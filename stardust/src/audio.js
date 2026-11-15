// 声音 = 背景音乐 + 两种现场合成的点缀（大爆炸的冲击、每个年代到来时的一声钟）。
//
// 背景音乐：《Wandering》— Andrewkn（Freesound #455855，CC0 公共领域）。
// 用频谱估过调性：几乎只用白键音，C 大调 / a 小调。所以钟声全部取 C 大调五声音阶，和音乐不打架。
//
// 同一张音频图既能实时播放（AudioContext + <audio>），也能离线渲染进成片（OfflineAudioContext + AudioBuffer）；
// 所有调度方法都接受一个显式的时间 when。
export const MUSIC_URL = 'audio/wandering.mp3';
// 影片 T=0 对应音乐第 5 秒：成片的 5 秒片头正好用掉音乐开头的渐入
export const MUSIC_OFFSET = 5;
// 造物模式里音乐一直放；放到结尾的淡出之前，回到 15 秒处接着放
const MUSIC_LOOP = [15, 232];
const LEVEL = 0.9;
const MUSIC_LEVEL = 1.0;

const C5 = 523.25;
// C 大调五声音阶：C D E G A，再往上一个八度
const PENTA = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2, 9 / 4, 5 / 2, 3, 10 / 3];
// 早期宇宙每个年代的钟声音高（都在 C 大调五声里）
const ERA_CHIME = {
  quark: 659.26, // E5
  nucleo: 783.99, // G5
  firstlight: 880.0, // A5
  darkages: 523.25, // C5
  dawn: 1174.66, // D6
  galaxy: 659.26, // E5
  blackhole: 440.0, // A4
  nebula: 783.99, // G5
  finale: 1046.5, // C6
};

export class Soundscape {
  constructor() {
    this.ctx = null;
    this.offline = false;
    this.muted = false;
    this.lastChime = -1;
    this.creationCount = 0;
    this.music = null;
    this.musicOn = false;
  }

