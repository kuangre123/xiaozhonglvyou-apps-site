// 粒子场：N 颗粒子，一次 draw call。
// 每一段镜头只在 GPU 上保存「上一个队形 A」和「当前队形 B」，
// 位置 = mix(animate(A), animate(B), 每颗粒子错峰后的进度)，全部在顶点着色器里完成。
import * as THREE from 'three';

const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const VERT = /* glsl */ `
uniform float uTime;
uniform float uMix;
uniform float uStagger;
uniform float uTurb;
uniform float uEase;
uniform float uScale;
uniform float uSpark;
uniform vec4 uMotA;   // spin, spinPow, expand, jitter
uniform vec4 uMotB;
uniform vec4 uAuxA;   // localT, phase, sizeMul, alpha
uniform vec4 uAuxB;
uniform vec4 uExtA;   // surfaceFade, jitterFreq, glow, coherence
uniform vec4 uExtB;
uniform vec4 uExt2A;  // beam（多普勒增亮）, holeFade（黑洞前方的光子壳淡出）, -, -
uniform vec4 uExt2B;
uniform mat3 uTiltA;
uniform mat3 uTiltB;
uniform vec3 uPointerO;
uniform vec3 uPointerD;
uniform float uPointerF;

attribute vec4 aFrom;
attribute vec4 aTo;
attribute vec4 aColFrom;
attribute vec4 aColTo;
attribute vec4 aSeed;

varying vec3 vColor;
varying float vAlpha;

${SIMPLEX}

// 队形自身的运动：膨胀 → 绕 Y 轴的较差自转（spinPow: 0 刚体 / 1 平坦自转曲线 / 1.5 开普勒）→ 流动抖动 → 倾角
// beamDot：粒子运动方向与视线的夹角余弦，用于相对论性多普勒增亮（迎面而来的一侧更亮）
// fix = 1：这颗粒子不随队形自转（例如黑洞那道必须正对镜头的透镜像）
vec3 animate(vec3 p, vec4 mot, vec4 aux, vec4 ext, mat3 tilt, float fix, out float beamDot) {
  float t = aux.x;
  p *= 1.0 + mot.z * t;
  float r = length(p.xz);
  float w = mot.x * pow(max(r, 0.4), -mot.y);
  float ang = (aux.y + w * t) * (1.0 - fix);
  float c = cos(ang);
  float s = sin(ang);
  p = vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c);
  vec3 vel = vec3(p.z, 0.0, -p.x) * w * (1.0 - fix);
  // coherence = 1：抖动只取决于位置 → 整片粒子随同一个流场翻卷；0：每颗各抖各的
  vec3 q = p * ext.y + aSeed.yzw * 6.2831853 * (1.0 - ext.w);
  float tt = uTime * 0.6;
  p += mot.w * 0.5 * vec3(
    sin(q.y + tt) + sin(q.z * 1.7 - tt * 1.3),
    sin(q.z + tt * 1.1) + sin(q.x * 1.6 + tt * 0.7),
    sin(q.x + tt * 0.9) + sin(q.y * 1.8 - tt * 1.2));
  vec3 world = tilt * p;
  vec3 v = tilt * vel;
  float sp = length(v);
  beamDot = sp > 1e-5 ? dot(v / sp, normalize(cameraPosition - world)) : 0.0;
  return world;
}

void main() {
  float prog = clamp(uMix * (1.0 + uStagger) - aSeed.x * uStagger, 0.0, 1.0);
  float eSmooth = prog * prog * (3.0 - 2.0 * prog);
  float eExpo = (1.0 - pow(2.0, -10.0 * prog)) / 0.9990234375;
  float e = mix(eSmooth, eExpo, uEase);

  float bA;
  float bB;
  float rawA = abs(aFrom.w);
  float rawB = abs(aTo.w);
  float fixA = step(5.0, rawA);
  float fixB = step(5.0, rawB);
  vec3 a = animate(aFrom.xyz, uMotA, uAuxA, uExtA, uTiltA, fixA, bA);
  vec3 b = animate(aTo.xyz, uMotB, uAuxB, uExtB, uTiltB, fixB, bB);
  vec3 pos = mix(a, b, e);
  float beam = mix(uExt2A.x * bA, uExt2B.x * bB, e);
  float holeFade = mix(uExt2A.y, uExt2B.y, e);

  // 途中的湍流：粒子不是直线飞过去，而是被气流卷着走
  float mid = sin(3.14159265 * prog);
  if (uTurb > 0.0) {
    vec3 np = pos * 0.33;
    float tn = uTime * 0.03;
    pos += uTurb * mid * vec3(
      snoise(np + vec3(0.0, 13.1, 7.7) + tn),
      snoise(np + vec3(31.4, 0.0, 5.3) - tn),
      snoise(np + vec3(9.2, 21.7, 0.0) + tn));
  }

  // 指针划过时把星尘拨开
  if (uPointerF > 0.0) {
    vec3 toP = pos - uPointerO;
    vec3 perp = toP - uPointerD * dot(toP, uPointerD);
    float d2 = dot(perp, perp);
    pos += normalize(perp + vec3(1e-4)) * uPointerF * exp(-d2 * 2.6);
  }

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float size = mix((rawA - 10.0 * fixA) * uAuxA.z, (rawB - 10.0 * fixB) * uAuxB.z, e);
  float depth = max(0.05, -mv.z);
  float px = size * uScale / depth;
  gl_PointSize = clamp(px, 1.0, 128.0);

  float alA = uAuxA.w * mix(uExtA.x, 1.0, step(aFrom.w, 0.0));
  float alB = uAuxB.w * mix(uExtB.x, 1.0, step(aTo.w, 0.0));
  float alpha = mix(alA, alB, e);
  alpha *= min(1.0, px * px);                 // 小于 1 像素时用亮度代替面积
  alpha *= smoothstep(0.12, 1.4, depth);      // 贴脸的粒子淡出，避免糊屏
  alpha *= 1.0 - 0.85 * smoothstep(40.0, 120.0, px); // 离镜头太近的巨大光斑压暗
  alpha *= 0.8 + 0.2 * sin(uTime * (1.0 + aSeed.y * 2.5) + aSeed.z * 40.0);
  // 黑洞：光子环与「盘背面的像」是两层球壳，朝向镜头的那半边会糊在黑色阴影上 —— 把它淡掉，
  // 只留下轮廓边缘（投影后就是光子环和上下两道弧）。吸积盘本身（贴着赤道面）不受影响。
  if (holeFade > 0.0) {
    float rr = length(pos);
    float shell = (1.0 - smoothstep(1.55, 1.75, rr)) * max(1.0 - step(1.12, rr), step(0.09, abs(pos.y)));
    float front = dot(pos / max(rr, 1e-4), normalize(cameraPosition));
    alpha *= 1.0 - holeFade * shell * smoothstep(-0.05, 0.35, front);
  }
  vAlpha = alpha;

  vec3 cA = aColFrom.rgb * aColFrom.a * 4.0 * uExtA.z;
  vec3 cB = aColTo.rgb * aColTo.a * 4.0 * uExtB.z;
  vColor = mix(cA, cB, e) * (1.0 + uSpark * mid) * max(0.12, 1.0 + beam);
}`;

