// 《星尘简史》主程序。
// 结构：filmFrame(T) / forge.frame() 产出一份「这一帧应该长什么样」的描述，applyFrame() 负责把它画出来。
// 影片本身是影片时间 T 的纯函数，所以可以任意拖动、倒放、跳转。
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createFormations } from './formations.js';
import { ParticleField } from './particles.js';
import { loadCreation } from './models.js';
import { Sky } from './sky.js';
import { buildTimeline } from './timeline.js';
import { UI } from './ui.js';
import { Forge } from './forge.js';
import { Soundscape } from './audio.js';
import { clamp, ease, lerp, smoothstep } from './util.js';

const query = new URLSearchParams(location.search);
const coarse = matchMedia('(pointer: coarse)').matches;
const N = clamp(parseInt(query.get('n'), 10) || (coarse ? 70000 : 160000), 20000, 400000);

// ── 渲染器 ────────────────────────────────────────────────────
const canvas = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
const pixelRatio = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
renderer.setPixelRatio(pixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setClearColor(0x000000, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 2000);

// 造物是 PBR 材质，需要一个环境来反射；用中性的摄影棚光，不抢星空的戏
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.5;
const keyLight = new THREE.DirectionalLight(0xfff0dc, 2.4);
keyLight.position.set(4, 5, 6);
const rimLight = new THREE.DirectionalLight(0x8fb4ff, 2.0);
rimLight.position.set(-6, 2.5, -5);
scene.add(keyLight, rimLight);

const sky = new Sky();
scene.add(sky.group);

// 黑洞的「事件视界阴影」：一个纯黑、写深度的球，挡住它背后的星尘与星空
const holeMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), new THREE.MeshBasicMaterial({ color: 0x000000 }));
holeMesh.visible = false;
scene.add(holeMesh);
const _holeDir = new THREE.Vector3();

// 黑洞的透镜光带要正对镜头：从镜头表里取黑洞镜头的机位
const bhCam = buildTimeline(new Map()).shots.find((s) => s.id === 'blackhole')?.cam;
const F = createFormations(N, undefined, bhCam ? { blackHole: { az: bhCam.az, el: bhCam.el } } : {});
const field = new ParticleField(N, F.seeds());
scene.add(field.points);