  /** 实时：不传参数（必须在用户手势里调用）；离线：传入 OfflineAudioContext */
  start(offlineCtx) {
    if (this.ctx) {
      if (!this.offline) this.ctx.resume();
      return;
    }
    let ctx = offlineCtx;
    if (ctx) {
      this.offline = true;
    } else {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
    }
    this.ctx = ctx;
    const now = ctx.currentTime;

    this.master = ctx.createGain();
    this.master.gain.setValueAtTime(this.muted ? 0 : LEVEL, now);
    // 压缩器：防止大爆炸那一下削波，也让音乐和钟声的音量更均匀
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20;
    comp.knee.value = 18;
    comp.ratio.value = 3;
    comp.attack.value = 0.01;
    comp.release.value = 0.4;
    const makeup = ctx.createGain();
    makeup.gain.value = 0.95;
    this.master.connect(comp).connect(makeup).connect(ctx.destination);

    // 混响：指数衰减的噪声当作脉冲响应（固定种子，离线渲染可复现）
    let seed = 1234567;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
    const len = Math.floor(ctx.sampleRate * 3.4);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) data[i] = rand() * Math.pow(1 - i / len, 2.6);
    }
    this.reverb = ctx.createConvolver();
    this.reverb.buffer = ir;
    const wet = ctx.createGain();
    wet.gain.value = 0.5;
    this.reverb.connect(wet).connect(this.master);

    // 大爆炸用的噪声
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = rand();
    this.noiseBuf = noiseBuf;

    // 背景音乐
    this.musicGain = ctx.createGain();
    this.musicGain.gain.setValueAtTime(0, now);
    this.musicGain.connect(this.master);
    if (!this.offline) {
      const el = new Audio(MUSIC_URL);
      el.preload = 'auto';
      this.music = el;
      ctx.createMediaElementSource(el).connect(this.musicGain);
    }
  }

  get #ready() {
    return Boolean(this.ctx && (this.offline || this.ctx.state === 'running'));
  }

  setMuted(v) {
    this.muted = v;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(v ? 0 : LEVEL, now, 0.15);
  }

  /**
   * 实时：每帧调用，让音乐跟着影片时间走（播放 / 暂停 / 拖动时间尺 / 变速）。
   * @param T 影片时间；forge 为真时音乐自己往下放；ended 为真表示影片刚放完
   */
  syncMusic({ T, playing, speed = 1, forge = false, ended = false }) {
    const el = this.music;
    if (!el || !this.#ready) return;
    const now = this.ctx.currentTime;
    const target = MUSIC_OFFSET + T;
    if (playing || forge) {
      if (forge) {
        el.playbackRate = 1;
        if (el.currentTime >= MUSIC_LOOP[1]) el.currentTime = MUSIC_LOOP[0];
      } else {
        el.playbackRate = speed;
        if (Math.abs(el.currentTime - target) > 0.35 * Math.max(1, speed)) el.currentTime = target;
      }
      if (el.paused) el.play().catch(() => {});
      if (!this.musicOn) {
        this.musicOn = true;
        clearTimeout(this.pauseTimer);
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setTargetAtTime(MUSIC_LEVEL, now, 0.35);
      }
    } else if (this.musicOn) {
      // 暂停：音乐淡出再停；影片放完时淡得更慢一些，让终章的余韵留住
      this.musicOn = false;
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setTargetAtTime(0, now, ended ? 1.6 : 0.25);
      clearTimeout(this.pauseTimer);
      this.pauseTimer = setTimeout(() => !this.musicOn && el.pause(), ended ? 9000 : 1200);
    } else if (el.paused && Math.abs(el.currentTime - target) > 0.35) {
      el.currentTime = target; // 暂停时拖动时间尺：先把位置对好，恢复播放时不跳
    }
  }

  /** 离线：把解码好的音乐排进成片。offset 为音乐内的起点（秒），可为负（表示晚些再开始） */
  scheduleMusic(buffer, when, offset) {
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(this.musicGain);
    this.musicGain.gain.setValueAtTime(MUSIC_LEVEL, when);
    if (offset >= 0) src.start(when, offset);
    else src.start(when - offset, 0);
  }

  onShot(shot, index, when = this.ctx?.currentTime) {
    if (!this.#ready) return;
    let chime = 0;
    let level = 0.085;
    if (shot.form === 'model') {
      const k = this.creationCount++ % PENTA.length;
      chime = C5 * PENTA[k];
      level = 0.1;
    } else {
      this.creationCount = 0;
      chime = ERA_CHIME[shot.id] || 0;
    }
    if (shot.flash) this.#bang(when);
    // 拖动时间尺时别连成一串
    if (chime && when - this.lastChime > 0.45) {
      this.lastChime = when;
      this.chime(chime, when + (shot.form === 'model' ? shot.trans * 0.85 : shot.trans * 0.5), level);
    }
  }

  chime(freq, when, level) {
    if (!this.#ready) return;
    const ctx = this.ctx;
    for (const [mul, amp, decay] of [
      [1, 1, 3.2],
      [2, 0.22, 1.8],
      [3, 0.08, 1.0],
    ]) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq * mul;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(level * amp, when + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, when + decay);
      osc.connect(g);
      g.connect(this.reverb);
      g.connect(this.master);
      osc.start(when);
      osc.stop(when + decay + 0.1);
    }
  }

  /** 大爆炸：一记下坠的低频 + 一阵由亮转暗的噪声（整部片子唯一的一次重击） */
  #bang(now) {
    const ctx = this.ctx;
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(110, now);
    sub.frequency.exponentialRampToValueAtTime(30, now + 2.0);
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0.0001, now);
    sg.gain.exponentialRampToValueAtTime(0.7, now + 0.03);
    sg.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);
    sub.connect(sg).connect(this.master);
    sub.start(now);
    sub.stop(now + 2.8);

    const burst = ctx.createBufferSource();
    burst.buffer = this.noiseBuf;
    burst.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(8000, now);
    lp.frequency.exponentialRampToValueAtTime(200, now + 3.2);
    const bg = ctx.createGain();
    bg.gain.setValueAtTime(0.0001, now);
    bg.gain.exponentialRampToValueAtTime(0.4, now + 0.04);
    bg.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);
    burst.connect(lp).connect(bg);
    bg.connect(this.master);
    bg.connect(this.reverb);
    burst.start(now);
    burst.stop(now + 4.0);
  }

  /** 旧接口：曾用于驱动持续音，现在由背景音乐取代 */
  frame() {}
  setRoot() {}

  /** 界面点击声：一下很短、很轻的「嗒」 */
  uiClick(when) {
    if (!this.#ready) return;
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    const hp = ctx.createBiquadFilter();
    hp.type = 'bandpass';
    hp.frequency.value = 3200;
    hp.Q.value = 1.2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(0.16, when + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.045);
    src.connect(hp).connect(g).connect(this.master);
    src.start(when, Math.random() * 1.5);
    src.stop(when + 0.06);
  }

  /** 离线成片用：演示「关闭声音」时把整体音量压低一会儿 */
  duck(when, dur, level = 0.06) {
    if (!this.#ready) return;
    const g = this.master.gain;
    g.setValueAtTime(LEVEL, when);
    g.linearRampToValueAtTime(LEVEL * level, when + 0.12);
    g.setValueAtTime(LEVEL * level, when + dur);
    g.linearRampToValueAtTime(LEVEL, when + dur + 0.25);
  }

  /** 离线成片用：在 when 之后 dur 秒内淡出 */
  fadeOut(when, dur) {
    if (!this.#ready) return;
    this.master.gain.setValueAtTime(LEVEL, when);
    this.master.gain.linearRampToValueAtTime(0, when + dur);
  }
}
