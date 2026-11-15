// 界面层：字幕、读数、时间尺、控制按钮、造物面板。只管 DOM，不碰 WebGL。
import { clamp, superscript } from './util.js';

const YEAR = 3.156e7;

function sci(v, unit) {
  const exp = Math.floor(Math.log10(v));
  const mant = v / 10 ** exp;
  const m = mant.toFixed(1);
  return m === '1.0' ? `10${superscript(exp)} ${unit}` : `${m} × 10${superscript(exp)} ${unit}`;
}

/** 宇宙年龄：从 10⁻⁴³ 秒一路到 138 亿年 */
export function formatAge(sec) {
  if (sec < 0.01) return sci(sec, '秒');
  if (sec < 60) return `${sec.toFixed(sec < 10 ? 2 : 1)} 秒`;
  if (sec < 3600) return `${(sec / 60).toFixed(1)} 分钟`;
  if (sec < 86400) return `${(sec / 3600).toFixed(1)} 小时`;
  if (sec < YEAR) return `${Math.round(sec / 86400)} 天`;
  const y = sec / YEAR;
  if (y < 1e4) return `${Math.round(y)} 年`;
  if (y < 1e8) return `${(y / 1e4).toFixed(y < 1e5 ? 1 : 0)} 万年`;
  return `${(y / 1e8).toFixed(y < 1e9 ? 2 : 1)} 亿年`;
}

export function formatTemp(k) {
  if (k >= 1e5) return sci(k, 'K');
  if (k >= 100) return `${Math.round(k)} K`;
  if (k >= 10) return `${k.toFixed(1)} K`;
  return `${k.toFixed(3)} K`;
}

export class UI {
  constructor() {
    this.listeners = new Map();
    const $ = (id) => document.getElementById(id);
    this.el = {
      ui: $('ui'),
      intro: $('intro'),
      begin: $('btn-begin'),
      age: $('age'),
      temp: $('temp'),
      caption: $('caption'),
      title: $('cap-title'),
      when: $('cap-when'),
      en: $('cap-en'),
      line: $('cap-line'),
      lux: $('cap-lux'),
      prompt: $('cap-prompt'),
      actions: $('cap-actions'),
      ruler: $('ruler'),
      ticks: $('ruler-ticks'),
      play: $('btn-play'),
      speed: $('btn-speed'),
      sound: $('btn-sound'),
      forgeBtn: $('btn-forge'),
      forge: $('forge'),
      forgeForm: $('forge-form'),
      forgeInput: $('forge-input'),
      forgeSubmit: $('btn-forge-submit'),
      forgeStyles: $('forge-styles'),
      forgeStatus: $('forge-status'),
      forgeLede: $('forge-lede'),
      forgeList: $('forge-list'),
      forgeShelfLabel: $('forge-shelf-label'),
    };
    this.shots = [];
    this.swapToken = 0;
    this.lastReadout = 0;
    this.speeds = [1, 2, 0.5];
    this.speedIdx = 0;
    this.muted = false;
    this.narrow = matchMedia('(max-width: 820px)');
    this.#wire();
  }

  on(evt, fn) {
    this.listeners.set(evt, fn);
  }
  emit(evt, payload) {
    this.listeners.get(evt)?.(payload);
  }

  #wire() {
    const e = this.el;
    e.begin.addEventListener('click', () => {
      this.dismissIntro();
      this.emit('begin');
    });
    e.play.addEventListener('click', () => this.emit('toggle'));
    e.speed.addEventListener('click', () => {
      this.speedIdx = (this.speedIdx + 1) % this.speeds.length;
      const v = this.speeds[this.speedIdx];
      e.speed.textContent = `${v}×`;
      this.emit('speed', v);
    });
    e.sound.addEventListener('click', () => {
      this.muted = !this.muted;
      e.sound.textContent = this.muted ? '声音 关' : '声音 开';
      e.sound.setAttribute('aria-pressed', String(!this.muted));
      this.emit('mute', this.muted);
    });
    e.forgeBtn.addEventListener('click', () => this.emit('forgeOpen'));
    document.getElementById('btn-finale-forge').addEventListener('click', () => this.emit('forgeOpen'));
    document.getElementById('btn-replay').addEventListener('click', () => this.emit('replay'));
    document.getElementById('btn-forge-close').addEventListener('click', () => this.emit('forgeClose'));

