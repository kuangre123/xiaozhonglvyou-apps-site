// 成片录制器（只在调试服务里用）：以固定步长逐帧驱动整部影片，
// 用 2D 画布按网页界面的同一套字体与动效把字幕、读数、时间尺画进画面，
// 声音用同一张 WebAudio 图离线渲染，最后由本地服务交给 ffmpeg 合成 MP4。
//
// 用法（在 DEBUG_CAPTURE=1 的服务上打开页面后，于控制台）：
//   const { Recorder } = await import('/src/recorder.js');
//   const rec = new Recorder(window.stardust, { width: 1920, height: 1080, fps: 30 });
//   await rec.run();   // rec.progress 可查进度
import { MUSIC_OFFSET, MUSIC_URL, Soundscape } from './audio.js';
import { simulateFilm } from './director.js';
import { formatAge, formatTemp } from './ui.js';

const STARLIGHT = '#eef2ff';
const DUST = '#9299ad';
const HAIR = 'rgba(238, 242, 255, 0.16)';
const F = {
  zh: '"Songti SC", "STSong", "Noto Serif CJK SC", "Source Han Serif SC", serif',
  en: '"Didot", "Bodoni 72", "Hoefler Text", Baskerville, Georgia, serif',
  sans: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif',
  mono: '"SF Mono", ui-monospace, Menlo, Consolas, monospace',
};
const NO_LINE_START = '，。、；：！？）」』”’…—·,.;:!?)';

