// 小工具：确定性随机数、噪声、缓动。整部影片是影片时间 T 的纯函数，
// 所以这里的一切都必须可复现（同一个 seed → 同一个宇宙）。

export const TAU = Math.PI * 2;

export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (a, b, v) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export const ease = {
  linear: (t) => t,
  inOut: (t) => t * t * (3 - 2 * t),
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: (t) => 1 - Math.pow(1 - t, 3),
  outExpo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  in: (t) => t * t * t,
};

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box–Muller 标准正态 */
export function gaussian(rng) {
  let u = 0;
  while (u < 1e-9) u = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * rng());
}

/** 三维值噪声（三次插值），返回约 [-1, 1] */
export function createNoise3(seed = 1) {
  const rng = mulberry32(seed);
  const perm = new Uint8Array(512);
  const vals = new Float32Array(256);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  for (let i = 0; i < 256; i++) vals[i] = rng() * 2 - 1;
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const h = (x, y, z) => vals[perm[perm[perm[x & 255] + (y & 255)] + (z & 255)]];

  const noise = (x, y, z) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const zi = Math.floor(z);
    const u = fade(x - xi);
    const v = fade(y - yi);
    const w = fade(z - zi);
    const x00 = lerp(h(xi, yi, zi), h(xi + 1, yi, zi), u);
    const x10 = lerp(h(xi, yi + 1, zi), h(xi + 1, yi + 1, zi), u);
    const x01 = lerp(h(xi, yi, zi + 1), h(xi + 1, yi, zi + 1), u);
    const x11 = lerp(h(xi, yi + 1, zi + 1), h(xi + 1, yi + 1, zi + 1), u);
    return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w);
  };

  const fbm = (x, y, z, octaves = 4, gain = 0.5, lacunarity = 2.02) => {
    let amp = 0.5;
    let sum = 0;
    let norm = 0;
    for (let o = 0; o < octaves; o++) {
      sum += amp * noise(x, y, z);
      norm += amp;
      x *= lacunarity;
      y *= lacunarity;
      z *= lacunarity;
      amp *= gain;
    }
    return sum / norm;
  };

  return { noise, fbm };
}

/** 多段颜色渐变：stops = [[t, r, g, b], ...]（线性空间），返回写入 out 的 [r,g,b] */
export function ramp(stops, t, out) {
  if (t <= stops[0][0]) {
    out[0] = stops[0][1];
    out[1] = stops[0][2];
    out[2] = stops[0][3];
    return out;
  }
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const a = stops[i - 1];
      const b = stops[i];
      const k = (t - a[0]) / (b[0] - a[0]);
      out[0] = lerp(a[1], b[1], k);
      out[1] = lerp(a[2], b[2], k);
      out[2] = lerp(a[3], b[3], k);
      return out;
    }
  }
  const last = stops[stops.length - 1];
  out[0] = last[1];
  out[1] = last[2];
  out[2] = last[3];
  return out;
}

/** sRGB 8bit → 线性 [0,1] 查找表 */
export const SRGB_TO_LINEAR = (() => {
  const lut = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const c = i / 255;
    lut[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  return lut;
})();

/** '#rrggbb' → 线性 [r,g,b] */
export function hexLinear(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [SRGB_TO_LINEAR[(n >> 16) & 255], SRGB_TO_LINEAR[(n >> 8) & 255], SRGB_TO_LINEAR[n & 255]];
}

/** 把一个数格式化成「a × 10ⁿ」里的上标指数 */
const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
export const superscript = (n) => String(n).split('').map((c) => SUP[c] ?? c).join('');
