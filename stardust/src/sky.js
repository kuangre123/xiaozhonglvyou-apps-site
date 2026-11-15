// 天空：一层辉光穹顶（早期宇宙是不透明的发光等离子体）+ 远处的星与星云。
// 星星只在「宇宙黎明」之后才出现——在那之前，宇宙里没有任何一颗星。
import * as THREE from 'three';
import { gaussian, mulberry32, TAU } from './util.js';

const DOME_VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww; // 永远在最远处
}`;

const DOME_FRAG = /* glsl */ `
uniform vec3 uGlow;
uniform float uGlowAmt;
uniform float uNebula;
uniform float uTime;
varying vec3 vDir;

float hash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float noise(vec3 x){
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p){
  float a = 0.5; float s = 0.0;
  for (int i = 0; i < 5; i++) { s += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; }
  return s;
}

void main() {
  vec3 d = normalize(vDir);
  // 等离子辉光：整个视野都在发光，带缓慢翻滚的明暗
  float churn = fbm(d * 2.2 + vec3(0.0, uTime * 0.035, uTime * 0.02));
  vec3 col = uGlow * uGlowAmt * (0.55 + 0.9 * churn);

  // 星云与银河带：只在有恒星之后才淡入
  if (uNebula > 0.001) {
    float band = exp(-pow(d.y * 2.6 + 0.35 * sin(d.x * 2.0), 2.0));
    float cloud = fbm(d * 3.1 + 4.0);
    float wisps = smoothstep(0.42, 0.85, fbm(d * 1.7 - 2.0));
    vec3 cold = vec3(0.10, 0.16, 0.42);
    vec3 warm = vec3(0.42, 0.13, 0.26);
    vec3 neb = mix(cold, warm, smoothstep(0.35, 0.7, cloud)) * wisps * 0.11;
    neb += vec3(0.16, 0.17, 0.26) * band * (0.25 + 0.75 * cloud) * 0.13;
    col += neb * uNebula;
  }
  gl_FragColor = vec4(col, 1.0);
}`;

const STAR_VERT = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform vec3 uLensDir;    // 从镜头指向黑洞的单位向量
uniform float uLensTheta; // 爱因斯坦环的角半径（弧度），0 表示没有黑洞
attribute vec4 aStar; // 颜色 rgb + 大小
attribute float aPhase;
varying vec3 vColor;
varying float vTwinkle;
void main() {
  vec3 d = normalize(position);
  float mag = 1.0;
  if (uLensTheta > 0.0) {
    // 点质量透镜：角距离 θ 的星，主像出现在 θ' = (θ + √(θ² + 4θE²)) / 2，亮度放大 μ
    float th = acos(clamp(dot(d, uLensDir), -1.0, 1.0));
    if (th < 0.7) {
      float th2 = 0.5 * (th + sqrt(th * th + 4.0 * uLensTheta * uLensTheta));
      vec3 axis = cross(uLensDir, d);
      float al = length(axis);
      if (al > 1e-5) {
        axis /= al;
        float rot = th2 - th;
        d = d * cos(rot) + cross(axis, d) * sin(rot) + axis * dot(axis, d) * (1.0 - cos(rot));
      }
      float u = max(th / uLensTheta, 1e-3);
      mag = clamp((u * u + 2.0) / (u * sqrt(u * u + 4.0)), 1.0, 4.0);
    }
  }
  vColor = aStar.rgb * mag;
  vTwinkle = 0.72 + 0.28 * sin(uTime * (0.6 + aPhase * 1.9) + aPhase * 60.0);
  vec4 p = projectionMatrix * modelViewMatrix * vec4(d, 1.0);
  gl_Position = p.xyww;
  gl_PointSize = aStar.a * uPixelRatio;
}`;

