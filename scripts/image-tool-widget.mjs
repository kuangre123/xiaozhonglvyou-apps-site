const copy = {
  en: {
    title: "Compress or resize an image", privacy: "Your image stays in this browser. No upload, account or payment is required.",
    file: "Choose a JPEG, PNG or WebP image", limits: "One image at a time. Maximum input: 20 MiB and 20 megapixels. Maximum output: 4096 pixels on either side.",
    width: "Width (pixels)", height: "Height (pixels)", ratio: "The original aspect ratio is kept. Images are never enlarged beyond their original dimensions.",
    format: "Output format", quality: "JPEG / WebP quality", qualityNote: "Quality changes JPEG and WebP encoding. PNG uses lossless encoding; this slider does not reduce PNG file size.",
    jpegNote: "JPEG fills transparent areas with white. PNG and WebP can keep transparency. Output is a still image; PNG/WebP animation is not preserved. Metadata is not copied; check the exported image before sharing.",
    run: "Create image", clear: "Clear image", source: "Original image", result: "Exported image", preview: "Original image preview", resultPreview: "Exported image preview",
    inputSize: "Original size", outputSize: "Exported size", dimensions: "Dimensions", savings: "File size change", download: "Download image", empty: "Choose an image to begin.",
    unavailable: "This tool needs JavaScript and a browser with Canvas image support. Your original image is never changed."
  },
  zh: {
    title: "压缩或调整图片尺寸", privacy: "图片仅在当前浏览器中处理，无需上传、注册或付费。",
    file: "选择 JPEG、PNG 或 WebP 图片", limits: "每次处理一张图片。原图上限：20 MiB、2000 万像素。导出图片任意一边不超过 4096 像素。",
    width: "宽度（像素）", height: "高度（像素）", ratio: "始终保留原始宽高比，不会将图片放大到原始尺寸以上。",
    format: "导出格式", quality: "JPEG / WebP 画质", qualityNote: "画质选项仅影响 JPEG 和 WebP 编码。PNG 使用无损编码，降低此选项不会减小 PNG 体积。",
    jpegNote: "JPEG 会将透明区域填充为白色，PNG 和 WebP 可保留透明度。导出为静态图片，不保留 PNG/WebP 动画。导出时不复制原图元数据，分享前请检查导出图片。",
    run: "生成图片", clear: "清除图片", source: "原始图片", result: "导出图片", preview: "原始图片预览", resultPreview: "导出图片预览",
    inputSize: "原图体积", outputSize: "导出体积", dimensions: "图片尺寸", savings: "体积变化", download: "下载图片", empty: "请选择一张图片开始。",
    unavailable: "此工具需要启用 JavaScript，并使用支持 Canvas 图片处理的浏览器。原始文件不会被修改。"
  }
};

export function renderImageToolWidget(locale = "en") {
  const t = copy[/^zh(?:-|$)/i.test(locale) ? "zh" : "en"];
  return `<section class="tool-widget" data-image-tool aria-labelledby="image-tool-heading">
  <h2 id="image-tool-heading">${t.title}</h2>
  <p class="tool-privacy">${t.privacy}</p>
  <form class="tool-form" data-image-form novalidate>
    <div class="tool-field"><label for="image-tool-file">${t.file}</label><input id="image-tool-file" data-image-file type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" aria-describedby="image-tool-limits"><p class="tool-help" id="image-tool-limits">${t.limits}</p></div>
    <fieldset class="tool-controls" data-image-controls disabled>
      <legend>${t.title}</legend>
      <div class="tool-field-grid">
        <div class="tool-field"><label for="image-tool-width">${t.width}</label><input id="image-tool-width" data-image-width type="number" inputmode="numeric" min="1" max="4096" step="1" required aria-describedby="image-tool-ratio"></div>
        <div class="tool-field"><label for="image-tool-height">${t.height}</label><input id="image-tool-height" data-image-height type="number" inputmode="numeric" min="1" max="4096" step="1" required aria-describedby="image-tool-ratio"></div>
        <div class="tool-field"><label for="image-tool-format">${t.format}</label><select id="image-tool-format" data-image-format><option value="image/jpeg">JPEG (.jpg)</option><option value="image/png">PNG (.png)</option><option value="image/webp">WebP (.webp)</option></select></div>
        <div class="tool-field"><label for="image-tool-quality">${t.quality}: <output data-image-quality-value for="image-tool-quality">80%</output></label><input id="image-tool-quality" data-image-quality type="range" min="10" max="100" step="1" value="80" aria-describedby="image-tool-quality-note"></div>
      </div>
      <p class="tool-help" id="image-tool-ratio">${t.ratio}</p>
      <p class="tool-help" id="image-tool-quality-note">${t.qualityNote}</p>
      <p class="tool-help">${t.jpegNote}</p>
    </fieldset>
    <div class="tool-actions"><button class="btn btn-primary" data-image-run type="submit" disabled>${t.run}</button><button class="btn btn-secondary" data-image-clear type="button" disabled>${t.clear}</button></div>
  </form>
  <p class="tool-status" data-image-status role="status" aria-live="polite" aria-atomic="true">${t.empty}</p>
  <p class="tool-error" data-image-error role="alert" hidden></p>
  <div class="tool-preview-grid">
    <figure class="tool-preview" data-image-source-panel hidden><figcaption>${t.source}</figcaption><div class="tool-preview-image" data-image-source data-preview-alt="${t.preview}"></div><dl class="tool-metrics"><div><dt>${t.inputSize}</dt><dd data-image-input-size></dd></div><div><dt>${t.dimensions}</dt><dd data-image-input-dimensions></dd></div></dl></figure>
    <figure class="tool-preview" data-image-result-panel hidden><figcaption>${t.result}</figcaption><div class="tool-preview-image" data-image-result data-preview-alt="${t.resultPreview}"></div><dl class="tool-metrics"><div><dt>${t.outputSize}</dt><dd data-image-output-size></dd></div><div><dt>${t.dimensions}</dt><dd data-image-output-dimensions></dd></div><div><dt>${t.savings}</dt><dd data-image-savings></dd></div></dl><p class="tool-help" data-image-output-format></p><a class="btn btn-primary" data-image-download download>${t.download}</a></figure>
  </div>
  <noscript><p>${t.unavailable}</p></noscript>
</section>`;
}
