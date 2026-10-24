/* Local browser GIF maker. Self-hosted; no media requests or uploads. */
(() => {
  'use strict';
  const widget = document.getElementById('gif-tool');
  if (!widget) return;
  const zh = document.documentElement.lang.toLowerCase().startsWith('zh');
  const $ = (name) => document.getElementById(`gif-tool-${name}`);
  const codec = window.LocalGifCodec;
  const text = zh ? {
    ready: '选择文件后即可开始。', selected: '已选择', files: '个文件', removed: '已移除文件。', up: '上移', down: '下移', remove: '移除', busy: '正在处理', done: 'GIF 已生成，可预览并下载。', cancelled: '已取消处理。', invalidated: '设置已更改，请重新生成 GIF。',
    choose: '请先选择本地文件。', many: '照片最多 20 张；视频或 GIF 只能选择 1 个文件。', size: '单文件不能超过 20 MiB。', type: '文件类型不支持。照片请选择 JPEG、PNG 或 WebP；视频需浏览器可解码；GIF 模式请选择 GIF。', image: '照片无法读取，或尺寸过大（最多 4096 像素边长、1600 万像素）。', gif: 'GIF 无法读取或超过输入限制：最长边 2048 像素、每帧 400 万像素、240 帧、总计 6000 万像素。', output: '输出超过浏览器处理限制。请降低尺寸、帧率、视频时长，或提高 GIF 跳帧比例。', video: '当前浏览器无法读取此视频，或视频没有可读取的有限时长。可尝试常见 H.264 MP4 或兼容的 WebM。', range: '视频区间无效：结束时间需晚于开始时间，且选段不超过 15 秒。', delay: '照片帧间隔应为 20–5000 毫秒。', failed: '处理失败。请换一个有效文件，或降低尺寸后重试。', unavailable: '工具脚本未能加载，请刷新页面后重试。', dimensions: '尺寸', frames: '帧', seconds: '秒', bytes: '体积', source: '输入', larger: '输出比原 GIF 更大；请降低尺寸或跳过更多帧。', original: '原 GIF', noPreview: '当前浏览器不支持必要的本地图片处理功能。'
  } : {
    ready: 'Choose files to begin.', selected: 'Selected', files: 'file(s)', removed: 'File removed.', up: 'Move up', down: 'Move down', remove: 'Remove', busy: 'Processing', done: 'GIF ready. Preview and download it below.', cancelled: 'Processing cancelled.', invalidated: 'Settings changed. Create a new GIF to apply them.',
    choose: 'Choose local files first.', many: 'Choose up to 20 photos, or exactly one video or GIF.', size: 'Each file must be no larger than 20 MiB.', type: 'Unsupported file type. Use JPEG, PNG or WebP photos, a browser-decodable video, or a GIF in GIF mode.', image: 'The photo could not be decoded or is too large (maximum 4096-pixel side and 16 megapixels).', gif: 'Invalid GIF or input limit exceeded: maximum 2048-pixel side, 4 megapixels per frame, 240 frames and 60 million decoded pixels.', output: 'The output exceeds browser processing limits. Reduce dimensions, frame rate or video duration, or skip more GIF frames.', video: 'This browser cannot decode the video, or it has no finite readable duration. Try a compatible H.264 MP4 or WebM.', range: 'Choose a valid video range: end must follow start, with a maximum 15-second selection.', delay: 'Photo frame delay must be between 20 and 5000 milliseconds.', failed: 'Processing failed. Try a valid file or smaller output dimensions.', unavailable: 'The tool script could not load. Refresh this page and try again.', dimensions: 'Dimensions', frames: 'frames', seconds: 's', bytes: 'Size', source: 'Input', larger: 'This output is larger than the original GIF. Reduce dimensions or skip more frames.', original: 'Original GIF', noPreview: 'This browser does not support the required local image processing features.'
  };
  let files = [], thumbnails = [], resultUrl = null, revision = 0, running = false, operation = null;
  const stop = Symbol('cancelled');
  const yieldFrame = () => new Promise((resolve) => setTimeout(resolve, 0));
  const formatBytes = (n) => n >= 1048576 ? `${(n / 1048576).toFixed(2)} MiB` : `${(n / 1024).toFixed(1)} KiB`;
  const mode = () => $('mode').value;
  const status = (value, error = false) => { $('status').textContent = value; $('status').classList.toggle('tool-error', error); };
  const analytics = (event, params = {}) => { if (typeof window.trackAnalyticsEvent === 'function') window.trackAnalyticsEvent(event, { tool: 'gif_maker', mode: mode(), ...params }); };
  const revokeResult = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    resultUrl = null; $('result').hidden = true; $('preview').replaceChildren(); $('download').removeAttribute('href'); $('summary').textContent = '';
  };
  const invalidate = (message = text.invalidated) => { revision++; operation?.abort(); revokeResult(); status(message); };
  const setBusy = (value) => {
    running = value;
    $('create').disabled = value; $('cancel').hidden = !value; $('progress').hidden = !value;
    $('form').setAttribute('aria-busy', String(value));
  };
  function releaseThumbnails() { thumbnails.forEach((url) => URL.revokeObjectURL(url)); thumbnails = []; }
  function showFiles(focusIndex = null) {
    releaseThumbnails(); $('file-list').replaceChildren();
    files.forEach((file, index) => {
      const item = document.createElement('li'); item.className = 'tool-file-item';
      if (mode() === 'photos') {
        const image = document.createElement('img'); const url = URL.createObjectURL(file); thumbnails.push(url);
        image.src = url; image.alt = ''; image.width = 64; image.height = 64; image.loading = 'lazy'; item.append(image);
      }
      const name = document.createElement('span'); name.textContent = `${index + 1}. ${file.name} (${formatBytes(file.size)})`; name.className = 'tool-file-name'; item.append(name);
      const actions = document.createElement('div'); actions.className = 'tool-file-actions';
      const button = (label, handler, disabled = false) => {
        const el = document.createElement('button'); el.type = 'button'; el.textContent = label; el.disabled = disabled; el.setAttribute('aria-label', `${label}: ${file.name}`); el.addEventListener('click', handler); actions.append(el); return el;
      };
      if (mode() === 'photos') {
        button(text.up, () => { invalidate(); [files[index - 1], files[index]] = [files[index], files[index - 1]]; showFiles(index - 1); }, index === 0);
        button(text.down, () => { invalidate(); [files[index + 1], files[index]] = [files[index], files[index + 1]]; showFiles(index + 1); }, index === files.length - 1);
      }
      button(text.remove, () => { invalidate(text.removed); files.splice(index, 1); showFiles(Math.min(index, files.length - 1)); });
      item.append(actions); $('file-list').append(item);
    });
    if (focusIndex !== null && focusIndex >= 0) $('file-list').children[focusIndex]?.querySelector('button:not(:disabled)')?.focus();
  }
  function setMode() {
    invalidate(text.ready); files = []; $('input').value = ''; showFiles();
    $('input').multiple = mode() === 'photos';
    $('input').accept = ({ photos: 'image/jpeg,image/png,image/webp', video: 'video/*', gif: 'image/gif' })[mode()];
    widget.querySelectorAll('[data-gif-mode]').forEach((el) => { el.hidden = el.dataset.gifMode !== mode(); el.querySelectorAll('input,select').forEach((field) => { field.disabled = el.hidden; }); });
  }
  function checkFiles(selected) {
    if (!selected.length) throw new Error('choose');
    if (selected.length > (mode() === 'photos' ? 20 : 1)) throw new Error('many');
    for (const file of selected) {
      if (file.size > codec.LIMITS.fileBytes) throw new Error('size');
      const ext = file.name.split('.').pop().toLowerCase();
      const valid = mode() === 'photos' ? /^(image\/(jpeg|png|webp))$/.test(file.type) || (!file.type && ['jpg', 'jpeg', 'png', 'webp'].includes(ext)) : mode() === 'gif' ? file.type === 'image/gif' || (!file.type && ext === 'gif') : file.type.startsWith('video/') || (!file.type && ['mp4', 'mov', 'm4v', 'webm', 'ogv'].includes(ext));
      if (!valid) throw new Error('type');
    }
  }
  const dims = (width, height, max) => { const ratio = Math.min(1, max / Math.max(width, height)); return [Math.max(1, Math.round(width * ratio)), Math.max(1, Math.round(height * ratio))]; };
  function canvas(width, height) {
    const el = document.createElement('canvas'); el.width = width; el.height = height;
    const ctx = el.getContext('2d', { willReadFrequently: true }); if (!ctx) throw new Error('noPreview');
    return { el, ctx };
  }
  function capture(ctx, source, width, height) {
    const { width: cw, height: ch } = ctx.canvas; const ratio = Math.min(cw / width, ch / height);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(source, (cw - width * ratio) / 2, (ch - height * ratio) / 2, width * ratio, height * ratio);
    return ctx.getImageData(0, 0, cw, ch).data;
  }
  async function loadImage(file) {
    const url = URL.createObjectURL(file); const image = new Image();
    try {
      await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = () => reject(new Error('image')); image.src = url; });
      if (!image.naturalWidth || image.naturalWidth > 4096 || image.naturalHeight > 4096 || image.naturalWidth * image.naturalHeight > 16000000) throw new Error('image');
      return image;
    } catch (error) { image.src = ''; throw error; } finally { URL.revokeObjectURL(url); }
  }
  function waitForVideo(video, event) {
    const signal = operation?.signal;
    return new Promise((resolve, reject) => {
      const finish = (fn, value) => { clearTimeout(timeout); video.removeEventListener(event, success); video.removeEventListener('error', failure); signal?.removeEventListener('abort', aborted); fn(value); };
      const success = () => finish(resolve); const failure = () => finish(reject, new Error('video')); const aborted = () => finish(reject, stop);
      const timeout = setTimeout(failure, 15000); video.addEventListener(event, success, { once: true }); video.addEventListener('error', failure, { once: true }); signal?.addEventListener('abort', aborted, { once: true }); if (signal?.aborted) aborted();
    });
  }
  const checkRevision = (ticket) => { if (ticket !== revision) throw stop; };
  async function fromPhotos(ticket, max) {
    const delayMs = Number($('delay').value);
    if (!Number.isFinite(delayMs) || delayMs < 20 || delayMs > 5000) throw new Error('delay');
    const first = await loadImage(files[0]); checkRevision(ticket);
    const [width, height] = dims(first.naturalWidth, first.naturalHeight, max);
    const encoder = codec.createEncoder(width, height, files.length); const target = canvas(width, height);
    for (let i = 0; i < files.length; i++) {
      checkRevision(ticket); const image = i === 0 ? first : await loadImage(files[i]); checkRevision(ticket);
      encoder.add(capture(target.ctx, image, image.naturalWidth, image.naturalHeight), Math.max(2, Math.round(delayMs / 10)));
      image.src = ''; $('progress').value = (i + 1) / files.length * 100; status(`${text.busy}: ${i + 1}/${files.length}`); await yieldFrame();
    }
    return encoder.finish();
  }
  async function fromVideo(ticket, max) {
    const video = document.createElement('video'); video.muted = true; video.playsInline = true; video.preload = 'auto';
    const url = URL.createObjectURL(files[0]);
    try {
      const ready = waitForVideo(video, 'loadeddata'); video.src = url; video.load(); await ready; checkRevision(ticket);
      const start = Number($('start').value), end = Math.min(Number($('end').value), video.duration), fps = Number($('fps').value);
      if (!Number.isFinite(video.duration) || video.duration <= 0 || !video.videoWidth || video.videoWidth > 7680 || video.videoHeight > 7680 || video.videoWidth * video.videoHeight > 34000000) throw new Error('video');
      if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start || end - start > 15) throw new Error('range');
      const count = Math.ceil((end - start) * fps); const [width, height] = dims(video.videoWidth, video.videoHeight, max);
      const encoder = codec.createEncoder(width, height, count), target = canvas(width, height);
      for (let i = 0; i < count; i++) {
        checkRevision(ticket); const time = start + i / fps;
        if (Math.abs(video.currentTime - time) > 0.0001) { const seek = waitForVideo(video, 'seeked'); video.currentTime = time; await seek; }
        checkRevision(ticket);
        const delay = Math.max(2, Math.round(Math.min((i + 1) / fps, end - start) * 100) - Math.round(i / fps * 100));
        encoder.add(capture(target.ctx, video, video.videoWidth, video.videoHeight), delay);
        $('progress').value = (i + 1) / count * 100; status(`${text.busy}: ${i + 1}/${count}`); await yieldFrame();
      }
      return encoder.finish();
    } finally { video.pause(); video.removeAttribute('src'); video.load(); URL.revokeObjectURL(url); }
  }
  async function fromGif(ticket, max) {
    const buffer = new Uint8Array(await files[0].arrayBuffer()); checkRevision(ticket);
    let info; try { info = codec.inspectGif(buffer); } catch { throw new Error('gif'); }
    const step = Number($('step').value), count = Math.ceil(info.count / step), [width, height] = dims(info.width, info.height, max);
    const encoder = codec.createEncoder(width, height, count), source = canvas(info.width, info.height), target = canvas(width, height);
    await codec.readGif(buffer, { step, checkAbort: () => checkRevision(ticket), yieldFrame, onFrame(rgba, frame) {
      source.ctx.putImageData(new ImageData(rgba, info.width, info.height), 0, 0);
      encoder.add(capture(target.ctx, source.el, info.width, info.height), frame.delay);
      $('progress').value = (frame.index + 1) / count * 100; status(`${text.busy}: ${frame.index + 1}/${count}`);
    } });
    return encoder.finish();
  }
  function errorMessage(error) {
    if (['output-limit', 'frame-limit', 'missing-frames'].includes(error?.message)) return text.output;
    return text[error?.message] || text.failed;
  }
  $('mode').addEventListener('change', setMode);
  $('input').addEventListener('change', () => {
    invalidate(); files = [];
    try { if (!codec) throw new Error('unavailable'); const selected = Array.from($('input').files); checkFiles(selected); files = selected; status(`${text.selected} ${files.length} ${text.files}.`); }
    catch (error) { status(errorMessage(error), true); }
    showFiles();
  });
  $('form').querySelectorAll('input:not([type=file]), select:not(#gif-tool-mode)').forEach((el) => { el.addEventListener('change', () => invalidate()); el.addEventListener('input', () => invalidate()); });
  $('cancel').addEventListener('click', () => { invalidate(text.cancelled); });
  $('clear').addEventListener('click', () => { invalidate(text.ready); files = []; $('input').value = ''; showFiles(); });
  $('download').addEventListener('click', () => { if (resultUrl) analytics('tool_download'); });
  $('form').addEventListener('submit', async (event) => {
    event.preventDefault(); if (running) return;
    invalidate(); const ticket = revision; operation = new AbortController();
    try {
      if (!codec) throw new Error('unavailable'); checkFiles(files); const max = Number($('size').value); if (![240, 320, 480, 640].includes(max)) throw new Error('output-limit');
      setBusy(true); $('progress').value = 0; status(text.busy); analytics('tool_start'); await yieldFrame();
      const result = await ({ photos: fromPhotos, video: fromVideo, gif: fromGif })[mode()](ticket, max);
      checkRevision(ticket); const blob = new Blob([result.bytes], { type: 'image/gif' }); resultUrl = URL.createObjectURL(blob);
      const image = document.createElement('img'); image.src = resultUrl; image.alt = $('preview').dataset.previewAlt; image.width = result.width; image.height = result.height; image.loading = 'eager'; $('preview').replaceChildren(image);
      $('download').href = resultUrl; $('result').hidden = false;
      const details = `${text.dimensions}: ${result.width} × ${result.height} · ${result.frames} ${text.frames} · ${result.duration.toFixed(2)} ${text.seconds} · ${text.bytes}: ${formatBytes(blob.size)}`;
      $('summary').textContent = details + (mode() === 'gif' ? ` · ${text.original}: ${formatBytes(files[0].size)}${blob.size > files[0].size ? ` — ${text.larger}` : ''}` : '');
      status(text.done); analytics('tool_success', { frames: result.frames, output_bytes: blob.size, width: result.width, height: result.height });
    } catch (error) { if (error === stop || ticket !== revision) status(text.cancelled); else status(errorMessage(error), true); }
    finally { operation = null; setBusy(false); }
  });
  window.addEventListener('pagehide', () => { revision++; operation?.abort(); releaseThumbnails(); revokeResult(); });
  setMode();
})();
