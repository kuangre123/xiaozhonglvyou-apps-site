const strings = {
  en: {
    title: 'Make or resize a GIF', intro: 'Choose photos, a short video, or an existing GIF. Processing stays in this browser; your media is not uploaded.',
    mode: 'Input type', photos: 'Photos to GIF', video: 'Video to GIF', gif: 'Resize an existing GIF', select: 'Choose local files', files: 'Selected media',
    settings: 'GIF settings', size: 'Maximum width or height (pixels)', delay: 'Photo frame delay (milliseconds)', start: 'Video start (seconds)', end: 'Video end (seconds)', fps: 'Video frames per second', skip: 'Keep GIF frames', every: ['Every frame', 'Every 2nd frame', 'Every 3rd frame', 'Every 4th frame'],
    create: 'Create GIF', cancel: 'Cancel processing', clear: 'Clear files and result', download: 'Download GIF', result: 'Your GIF', preview: 'Animated GIF preview',
    ready: 'Choose files to begin.', limits: 'Limits: 20 MiB per file; up to 20 photos, 80 output frames, a 640-pixel maximum side and a 15-second video selection. Large source GIFs are rejected to protect browser memory. GIF has 256 colours; transparency and uncovered areas are flattened onto white. Photo animations fit each image without cropping. Export loops continuously; resizing does not guarantee a smaller file.',
    note: 'GIF import keeps frame timing, combining skipped-frame delays. Delays shorter than 20 ms use 20 ms; unspecified delays use 100 ms. Video decoding depends on your browser and codec. Audio is not included.',
    privacy: 'Only anonymous tool events may be measured. File names, images and video content are never sent with these events.', noscript: 'Enable JavaScript to process local media. The guides below are available without JavaScript.'
  },
  zh: {
    title: '制作或缩小 GIF 动图', intro: '选择多张照片、短视频或现有 GIF，在当前浏览器处理，媒体文件不会上传。',
    mode: '输入类型', photos: '照片制作 GIF', video: '视频转 GIF', gif: '缩小现有 GIF', select: '选择本地文件', files: '已选媒体',
    settings: 'GIF 设置', size: '最长边尺寸（像素）', delay: '照片每帧间隔（毫秒）', start: '视频开始时间（秒）', end: '视频结束时间（秒）', fps: '视频每秒帧数', skip: 'GIF 保留帧数', every: ['保留每一帧', '每 2 帧保留 1 帧', '每 3 帧保留 1 帧', '每 4 帧保留 1 帧'],
    create: '生成 GIF', cancel: '取消处理', clear: '清空文件与结果', download: '下载 GIF', result: '生成结果', preview: 'GIF 动画预览',
    ready: '选择文件后即可开始。', limits: '限制：单文件不超过 20 MiB；最多 20 张照片、80 帧输出、最长边 640 像素，视频选段不超过 15 秒。为保护浏览器内存，会拒绝过大的源 GIF。GIF 最多 256 色；透明区域与留白统一铺白底。照片按比例完整显示，不裁剪。输出持续循环播放；重新编码不保证体积一定更小。',
    note: '导入 GIF 会保留帧时长，跳帧时合并被跳过帧的时长。短于 20 毫秒按 20 毫秒处理，未指定时长按 100 毫秒处理。视频能否读取取决于浏览器与视频编码，不包含音频。',
    privacy: '仅可能统计匿名工具操作事件，不会随事件发送文件名、照片或视频内容。', noscript: '请启用 JavaScript 后处理本地媒体；下方教程无需 JavaScript 也可阅读。'
  }
};
export function renderGifToolWidget(locale = 'en') {
  const s = strings[locale.startsWith('zh') ? 'zh' : 'en'];
  return `<section class="tool-widget" id="gif-tool" aria-labelledby="gif-tool-heading" data-tool="gif-maker" data-gif-tool>
<h2 id="gif-tool-heading">${s.title}</h2><p>${s.intro}</p>
<form id="gif-tool-form">
<div class="tool-fields"><label for="gif-tool-mode">${s.mode}<select id="gif-tool-mode" name="mode"><option value="photos">${s.photos}</option><option value="video">${s.video}</option><option value="gif">${s.gif}</option></select></label>
<label for="gif-tool-input">${s.select}<input id="gif-tool-input" name="files" type="file" accept="image/jpeg,image/png,image/webp" multiple></label></div>
<div class="tool-selected" id="gif-tool-selected"><h3>${s.files}</h3><ol id="gif-tool-file-list" class="tool-file-list"></ol></div>
<fieldset class="tool-settings"><legend>${s.settings}</legend><div class="tool-fields">
<label for="gif-tool-size">${s.size}<select id="gif-tool-size" name="size"><option value="240">240</option><option value="320">320</option><option value="480" selected>480</option><option value="640">640</option></select></label>
<label for="gif-tool-delay" data-gif-mode="photos">${s.delay}<input id="gif-tool-delay" name="delay" type="number" min="20" max="5000" step="10" value="200"></label>
<label for="gif-tool-start" data-gif-mode="video" hidden>${s.start}<input id="gif-tool-start" name="start" type="number" min="0" step="0.1" value="0"></label>
<label for="gif-tool-end" data-gif-mode="video" hidden>${s.end}<input id="gif-tool-end" name="end" type="number" min="0.1" step="0.1" value="3"></label>
<label for="gif-tool-fps" data-gif-mode="video" hidden>${s.fps}<select id="gif-tool-fps" name="fps"><option value="4">4</option><option value="8" selected>8</option><option value="12">12</option></select></label>
<label for="gif-tool-step" data-gif-mode="gif" hidden>${s.skip}<select id="gif-tool-step" name="step">${s.every.map((label, i) => `<option value="${i + 1}">${label}</option>`).join('')}</select></label>
</div></fieldset>
<div class="tool-actions"><button class="button" type="submit" id="gif-tool-create">${s.create}</button><button class="button secondary" type="button" id="gif-tool-cancel" hidden>${s.cancel}</button><button class="button secondary" type="button" id="gif-tool-clear">${s.clear}</button></div>
</form>
<p class="tool-status" id="gif-tool-status" role="status" aria-live="polite">${s.ready}</p><progress id="gif-tool-progress" max="100" value="0" aria-label="${s.title}" hidden></progress>
<section id="gif-tool-result" class="tool-result" aria-labelledby="gif-tool-result-heading" hidden><h3 id="gif-tool-result-heading">${s.result}</h3><div id="gif-tool-preview" data-preview-alt="${s.preview}"></div><p id="gif-tool-summary"></p><a id="gif-tool-download" class="button" download="animation.gif">${s.download}</a></section>
<p class="tool-help">${s.limits}</p><p class="tool-help">${s.note}</p><p class="tool-help">${s.privacy}</p><noscript><p>${s.noscript}</p></noscript>
</section>`;
}