const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const easeOut = (t) => 1 - Math.pow(1 - clamp(t), 3);
const smooth = (t) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
const hexRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mixHex = (a, b, k) => {
  const A = hexRgb(a);
  const B = hexRgb(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`;
};

function encodeWav(buffer) {
  const ch = buffer.numberOfChannels;
  const n = buffer.length;
  const sr = buffer.sampleRate;
  const view = new DataView(new ArrayBuffer(44 + n * ch * 2));
  const str = (o, s) => [...s].forEach((c, i) => view.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF');
  view.setUint32(4, 36 + n * ch * 2, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, ch, true);
  view.setUint32(24, sr, true);
  view.setUint32(28, sr * ch * 2, true);
  view.setUint16(32, ch * 2, true);
  view.setUint16(34, 16, true);
  str(36, 'data');
  view.setUint32(40, n * ch * 2, true);
  const data = [...Array(ch)].map((_, c) => buffer.getChannelData(c));
  let o = 44;
  for (let i = 0; i < n; i++) {
    for (let c = 0; c < ch; c++) {
      const v = Math.max(-1, Math.min(1, data[c][i]));
      view.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true);
      o += 2;
    }
  }
  return new Blob([view.buffer], { type: 'audio/wav' });
}

export class Recorder {
  constructor(api, { width = 1920, height = 1080, fps = 30, quality = 0.9, name = 'stardust-demo', intro = 5, forge = 16, outro = 5.5, filmFrom = 0, filmTo = api.timeline.duration, interactive = true } = {}) {
    Object.assign(this, { api, W: width, H: height, fps, quality, name, filmFrom, interactive });
    this.s = width / 1536; // 以 1536×864 的 CSS 视口为设计基准
    this.seg = { intro, film: Math.min(api.timeline.duration, filmTo) - filmFrom, forge, outro };
    this.total = intro + this.seg.film + forge + outro;
    this.progress = 0;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.owl = null;
    this.plan = null;
    if (interactive) {
      // 先把整段互动演示模拟出来：影片段的长度由脚本决定（暂停、变速、跳转都会改变它）
      this.plan = simulateFilm({ timeline: api.timeline, fps, filmFrom, layout: (st) => this.layoutNorm(st) });
      this.seg.film = this.plan.seconds;
      this.total = intro + this.seg.film + forge + outro;
    }
  }

  // ── 控制栏与时间尺的位置（与网页 CSS 一致：右下角，按钮间距 8px）──────────
  controlsLayout(st) {
    const { s, W, H } = this;
    this.font(12, F.sans, { spacing: 0.14 });
    const items = [
      ['play', st.playing ? '暂停' : '播放'],
      ['speed', st.speedLabel],
      ['sound', st.sound ? '声音 开' : '声音 关'],
      ['forge', '造物'],
    ];
    const h = 34 * s;
    const y = H - 30 * s - h;
    let x = W - 34 * s;
    const rects = {};
    for (let i = items.length - 1; i >= 0; i--) {
      const [id, text] = items[i];
      const w = this.ctx.measureText(text).width + 28 * s;
      x -= w;
      rects[id] = { x, y, w, h, text };
      x -= 8 * s;
    }
    return rects;
  }

  /** 给互动脚本用：按钮中心与时间尺刻度的归一化坐标 */
  layoutNorm(st) {
    const { s, W, H } = this;
    const r = this.controlsLayout(st);
    const c = (k) => [(r[k].x + r[k].w * 0.55) / W, (r[k].y + r[k].h * 0.6) / H];
    const n = this.api.timeline.shots.length;
    const top = 104 * s;
    const h = H - 96 * s - top;
    return {
      play: c('play'),
      speed: c('speed'),
      sound: c('sound'),
      forge: c('forge'),
      tick: (i) => [(W - 34 * s - 52 * s) / W, (top + (i / n) * h + 2 * s) / H],
    };
  }

  // ── 声音：整段离线渲染 ───────────────────────────────────────
  async renderAudio() {
    const { api, seg } = this;
    const sr = 48000;
    const octx = new OfflineAudioContext(2, Math.ceil(this.total * sr), sr);
    const snd = new Soundscape();
    snd.start(octx);
    // 背景音乐：与网页一致，影片 T 对应音乐的 MUSIC_OFFSET + T 秒
    const music = await octx.decodeAudioData(await (await fetch(MUSIC_URL)).arrayBuffer());
    snd.scheduleMusic(music, 0, MUSIC_OFFSET + this.filmFrom - seg.intro);
    if (this.plan) {
      for (const e of this.plan.events) {
        const when = seg.intro + e.tau;
        if (e.type === 'shot') snd.onShot(api.timeline.shots[e.index], e.index, when);
        else if (e.type === 'duck') snd.duck(when, e.dur);
        else if (e.type === 'click') snd.uiClick(when);
      }
      snd.uiClick(seg.intro + seg.film - 0.4); // 点下「造物」
      const f0c = seg.intro + seg.film;
      snd.uiClick(f0c + 1.45); // 点进输入框
      snd.uiClick(f0c + 4.65); // 点「凝聚」
    } else {
      const off = seg.intro - this.filmFrom;
      api.timeline.shots.forEach((shot, i) => {
        if (shot.start >= this.filmFrom) snd.onShot(shot, i, off + shot.start);
      });
    }
    const f0 = seg.intro + seg.film;
    snd.onShot({ id: 'nebula', form: 'nebula', trans: 2.6 }, -1, f0 + 0.3);
    snd.chime(587.33, f0 + 4.8, 0.07); // 按下「凝聚」（D5）
    snd.chime(783.99, f0 + 7 + 2.8 * 0.85, 0.11); // 猫头鹰显形（G5）
    snd.fadeOut(this.total - 4.6, 4.4);
    return encodeWav(await octx.startRendering());
  }

  // ── 主循环 ──────────────────────────────────────────────────
  async run() {
    const { api, fps, seg } = this;
    const frames = Math.round(this.total * fps);
    const creations = await (await fetch('/api/creations', { cache: 'no-store' })).json();
    const owl = creations.find((c) => c.prompt.includes('猫头鹰')) || creations[0];
    this.owl = owl ? { key: `user:${owl.id}`, kind: 'user', id: owl.id, url: owl.url, prompt: owl.prompt } : null;
    await document.fonts.ready;

    const wav = await this.renderAudio();
    await fetch(`/api/debug/video/start?name=${encodeURIComponent(this.name)}&fps=${fps}`, { method: 'POST' });
    await fetch('/api/debug/video/audio', { method: 'POST', body: wav });

    // 录制期间屏蔽页面上的一切点击与按键（否则一次误触就会让时间轴跳走）
    const blocker = document.createElement('div');
    blocker.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:transparent;cursor:wait';
    document.body.appendChild(blocker);
    const swallow = (e) => e.stopImmediatePropagation();
    window.addEventListener('keydown', swallow, true);
    window.addEventListener('wheel', swallow, { capture: true, passive: true });
    api.setExternalClock(true);
    api.setGrain(0.012);
    api.setView(this.W, this.H);
    api.pause();
    api.seek(this.filmFrom);
    const filmStart = seg.intro;
    const forgeStart = filmStart + seg.film;
    let phase = 'intro';
    let shown = false;
    const t0 = performance.now();
    try {
      for (let f = 0; f < frames; f++) {
        const t = f / fps;
        if (phase === 'intro' && t >= filmStart) {
          phase = 'film';
          api.seek(this.filmFrom);
          if (!this.plan) api.play();
        } else if (phase === 'film' && t >= forgeStart) {
          phase = 'forge';
          api.pause();
          api.forge.open();
        }
        if (phase === 'forge') {
          const ft = t - forgeStart;
          api.forge.busy = ft >= 4.8 && ft < 7;
          if (!shown && ft >= 7 && this.owl) {
            shown = true;
            await api.forge.show(this.owl);
          }
        }
        let st = null;
        if (phase === 'film' && this.plan) {
          st = this.plan.frames[Math.min(this.plan.frames.length - 1, f - Math.round(filmStart * fps))];
          api.seek(st.T);
          api.setUserView(st);
          api.setPointer(st.cursor.x * 2 - 1, 1 - st.cursor.y * 2, st.force);
        } else if (phase !== 'film') {
          api.setUserView({}, true);
          api.setPointer(0, 0, 0);
        }
        const d = api.tick(1, 1 / fps);
        const ctx = this.ctx;
        ctx.drawImage(api.renderer.domElement, 0, 0, this.W, this.H);
        if (phase === 'intro') this.drawIntro(t);
        else if (phase === 'film') {
          this.drawFilm(d, t - filmStart + (this.filmFrom > 0 ? 2 : 0));
          if (st) this.drawInteraction(st);
        } else this.drawForge(t - forgeStart, t - forgeStart - seg.forge);
        this.drawCredit();
        // toBlob 在后台标签页里走空闲调度，一帧要等 1 秒；toDataURL 是同步的（约 20ms）
        const url = this.canvas.toDataURL('image/jpeg', this.quality);
        const res = await fetch('/api/debug/video/frame', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: url });
        if (!res.ok) throw new Error(`上传第 ${f} 帧失败：${res.status}`);
        this.progress = (f + 1) / frames;
        this.fpsRate = (f + 1) / ((performance.now() - t0) / 1000);
      }
    } finally {
      api.setExternalClock(false);
      api.setUserView({}, false);
      api.restoreView();
      api.setGrain(0.045);
      blocker.remove();
      window.removeEventListener('keydown', swallow, true);
      window.removeEventListener('wheel', swallow, { capture: true });
    }
    return (await fetch('/api/debug/video/finish', { method: 'POST' })).json();
  }

  // ── 文字工具 ────────────────────────────────────────────────
  font(px, family, { weight = 400, italic = false, spacing = 0 } = {}) {
    const ctx = this.ctx;
    ctx.font = `${italic ? 'italic ' : ''}${weight} ${px * this.s}px ${family}`;
    ctx.letterSpacing = `${spacing}em`;
  }

  wrap(text, maxW) {
    const ctx = this.ctx;
    const lines = [];
    let line = '';
    for (const ch of text) {
      const test = line + ch;
      if (line && ctx.measureText(test).width > maxW && !NO_LINE_START.includes(ch)) {
        lines.push(line);
        line = ch;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  text(str, x, y, color, alpha = 1, align = 'left') {
    const ctx = this.ctx;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'top';
    ctx.fillText(str, x, y);
    ctx.globalAlpha = 1;
  }

  // ── 互动演示的叠加层 ──────────────────────────────────────────
  drawInteraction(st) {
    this.drawControls(st);
    this.drawKey(st);
    this.drawCursor(st.cursor, st.ripple);
    this.drawLabel(st);
  }

  drawControls(st, accent = '#fff3df') {
    const { ctx, s } = this;
    const rects = this.controlsLayout(st);
    for (const [id, r] of Object.entries(rects)) {
      const flash = st.pressed === id ? Math.max(0, 1 - st.pressAge / 0.35) : 0;
      const hover = st.cursor.alpha > 0.5 && st.cursor.x * this.W >= r.x && st.cursor.x * this.W <= r.x + r.w && st.cursor.y * this.H >= r.y && st.cursor.y * this.H <= r.y + r.h;
      ctx.save();
      if (id === 'forge') {
        ctx.fillStyle = accent;
        ctx.globalAlpha = 1;
        ctx.fillRect(r.x, r.y, r.w, r.h);
        if (flash) {
          ctx.fillStyle = `rgba(255,255,255,${0.6 * flash})`;
          ctx.fillRect(r.x, r.y, r.w, r.h);
        }
        this.font(12, F.sans, { weight: 600, spacing: 0.14 });
        this.text(r.text, r.x + 14 * s, r.y + 11 * s, '#0a0b10', 1);
      } else {
        ctx.fillStyle = `rgba(4,5,10,${0.42 + 0.3 * flash})`;
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle = flash ? accent : hover ? 'rgba(238,242,255,0.55)' : HAIR;
        ctx.lineWidth = Math.max(1, s);
        ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);
        this.font(12, F.sans, { spacing: 0.14 });
        this.text(r.text, r.x + 14 * s, r.y + 11 * s, STARLIGHT, 1);
      }
      ctx.restore();
    }
  }

  drawCursor(c, ripple) {
    if (!c || c.alpha <= 0.01) return;
    const { ctx, s, W, H } = this;
    if (ripple) {
      const k = ripple.age / 0.6;
      ctx.save();
      ctx.beginPath();
      ctx.arc(ripple.x * W, ripple.y * H, (6 + 30 * k) * s, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,243,223,${(1 - k) * 0.9 * c.alpha})`;
      ctx.lineWidth = 2 * s;
      ctx.stroke();
      ctx.restore();
    }
    ctx.save();
    ctx.translate(c.x * W, c.y * H);
    const sc = (c.pressed ? 0.9 : 1) * s * 1.2;
    ctx.scale(sc, sc);
    ctx.globalAlpha = c.alpha;
    if (c.pressed) {
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,243,223,0.22)';
      ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 21);
    ctx.lineTo(5, 16.5);
    ctx.lineTo(8.6, 24.5);
    ctx.lineTo(11.6, 23.2);
    ctx.lineTo(8.1, 15.4);
    ctx.lineTo(14.6, 15.2);
    ctx.closePath();
    ctx.shadowColor = 'rgba(0,0,0,0.65)';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = '#0a0b10';
    ctx.stroke();
    if (c.wheel) {
      // 鼠标滚轮示意：小鼠标 + 上 / 下箭头（上 = 拉近，下 = 拉远）
      ctx.translate(20, 22);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.roundRect(0, 0, 12, 18, 6);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(6, 3.5);
      ctx.lineTo(6, 7.5);
      ctx.stroke();
      ctx.beginPath();
      const up = c.wheel > 0;
      ctx.moveTo(17, up ? 10 : 6);
      ctx.lineTo(20.5, up ? 5 : 11);
      ctx.lineTo(24, up ? 10 : 6);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawLabel(st) {
    if (!st.label || st.labelAlpha < 0.02) return;
    const { ctx, s, W, H } = this;
    this.font(13, F.sans, { spacing: 0.06 });
    const tw = ctx.measureText(st.label).width;
    const pw = tw + 24 * s;
    const ph = 30 * s;
    let x;
    let y;
    if (st.key && st.keyAlpha > 0.05) {
      x = W / 2 + 34 * s;
      y = H - 156 * s + 8 * s;
    } else {
      x = st.cursor.x * W + 26 * s;
      y = st.cursor.y * H - 46 * s;
      if (x + pw > W - 24 * s) x = st.cursor.x * W - 18 * s - pw;
      y = Math.max(20 * s, Math.min(H - 120 * s, y));
    }
    const a = st.labelAlpha * (st.key ? 1 : Math.max(0.25, st.cursor.alpha));
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(6,8,14,0.82)';
    ctx.beginPath();
    ctx.roundRect(x, y, pw, ph, 3 * s);
    ctx.fill();
    ctx.strokeStyle = '#fff3df';
    ctx.lineWidth = Math.max(1, s);
    ctx.stroke();
    ctx.restore();
    this.text(st.label, x + 12 * s, y + 8 * s, STARLIGHT, a);
  }

  drawKey(st) {
    if (!st.key || st.keyAlpha < 0.02) return;
    const { ctx, s, W, H } = this;
    const size = 46 * s;
    const x = W / 2 - size / 2 - 10 * s;
    const y = H - 156 * s;
    ctx.save();
    ctx.globalAlpha = st.keyAlpha;
    ctx.fillStyle = 'rgba(6,8,14,0.78)';
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, 7 * s);
    ctx.fill();
    ctx.strokeStyle = STARLIGHT;
    ctx.lineWidth = 1.5 * s;
    ctx.stroke();
    ctx.restore();
    this.font(22, F.sans, { weight: 600 });
    this.text(st.key, x + size / 2, y + 10 * s, STARLIGHT, st.keyAlpha, 'center');
  }

  /** 右下角署名 */
  drawCredit() {
    this.font(11, F.mono, { spacing: 0.14 });
    this.text('作者：狂热AI', this.W - 34 * this.s, this.H - 21 * this.s, DUST, 0.85, 'right');
  }

  // ── 片头 ────────────────────────────────────────────────────
  drawIntro(t) {
    const { ctx, s, W, H } = this;
    const a = smooth((t - 0.6) / 1.0) * (1 - smooth((t - 3.7) / 1.1));
    if (a <= 0) return;
    ctx.save();
    ctx.shadowColor = 'rgba(4,5,10,0.8)';
    ctx.shadowBlur = 30 * s;
    this.font(132, F.zh, { spacing: 0.36 });
    this.text('星尘简史', W / 2 + 0.18 * 132 * s, H * 0.17, STARLIGHT, a, 'center');
    this.font(31, F.en, { italic: true, spacing: 0.05 });
    this.text('A Brief History of Stardust', W / 2, H * 0.17 + 160 * s, 'rgba(238,242,255,0.78)', a, 'center');
    this.font(15, F.sans);
    this.text('从奇点到万物，138 亿年，一镜到底。', W / 2, H * 0.7, 'rgba(238,242,255,0.82)', a, 'center');
    this.text('片中每一件造物，都由 Aholo Lux3D 从一句话生成，再由同一批星尘凝聚成形。', W / 2, H * 0.7 + 29 * s, 'rgba(238,242,255,0.82)', a, 'center');
    ctx.restore();
  }

  // ── 影片界面 ────────────────────────────────────────────────
  drawFilm(d, T) {
    const shots = this.api.timeline.shots;
    const shot = d.shot;
    const i = d.index;
    const prev = i > 0 ? shots[i - 1] : null;
    const k = prev ? smooth(d.local / 0.9) : 1;
    const accent = prev ? mixHex(prev.look.accent, shot.look.accent, k) : shot.look.accent;
    const fadeIn = smooth(T / 1.2); // 片头结束后界面淡入
    this.drawChrome(d, accent, fadeIn);
    this.drawRuler(i, d.local / shot.dur, accent, fadeIn);
    this.drawCaption(shot, prev, d.local, accent);
  }

  drawChrome(d, accent, a) {
    const { s, W } = this;
    this.font(17, F.zh, { weight: 500, spacing: 0.44 });
    this.text('星尘简史', 34 * s, 28 * s, STARLIGHT, a);
    this.font(13, F.en, { italic: true, spacing: 0.03 });
    this.text('A Brief History of Stardust', 34 * s, 51 * s, DUST, a);
    const right = W - 34 * s;
    const rows = [
      ['宇宙年龄', formatAge(d.age)],
      ['背景温度', formatTemp(d.temp)],
    ];
    rows.forEach(([label, value], r) => {
      const y = 26 * s + r * 23 * s;
      this.font(13, F.mono);
      this.text(value, right, y, STARLIGHT, a, 'right');
      this.font(10.5, F.mono, { spacing: 0.2 });
      this.text(label, right - 10.5 * 13 * s - 14 * s, y + 2 * s, DUST, a, 'right');
    });
  }

  drawRuler(index, frac, accent, a) {
    const { ctx, s, W, H } = this;
    const shots = this.api.timeline.shots;
    const n = shots.length;
    const x = W - 34 * s;
    const top = 104 * s;
    const bottom = H - 96 * s;
    const h = bottom - top;
    const p = (index + clamp(frac)) / n;
    ctx.globalAlpha = a;
    ctx.fillStyle = HAIR;
    ctx.fillRect(x, top, Math.max(1, s), h);
    ctx.fillStyle = accent;
    ctx.fillRect(x, top, Math.max(1, s), h * p);
    let act = '';
    shots.forEach((shot, i) => {
      const y = top + (i / n) * h;
      const current = i === index;
      const major = shot.act !== act;
      act = shot.act;
      const len = (current ? 24 : major ? 16 : 9) * s;
      ctx.globalAlpha = a * (current ? 1 : 0.62);
      ctx.fillStyle = current ? accent : DUST;
      ctx.fillRect(x - len, y, len, Math.max(1, s));
      this.font(10.5, F.mono);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(shot.tick, x - len - 9 * s, y + 0.5 * s);
      if (current) {
        const tw = ctx.measureText(shot.tick).width;
        this.font(12, F.zh, { spacing: 0.1 });
        ctx.fillText(shot.title, x - len - 9 * s - tw - 9 * s, y + 0.5 * s);
      }
    });
    // 菱形游标
    ctx.globalAlpha = a;
    ctx.save();
    ctx.translate(x + 0.5 * s, top + h * p);
    ctx.rotate(Math.PI / 4);
    ctx.shadowColor = accent;
    ctx.shadowBlur = 14 * s;
    ctx.fillStyle = accent;
    ctx.fillRect(-4.5 * s, -4.5 * s, 9 * s, 9 * s);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  drawCaption(shot, prev, local, accent) {
    const { ctx, s, H } = this;
    let cap;
    let alpha;
    let reveal;
    let dy;
    if (local < 0.3) {
      if (!prev) return;
      cap = prev;
      alpha = 1 - local / 0.3;
      reveal = alpha;
      dy = 8 * (1 - alpha);
    } else {
      cap = shot;
      const u = local - 0.3;
      alpha = easeOut(u / 0.55);
      reveal = easeOut(u / 0.95);
      dy = 8 * (1 - alpha);
    }
    if (alpha <= 0.002) return;

    // 亮场镜头下的暗角，保证可读
    const g = ctx.createRadialGradient(360 * s, H - 150 * s, 0, 360 * s, H - 150 * s, 620 * s);
    g.addColorStop(0, `rgba(4,5,10,${0.55 * alpha})`);
    g.addColorStop(1, 'rgba(4,5,10,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, H - 760 * s, 1100 * s, 760 * s);

    const left = 34 * s;
    const bottom = H - 34 * s;
    const S = 79.5 * s;
    const chars = [...cap.title];
    const titleH = chars.length * 1.14 * S;
    const titleTop = bottom - titleH;
    // 竖排标题：左侧一根主题色细线，字自上而下「写」出来
    ctx.globalAlpha = alpha;
    ctx.fillStyle = accent;
    ctx.fillRect(left, titleTop, Math.max(1, s), titleH);
    ctx.save();
    ctx.beginPath();
    ctx.rect(left, titleTop - 10 * s, 1.02 * S + 40 * s, titleH * reveal + 10 * s);
    ctx.clip();
    ctx.shadowColor = 'rgba(4,5,10,0.75)';
    ctx.shadowBlur = 36 * s;
    this.font(79.5, F.zh, { spacing: 0 });
    ctx.fillStyle = STARLIGHT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const cx = left + 18 * s + 0.51 * S;
    chars.forEach((ch, i) => ctx.fillText(ch, cx, titleTop + i * 1.14 * S + 0.04 * S));
    ctx.restore();

    // 正文：自下而上排版
    const x = left + 18 * s + 1.02 * S + 30 * s;
    const maxW = 465 * s;
    const gap = 10 * s;
    const blocks = [];
    this.font(12, F.mono, { spacing: 0.16 });
    blocks.push({ h: 15.6 * s, draw: (y) => this.text(cap.when, x, y, accent, alpha) });
    this.font(26, F.en, { italic: true, spacing: 0.01 });
    blocks.push({ h: 32.5 * s, draw: (y) => (this.font(26, F.en, { italic: true, spacing: 0.01 }), this.text(cap.en, x, y + 2 * s, 'rgba(238,242,255,0.94)', alpha)) });
    this.font(15, F.sans);
    const lines = this.wrap(cap.line, maxW);
    blocks.push({
      h: lines.length * 27.75 * s,
      draw: (y) => {
        this.font(15, F.sans);
        ctx.save();
        ctx.shadowColor = 'rgba(4,5,10,0.85)';
        ctx.shadowBlur = 16 * s;
        lines.forEach((l, j) => this.text(l, x, y + j * 27.75 * s + 6 * s, 'rgba(238,242,255,0.86)', alpha));
        ctx.restore();
      },
    });
    if (cap.prompt) {
      const badge = 'Aholo Lux3D · 文生 3D';
      this.font(10.5, F.mono, { spacing: 0.06 });
      const bw = ctx.measureText(badge).width + 14 * s;
      this.font(10.5, F.mono);
      let pl = this.wrap(`“${cap.prompt}”`, maxW - bw - 10 * s);
      if (pl.length > 2) pl = [pl[0], `${pl[1].slice(0, -1)}…`];
      blocks.push({
        h: 6 * s + Math.max(20 * s, pl.length * 16.8 * s),
        draw: (y) => {
          const yy = y + 6 * s;
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = accent;
          ctx.lineWidth = Math.max(1, s);
          ctx.strokeRect(x + 0.5, yy + 0.5, bw, 20 * s);
          this.font(10.5, F.mono, { spacing: 0.06 });
          this.text(badge, x + 7 * s, yy + 4.5 * s, accent, alpha);
          this.font(10.5, F.mono);
          pl.forEach((l, j) => this.text(l, x + bw + 10 * s, yy + 1 * s + j * 16.8 * s, DUST, alpha));
        },
      });
    }
    if (cap.finale) {
      blocks.push({
        h: 10 * s + 34 * s,
        draw: (y) => {
          const yy = y + 10 * s;
          this.font(12, F.sans, { weight: 600, spacing: 0.14 });
          const t1 = '让星尘凝聚成你想要的东西';
          const w1 = ctx.measureText(t1).width + 28 * s;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = accent;
          ctx.fillRect(x, yy, w1, 34 * s);
          this.text(t1, x + 14 * s, yy + 11 * s, '#0a0b10', alpha);
          this.font(12, F.sans, { spacing: 0.14 });
          const t2 = '从奇点重播';
          const w2 = ctx.measureText(t2).width + 28 * s;
          ctx.strokeStyle = HAIR;
          ctx.strokeRect(x + w1 + 8 * s + 0.5, yy + 0.5, w2, 34 * s);
          this.text(t2, x + w1 + 8 * s + 14 * s, yy + 11 * s, STARLIGHT, alpha);
        },
      });
    }
    const total = blocks.reduce((sum, b) => sum + b.h, 0) + gap * (blocks.length - 1);
    let y = bottom - 4 * s - total + dy * s;
    for (const b of blocks) {
      b.draw(y);
      y += b.h + gap;
    }
    ctx.globalAlpha = 1;
  }

  // ── 造物演示 ────────────────────────────────────────────────
  drawForge(ft, tEnd) {
    const { ctx, s, W, H } = this;
    const accent = '#fff3df';
    const a = smooth(ft / 0.6) * (1 - smooth((tEnd + 5.0) / 1.0)); // 片尾前收起面板
    const prompt = '一只蹲坐的青铜猫头鹰';
    const typed = [...prompt].slice(0, Math.floor(clamp((ft - 1.6) / 2.6) * prompt.length + 0.001)).join('');
    let status = '';
    if (ft >= 4.8 && ft < 5.4) status = '正在把这句话交给 Lux3D…';
    else if (ft >= 5.4 && ft < 7.0) status = 'Lux3D 正在生成：参考图 → 网格 → 材质';
    else if (ft >= 7.0 && ft < 9.6) status = '生成完成，星尘正在凝聚…';
    else if (ft >= 9.6) status = `“${prompt}” 已凝聚成形。`;

    if (a > 0.002) {
      const pw = 410 * s;
      const pad = 22 * s;
      const ph = 470 * s;
      const px = 34 * s;
      const py = H - 34 * s - ph;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.roundRect(px, py, pw, ph, 3 * s);
      ctx.clip();
      ctx.filter = `blur(${16 * s}px)`;
      ctx.drawImage(this.api.renderer.domElement, px, py, pw, ph, px, py, pw, ph);
      ctx.filter = 'none';
      ctx.fillStyle = 'rgba(6,8,14,0.74)';
      ctx.fillRect(px, py, pw, ph);
      ctx.restore();
      ctx.save();
      ctx.globalAlpha = a;
      ctx.strokeStyle = HAIR;
      ctx.lineWidth = Math.max(1, s);
      ctx.beginPath();
      ctx.roundRect(px + 0.5, py + 0.5, pw - 1, ph - 1, 3 * s);
      ctx.stroke();

      let y = py + pad;
      const x = px + pad;
      const inner = pw - 2 * pad;
      this.font(30, F.zh, { spacing: 0.3 });
      this.text('造物', x, y, STARLIGHT, a);
      this.font(12, F.sans, { spacing: 0.14 });
      const bt = '回到影片';
      const bw = ctx.measureText(bt).width + 28 * s;
      ctx.strokeStyle = HAIR;
      ctx.strokeRect(px + pw - pad - bw, y, bw, 32 * s);
      this.text(bt, px + pw - pad - bw + 14 * s, y + 10 * s, STARLIGHT, a);
      y += 30 * s + 14 * s;
      this.font(13.5, F.sans);
      for (const l of this.wrap('写下一样东西。Lux3D 把它生成出来，星尘随后凝聚成形。', inner)) {
        this.text(l, x, y, 'rgba(238,242,255,0.8)', a);
        y += 24.3 * s;
      }
      y += 14 * s;
      this.font(10.5, F.mono, { spacing: 0.2 });
      this.text('它是什么', x, y, DUST, a);
      y += 10.5 * s + 12 * s;
      this.font(18, F.zh);
      this.text(typed || '例如：一只蹲坐的青铜猫头鹰', x, y + 8 * s, typed ? STARLIGHT : 'rgba(146,153,173,0.75)', a);
      if (ft < 4.8 && Math.floor(ft * 2.2) % 2 === 0) {
        const cw = typed ? ctx.measureText(typed).width : 0;
        ctx.fillStyle = accent;
        ctx.fillRect(x + cw + 2 * s, y + 8 * s, Math.max(1, 1.5 * s), 22 * s);
      }
      ctx.fillStyle = ft < 4.8 ? accent : 'rgba(238,242,255,0.4)';
      ctx.fillRect(x, y + 41 * s, inner, Math.max(1, s));
      this.forgeTargets = { input: [(x + 150 * s) / W, (y + 24 * s) / H] };
      y += 42 * s + 12 * s;
      this.font(12, F.sans);
      let cx = x;
      ['写实', '卡通', '手绘', '奇幻', '赛博朋克'].forEach((c, i) => {
        const w = ctx.measureText(c).width + 20 * s;
        ctx.strokeStyle = i === 0 ? accent : HAIR;
        ctx.strokeRect(cx + 0.5, y + 0.5, w, 27 * s);
        this.text(c, cx + 10 * s, y + 7 * s, i === 0 ? STARLIGHT : DUST, a);
        cx += w + 6 * s;
      });
      y += 27 * s + 12 * s;
      this.forgeTargets.submit = [(x + 30 * s) / W, (y + 18 * s) / H];
      const pressed = ft >= 4.6 && ft < 4.95;
      const busy = ft >= 4.8 && ft < 7.0;
      this.font(12, F.sans, { weight: 600, spacing: 0.14 });
      const st = busy ? '生成中…' : '凝聚';
      const sw = ctx.measureText(st).width + 28 * s;
      ctx.globalAlpha = a * (busy ? 0.62 : 1);
      ctx.fillStyle = pressed ? '#ffffff' : accent;
      ctx.fillRect(x, y, sw, 32 * s);
      this.text(st, x + 14 * s, y + 10 * s, '#0a0b10', a * (busy ? 0.62 : 1));
      y += 32 * s + 14 * s;
      this.font(12, F.mono);
      this.text(status, x, y, accent, a);
      if (status.startsWith('Lux3D 正在生成')) {
        this.font(10.5, F.mono);
        this.text('（真实生成约 1–2 分钟，视频中已加速）', x, y + 20 * s, DUST, a);
      }
      y += 44 * s;
      ctx.fillStyle = HAIR;
      ctx.fillRect(x, y, inner, Math.max(1, s));
      y += 12 * s;
      this.font(10.5, F.mono, { spacing: 0.2 });
      this.text('已有的造物', x, y, DUST, a);
      y += 10.5 * s + 10 * s;
      this.font(12, F.sans);
      cx = x;
      const items = [...(ft >= 9.6 ? [prompt] : []), '小行星', '熔岩地球', '地球', '三叶虫', '菊石', '霸王龙', '青铜鼎', '望远镜'];
      for (const it of items) {
        const w = ctx.measureText(it).width + 20 * s;
        if (cx + w > x + inner) break;
        ctx.strokeStyle = it === prompt ? accent : HAIR;
        ctx.strokeRect(cx + 0.5, y + 0.5, w, 27 * s);
        this.text(it, cx + 10 * s, y + 7 * s, it === prompt ? STARLIGHT : DUST, a);
        cx += w + 6 * s;
      }
      ctx.restore();
    }

    // 光标：从「造物」按钮出发，点进输入框，打字，再去点「凝聚」，然后离开
    if (this.plan && this.forgeTargets && tEnd < 0) {
      const from = this.plan.cursorEnd;
      const [ix, iy] = this.forgeTargets.input;
      const [bx, by] = this.forgeTargets.submit;
      const e = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const k = (a, b) => e(clamp((ft - a) / (b - a)));
      let cx = from.x + (ix - from.x) * k(0.5, 1.35);
      let cy = from.y + (iy - from.y) * k(0.5, 1.35);
      cx += (bx - ix) * k(4.15, 4.6);
      cy += (by - iy) * k(4.15, 4.6);
      cx += 0.12 * k(5.2, 6.2);
      cy += 0.08 * k(5.2, 6.2);
      const alpha = 1 - k(5.4, 6.2);
      const pressedNow = (ft >= 1.42 && ft < 1.56) || (ft >= 4.62 && ft < 4.76);
      const ripple = ft >= 1.42 && ft < 2.02 ? { x: ix, y: iy, age: ft - 1.42 } : ft >= 4.62 && ft < 5.22 ? { x: bx, y: by, age: ft - 4.62 } : null;
      this.drawCursor({ x: cx, y: cy, alpha, pressed: pressedNow, wheel: 0 }, ripple);
    }

    // 片尾：渐黑 + 字幕
    if (tEnd >= 0) {
      const ot = tEnd; // 片尾内的时间
      const black = smooth(ot / 1.6);
      ctx.fillStyle = `rgba(0,0,0,${black})`;
      ctx.fillRect(0, 0, W, H);
      const ta = smooth((ot - 1.2) / 1.0);
      if (ta > 0) {
        this.font(64, F.zh, { spacing: 0.36 });
        this.text('星尘简史', W / 2 + 0.18 * 64 * s, H * 0.36, STARLIGHT, ta, 'center');
        this.font(24, F.en, { italic: true, spacing: 0.04 });
        this.text('A Brief History of Stardust', W / 2, H * 0.36 + 88 * s, 'rgba(238,242,255,0.78)', ta, 'center');
        this.font(15, F.sans);
        this.text('片中 15 件造物，均由 Aholo Lux3D 从一句话生成', W / 2, H * 0.36 + 150 * s, 'rgba(238,242,255,0.85)', ta, 'center');
        this.font(15, F.sans);
        this.text('作者：狂热AI', W / 2, H * 0.36 + 180 * s, 'rgba(238,242,255,0.85)', ta, 'center');
        this.font(11, F.mono, { spacing: 0.14 });
        this.text('配乐：Wandering — Andrewkn（Freesound，CC0）', W / 2, H * 0.36 + 218 * s, DUST, ta, 'center');
        this.text('2026 群核科技 Aholo 全球 3D AI 黑客松 · Play in 3D, Create with Aholo', W / 2, H * 0.36 + 240 * s, DUST, ta, 'center');
      }
    }
  }
}
