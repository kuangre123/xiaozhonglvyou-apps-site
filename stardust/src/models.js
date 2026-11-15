// Lux3D 造物的加载：GLB → 归一化 → 表面采样成星尘 → 可「显形」的 PBR 网格。
// 预生成的造物和「造物」模式实时生成的模型走的是同一条路径。
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { mulberry32, SRGB_TO_LINEAR } from './util.js';

const TARGET_SIZE = 2.7; // 归一化后模型最长边的世界尺寸

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

/** 把贴图读回 CPU（缩到 ≤512，采样星尘颜色够用） */
function readTexture(texture) {
  const img = texture?.image;
  if (!img || !img.width) return null;
  const scale = Math.min(1, 512 / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  try {
    return { data: ctx.getImageData(0, 0, w, h).data, w, h };
  } catch {
    return null; // 跨域污染的画布：退回材质纯色
  }
}

// ── 显形着色：噪声阈值溶解，边缘带一圈发光 ──────────────────────
// uReveal 0 → 完全不可见，1 → 完整显形。自下而上、带噪声的边界，
// 看上去像星尘在网格表面「结晶」。
const DISSOLVE_PARS = /* glsl */ `
uniform float uReveal;
uniform vec3 uEdgeColor;
uniform vec2 uYRange;
varying vec3 vDissolveLocal;
varying float vDissolveY;
float dHash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float dNoise(vec3 x){
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(dHash(i), dHash(i + vec3(1,0,0)), f.x), mix(dHash(i + vec3(0,1,0)), dHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(dHash(i + vec3(0,0,1)), dHash(i + vec3(1,0,1)), f.x), mix(dHash(i + vec3(0,1,1)), dHash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float dissolveField(){
  float n = dNoise(vDissolveLocal * 9.0) * 0.6 + dNoise(vDissolveLocal * 23.0) * 0.4;
  float h = clamp((vDissolveY - uYRange.x) / max(1e-4, uYRange.y - uYRange.x), 0.0, 1.0);
  return h * 0.5 + n * 0.5;
}`;

function patchMaterial(material, uniforms) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vDissolveLocal;\nvarying float vDissolveY;')
      .replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\nvDissolveLocal = position;\nvDissolveY = (modelMatrix * vec4(position, 1.0)).y;',
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${DISSOLVE_PARS}`)
      .replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>
  float dField = dissolveField();
  float dEdge = uReveal * 1.16 - 0.08;
  if (dField > dEdge) discard;`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
  totalEmissiveRadiance += uEdgeColor * smoothstep(dEdge - 0.05, dEdge, dField) * 2.6 * step(uReveal, 0.999);`,
      );
  };
  material.customProgramCacheKey = () => 'stardust-dissolve';
  material.needsUpdate = true;
}

export class Creation {
  constructor(id, gltfScene) {
    this.id = id;
    this.root = new THREE.Group(); // 转台：只做绕 Y 的旋转
    this.root.name = `creation:${id}`;

    // 归一化：包围盒中心移到原点，最长边缩放到 TARGET_SIZE
    const box = new THREE.Box3().setFromObject(gltfScene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = TARGET_SIZE / Math.max(size.x, size.y, size.z, 1e-6);
    // 用一层 holder 承担归一化，这样不必关心 glTF 根节点自带的变换：p' = scale · (p − center)
    const holder = new THREE.Group();
    holder.scale.setScalar(scale);
    holder.position.copy(center).multiplyScalar(-scale);
    holder.add(gltfScene);
    this.root.add(holder);
    this.root.updateMatrixWorld(true);

    this.height = size.y * scale;
    this.uniforms = {
      uReveal: { value: 0 },
      uEdgeColor: { value: new THREE.Color(1.0, 0.72, 0.38) },
      uYRange: { value: new THREE.Vector2(-this.height / 2, this.height / 2) },
    };

    this.meshes = [];
    this.root.traverse((o) => {
      if (!o.isMesh) return;
      this.meshes.push(o);
      o.frustumCulled = false;
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
        m.envMapIntensity = 1.0;
        patchMaterial(m, this.uniforms);
      }
    });
    this.root.visible = false;
    this.#buildSampler();
  }

  /** 让基础色贴图里的亮部自发光：熔岩的裂缝、发动机的喷口 */
  setGlow(color, intensity) {
    for (const mesh of this.meshes) {
      for (const m of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
        if (!m.map) continue;
        m.emissiveMap = m.map;
        m.emissive.setRGB(color[0], color[1], color[2]);
        m.emissiveIntensity = intensity;
        m.needsUpdate = true;
      }
    }
  }

  set reveal(v) {
    this.uniforms.uReveal.value = v;
    this.root.visible = v > 0.002;
  }
  get reveal() {
    return this.uniforms.uReveal.value;
  }

  /** 预计算三角形面积的累积分布，供按面积均匀采样 */
  #buildSampler() {
    const parts = [];
    let triTotal = 0;
    const v = new THREE.Vector3();
    for (const mesh of this.meshes) {
      const geo = mesh.geometry;
      const posAttr = geo.getAttribute('position');
      if (!posAttr) continue;
      const world = new Float32Array(posAttr.count * 3);
      for (let i = 0; i < posAttr.count; i++) {
        v.fromBufferAttribute(posAttr, i).applyMatrix4(mesh.matrixWorld);
        world[i * 3] = v.x;
        world[i * 3 + 1] = v.y;
        world[i * 3 + 2] = v.z;
      }
      const index = geo.index;
      const tris = (index ? index.count : posAttr.count) / 3;
      const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      parts.push({
        world,
        index: index ? index.array : null,
        uv: geo.getAttribute('uv') || null,
        color: geo.getAttribute('color') || null,
        tris,
        tex: readTexture(mat.map),
        base: mat.color ? [mat.color.r, mat.color.g, mat.color.b] : [1, 1, 1],
        triStart: triTotal,
      });
      triTotal += tris;
    }
    const cum = new Float32Array(triTotal);
    let acc = 0;
    for (const p of parts) {
      const w = p.world;
      for (let t = 0; t < p.tris; t++) {
        const ia = p.index ? p.index[t * 3] : t * 3;
        const ib = p.index ? p.index[t * 3 + 1] : t * 3 + 1;
        const ic = p.index ? p.index[t * 3 + 2] : t * 3 + 2;
        const ax = w[ia * 3];
        const ay = w[ia * 3 + 1];
        const az = w[ia * 3 + 2];
        const ux = w[ib * 3] - ax;
        const uy = w[ib * 3 + 1] - ay;
        const uz = w[ib * 3 + 2] - az;
        const vx = w[ic * 3] - ax;
        const vy = w[ic * 3 + 1] - ay;
        const vz = w[ic * 3 + 2] - az;
        const cx = uy * vz - uz * vy;
        const cy = uz * vx - ux * vz;
        const cz = ux * vy - uy * vx;
        acc += 0.5 * Math.sqrt(cx * cx + cy * cy + cz * cz);
        cum[p.triStart + t] = acc;
      }
    }
    this.sampler = { parts, cum, total: acc, triTotal };
  }

  /** 在表面按面积均匀采 count 个点：返回 { pos, col }（转台本地坐标、线性颜色） */
  sample(count, seed = 1) {
    const { parts, cum, total, triTotal } = this.sampler;
    const rng = mulberry32(seed);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    if (!triTotal || total <= 0) return { pos, col };
    let partIdx = 0;
    for (let s = 0; s < count; s++) {
      const target = rng() * total;
      let lo = 0;
      let hi = triTotal - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (cum[mid] < target) lo = mid + 1;
        else hi = mid;
      }
      partIdx = 0;
      while (partIdx < parts.length - 1 && lo >= parts[partIdx + 1].triStart) partIdx++;
      const p = parts[partIdx];
      const t = lo - p.triStart;
      const ia = p.index ? p.index[t * 3] : t * 3;
      const ib = p.index ? p.index[t * 3 + 1] : t * 3 + 1;
      const ic = p.index ? p.index[t * 3 + 2] : t * 3 + 2;
      let u = rng();
      let v = rng();
      if (u + v > 1) {
        u = 1 - u;
        v = 1 - v;
      }
      const w = 1 - u - v;
      const W = p.world;
      const o = s * 3;
      pos[o] = W[ia * 3] * w + W[ib * 3] * u + W[ic * 3] * v;
      pos[o + 1] = W[ia * 3 + 1] * w + W[ib * 3 + 1] * u + W[ic * 3 + 1] * v;
      pos[o + 2] = W[ia * 3 + 2] * w + W[ib * 3 + 2] * u + W[ic * 3 + 2] * v;

      let r = p.base[0];
      let g = p.base[1];
      let b = p.base[2];
      if (p.tex && p.uv) {
        const tu = p.uv.getX(ia) * w + p.uv.getX(ib) * u + p.uv.getX(ic) * v;
        const tv = p.uv.getY(ia) * w + p.uv.getY(ib) * u + p.uv.getY(ic) * v;
        // glTF 的 UV 原点在左上角（GLTFLoader 设了 flipY=false），所以不需要翻转 v
        const px = Math.min(p.tex.w - 1, Math.floor((tu - Math.floor(tu)) * p.tex.w));
        const py = Math.min(p.tex.h - 1, Math.floor((tv - Math.floor(tv)) * p.tex.h));
        const k = (py * p.tex.w + px) * 4;
        r *= SRGB_TO_LINEAR[p.tex.data[k]];
        g *= SRGB_TO_LINEAR[p.tex.data[k + 1]];
        b *= SRGB_TO_LINEAR[p.tex.data[k + 2]];
      } else if (p.color) {
        r *= p.color.getX(ia) * w + p.color.getX(ib) * u + p.color.getX(ic) * v;
        g *= p.color.getY(ia) * w + p.color.getY(ib) * u + p.color.getY(ic) * v;
        b *= p.color.getZ(ia) * w + p.color.getZ(ib) * u + p.color.getZ(ic) * v;
      }
      col[o] = r;
      col[o + 1] = g;
      col[o + 2] = b;
    }
    return { pos, col };
  }

  dispose() {
    this.root.removeFromParent();
    this.root.traverse((o) => {
      if (!o.isMesh) return;
      o.geometry.dispose();
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
        for (const key of ['map', 'metalnessMap', 'roughnessMap', 'normalMap', 'emissiveMap', 'aoMap']) m[key]?.dispose();
        m.dispose();
      }
    });
  }
}

export async function loadCreation(id, url) {
  const gltf = await loader.loadAsync(url);
  return new Creation(id, gltf.scene);
}