// ── 后期：泛光 → 调色（暗角/颗粒/色散/闪白）→ 色调映射 ───────────
const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uVignette: { value: 0.85 },
    uGrain: { value: 0.045 },
    uFlash: { value: 0 },
    uAberration: { value: 0.012 },
  },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uTime; uniform float uVignette; uniform float uGrain; uniform float uFlash; uniform float uAberration;
    varying vec2 vUv;
    void main(){
      vec2 c = vUv - 0.5;
      float r2 = dot(c, c);
      vec2 off = c * r2 * uAberration;
      vec3 col = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
      col *= mix(1.0, smoothstep(0.95, 0.25, sqrt(r2) * 1.2), uVignette);
      float g = fract(sin(dot(gl_FragCoord.xy + uTime * 61.7, vec2(12.9898, 78.233))) * 43758.5453);
      col += (g - 0.5) * uGrain * (0.35 + col);
      col += uFlash;
      gl_FragColor = vec4(max(col, 0.0), 1.0);
    }`,
};
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 1, 0.72, 0.8);
composer.addPass(bloom);
const grade = new ShaderPass(GradeShader);
composer.addPass(grade);
composer.addPass(new OutputPass());

// ── 取景 ──────────────────────────────────────────────────────
// 镜头表里的 fov 是横屏下的竖直视角。竖屏时保持水平视角不变（等效于把镜头拉远），
// 再做一点「移轴」：主体略偏上，给左下角（竖屏是底部）的字幕留出位置。
let viewW = 1;
let viewH = 1;
let baseFov = 42;
function applyLens() {
  const aspect = viewW / viewH;
  const k = Math.min(1, aspect / 1.15);
  camera.aspect = aspect;
  camera.fov = Math.min(100, (2 * Math.atan(Math.tan((baseFov * Math.PI) / 360) / k) * 180) / Math.PI);
  const shiftY = aspect < 1 ? 0.11 : 0.045;
  camera.setViewOffset(viewW, viewH, 0, shiftY * viewH, viewW, viewH); // 内部会 updateProjectionMatrix
}
function setView(w, h) {
  viewW = w;
  viewH = h;
  renderer.setSize(w, h, false);
  composer.setSize(w, h);
  applyLens();
}
function resize() {
  setView(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resize);
resize();

// ── 状态 ──────────────────────────────────────────────────────
const forms = new Map(); // key → GPU 队形
const creations = new Map(); // id → Creation
let timeline = null;
let T = 0;
let playing = false;
let speed = 1;
let started = false;
let clock = 0;
let shotIndex = -1;

const user = { yaw: 0, pitch: 0, zoom: 1, idle: 99, dragging: false };
const pointer = { ndc: new THREE.Vector2(), force: 0 };
const raycaster = new THREE.Raycaster();

const ui = new UI();
const audio = new Soundscape();
const formKey = (shot) => (shot.form === 'model' ? `model:${shot.model}` : shot.form);

// ── 影片：T → 帧描述 ──────────────────────────────────────────
function pose(shot, t) {
  const c = shot.cam;
  return { r: c.r, az: c.az + c.drift * t, el: c.el, fov: c.fov, target: c.target || [0, 0, 0] };
}

function filmFrame(time) {
  const { shots } = timeline;
  const i = timeline.indexAt(time);
  const shot = shots[i];
  const first = i === 0;
  const prev = shots[Math.max(0, i - 1)];
  const local = time - shot.start;
  const prevLocal = time - prev.start;
  const m = first ? 1 : clamp(local / shot.trans);
  const camM = first ? 1 : ease.inOutCubic(clamp(local / shot.camTrans));
  const lookM = first ? 1 : ease.inOut(clamp(local / (shot.trans * 1.1)));

  // 造物显形：粒子先到位，网格随后自下而上「结晶」；离开时先溶解回粒子，再飞走
  const revealCur = shot.form === 'model' ? smoothstep(shot.trans * 0.58, shot.trans * 1.3, local) : 0;
  const revealPrev = !first && prev.form === 'model' ? 1 - smoothstep(0, shot.trans * 0.3, local) : 0;
  const reveals = [];
  if (shot.form === 'model') reveals.push({ id: shot.model, reveal: revealCur, rot: (shot.motion.phase || 0) + shot.motion.spin * local });
  if (!first && prev.form === 'model') reveals.push({ id: prev.model, reveal: revealPrev, rot: (prev.motion.phase || 0) + prev.motion.spin * prevLocal });

  // 黑洞阴影：星尘聚成吸积盘时长出来，离开时先缩回去
  const holeCur = shot.hole ? smoothstep(shot.trans * 0.35, shot.trans * 1.0, local) : 0;
  const holePrev = !first && prev.hole ? 1 - smoothstep(0, shot.trans * 0.45, local) : 0;

  const A = { ...prev.motion, localT: prevLocal, surfaceFade: 1 - 0.95 * revealPrev };
  const B = { ...shot.motion, localT: local, surfaceFade: 1 - 0.95 * revealCur };

  // 奇点：缓慢搏动，临近大爆炸时急剧收紧发亮
  let flash = 0;
  let shake = 0;
  let bloomBoost = 0;
  if (shot.id === 'singularity') {
    const tense = smoothstep(shot.dur - 1.8, shot.dur, local);
    const pulse = 1 + 0.16 * Math.sin(local * 2.4) + 1.6 * tense * tense;
    B.size = (B.size || 1) * pulse;
    A.size = B.size;
    B.alpha = (B.alpha || 1) * (1 + 3 * tense);
    A.alpha = B.alpha;
    bloomBoost = 1.2 * tense;
    shake = 0.02 * tense;
  }
  if (shot.flash) {
    flash = 2.6 * Math.exp(-local * 4.0);
    shake = 0.22 * Math.exp(-local * 1.3);
    bloomBoost = 1.0 * Math.exp(-local * 1.6);
  }

  const pa = pose(prev, prevLocal);
  const pb = pose(shot, local);
  const la = prev.look;
  const lb = shot.look;
  return {
    index: i,
    shot,
    prev,
    local,
    formA: forms.get(formKey(prev)),
    formB: forms.get(formKey(shot)),
    mix: m,
    stagger: shot.stagger ?? 0.5,
    turb: shot.turb ?? 0,
    easeMode: shot.easeMode ?? 0,
    spark: shot.spark ?? 0.35,
    A,
    B,
    reveals,
    hole: Math.max(holeCur, holePrev),
    cam: {
      r: Math.exp(lerp(Math.log(pa.r), Math.log(pb.r), camM)),
      az: lerp(pa.az, pb.az, camM),
      el: lerp(pa.el, pb.el, camM),
      fov: lerp(pa.fov, pb.fov, camM),
      target: [0, 1, 2].map((k) => lerp(pa.target[k], pb.target[k], camM)),
      shake,
    },
    look: {
      bloom: lerp(la.bloom, lb.bloom, lookM) + bloomBoost,
      glow: [0, 1, 2].map((k) => lerp(la.glow[k], lb.glow[k], lookM)),
      glowAmt: lerp(la.glowAmt, lb.glowAmt, lookM),
      stars: lerp(la.stars, lb.stars, lookM),
      nebula: lerp(la.nebula, lb.nebula, lookM),
      flash,
    },
    // 宇宙学读数在对数空间里插值：10⁻⁴³ 秒 → 138 亿年跨了 60 个数量级
    age: Math.exp(lerp(Math.log(prev.age), Math.log(shot.age), lookM)),
    temp: Math.exp(lerp(Math.log(prev.temp), Math.log(shot.temp), lookM)),
  };
}

// ── 把帧描述画出来 ────────────────────────────────────────────
const _target = new THREE.Vector3();
function applyFrame(d, dt) {
  field.setPair(d.formA, d.formB);

  // 用户视角偏移：松手几秒后缓缓回到导演机位（录制成片时由脚本直接给出，不自动回正）
  if (!user.dragging && !user.scripted) {
    user.idle += dt;
    if (user.idle > 3.5) {
      const k = 1 - Math.exp(-dt * 0.9);
      user.yaw = lerp(user.yaw, 0, k);
      user.pitch = lerp(user.pitch, 0, k);
      user.zoom = lerp(user.zoom, 1, k);
    }
  }
  const c = d.cam;
  const el = clamp(c.el + user.pitch, -1.45, 1.45);
  const az = c.az + user.yaw;
  const r = c.r * user.zoom;
  _target.set(c.target[0], c.target[1], c.target[2]);
  camera.position.set(_target.x + r * Math.cos(el) * Math.sin(az), _target.y + r * Math.sin(el), _target.z + r * Math.cos(el) * Math.cos(az));
  if (c.shake > 0.0005) {
    camera.position.x += Math.sin(clock * 47.1) * c.shake;
    camera.position.y += Math.sin(clock * 53.7 + 1.3) * c.shake;
  }
  camera.lookAt(_target);
  if (Math.abs(baseFov - c.fov) > 0.01) {
    baseFov = c.fov;
    applyLens();
  }
  camera.updateMatrixWorld();

  // 指针尾迹
  pointer.force = Math.max(0, pointer.force - dt * 0.9);
  raycaster.setFromCamera(pointer.ndc, camera);
  field.uniforms.uPointerO.value.copy(raycaster.ray.origin);
  field.uniforms.uPointerD.value.copy(raycaster.ray.direction);
  field.uniforms.uPointerF.value = pointer.force * 0.42;

  const drawH = renderer.domElement.height;
  field.update({
    time: clock,
    mix: d.mix,
    stagger: d.stagger,
    turb: d.turb,
    easeMode: d.easeMode,
    spark: d.spark,
    scale: drawH / (2 * Math.tan((camera.fov * Math.PI) / 360)),
    A: d.A,
    B: d.B,
  });

  for (const creation of creations.values()) {
    const hit = d.reveals.find((x) => x.id === creation.id);
    creation.reveal = hit ? hit.reveal : 0;
    if (hit) creation.root.rotation.y = hit.rot;
  }

  const hole = d.hole || 0;
  holeMesh.visible = hole > 0.002;
  holeMesh.scale.setScalar(Math.max(0.001, hole));
  // 引力透镜：背景星光被推离黑洞，在爱因斯坦环附近堆积变亮
  const holeDist = camera.position.length();
  _holeDir.copy(camera.position).multiplyScalar(-1 / Math.max(1e-6, holeDist));
  const lensTheta = hole > 0.002 ? 1.6 * Math.atan(hole / holeDist) : 0;
  sky.update(camera, { time: clock, glow: d.look.glow, glowAmt: d.look.glowAmt, stars: d.look.stars, nebula: d.look.nebula, pixelRatio, lensDir: _holeDir, lensTheta });
  bloom.strength = d.look.bloom;
  grade.uniforms.uTime.value = clock;
  grade.uniforms.uFlash.value = d.look.flash;
  grade.uniforms.uAberration.value = 0.012 + 0.05 * Math.min(1, d.look.flash);
}

// ── 主循环 ────────────────────────────────────────────────────
const forge = new Forge({ F, field, forms, creations, scene, ui, getFilmFrame: () => filmFrame(T), getShots: () => timeline.shots });
let pendingForge = false; // 点了「造物」，等当前变形走完再进入
let last = performance.now();
// 录制成片时由录制器以固定步长驱动；这时 rAF 循环必须让开，否则会按真实时间再推进一遍影片
let externalClock = false;
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!externalClock) step(dt);
  requestAnimationFrame(loop);
}

/** 推进并渲染一帧。单独拆出来，是为了调试 / 录屏时可以脱离 rAF 逐帧驱动 */
function step(dt) {
  clock += dt;
  forge.clock = clock;
  let d = null;
  if (timeline) {
    if ((playing || pendingForge) && !forge.active) {
      T = Math.min(timeline.duration - 0.001, T + dt * (playing ? speed : 1));
      if (playing && T >= timeline.duration - 0.002) setPlaying(false);
    }
    d = forge.active ? forge.frame(dt, clock) : filmFrame(T);
    if (pendingForge && !forge.active) {
      const settled = d.mix >= 1 && (d.shot.form !== 'model' || d.local >= d.shot.trans * 1.3);
      if (settled || T >= timeline.duration - 0.002) {
        pendingForge = false;
        setPlaying(false);
        forge.open();
        d = forge.frame(dt, clock);
      }
    }
    applyFrame(d, dt);
    if (!forge.active) {
      if (d.index !== shotIndex) {
        shotIndex = d.index;
        ui.showShot(d.shot, d.index);
        audio.onShot(d.shot, d.index);
      }
      ui.frame({ T, duration: timeline.duration, age: d.age, temp: d.temp, local: d.local, shot: d.shot, playing });
    }
    audio.frame(dt, d);
    audio.syncMusic({ T, playing, speed, forge: forge.active, ended: T >= timeline.duration - 0.01 });
  }
  composer.render(dt);
  return d;
}

function setPlaying(v) {
  playing = v;
  ui.setPlaying(v);
}
function seek(time) {
  T = clamp(time, 0, timeline.duration - 0.001);
}
function seekShot(i, offset = 0) {
  const s = timeline.shots[clamp(i, 0, timeline.shots.length - 1)];
  seek(s.start + offset);
}

// ── 交互 ──────────────────────────────────────────────────────
ui.on('begin', () => {
  started = true;
  startAudio();
  seek(0);
  setPlaying(true);
});
ui.on('toggle', () => {
  if (!started) return;
  if (T >= timeline.duration - 0.01) seek(0);
  setPlaying(!playing);
});
ui.on('seek', (time) => seek(time));
ui.on('seekShot', (i) => seekShot(i, 0));
ui.on('speed', (v) => (speed = v));
ui.on('mute', (v) => {
  if (!audio.ctx) {
    // 还没启动过：这次点击就是「打开声音」
    startAudio();
    ui.setMuted(false);
    return;
  }
  audio.setMuted(v);
});
function startAudio() {
  const fresh = !audio.ctx;
  audio.start();
  if (fresh && timeline && shotIndex >= 0) audio.setRoot(timeline.shots[shotIndex]);
}
// 浏览器只允许在用户手势里启动声音：影片开始后，任意一次点击 / 按键都顺手把它打开
const unlockAudio = (e) => {
  if (!started || ui.muted || e.target?.closest?.('#btn-sound')) return;
  startAudio();
};
window.addEventListener('pointerdown', unlockAudio, true);
window.addEventListener('keydown', unlockAudio, true);
ui.on('replay', () => {
  seek(0);
  setPlaying(true);
});
ui.on('forgeOpen', () => {
  if (!started || forge.active || pendingForge) return;
  pendingForge = true;
  ui.openForge();
});
ui.on('forgeClose', () => {
  if (pendingForge) {
    pendingForge = false;
    ui.closeForge();
  } else {
    forge.close();
  }
});
ui.on('forgeSubmit', (payload) => forge.submit(payload));
ui.on('forgeShow', (entry) => forge.show(entry));

canvas.addEventListener('pointerdown', (e) => {
  user.dragging = true;
  user.idle = 0;
  user.px = e.clientX;
  user.py = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  pointer.ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  pointer.force = Math.min(1, pointer.force + 0.25);
  if (!user.dragging) return;
  user.yaw -= ((e.clientX - user.px) / window.innerWidth) * 4.2;
  user.pitch = clamp(user.pitch + ((e.clientY - user.py) / window.innerHeight) * 3.0, -1.3, 1.3);
  user.px = e.clientX;
  user.py = e.clientY;
  user.idle = 0;
});
const endDrag = () => {
  user.dragging = false;
  user.idle = 0;
};
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);
canvas.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    user.zoom = clamp(user.zoom * Math.exp(e.deltaY * 0.0012), 0.35, 2.6);
    user.idle = 0;
  },
  { passive: false },
);
window.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
  if (!timeline || !started) return;
  if (e.code === 'Space') {
    e.preventDefault();
    ui.emit('toggle');
  } else if (e.code === 'ArrowRight') {
    seekShot(timeline.indexAt(T) + 1);
  } else if (e.code === 'ArrowLeft') {
    seekShot(timeline.indexAt(T) - (T - timeline.shots[timeline.indexAt(T)].start > 1.5 ? 0 : 1));
  }
});

// ── 启动 ──────────────────────────────────────────────────────
// 让出一帧给浏览器（更新加载进度）。不能只等 rAF：被遮住的标签页里 rAF 可能永远不触发，
// 而 visibilityState 仍然报告 visible —— 所以和一个短定时器赛跑，谁先到算谁。
const nextFrame = () =>
  new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
    setTimeout(resolve, 30);
  });
const hash = (s) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7);

async function boot() {
  // 先把奇点摆出来，加载期间它就在标题后面搏动
  forms.set('singularity', field.createFormation(F.get('singularity')));
  timeline = buildTimeline(new Map());
  requestAnimationFrame(loop);

  const procedural = ['bang', 'quark', 'nucleo', 'cmb', 'darkAges', 'dawn', 'galaxy', 'blackHole', 'nebula'];
  let manifest = [];
  try {
    const res = await fetch('models/manifest.json', { cache: 'no-cache' });
    if (res.ok) manifest = await res.json();
  } catch { /* 没有预生成的造物也能播放前半段 */ }

  const total = procedural.length + manifest.length;
  let done = 0;
  const progress = (label) => ui.setLoading(++done / total, label);

  for (const key of procedural) {
    forms.set(key, field.createFormation(F.get(key)));
    progress('排布星尘');
    await nextFrame();
  }

  const available = new Map();
  const samples = new Map();
  const queue = [...manifest];
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      for (let entry; (entry = queue.shift()); ) {
        try {
          const creation = await loadCreation(entry.id, `models/${entry.file}`);
          creations.set(entry.id, creation);
          scene.add(creation.root);
          samples.set(entry.id, creation.sample(F.surfaceCount, hash(entry.id)));
          available.set(entry.id, entry);
        } catch (err) {
          console.warn(`造物 ${entry.id} 加载失败，已从时间线里跳过`, err);
        }
        progress('唤醒 Lux3D 造物');
      }
    }),
  );

  const built = buildTimeline(available);
  for (const shot of built.shots) {
    if (shot.form !== 'model') continue;
    forms.set(formKey(shot), field.createFormation(F.model(samples.get(shot.model), shot.tint)));
    creations.get(shot.model).uniforms.uEdgeColor.value.setRGB(shot.tint[0], shot.tint[1], shot.tint[2]);
    if (shot.glow) creations.get(shot.model).setGlow(shot.glow[0], shot.glow[1]);
    // 开场时模型正面略偏向镜头，随转台转到正面
    shot.motion.phase = shot.cam.az - 0.55 + (shot.yaw || 0);
  }
  timeline = built;
  shotIndex = -1;
  ui.build(timeline, { creations: available.size });

  let live = false;
  try {
    live = (await (await fetch('api/health', { cache: 'no-store' })).json()).live === true;
  } catch { /* 纯静态托管：没有后端 */ }
  forge.setLive(live);
  ui.ready({ live });

  // 调试与录屏用的入口：?t=42 跳到指定秒，?shot=galaxy 跳到指定镜头，?play=1 自动播放
  const api = {
    seek,
    seekShot,
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    get T() {
      return T;
    },
    timeline,
    renderer,
    forge,
    /** 同步推进 n 帧（每帧 dt 秒），不依赖 rAF——后台标签页里 rAF 会被限速 */
    tick(n = 1, dt = 1 / 60) {
      let d = null;
      for (let i = 0; i < n; i++) d = step(dt);
      return d;
    },
    /** 录制用：固定分辨率、像素比 1；restoreView() 回到窗口尺寸 */
    setView(w, h) {
      renderer.setPixelRatio(1);
      composer.setPixelRatio(1);
      setView(w, h);
    },
    restoreView() {
      renderer.setPixelRatio(pixelRatio);
      composer.setPixelRatio(pixelRatio);
      resize();
    },
    frameAt: (time) => filmFrame(time),
    audio,
    setGrain(v) {
      grade.uniforms.uGrain.value = v;
    },
    setExternalClock(v) {
      externalClock = v;
    },
    /** 录制用：直接给出用户视角偏移（旋转、俯仰、远近）；scripted 为真时不自动回正 */
    setUserView({ yaw = 0, pitch = 0, zoom = 1 } = {}, scripted = true) {
      user.yaw = yaw;
      user.pitch = pitch;
      user.zoom = zoom;
      user.scripted = scripted;
    },
    /** 录制用：模拟指针（NDC 坐标）与它拨开星尘的力度 */
    setPointer(x, y, force) {
      pointer.ndc.set(x, y);
      pointer.force = force;
    },
    get clock() {
      return clock;
    },
    /**
     * 调试录帧：以固定分辨率渲染当前画面（只有 WebGL 画布，不含界面），
     * 交给本地服务存成 .debug/frames/<name>.jpg。需要服务端 DEBUG_CAPTURE=1。
     */
    async capture(name, { w = 960, h = 540, frames = 2, quality = 0.86 } = {}) {
      const prevRatio = renderer.getPixelRatio();
      renderer.setPixelRatio(1);
      composer.setPixelRatio(1);
      setView(w, h);
      for (let i = 0; i < frames; i++) step(1 / 60);
      const url = renderer.domElement.toDataURL('image/jpeg', quality);
      renderer.setPixelRatio(prevRatio);
      composer.setPixelRatio(prevRatio);
      resize();
      const res = await fetch('api/debug/frame', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, url }) });
      return res.ok ? name : `failed ${res.status}`;
    },
    shotAt(id, offset = 0) {
      const i = timeline.shots.findIndex((s) => s.id === id);
      if (i < 0) throw new Error(`没有镜头 ${id}`);
      seekShot(i, offset);
    },
  };
  window.stardust = api;
  if (query.has('t') || query.has('shot') || query.has('play')) {
    started = true;
    ui.dismissIntro();
    if (query.has('shot')) {
      const idx = timeline.shots.findIndex((s) => s.id === query.get('shot'));
      if (idx >= 0) seekShot(idx, parseFloat(query.get('o') || '0'));
    } else {
      seek(parseFloat(query.get('t') || '0'));
    }
    setPlaying(query.get('play') === '1');
  }
}

boot().catch((err) => {
  console.error(err);
  ui.fatal(err);
});