const STAR_FRAG = /* glsl */ `
uniform float uOpacity;
varying vec3 vColor;
varying float vTwinkle;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d2 = dot(uv, uv) * 4.0;
  if (d2 > 1.0) discard;
  float a = exp(-d2 * 5.0);
  gl_FragColor = vec4(vColor * a * vTwinkle * uOpacity, 0.0);
}`;

// 恒星颜色大致按光谱型分布：多数偏暖的红矮星 / 类太阳星，少数明亮的蓝白星
const STAR_TINTS = [
  [1.0, 0.72, 0.5],
  [1.0, 0.86, 0.7],
  [1.0, 0.96, 0.9],
  [0.82, 0.88, 1.0],
  [0.65, 0.78, 1.0],
];

export class Sky {
  constructor({ starCount = 7000, seed = 42 } = {}) {
    this.group = new THREE.Group();
    this.group.name = 'sky';

    this.domeUniforms = {
      uGlow: { value: new THREE.Color(0, 0, 0) },
      uGlowAmt: { value: 0 },
      uNebula: { value: 0 },
      uTime: { value: 0 },
    };
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(1, 48, 24),
      new THREE.ShaderMaterial({
        uniforms: this.domeUniforms,
        vertexShader: DOME_VERT,
        fragmentShader: DOME_FRAG,
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: false,
      }),
    );
    dome.renderOrder = -100;
    dome.frustumCulled = false;
    this.group.add(dome);

    const rng = mulberry32(seed);
    const pos = new Float32Array(starCount * 3);
    const star = new Float32Array(starCount * 4);
    const phase = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      // 三成的星集中在银河带附近
      let y = rng() * 2 - 1;
      if (rng() < 0.32) y = Math.max(-1, Math.min(1, gaussian(rng) * 0.16 - 0.12));
      const a = rng() * TAU;
      const s = Math.sqrt(1 - y * y);
      pos[i * 3] = s * Math.cos(a);
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = s * Math.sin(a);
      const mag = Math.pow(rng(), 5.0); // 绝大多数星很暗
      const tint = STAR_TINTS[Math.min(4, Math.floor(Math.pow(rng(), 1.6) * 5))];
      const b = 0.22 + 1.7 * mag;
      star[i * 4] = tint[0] * b;
      star[i * 4 + 1] = tint[1] * b;
      star[i * 4 + 2] = tint[2] * b;
      star[i * 4 + 3] = 1.2 + 2.6 * mag;
      phase[i] = rng();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aStar', new THREE.BufferAttribute(star, 4));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    this.starUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uOpacity: { value: 0 },
      uLensDir: { value: new THREE.Vector3(0, 0, -1) },
      uLensTheta: { value: 0 },
    };
    this.stars = new THREE.Points(
      geo,
      new THREE.ShaderMaterial({
        uniforms: this.starUniforms,
        vertexShader: STAR_VERT,
        fragmentShader: STAR_FRAG,
        transparent: true,
        depthWrite: false,
        depthTest: true, // 深度恒为最远处：只画在没被造物网格挡住的像素上
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneFactor,
      }),
    );
    this.stars.renderOrder = -90;
    this.stars.frustumCulled = false;
    this.group.add(this.stars);
  }

  update(camera, { time, glow, glowAmt, stars, nebula, pixelRatio, lensDir, lensTheta = 0 }) {
    if (lensDir) this.starUniforms.uLensDir.value.copy(lensDir);
    this.starUniforms.uLensTheta.value = lensTheta;
    this.group.position.copy(camera.position); // 天空没有视差
    this.domeUniforms.uTime.value = time;
    this.domeUniforms.uGlow.value.setRGB(glow[0], glow[1], glow[2]);
    this.domeUniforms.uGlowAmt.value = glowAmt;
    this.domeUniforms.uNebula.value = nebula;
    this.starUniforms.uTime.value = time;
    this.starUniforms.uPixelRatio.value = pixelRatio;
    this.starUniforms.uOpacity.value = stars;
    this.stars.visible = stars > 0.002;
  }
}