    // 时间尺：点刻度跳转，在尺上按住拖动则连续定位
    const scrub = (ev) => {
      const rect = e.ruler.getBoundingClientRect();
      const f = this.narrow.matches ? (ev.clientX - rect.left) / rect.width : (ev.clientY - rect.top) / rect.height;
      const n = this.shots.length;
      if (!n) return;
      const x = clamp(f, 0, 0.9999) * n;
      const i = Math.floor(x);
      this.emit('seek', this.shots[i].start + (x - i) * this.shots[i].dur);
    };
    let scrubbing = false;
    e.ruler.addEventListener('pointerdown', (ev) => {
      if (ev.target.closest('.ruler__tick')) return;
      scrubbing = true;
      e.ruler.setPointerCapture(ev.pointerId);
      scrub(ev);
    });
    e.ruler.addEventListener('pointermove', (ev) => scrubbing && scrub(ev));
    const stop = () => (scrubbing = false);
    e.ruler.addEventListener('pointerup', stop);
    e.ruler.addEventListener('pointercancel', stop);
    e.ticks.addEventListener('click', (ev) => {
      const tick = ev.target.closest('.ruler__tick');
      if (tick) this.emit('seekShot', Number(tick.dataset.index));
    });

    // 造物面板
    e.forgeStyles.addEventListener('click', (ev) => {
      const chip = ev.target.closest('.chip');
      if (!chip) return;
      for (const c of e.forgeStyles.querySelectorAll('.chip')) c.setAttribute('aria-checked', String(c === chip));
    });
    e.forgeForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const prompt = e.forgeInput.value.trim();
      if (prompt.length < 2) {
        this.setForgeStatus('先写下它是什么，至少两个字。', 'error');
        e.forgeInput.focus();
        return;
      }
      const style = e.forgeStyles.querySelector('.chip[aria-checked="true"]')?.dataset.style || 'photorealistic';
      this.emit('forgeSubmit', { prompt, style });
    });
    e.forgeList.addEventListener('click', (ev) => {
      const btn = ev.target.closest('button[data-key]');
      if (btn) this.emit('forgeShow', this.forgeEntries.get(btn.dataset.key));
    });
  }

  // ── 片头 ────────────────────────────────────────────────
  setLoading(p, label) {
    this.el.begin.textContent = `${label} ${Math.round(clamp(p) * 100)}%`;
  }

  ready({ live }) {
    this.el.begin.disabled = false;
    this.el.begin.textContent = '开始';
    this.el.begin.focus({ preventScroll: true });
    this.setForgeLive(live);
  }

  dismissIntro() {
    this.el.intro.classList.add('is-gone');
    this.el.ui.dataset.state = 'film';
  }

  fatal(err) {
    this.el.begin.disabled = true;
    this.el.begin.textContent = '无法启动：这个浏览器不支持 WebGL 2';
    console.error(err);
  }

  // ── 影片 ────────────────────────────────────────────────
  build(timeline) {
    this.shots = timeline.shots;
    const n = this.shots.length;
    const frag = document.createDocumentFragment();
    let act = '';
    this.shots.forEach((s, i) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ruler__tick';
      btn.dataset.index = String(i);
      btn.style.setProperty('--p', String(i / n));
      btn.setAttribute('aria-label', `${s.tick}，${s.title}`);
      if (s.act !== act) {
        btn.dataset.major = '';
        act = s.act;
      }
      const name = document.createElement('span');
      name.className = 'tick__name';
      name.textContent = s.title;
      const time = document.createElement('span');
      time.className = 'tick__time';
      time.textContent = s.tick;
      btn.append(name, time);
      li.append(btn);
      frag.append(li);
    });
    this.el.ticks.replaceChildren(frag);
  }

  showShot(shot, index) {
    const e = this.el;
    for (const t of e.ticks.querySelectorAll('.ruler__tick')) {
      if (Number(t.dataset.index) === index) t.setAttribute('aria-current', 'true');
      else t.removeAttribute('aria-current');
    }
    document.documentElement.style.setProperty('--accent', shot.look.accent);

    // 先淡出旧字幕，换字，再让新标题自上而下写出来
    const token = ++this.swapToken;
    e.caption.dataset.swap = 'out';
    setTimeout(() => {
      if (token !== this.swapToken) return;
      e.title.textContent = shot.title;
      e.when.textContent = shot.when;
      e.en.textContent = shot.en;
      e.line.textContent = shot.line;
      e.lux.hidden = !shot.prompt;
      e.prompt.textContent = shot.prompt ? `“${shot.prompt}”` : '';
      e.actions.hidden = !shot.finale;
      requestAnimationFrame(() => {
        if (token === this.swapToken) delete e.caption.dataset.swap;
      });
    }, 300);
  }

  frame({ T, age, temp, shot, local, now = performance.now() }) {
    const n = this.shots.length;
    if (n) {
      const i = this.shots.indexOf(shot);
      this.el.ruler.style.setProperty('--progress', String((i + clamp(local / shot.dur)) / n));
    }
    if (now - this.lastReadout > 90) {
      this.lastReadout = now;
      this.el.age.textContent = formatAge(age);
      this.el.temp.textContent = formatTemp(temp);
    }
    this.T = T;
  }

  setMuted(v) {
    this.muted = v;
    this.el.sound.textContent = v ? '声音 关' : '声音 开';
    this.el.sound.setAttribute('aria-pressed', String(!v));
  }

  setPlaying(v) {
    this.el.play.textContent = v ? '暂停' : '播放';
    this.el.play.setAttribute('aria-pressed', String(v));
  }

  // ── 造物面板 ────────────────────────────────────────────
  openForge() {
    this.el.ui.dataset.state = 'forge';
    this.el.forge.hidden = false;
    if (!this.el.forgeInput.disabled) this.el.forgeInput.focus({ preventScroll: true });
  }

  closeForge() {
    this.el.forge.hidden = true;
    this.el.ui.dataset.state = 'film';
  }

  setForgeLive(live) {
    const e = this.el;
    // 静态部署没有后端：输入框、风格和「凝聚」按钮都用不了，干脆不显示，免得看起来像坏了
    e.forgeForm.hidden = !live;
    e.forgeInput.disabled = !live;
    e.forgeSubmit.disabled = !live;
    for (const c of e.forgeStyles.querySelectorAll('.chip')) c.disabled = !live;
    e.forgeLede.textContent = live
      ? '写下一样东西。Lux3D 把它生成出来，星尘随后凝聚成形。'
      : '片中每一件造物，都由 Aholo Lux3D 从一句话生成。点下面任意一件，看星尘重新凝聚成它。（写一句话实时生成，需要在本地运行。）';
    e.forgeShelfLabel.textContent = live ? '已有的造物' : '片中的造物';
  }

  setForgeBusy(busy) {
    const e = this.el;
    e.forgeSubmit.disabled = busy || e.forgeInput.disabled;
    e.forgeSubmit.textContent = busy ? '生成中…' : '凝聚';
  }

  setForgeStatus(text, kind = 'info') {
    this.el.forgeStatus.textContent = text;
    this.el.forgeStatus.dataset.kind = kind;
  }

  /** entries: [{ key, label, ... }] */
  setForgeList(entries, currentKey) {
    this.forgeEntries = new Map(entries.map((x) => [x.key, x]));
    const frag = document.createDocumentFragment();
    for (const x of entries) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.key = x.key;
      btn.textContent = x.label;
      btn.title = x.prompt || x.label;
      if (x.key === currentKey) btn.setAttribute('aria-current', 'true');
      li.append(btn);
      frag.append(li);
    }
    this.el.forgeList.replaceChildren(frag);
  }
}
