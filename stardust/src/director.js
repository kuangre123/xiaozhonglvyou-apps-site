// 成片里的「互动演示」脚本：模拟观众在影片里开关声音、拖动旋转、滚轮缩放、暂停后环绕造物、
// 变速、点时间尺跳转、方向键切换年代，最后点「造物」。
//
// 做法：先逐帧「模拟」出每一帧的状态（影片时间 T、视角偏移、光标、提示文字、控制栏），
// 录制器再按帧回放渲染。镜头切换、静音、点击这些事件也一并记下，用来对齐成片配乐里的钟声与音量。
// 光标坐标一律是画面的归一化坐标（0–1）。
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * @param timeline  { shots, duration, indexAt }
 * @param layout    (state) => { play, speed, sound, forge: [x, y], tick(i): [x, y] } 控制栏与时间尺的位置
 */
export function simulateFilm({ timeline, fps, layout, filmFrom = 0 }) {
  const dt = 1 / fps;
  const st = {
    tau: 0,
    T: filmFrom,
    playing: true,
    rate: 1,
    yaw: 0,
    pitch: 0,
    zoom: 1,
    held: false,
    idle: 99,
    cursor: { x: 1.06, y: 0.6, alpha: 0, pressed: false, wheel: 0 },
    ripple: null,
    label: null,
    labelAlpha: 0,
    key: null,
    keyAlpha: 0,
    sound: true,
    speedLabel: '1×',
    pressed: null,
    pressAge: 9,
    force: 0,
    done: false,
  };
  const events = [];
  const frames = [];
  const gen = script(st, { fps, timeline, layout, events });
  let lastShot = -1;
  let px = st.cursor.x;
  let py = st.cursor.y;
  let lastLabel = null;
  let lastKey = null;

  while (!st.done && frames.length < fps * 900) {
    gen.next();
    // 松手之后像网页里一样：闲置 3.5 秒，再慢慢回到导演机位
    if (!st.held) {
      st.idle += dt;
      if (st.idle > 3.5) {
        const k = 1 - Math.exp(-dt * 0.9);
        st.yaw *= 1 - k;
        st.pitch *= 1 - k;
        st.zoom += (1 - st.zoom) * k;
      }
    }
    // 光标掠过画面时拨开星尘（停在按钮上不算）
    const v = Math.hypot(st.cursor.x - px, st.cursor.y - py) / dt;
    px = st.cursor.x;
    py = st.cursor.y;
    const overScene = st.cursor.alpha > 0.5 && st.cursor.y < 0.84 && st.cursor.x < 0.84;
    st.force += ((overScene ? Math.min(1, v * 1.6) : 0) - st.force) * 0.2;

    const idx = timeline.indexAt(st.T);
    if (idx !== lastShot) {
      events.push({ tau: st.tau, type: 'shot', index: idx });
      lastShot = idx;
    }
    st.labelAlpha += ((st.label ? 1 : 0) - st.labelAlpha) * 0.25;
    st.keyAlpha += ((st.key ? 1 : 0) - st.keyAlpha) * 0.3;
    if (st.label) lastLabel = st.label;
    if (st.key) lastKey = st.key;
    frames.push({
      T: st.T,
      yaw: st.yaw,
      pitch: st.pitch,
      zoom: st.zoom,
      cursor: { ...st.cursor },
      ripple: st.ripple ? { ...st.ripple } : null,
      label: lastLabel,
      labelAlpha: st.labelAlpha,
      key: lastKey,
      keyAlpha: st.keyAlpha,
      playing: st.playing,
      speedLabel: st.speedLabel,
      sound: st.sound,
      pressed: st.pressed,
      pressAge: st.pressAge,
      force: st.force,
    });

    if (st.playing) {
      st.T = Math.min(timeline.duration - 0.001, st.T + dt * st.rate);
      if (st.T >= timeline.duration - 0.002) st.playing = false;
    }
    st.pressAge += dt;
    if (st.ripple && (st.ripple.age += dt) > 0.6) st.ripple = null;
    st.tau += dt;
  }
  return { frames, events, seconds: frames.length / fps, cursorEnd: { ...st.cursor } };
}

