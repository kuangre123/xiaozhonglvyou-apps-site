// 「造物」模式：影片暂停，星尘先聚成一团旋转的原行星盘（一切造物诞生的地方），
// 然后凝聚成你点名的东西——预生成的造物直接取用，新的一句话则交给 Lux3D 实时生成。
import { loadCreation } from './models.js';
import { clamp, ease, lerp, smoothstep } from './util.js';

const NEBULA_MOTION = { spin: 0.85, spinPow: 1.5, jitter: 0.006, jitterFreq: 2, alpha: 0.18, tilt: [-0.5, 0.08] };
const MODEL_MOTION = { spin: 0.24, spinPow: 0, jitter: 0.004, jitterFreq: 6, alpha: 0.3 };
const FORGE_LOOK = { bloom: 0.62, glow: [0.03, 0.03, 0.07], glowAmt: 0.01, stars: 1, nebula: 0.5, flash: 0 };
const USER_TINT = [0.6, 0.76, 1.0];
const MAX_USER_CREATIONS = 6;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const hash = (s) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7);

function blendCam(a, b, k) {
  return {
    r: Math.exp(lerp(Math.log(a.r), Math.log(b.r), k)),
    az: lerp(a.az, b.az, k),
    el: lerp(a.el, b.el, k),
    fov: lerp(a.fov, b.fov, k),
    target: [0, 1, 2].map((i) => lerp(a.target[i], b.target[i], k)),
    shake: 0,
  };
}
function blendLook(a, b, k) {
  return {
    bloom: lerp(a.bloom, b.bloom, k),
    glow: [0, 1, 2].map((i) => lerp(a.glow[i], b.glow[i], k)),
    glowAmt: lerp(a.glowAmt, b.glowAmt, k),
    stars: lerp(a.stars, b.stars, k),
    nebula: lerp(a.nebula, b.nebula, k),
    flash: 0,
  };
}

export class Forge {
  constructor({ F, field, forms, creations, scene, ui, getFilmFrame, getShots }) {
    Object.assign(this, { F, field, forms, creations, scene, ui, getFilmFrame, getShots });
    this.active = false;
    this.live = false;
    this.busy = false;
    this.clock = 0;
    this.queue = null;
    this.scratch = [];
    this.userOrder = [];
    this.currentKey = null;
  }

  setLive(v) {
    this.live = v;
  }

  // ── 进入 / 离开 ─────────────────────────────────────────
  /** 由主循环在影片画面「落定」（没有正在进行的变形）时调用 */
  open() {
    const film = this.getFilmFrame();
    const filmCreation = film.shot.form === 'model' ? film.shot.model : null;
    this.film = film;
    this.azBase = film.cam.az;
    this.tOpen = this.clock;
    this.a = { form: film.formB, motion: film.B, frozenLocal: film.local, creationId: filmCreation, reveal: filmCreation ? 1 : 0, revealAtStart: filmCreation ? 1 : 0 };
    this.b = { ...this.a };
    this.tStart = this.clock - 100;
    this.dur = 1;
    this.returning = false;
    this.camA = () => film.cam;
    this.camB = (c) => this.#forgeCam(c);
    this.lookA = film.look;
    this.lookB = FORGE_LOOK;
    this.blendT0 = this.clock;
    this.blendDur = 2.6;
    this.active = true;
    this.camR = 10.5;
    this.currentKey = null;
    this.#transition({ form: this.forms.get('nebula'), motion: NEBULA_MOTION, creationId: null }, 2.6);
    this.ui.setForgeStatus(this.live ? '' : '');
    this.#refreshList();
  }

