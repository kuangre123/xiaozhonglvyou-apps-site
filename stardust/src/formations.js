// 粒子「队形」：同一批 N 颗粒子在 138 亿年里依次排成的每一种形态。
// 每个队形 = pos(Float32 x,y,z,size) + col(Uint8 r,g,b,intensity)。
//   · 颜色是线性空间，intensity 字节映射到 0..4 倍亮度（给 bloom 用的 HDR）。
//   · size 是世界单位；size 为负表示「环境粒子」（模型镜头里不随模型显形而淡出）。
// 粒子 i 在所有队形里共用同一组基础随机量（方向、均匀数、正态数），
// 所以相邻队形之间的运动是连贯的：比如暴胀 → 夸克汤 → CMB 时每颗粒子保持自己的径向方向。
import { clamp, createNoise3, gaussian, lerp, mulberry32, ramp, TAU } from './util.js';

const INTENSITY_SCALE = 4;

/**
 * @param view 可选：{ blackHole: { az, el } }，黑洞镜头的机位方位角与仰角（弧度）。
 *             引力透镜形成的那道光带必须正对镜头，所以队形需要知道镜头从哪儿看。
 */
export function createFormations(N, seed = 20261115, view = {}) {
  const rng = mulberry32(seed);
  const dir = new Float32Array(N * 3);
  const U = [0, 1, 2, 3].map(() => new Float32Array(N));
  const G = [0, 1, 2].map(() => new Float32Array(N));
  for (let i = 0; i < N; i++) {
    const z = rng() * 2 - 1;
    const a = rng() * TAU;
    const s = Math.sqrt(1 - z * z);
    dir[i * 3] = s * Math.cos(a);
    dir[i * 3 + 1] = z;
    dir[i * 3 + 2] = s * Math.sin(a);
    for (const u of U) u[i] = rng();
    for (const g of G) g[i] = gaussian(rng);
  }
  const { fbm } = createNoise3(seed + 7);
  const tmp = [0, 0, 0];

  const alloc = () => ({ pos: new Float32Array(N * 4), col: new Uint8Array(N * 4) });
  const setP = (f, i, x, y, z, size) => {
    const o = i * 4;
    f.pos[o] = x;
    f.pos[o + 1] = y;
    f.pos[o + 2] = z;
    f.pos[o + 3] = size;
  };
  const setC = (f, i, r, g, b, intensity) => {
    const o = i * 4;
    f.col[o] = clamp(r) * 255;
    f.col[o + 1] = clamp(g) * 255;
    f.col[o + 2] = clamp(b) * 255;
    f.col[o + 3] = clamp(intensity / INTENSITY_SCALE) * 255;
  };

  // ── 奇点：一切挤在一个点里 ─────────────────────────────────
  function singularity() {
    const f = alloc();
    for (let i = 0; i < N; i++) {
      const halo = U[0][i] < 0.06;
      const r = halo ? 0.04 + 0.42 * Math.pow(U[1][i], 2.4) : 0.012 * Math.cbrt(U[1][i]);
      setP(f, i, dir[i * 3] * r, dir[i * 3 + 1] * r, dir[i * 3 + 2] * r, halo ? 0.022 : 0.05);
      if (halo) setC(f, i, 0.75, 0.82, 1.0, 0.55);
      else setC(f, i, 1.0, 0.94, 0.86, 1.0);
    }
    return f;
  }

  // ── 暴胀：火球。径向带噪声起伏 = 量子涨落，日后宇宙网的种子 ──
  const BANG_RAMP = [
    [0.0, 0.85, 0.92, 1.0],
    [0.25, 1.0, 0.95, 0.75],
    [0.5, 1.0, 0.66, 0.22],
    [0.78, 0.95, 0.28, 0.06],
    [1.05, 0.5, 0.05, 0.03],
  ];
  function bang() {
    const f = alloc();
    const R = 5.6;
    for (let i = 0; i < N; i++) {
      const dx = dir[i * 3];
      const dy = dir[i * 3 + 1];
      const dz = dir[i * 3 + 2];
      const lump = fbm(dx * 2.3 + 11, dy * 2.3, dz * 2.3, 4);
      const r = R * Math.pow(U[1][i], 0.44) * (1 + 0.5 * lump);
      const t = r / R;
      ramp(BANG_RAMP, t + 0.12 * (U[2][i] - 0.5), tmp);
      setP(f, i, dx * r, dy * r, dz * r, 0.045 + 0.05 * U[3][i]);
      setC(f, i, tmp[0], tmp[1], tmp[2], 2.4 - 1.5 * clamp(t));
    }
    return f;
  }

  // ── 夸克汤：翻滚的等离子体 ───────────────────────────────────
  // 大部分粒子被牛顿迭代吸附到一个噪声场的零等值面上，形成一片片翻卷的「帷幕」；
  // 颜色在红、绿、蓝三种「色荷」之间连续流转，每颗粒子再保留一点自己的色荷。
  const QUARK = [
    [1.0, 0.16, 0.1],
    [0.16, 1.0, 0.3],
    [0.22, 0.38, 1.0],
  ];
  function quark() {
    const f = alloc();
    const R = 6.0;
    const e = 0.05;
    const field = (x, y, z) => fbm(x * 0.3 + 4.1, y * 0.3 - 2.7, z * 0.3 + 9.3, 3);
    for (let i = 0; i < N; i++) {
      const r = R * Math.cbrt(U[1][i]);
      let x = dir[i * 3] * r;
      let y = dir[i * 3 + 1] * r;
      let z = dir[i * 3 + 2] * r;
      const sheet = U[0][i] < 0.8;
      if (sheet) {
        for (let k = 0; k < 3; k++) {
          const n = field(x, y, z);
          const gx = (field(x + e, y, z) - n) / e;
          const gy = (field(x, y + e, z) - n) / e;
          const gz = (field(x, y, z + e) - n) / e;
          const g2 = gx * gx + gy * gy + gz * gz + 1e-4;
          let s = n / g2;
          const len = Math.sqrt(g2) * Math.abs(s);
          if (len > 0.9) s *= 0.9 / len; // 别一步跳太远
          x -= gx * s;
          y -= gy * s;
          z -= gz * s;
        }
        x += G[0][i] * 0.045;
        y += G[1][i] * 0.045;
        z += G[2][i] * 0.045;
      }
      const len = Math.hypot(x, y, z);
      const edge = R * (0.98 + 0.2 * U[3][i] * U[3][i]); // 软边界，不要一条硬轮廓
      if (len > edge) {
        const s = edge / len;
        x *= s;
        y *= s;
        z *= s;
      }
      const h = (fbm(x * 0.17 - 7, y * 0.17 + 3, z * 0.17 + 11, 2) * 2.4 + 4.5) % 3;
      const a = Math.floor(h) % 3;
      const b = (a + 1) % 3;
      const t = h - Math.floor(h);
      const own = QUARK[i % 3];
      const hot = 0.22 + 0.22 * U[2][i];
      const cr = lerp(lerp(QUARK[a][0], QUARK[b][0], t), own[0], 0.3);
      const cg = lerp(lerp(QUARK[a][1], QUARK[b][1], t), own[1], 0.3);
      const cb = lerp(lerp(QUARK[a][2], QUARK[b][2], t), own[2], 0.3);
      setP(f, i, x, y, z, sheet ? 0.034 + 0.024 * U[3][i] : 0.05);
      setC(f, i, lerp(cr, 1, hot), lerp(cg, 0.92, hot), lerp(cb, 0.85, hot), sheet ? 1.6 : 0.55);
    }
    return f;
  }

  // ── 原初核合成：稀疏的氦-4 核（2 质子 + 2 中子，四面体）悬在一片氢核的薄雾里 ──
  // 每 64 颗粒子出 1 个氦核，其余 60 颗是氢核。分布被噪声扭成一团团的，镜头穿行其中时有纵深。
  const TETRA = [
    [1, 1, 1],
    [1, -1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
  ];
  function nucleo() {
    const f = alloc();
    const R = 6.4;
    const w = 2.0;
    for (let i = 0; i < N; i++) {
      const k = i % 64;
      const lead = k < 4 ? i - k : i; // 同一个氦核的 4 颗核子共用成员 0 的位置
      const r0 = R * Math.cbrt(U[1][lead]);
      let x = dir[lead * 3] * r0;
      let y = dir[lead * 3 + 1] * r0;
      let z = dir[lead * 3 + 2] * r0;
      x += fbm(x * 0.3 + 1.3, y * 0.3, z * 0.3, 2) * w;
      y += fbm(x * 0.3, y * 0.3 + 5.1, z * 0.3, 2) * w;
      z += fbm(x * 0.3, y * 0.3, z * 0.3 + 9.7, 2) * w;
      if (k < 4) {
        const t = TETRA[k];
        const d = 0.05;
        setP(f, i, x + t[0] * d, y + t[1] * d, z + t[2] * d, 0.062);
        if (k < 2) setC(f, i, 1.0, 0.44, 0.18, 2.0); // 质子
        else setC(f, i, 0.55, 0.76, 1.0, 2.0); // 中子
      } else {
        setP(f, i, x + G[0][i] * 0.2, y + G[1][i] * 0.2, z + G[2][i] * 0.2, 0.022); // 氢核
        setC(f, i, 1.0, 0.5, 0.22, 0.32);
      }
    }
    return f;
  }

  // ── 第一缕光：最后散射面。颜色 = 温度涨落（仿 Planck 卫星全天图的配色）──
  const CMB_RAMP = [
    [0.0, 0.01, 0.03, 0.4],
    [0.3, 0.03, 0.28, 0.75],
    [0.5, 0.82, 0.78, 0.6],
    [0.7, 0.9, 0.4, 0.05],
    [1.0, 0.55, 0.02, 0.01],
  ];
  function cmb() {
    const f = alloc();
    const R = 7;
    for (let i = 0; i < N; i++) {
      const dx = dir[i * 3];
      const dy = dir[i * 3 + 1];
      const dz = dir[i * 3 + 2];
      const n = fbm(dx * 4.2 + 3, dy * 4.2 + 17, dz * 4.2 - 5, 5, 0.58);
      ramp(CMB_RAMP, clamp(0.5 + n * 1.5), tmp);
      const r = R * (1 + 0.006 * G[0][i]);
      setP(f, i, dx * r, dy * r, dz * r, 0.105 + 0.03 * U[3][i]);
      setC(f, i, tmp[0], tmp[1], tmp[2], 0.95);
    }
    return f;
  }

  // ── 宇宙网：节点 + 纤维 + 弥散气体 ────────────────────────────
  const web = (() => {
    const wr = mulberry32(seed + 99);
    const K = 64;
    const nodes = [];
    for (let guard = 0; nodes.length < K && guard < 20000; guard++) {
      const z = wr() * 2 - 1;
      const a = wr() * TAU;
      const s = Math.sqrt(1 - z * z);
      const r = 6.4 * Math.cbrt(wr());
      const p = [s * Math.cos(a) * r, z * r * 0.82, s * Math.sin(a) * r];
      if (nodes.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) > 1.45)) nodes.push(p);
    }
    const mass = nodes.map(() => 0.55 + wr() * 1.0);
    const ignite = nodes.map(() => wr()); // 每个节点的「点燃时刻」，用于宇宙黎明的错峰
    const edges = [];
    const seen = new Set();
    nodes.forEach((p, i) => {
      const near = nodes
        .map((q, j) => [Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]), j])
        .filter(([, j]) => j !== i)
        .sort((a, b) => a[0] - b[0]);
      const count = wr() < 0.45 ? 3 : 2;
      for (let k = 0; k < count; k++) {
        const j = near[k][1];
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) continue;
        seen.add(key);
        // 每条纤维带一点弧度
        const bow = [gaussian(wr), gaussian(wr), gaussian(wr)].map((v) => v * 0.22);
        edges.push({ a: i, b: j, len: near[k][0], bow });
      }
    });
    const cumNode = [];
    let acc = 0;
    for (const m of mass) cumNode.push((acc += m));
    const cumEdge = [];
    let accE = 0;
    for (const e of edges) cumEdge.push((accE += e.len));
    const pick = (cum, u) => {
      const target = u * cum[cum.length - 1];
      let lo = 0;
      let hi = cum.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (cum[mid] < target) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    };

    // 每颗粒子在宇宙网里的角色，两个队形（黑暗时代 / 宇宙黎明）共用
    const kind = new Uint8Array(N); // 0 节点 1 纤维 2 弥散
    const owner = new Uint16Array(N);
    for (let i = 0; i < N; i++) {
      const c = U[0][i];
      if (c < 0.34) {
        kind[i] = 0;
        owner[i] = pick(cumNode, U[1][i]);
      } else if (c < 0.9) {
        kind[i] = 1;
        owner[i] = pick(cumEdge, U[1][i]);
      } else {
        kind[i] = 2;
      }
    }

    const place = (i, tight, out) => {
      if (kind[i] === 0) {
        const n = nodes[owner[i]];
        const s = 0.24 * mass[owner[i]] * tight;
        out[0] = n[0] + G[0][i] * s;
        out[1] = n[1] + G[1][i] * s;
        out[2] = n[2] + G[2][i] * s;
      } else if (kind[i] === 1) {
        const e = edges[owner[i]];
        const a = nodes[e.a];
        const b = nodes[e.b];
        const t = U[2][i];
        const arc = Math.sin(Math.PI * t);
        const s = 0.05 + 0.05 * arc;
        out[0] = lerp(a[0], b[0], t) + e.bow[0] * arc + G[0][i] * s;
        out[1] = lerp(a[1], b[1], t) + e.bow[1] * arc + G[1][i] * s;
        out[2] = lerp(a[2], b[2], t) + e.bow[2] * arc + G[2][i] * s;
      } else {
        const r = 7.6 * Math.cbrt(U[1][i]);
        out[0] = dir[i * 3] * r;
        out[1] = dir[i * 3 + 1] * r;
        out[2] = dir[i * 3 + 2] * r;
      }
      return out;
    };
    return { kind, owner, ignite, place };
  })();

  function darkAges() {
    const f = alloc();
    for (let i = 0; i < N; i++) {
      web.place(i, 1, tmp);
      setP(f, i, tmp[0], tmp[1], tmp[2], 0.042);
      if (web.kind[i] === 0) setC(f, i, 0.34, 0.2, 0.7, 0.62);
      else if (web.kind[i] === 1) setC(f, i, 0.2, 0.15, 0.55, 0.5);
      else setC(f, i, 0.1, 0.1, 0.32, 0.3);
    }
    return f;
  }

  function dawn() {
    const f = alloc();
    for (let i = 0; i < N; i++) {
      web.place(i, 0.6, tmp);
      if (web.kind[i] === 0) {
        if (U[3][i] < 0.03) {
          // 第一代恒星：极亮、偏蓝白的点
          setP(f, i, tmp[0], tmp[1], tmp[2], 0.08 + 0.07 * U[2][i]);
          setC(f, i, 0.74, 0.86, 1.0, 4.0);
        } else {
          setP(f, i, tmp[0], tmp[1], tmp[2], 0.04);
          setC(f, i, 0.42, 0.5, 1.0, 0.75);
        }
      } else if (web.kind[i] === 1) {
        if (U[3][i] < 0.006) {
          setP(f, i, tmp[0], tmp[1], tmp[2], 0.07);
          setC(f, i, 0.8, 0.88, 1.0, 3.0);
        } else {
          setP(f, i, tmp[0], tmp[1], tmp[2], 0.036);
          setC(f, i, 0.3, 0.26, 0.75, 0.5);
        }
      } else {
        setP(f, i, tmp[0], tmp[1], tmp[2], 0.036);
        setC(f, i, 0.14, 0.15, 0.42, 0.3);
      }
    }
    return f;
  }

  // ── 旋涡星系：两条对数螺旋臂 + 核球 + 晕 ─────────────────────
  // 盘面的面密度 ∝ exp(-r/H)，所以半径取 Gamma(2, H) 分布（两个指数分布之和）
  function galaxy() {
    const f = alloc();
    const rng = mulberry32(seed + 404);
    const H = 1.45;
    for (let i = 0; i < N; i++) {
      const c = U[0][i];
      if (c < 0.07) {
        setP(f, i, G[0][i] * 0.4, G[1][i] * 0.26, G[2][i] * 0.4, 0.038 + 0.02 * U[3][i]);
        setC(f, i, 1.0, 0.78, 0.5, 0.75);
      } else if (c < 0.93) {
        let r = -H * Math.log(Math.max(1e-6, rng()) * Math.max(1e-6, rng()));
        if (r > 6.2) r = 0.6 + 5.6 * rng();
        r += 0.12;
        const inArm = U[2][i] < 0.84;
        const theta = inArm ? (i % 2) * Math.PI + 2.6 * Math.log(r / 0.3) + G[0][i] * 0.3 : rng() * TAU;
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
        const y = G[1][i] * (0.035 + 0.014 * r);
        const k = clamp((r - 0.6) / 3.2);
        if (inArm && U[3][i] < 0.03 && r > 1.2) {
          setP(f, i, x, y, z, 0.075); // 电离氢区：恒星的摇篮
          setC(f, i, 1.0, 0.3, 0.52, 2.2);
        } else if (inArm) {
          const young = U[3][i] * U[3][i];
          setP(f, i, x, y, z, 0.032 + 0.024 * U[3][i]);
          setC(f, i, lerp(1.0, 0.56, k), lerp(0.84, 0.72, k), lerp(0.64, 1.0, k), 0.8 + 1.1 * young);
        } else {
          setP(f, i, x, y, z, 0.03);
          setC(f, i, 0.95, 0.76, 0.52, 0.42);
        }
      } else {
        const r = 1.6 + 5.6 * U[1][i];
        setP(f, i, dir[i * 3] * r, dir[i * 3 + 1] * r * 0.7, dir[i * 3 + 2] * r, 0.03);
        setC(f, i, 0.75, 0.8, 1.0, 0.4);
      }
    }
    return f;
  }

  // ── 黑洞（类星体）：吸积盘 + 光子环 + 被引力弯折的盘背面 + 相对论性喷流 + 核球恒星 ──
  // 黑色的「事件视界阴影」是 main.js 里一个半径为 1 的遮挡球；这里的一切都围着它摆。
  //   · 吸积盘：赤道面上，内缘 1.18（略大于阴影），越靠内越密、越热
  //   · 光子环：紧贴阴影的一层极薄球壳，投影后边缘最亮 → 一圈细亮环
  //   · 盘背面的像：两顶「帽子」形的厚球壳（只取高纬度），侧看时它们的轮廓正好是阴影上下两道弧
  //   两层球壳朝向镜头的半边由粒子着色器淡掉（holeFade），所以阴影保持漆黑。
  const DISK_RAMP = [
    [0.0, 0.86, 0.9, 1.0],
    [0.12, 1.0, 0.94, 0.8],
    [0.35, 1.0, 0.7, 0.32],
    [0.65, 0.95, 0.38, 0.12],
    [1.0, 0.5, 0.12, 0.06],
  ];
  // 镜头坐标系：three.js 的 lookAt 里，右 = normalize(up × z)，上 = z × 右，z 从目标指向镜头
  const bhView = view.blackHole || { az: 4.35, el: 0.227 };
  const bhZ = [Math.cos(bhView.el) * Math.sin(bhView.az), Math.sin(bhView.el), Math.cos(bhView.el) * Math.cos(bhView.az)];
  const bhRight = [Math.cos(bhView.az), 0, -Math.sin(bhView.az)];
  const bhUp = [
    bhZ[1] * bhRight[2] - bhZ[2] * bhRight[1],
    bhZ[2] * bhRight[0] - bhZ[0] * bhRight[2],
    bhZ[0] * bhRight[1] - bhZ[1] * bhRight[0],
  ];
  function blackHole() {
    const f = alloc();
    for (let i = 0; i < N; i++) {
      const c = U[0][i];
      if (c < 0.56) {
        const r = 1.18 + 4.1 * Math.pow(U[1][i], 1.4);
        const theta = U[2][i] * TAU;
        const t = clamp((r - 1.18) / 4.1);
        // 盘面上的螺旋密度波：较差自转时会被拉长，看得出盘在转
        const wave = 0.5 + 0.5 * Math.sin(3 * theta + 7.0 * Math.log(r));
        ramp(DISK_RAMP, t + 0.08 * (U[3][i] - 0.5), tmp);
        const h = G[1][i] * (0.008 + 0.03 * t);
        setP(f, i, Math.cos(theta) * r, h, Math.sin(theta) * r, 0.028 + 0.018 * U[3][i]);
        setC(f, i, tmp[0], tmp[1], tmp[2], lerp(1.3, 0.35, Math.sqrt(t)) * (0.55 + 0.8 * wave));
      } else if (c < 0.61) {
        const R = 1.035 + 0.012 * G[0][i];
        setP(f, i, dir[i * 3] * R, dir[i * 3 + 1] * R, dir[i * 3 + 2] * R, 0.02);
        setC(f, i, 1.0, 0.9, 0.72, 1.4);
      } else if (c < 0.75) {
        // 盘背面被引力弯折出来的像：在正对镜头的平面里绕阴影一圈，上方宽而亮、下方窄而暗，
        // 迎面而来的一侧更亮（与盘的多普勒增亮同侧）。这些粒子不随盘自转（大小编码 +10）。
        const phi = U[2][i] * TAU;
        const up = Math.sin(phi);
        const band = lerp(0.16, 0.62, (up + 1) / 2);
        const R = 1.1 + band * Math.pow(U[1][i], 1.5);
        const k = clamp((R - 1.1) / 0.62);
        const side = -Math.cos(phi); // 屏幕左侧为正
        ramp(DISK_RAMP, 0.08 + 0.5 * k, tmp);
        const x = Math.cos(phi) * R;
        const y = up * R;
        setP(f, i, bhRight[0] * x + bhUp[0] * y, bhRight[1] * x + bhUp[1] * y, bhRight[2] * x + bhUp[2] * y, 10 + 0.024);
        setC(f, i, tmp[0], tmp[1], tmp[2], lerp(0.7, 1.6, (up + 1) / 2) * lerp(1.4, 0.45, k) * (1 + 0.45 * side));
      } else if (c < 0.8) {
        const sign = i % 2 ? 1 : -1;
        const h = 1.05 + 6.2 * Math.pow(U[1][i], 1.35);
        const w = 0.025 + 0.045 * h;
        setP(f, i, G[0][i] * w, sign * h, G[2][i] * w, 0.032);
        setC(f, i, 0.55, 0.72, 1.0, 1.5 * (1 - h / 8));
      } else {
        // 星系核球里密集的老年恒星
        const r = 6.6 + 7.0 * Math.pow(U[1][i], 0.6);
        setP(f, i, dir[i * 3] * r, dir[i * 3 + 1] * r * 0.62, dir[i * 3 + 2] * r, 0.03);
        setC(f, i, 1.0, 0.84, 0.6, 0.42);
      }
    }
    return f;
  }

  // ── 太阳星云：带环缝的原行星盘 + 原恒星 + 双极喷流 + 行星胚胎 ──
  const NEBULA_RAMP = [
    [0.4, 1.0, 0.86, 0.56],
    [1.4, 1.0, 0.52, 0.18],
    [3.0, 0.78, 0.27, 0.1],
    [5.2, 0.36, 0.12, 0.07],
  ];
  const GAPS = [
    [1.3, 0.085],
    [2.15, 0.105],
    [3.05, 0.125],
    [4.1, 0.15],
  ];
  const diskCdf = (() => {
    const bins = 2048;
    const rMin = 0.42;
    const rMax = 5.3;
    const cdf = new Float32Array(bins + 1);
    for (let b = 0; b < bins; b++) {
      const r = rMin + ((b + 0.5) / bins) * (rMax - rMin);
      let density = Math.pow(r, 0.25);
      for (const [g, w] of GAPS) density *= 1 - 0.92 * Math.exp(-(((r - g) / w) ** 2));
      cdf[b + 1] = cdf[b] + density;
    }
    return (u) => {
      const target = u * cdf[bins];
      let lo = 0;
      let hi = bins;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (cdf[mid + 1] < target) lo = mid + 1;
        else hi = mid;
      }
      const k = (target - cdf[lo]) / Math.max(1e-9, cdf[lo + 1] - cdf[lo]);
      return rMin + ((lo + k) / bins) * (rMax - rMin);
    };
  })();
  function nebula() {
    const f = alloc();
    const clumps = [
      [1.3, 0.6],
      [2.15, 2.9],
      [3.05, 4.6],
    ];
    for (let i = 0; i < N; i++) {
      const c = U[0][i];
      if (c < 0.035) {
        setP(f, i, G[0][i] * 0.11, G[1][i] * 0.11, G[2][i] * 0.11, 0.06);
        setC(f, i, 1.0, 0.9, 0.7, 1.8);
      } else if (c < 0.07) {
        const sign = i % 2 ? 1 : -1;
        const h = 0.25 + 3.4 * Math.pow(U[1][i], 1.5);
        const w = 0.025 + 0.045 * h;
        setP(f, i, G[0][i] * w, sign * h, G[2][i] * w, 0.04);
        setC(f, i, 0.55, 0.76, 1.0, 1.9 * (1 - h / 4.2));
      } else if (c < 0.082) {
        const [r, a] = clumps[i % 3];
        setP(f, i, Math.cos(a) * r + G[0][i] * 0.05, G[1][i] * 0.035, Math.sin(a) * r + G[2][i] * 0.05, 0.05);
        setC(f, i, 1.0, 0.78, 0.5, 1.8);
      } else {
        const r = diskCdf(U[1][i]);
        const theta = U[2][i] * TAU;
        ramp(NEBULA_RAMP, r, tmp);
        setP(f, i, Math.cos(theta) * r, G[1][i] * 0.022 * Math.pow(r, 1.2), Math.sin(theta) * r, 0.036 + 0.016 * U[3][i]);
        setC(f, i, tmp[0], tmp[1], tmp[2], lerp(1.3, 0.55, clamp((r - 0.4) / 4.8)));
      }
    }
    return f;
  }

  // ── Lux3D 造物：74% 的粒子落在模型表面，其余成为环绕它的星尘晕 ──
  const SURFACE_SHARE = 0.74;
  let surfaceCount = 0;
  for (let i = 0; i < N; i++) if (U[0][i] < SURFACE_SHARE) surfaceCount++;

  /**
   * @param samples { pos: Float32Array(n*3), col: Float32Array(n*3 线性) }，n ≥ surfaceCount
   * @param tint 环境星尘的色调（线性 rgb）
   * @param target 可选：写入已有的队形对象（「造物」模式复用同一块缓冲）
   */
  function model(samples, tint = [0.6, 0.7, 1.0], target) {
    const f = target || alloc();
    let s = 0;
    for (let i = 0; i < N; i++) {
      if (U[0][i] < SURFACE_SHARE) {
        const o = s * 3;
        setP(f, i, samples.pos[o], samples.pos[o + 1], samples.pos[o + 2], 0.024 + 0.012 * U[3][i]);
        // 加一点亮度地板，深色物体（比如黑色机车）在加色混合下也看得见
        setC(f, i, samples.col[o] * 0.92 + 0.045, samples.col[o + 1] * 0.92 + 0.045, samples.col[o + 2] * 0.92 + 0.045, 1.0);
        s++;
      } else {
        const r = 3.3 + 3.0 * Math.pow(U[1][i], 0.7);
        const bright = U[3][i] < 0.03;
        setP(f, i, dir[i * 3] * r, dir[i * 3 + 1] * r * 0.8, dir[i * 3 + 2] * r, bright ? -0.06 : -0.03);
        setC(f, i, tint[0], tint[1], tint[2], bright ? 1.2 : 0.3);
      }
    }
    return f;
  }

  const builders = { singularity, bang, quark, nucleo, cmb, darkAges, dawn, galaxy, blackHole, nebula };
  const cache = new Map();
  return {
    N,
    surfaceCount,
    alloc,
    /** 程序化队形（带缓存） */
    get(key) {
      if (!cache.has(key)) {
        if (!builders[key]) throw new Error(`未知队形：${key}`);
        cache.set(key, builders[key]());
      }
      return cache.get(key);
    },
    model,
    /** 给粒子着色器的静态随机量；x 用作变形错峰，宇宙网节点上的粒子共用节点的点燃时刻 */
    seeds() {
      const s = new Float32Array(N * 4);
      for (let i = 0; i < N; i++) {
        s[i * 4] = web.kind[i] === 0 ? clamp(web.ignite[web.owner[i]] * 0.85 + U[3][i] * 0.15) : U[3][i];
        s[i * 4 + 1] = U[1][i];
        s[i * 4 + 2] = U[2][i];
        s[i * 4 + 3] = (G[0][i] * 0.25 + 0.5) % 1;
      }
      return s;
    },
  };
}