function* script(st, { fps, timeline, layout, events }) {
  const { shots, duration } = timeline;
  const start = (id) => shots.find((s) => s.id === id).start;
  const n = (sec) => Math.max(1, Math.round(sec * fps));
  const at = (name) => layout(st)[name];

  function* wait(sec) {
    for (let i = n(sec); i > 0; i--) yield;
  }
  function* untilT(t) {
    while (st.T < t) yield;
  }
  function* move(x, y, sec) {
    const x0 = st.cursor.x;
    const y0 = st.cursor.y;
    const k = n(sec);
    for (let i = 1; i <= k; i++) {
      const e = easeInOut(i / k);
      st.cursor.x = x0 + (x - x0) * e;
      st.cursor.y = y0 + (y - y0) * e;
      yield;
    }
  }
  function* appear([x, y], sec = 0.9) {
    st.cursor.x = Math.min(1.05, x + 0.22);
    st.cursor.y = Math.min(1.05, y + 0.12);
    const x0 = st.cursor.x;
    const y0 = st.cursor.y;
    const k = n(sec);
    for (let i = 1; i <= k; i++) {
      const e = easeInOut(i / k);
      st.cursor.alpha = Math.min(1, (i / k) * 1.6);
      st.cursor.x = x0 + (x - x0) * e;
      st.cursor.y = y0 + (y - y0) * e;
      yield;
    }
    st.cursor.alpha = 1;
  }
  function* vanish(sec = 0.6) {
    const x0 = st.cursor.x;
    const y0 = st.cursor.y;
    const k = n(sec);
    for (let i = 1; i <= k; i++) {
      st.cursor.alpha = 1 - i / k;
      st.cursor.x = x0 + 0.05 * (i / k);
      st.cursor.y = y0 + 0.04 * (i / k);
      yield;
    }
    st.cursor.alpha = 0;
  }
  function* click(button) {
    st.cursor.pressed = true;
    st.ripple = { x: st.cursor.x, y: st.cursor.y, age: 0 };
    if (button) {
      st.pressed = button;
      st.pressAge = 0;
    }
    events.push({ tau: st.tau, type: 'click' });
    yield* wait(0.14);
    st.cursor.pressed = false;
  }
  function* zoomTo(z, sec) {
    const z0 = st.zoom;
    const k = n(sec);
    for (let i = 1; i <= k; i++) {
      st.zoom = z0 + (z - z0) * easeInOut(i / k);
      yield;
    }
  }

  // ① 黑暗时代：开关声音
  yield* untilT(33.4);
  st.label = '声音开关';
  yield* appear(at('sound'), 1.0);
  yield* click('sound');
  st.sound = false;
  events.push({ tau: st.tau, type: 'duck', dur: 1.15 });
  yield* wait(1.15);
  yield* click('sound');
  st.sound = true;
  yield* wait(0.5);
  st.label = null;
  yield* vanish();

  // ② 星系：拖动旋转
  yield* untilT(50.4);
  st.label = '拖动 · 旋转视角';
  yield* appear([0.66, 0.4], 0.9);
  st.cursor.pressed = true;
  st.held = true;
  {
    const x0 = st.cursor.x;
    const y0 = st.cursor.y;
    const k = n(2.4);
    for (let i = 1; i <= k; i++) {
      const e = easeInOut(i / k);
      st.cursor.x = x0 + (0.36 - x0) * e;
      st.cursor.y = y0 + (0.54 - y0) * e;
      st.yaw = -1.25 * e;
      st.pitch = 0.22 * e;
      yield;
    }
  }
  st.cursor.pressed = false;
  st.held = false;
  st.idle = 0;
  yield* wait(0.4);
  st.label = '松手后，镜头会自己回到原位';
  yield* move(0.52, 0.64, 1.2);
  yield* wait(1.6);
  st.label = null;
  yield* vanish();

  // ③ 黑洞：滚轮缩放
  yield* untilT(61.4);
  st.label = '滚轮 · 拉近拉远';
  yield* appear([0.6, 0.34], 0.8);
  st.held = true;
  st.cursor.wheel = 1;
  yield* zoomTo(0.58, 1.5);
  yield* wait(1.0);
  st.cursor.wheel = -1;
  yield* zoomTo(1.0, 1.3);
  st.cursor.wheel = 0;
  st.held = false;
  yield* wait(0.3);
  st.label = null;
  yield* vanish();

  // ④ 霸王龙：暂停 → 绕着造物转一圈 → 放大 → 继续播放
  yield* untilT(110.2);
  st.label = '暂停';
  yield* appear(at('play'), 0.9);
  yield* click('play');
  st.playing = false;
  yield* wait(0.4);
  st.label = '暂停时，可以绕着这件 Lux3D 造物转一圈';
  yield* move(0.66, 0.46, 0.7);
  st.held = true;
  for (let pass = 0; pass < 2; pass++) {
    st.cursor.pressed = true;
    const x0 = st.cursor.x;
    const yaw0 = st.yaw;
    const k = n(1.9);
    for (let i = 1; i <= k; i++) {
      const e = easeInOut(i / k);
      st.cursor.x = x0 + (0.34 - x0) * e;
      st.yaw = yaw0 - Math.PI * e;
      st.pitch = 0.12 * Math.sin(Math.PI * e);
      yield;
    }
    st.cursor.pressed = false;
    if (pass === 0) yield* move(0.66, 0.46, 0.45);
  }
  st.yaw = 0; // 转满一圈：−2π 与 0 是同一个方向
  st.label = '滚轮放大，看清细节';
  st.cursor.wheel = 1;
  yield* zoomTo(0.6, 1.0);
  yield* wait(0.9);
  st.cursor.wheel = -1;
  yield* zoomTo(1.0, 0.8);
  st.cursor.wheel = 0;
  st.label = '继续播放';
  yield* move(...at('play'), 0.9);
  yield* click('play');
  st.playing = true;
  st.held = false;
  yield* wait(0.4);
  st.label = null;
  yield* vanish();

  // ⑤ 文明：2× 快进，再切回 1×
  yield* untilT(120.4);
  st.label = '2× 快进';
  yield* appear(at('speed'), 0.9);
  yield* click('speed');
  st.speedLabel = '2×';
  st.rate = 2;
  yield* wait(0.6);
  st.label = null;
  yield* vanish();
  yield* untilT(131.2);
  st.label = '再点两下，回到 1×';
  yield* appear(at('speed'), 0.8);
  yield* click('speed');
  st.speedLabel = '0.5×';
  st.rate = 0.5;
  yield* wait(0.35);
  yield* click('speed');
  st.speedLabel = '1×';
  st.rate = 1;
  yield* wait(0.5);
  st.label = null;
  yield* vanish();

  // ⑥ 终章之后：点时间尺跳回黑洞 → 方向键切到下一个年代 → 点「造物」
  yield* untilT(duration - 0.01);
  yield* wait(1.2);
  st.label = '点时间尺，回到任意年代';
  const bh = shots.findIndex((s) => s.id === 'blackhole');
  yield* appear(layout(st).tick(bh), 1.3);
  yield* click(null);
  st.T = start('blackhole');
  st.playing = true;
  yield* wait(1.0);
  st.label = null;
  yield* vanish();
  yield* untilT(start('blackhole') + 6.4);
  st.key = '→';
  st.label = '方向键 ← →　切换年代';
  events.push({ tau: st.tau, type: 'click' });
  yield* wait(0.25);
  st.T = start('nebula');
  yield* wait(1.5);
  st.key = null;
  st.label = null;
  yield* wait(1.4);
  st.label = '造物：写一句话，让星尘凝聚成它';
  yield* appear(at('forge'), 1.0);
  yield* click('forge');
  st.playing = false;
  yield* wait(0.4);
  st.done = true;
}