  close() {
    if (!this.active || this.returning) return;
    const film = this.film;
    const filmCreation = film.shot.form === 'model' ? film.shot.model : null;
    const snapshot = this.#forgeCam(this.clock);
    this.#transition(
      { form: film.formB, motion: film.B, frozenLocal: film.local, creationId: filmCreation },
      2.4,
      () => {
        this.returning = true;
        this.camA = () => snapshot;
        this.camB = () => film.cam;
        this.lookA = FORGE_LOOK;
        this.lookB = film.look;
        this.blendT0 = this.clock;
        this.blendDur = 2.4;
      },
    );
    this.ui.closeForge();
  }

  /** 等待时退远看整片原行星盘，造物出现时推近 */
  #forgeCam(clock) {
    return { r: this.camR ?? 10.5, az: this.azBase + 0.04 * (clock - this.tOpen), el: 0.2, fov: 40, target: [0, 0, 0], shake: 0 };
  }

  /** 排队一次变形：上一次没走完就等它走完，避免粒子瞬移 */
  #transition(next, dur, onStart) {
    const start = () => {
      this.a = this.b;
      this.a.revealAtStart = this.a.reveal || 0;
      this.b = { ...next, t0: this.clock, reveal: 0 };
      this.tStart = this.clock;
      this.dur = dur;
      onStart?.();
    };
    if (this.clock - this.tStart < this.dur) this.queue = start;
    else start();
  }

  // ── 每帧 ────────────────────────────────────────────────
  frame(dt, clock) {
    this.clock = clock;
    const wantR = this.b?.creationId ? 7.0 : 10.5;
    this.camR = this.camR == null ? wantR : this.camR + (wantR - this.camR) * (1 - Math.exp(-dt * 0.9));
    if (this.queue && clock - this.tStart >= this.dur) {
      const fn = this.queue;
      this.queue = null;
      fn();
    }
    const { a, b } = this;
    const el = clock - this.tStart;
    const mix = clamp(el / this.dur);
    a.reveal = a.creationId ? a.revealAtStart * (1 - smoothstep(0, this.dur * 0.3, el)) : 0;
    b.reveal = b.creationId ? smoothstep(this.dur * 0.58, this.dur * 1.3, el) : 0;

    const local = (s) => s.frozenLocal ?? clock - s.t0;
    const A = { ...a.motion, localT: local(a), surfaceFade: 1 - 0.95 * a.reveal };
    const B = { ...b.motion, localT: local(b), surfaceFade: 1 - 0.95 * b.reveal };
    // 等 Lux3D 的时候，星云跟着「呼吸」
    if (this.busy && !b.creationId) B.glow = 1.15 + 0.3 * Math.sin(clock * 2.1);

    const reveals = [];
    for (const s of [b, a]) {
      if (!s.creationId || reveals.some((r) => r.id === s.creationId)) continue;
      reveals.push({ id: s.creationId, reveal: s.reveal, rot: (s.motion.phase || 0) + (s.motion.spin || 0) * local(s) });
    }

    const k = ease.inOutCubic(clamp((clock - this.blendT0) / this.blendDur));
    const look = blendLook(this.lookA, this.lookB, k);
    if (this.busy) look.bloom += 0.3;

    if (this.returning && el > this.dur * 1.32) {
      this.active = false;
      this.returning = false;
      this.#pruneUsers(true);
    }

    return {
      index: -1,
      shot: null,
      formA: a.form,
      formB: b.form,
      mix,
      stagger: 0.55,
      turb: 0.85,
      easeMode: 0,
      spark: 0.5,
      A,
      B,
      reveals,
      cam: blendCam(this.camA(clock), this.camB(clock), k),
      look,
      age: this.film.age,
      temp: this.film.temp,
    };
  }

  // ── 展示已有造物 ────────────────────────────────────────
  async show(entry) {
    if (!this.active || !entry) return;
    try {
      if (entry.kind === 'builtin') {
        this.currentKey = entry.key;
        this.#transition({ form: this.forms.get(entry.key), motion: { ...MODEL_MOTION, phase: this.#facing() }, creationId: entry.id }, 2.8);
        this.ui.setForgeStatus(`Lux3D 提示词：“${entry.prompt}”`);
      } else {
        this.ui.setForgeStatus('正在取回这件造物…');
        await this.#showUser(entry);
        this.ui.setForgeStatus(`“${entry.prompt}” 已凝聚成形。拖动可以转动视角。`);
      }
    } catch (err) {
      this.ui.setForgeStatus(`没能载入这件造物：${err.message}`, 'error');
    }
    this.#refreshList();
  }

  /** 让模型正面略偏向镜头，随转台转过来 */
  #facing() {
    return this.#forgeCam(this.clock + 2.8).az - 0.55;
  }

  async #showUser({ id, url }) {
    const key = `user:${id}`;
    let creation = this.creations.get(key);
    if (!creation) {
      creation = await loadCreation(key, url);
      this.creations.set(key, creation);
      this.scene.add(creation.root);
      this.userOrder.push(key);
    }
    const samples = creation.sample(this.F.surfaceCount, hash(key));
    const slot = this.#scratchSlot();
    this.F.model(samples, USER_TINT, slot.data);
    this.field.touch(slot.gpu);
    this.currentKey = key;
    this.#transition({ form: slot.gpu, motion: { ...MODEL_MOTION, phase: this.#facing() }, creationId: key }, 2.8);
    this.#pruneUsers(false);
  }

  /** 两块可复写的队形缓冲，轮流使用（当前显示的那块不能动） */
  #scratchSlot() {
    const busy = new Set([this.a?.form, this.b?.form]);
    let slot = this.scratch.find((s) => !busy.has(s.gpu));
    if (!slot) {
      const data = this.F.alloc();
      slot = { data, gpu: this.field.createFormation(data) };
      this.scratch.push(slot);
    }
    return slot;
  }

  #pruneUsers(all) {
    const keep = new Set([this.a?.creationId, this.b?.creationId]);
    while (this.userOrder.length > (all ? 0 : MAX_USER_CREATIONS)) {
      const idx = this.userOrder.findIndex((k) => !keep.has(k));
      if (idx < 0) break;
      const [key] = this.userOrder.splice(idx, 1);
      this.creations.get(key)?.dispose();
      this.creations.delete(key);
    }
  }

  // ── 实时生成 ────────────────────────────────────────────
  async submit({ prompt, style }) {
    if (!this.active || this.busy) return;
    if (!this.live) {
      this.ui.setForgeStatus('实时生成需要本地服务（npm start）和 Aholo API key。', 'error');
      return;
    }
    this.busy = true;
    this.ui.setForgeBusy(true);
    if (this.b.creationId) {
      this.currentKey = null;
      this.#transition({ form: this.forms.get('nebula'), motion: NEBULA_MOTION, creationId: null }, 2.4);
    }
    this.ui.setForgeStatus('正在把这句话交给 Lux3D…');
    try {
      const res = await fetch('api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, style }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || `服务返回 ${res.status}`);
      const t0 = performance.now();
      for (;;) {
        await sleep(3000);
        const r = await (await fetch(`api/task/${body.taskId}`, { cache: 'no-store' })).json();
        const sec = Math.round((performance.now() - t0) / 1000);
        if (r.status === 'running') {
          this.ui.setForgeStatus(`Lux3D 正在生成：参考图 → 网格 → 材质　已等 ${sec} 秒（通常 1–2 分钟）`);
          continue;
        }
        if (r.status !== 'done') throw new Error(r.error || 'Lux3D 没有完成这次生成。');
        if (!this.active) break; // 生成期间用户已回到影片：模型已落盘，下次进来在列表里
        this.ui.setForgeStatus('生成完成，星尘正在凝聚…');
        await this.#showUser({ id: body.taskId, url: r.url });
        this.ui.setForgeStatus(`“${prompt}” 已凝聚成形。拖动可以转动视角。`);
        break;
      }
    } catch (err) {
      this.ui.setForgeStatus(err.message, 'error');
    } finally {
      this.busy = false;
      this.ui.setForgeBusy(false);
      this.#refreshList();
    }
  }

  async #refreshList() {
    const entries = this.getShots()
      .filter((s) => s.form === 'model')
      .map((s) => ({ key: `model:${s.model}`, kind: 'builtin', id: s.model, label: s.name || s.title, prompt: s.prompt }));
    if (this.live) {
      try {
        const mine = await (await fetch('api/creations', { cache: 'no-store' })).json();
        entries.unshift(...mine.map((c) => ({ key: `user:${c.id}`, kind: 'user', id: c.id, label: c.prompt, prompt: c.prompt, url: c.url })));
      } catch { /* 列表拿不到不影响使用 */ }
    }
    this.ui.setForgeList(entries, this.currentKey);
  }
}