const FRAG = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d2 = dot(uv, uv) * 4.0;
  if (d2 > 1.0) discard;
  float a = exp(-d2 * 4.2);
  gl_FragColor = vec4(vColor * (a * vAlpha), 0.0);
}`;

const DEFAULT_MOTION = {
  spin: 0,
  spinPow: 0,
  expand: 0,
  jitter: 0,
  jitterFreq: 1,
  phase: 0,
  size: 1,
  alpha: 1,
  glow: 1,
  surfaceFade: 1,
  coherence: 0,
  beam: 0,
  holeFade: 0,
  tilt: [0, 0],
};

const _euler = new THREE.Euler();
const _m4 = new THREE.Matrix4();

export class ParticleField {
  constructor(N, seeds) {
    this.N = N;
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4));
    this.geometry.setDrawRange(0, N); // 没有 position 属性，手动指定绘制数量

    this.uniforms = {
      uTime: { value: 0 },
      uMix: { value: 1 },
      uStagger: { value: 0.5 },
      uTurb: { value: 0 },
      uEase: { value: 0 },
      uScale: { value: 1000 },
      uSpark: { value: 0.35 },
      uMotA: { value: new THREE.Vector4() },
      uMotB: { value: new THREE.Vector4() },
      uAuxA: { value: new THREE.Vector4(0, 0, 1, 1) },
      uAuxB: { value: new THREE.Vector4(0, 0, 1, 1) },
      uExtA: { value: new THREE.Vector4(1, 1, 1, 0) },
      uExtB: { value: new THREE.Vector4(1, 1, 1, 0) },
      uExt2A: { value: new THREE.Vector4() },
      uExt2B: { value: new THREE.Vector4() },
      uTiltA: { value: new THREE.Matrix3() },
      uTiltB: { value: new THREE.Matrix3() },
      uPointerO: { value: new THREE.Vector3() },
      uPointerD: { value: new THREE.Vector3(0, 0, -1) },
      uPointerF: { value: 0 },
    };

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 10;
    // 画面亮度 ≈ 粒子数 × 单颗亮度：以 16 万颗为基准做归一化
    this.density = 160000 / N;
  }

  /** 把 CPU 端队形数据包成 GPU 属性（只上传一次，之后切换镜头只是换指针） */
  createFormation(data) {
    return {
      pos: new THREE.BufferAttribute(data.pos, 4),
      col: new THREE.BufferAttribute(data.col, 4, true),
    };
  }

  /** 队形数据被原地改写后调用（「造物」模式复用缓冲） */
  touch(formation) {
    formation.pos.needsUpdate = true;
    formation.col.needsUpdate = true;
  }

  setPair(a, b) {
    const g = this.geometry;
    if (g.getAttribute('aFrom') !== a.pos) {
      g.setAttribute('aFrom', a.pos);
      g.setAttribute('aColFrom', a.col);
    }
    if (g.getAttribute('aTo') !== b.pos) {
      g.setAttribute('aTo', b.pos);
      g.setAttribute('aColTo', b.col);
    }
  }

  /**
   * @param A,B 队形的运动参数（见 DEFAULT_MOTION）外加 localT
   */
  update({ time, mix, stagger, turb, easeMode, scale, spark, A, B }) {
    const u = this.uniforms;
    u.uTime.value = time;
    u.uMix.value = mix;
    u.uStagger.value = stagger;
    u.uTurb.value = turb;
    u.uEase.value = easeMode;
    u.uScale.value = scale;
    u.uSpark.value = spark;
    this.#apply(A, u.uMotA.value, u.uAuxA.value, u.uExtA.value, u.uTiltA.value, u.uExt2A.value);
    this.#apply(B, u.uMotB.value, u.uAuxB.value, u.uExtB.value, u.uTiltB.value, u.uExt2B.value);
  }

  #apply(src, mot, aux, ext, tilt, ext2) {
    const m = { ...DEFAULT_MOTION, ...src };
    mot.set(m.spin, m.spinPow, m.expand, m.jitter);
    aux.set(m.localT || 0, m.phase, m.size, m.alpha * this.density);
    ext.set(m.surfaceFade, m.jitterFreq, m.glow, m.coherence);
    ext2.set(m.beam, m.holeFade, 0, 0);
    _euler.set(m.tilt[0], 0, m.tilt[1], 'XYZ');
    tilt.setFromMatrix4(_m4.makeRotationFromEuler(_euler));
  }
}
