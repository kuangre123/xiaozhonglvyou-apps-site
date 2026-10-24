(function () {
  "use strict";
  var widget = document.querySelector("[data-image-tool]");
  if (!widget) return;

  var zh = /^zh(?:-|$)/i.test(document.documentElement.lang || "");
  var words = zh ? {
    empty: "请选择一张图片开始。", loading: "正在读取图片…", ready: "图片已载入。设置尺寸和格式后，点击“生成图片”。", processing: "正在浏览器中生成图片…",
    changed: "设置已更改，请重新生成图片。", done: "图片已生成，可预览并下载。", formatFallback: "浏览器未使用所选格式。实际导出格式为：",
    format: "实际导出格式：", unsupported: "仅支持 JPEG、PNG 和 WebP 图片。HEIC、GIF、SVG 等格式请先转换后再试。",
    tooLarge: "图片超过 20 MiB，请选择更小的原图。", tooManyPixels: "图片超过 2000 万像素，请先缩小原图。", unreadable: "无法读取这张图片。文件可能已损坏，或当前浏览器不支持此编码。",
    dimensions: "请输入 1 到 4096 之间的整数，且不要超过原图尺寸。", encode: "无法生成图片。请尝试减小尺寸或选择其他格式。", capability: "当前浏览器不支持此图片工具，请使用较新的 Safari、Chrome、Firefox 或 Edge。",
    smaller: "减小", larger: "增大", unchanged: "体积未变化", unavailable: "（当前浏览器不支持）"
  } : {
    empty: "Choose an image to begin.", loading: "Reading image…", ready: "Image loaded. Choose dimensions and format, then select Create image.", processing: "Creating your image in this browser…",
    changed: "Settings changed. Create a new image to update the result.", done: "Image created. Preview it and download when ready.", formatFallback: "The browser did not use the requested format. The actual output format is: ",
    format: "Actual output format: ", unsupported: "Use a JPEG, PNG or WebP image. Convert HEIC, GIF, SVG or other formats before trying again.",
    tooLarge: "This image exceeds 20 MiB. Choose a smaller original.", tooManyPixels: "This image exceeds 20 megapixels. Resize the original before trying again.", unreadable: "This image could not be read. It may be damaged or use an encoding your browser does not support.",
    dimensions: "Enter whole numbers from 1 to 4096, without exceeding the original image dimensions.", encode: "The image could not be created. Try smaller dimensions or another output format.", capability: "This browser does not support the image tool. Try a recent Safari, Chrome, Firefox or Edge.",
    smaller: "smaller", larger: "larger", unchanged: "No size change", unavailable: " (not supported in this browser)"
  };
  function find(name) { return widget.querySelector("[data-image-" + name + "]"); }
  var form = find("form"), fileInput = find("file"), controls = find("controls"), widthInput = find("width"), heightInput = find("height");
  var formatInput = find("format"), qualityInput = find("quality"), qualityValue = find("quality-value"), run = find("run"), clear = find("clear");
  var status = find("status"), error = find("error"), sourceContainer = find("source"), resultContainer = find("result"), sourcePanel = find("source-panel"), resultPanel = find("result-panel"), download = find("download");
  var sourceImage = document.createElement("img"), resultImage = document.createElement("img");
  [[sourceImage, sourceContainer], [resultImage, resultContainer]].forEach(function (pair) {
    pair[0].alt = pair[1].getAttribute("data-preview-alt");
    pair[0].width = 320; pair[0].height = 240; pair[0].loading = "lazy";
    pair[1].appendChild(pair[0]);
  });
  var MAX_BYTES = 20 * 1024 * 1024, MAX_PIXELS = 20000000, MAX_SIDE = 4096;
  var revision = 0, source = null, sourceUrl = null, resultUrl = null, result = null;
  var mimeNames = { "image/jpeg": "JPEG", "image/png": "PNG", "image/webp": "WebP" };
  var extensions = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

  function setStatus(message) { status.textContent = message; }
  function setError(message) { error.textContent = message || ""; error.hidden = !message; }
  function telemetry(event, fields) {
    if (typeof window.trackAnalyticsEvent === "function") {
      try { window.trackAnalyticsEvent(event, Object.assign({ tool: "image_compressor" }, fields)); } catch (_) { /* Analytics cannot block local work. */ }
    }
  }
  function bytes(size) {
    if (size < 1024) return size + " B";
    return (size / (size < 1048576 ? 1024 : 1048576)).toLocaleString(zh ? "zh-CN" : "en", { maximumFractionDigits: 2 }) + (size < 1048576 ? " KiB" : " MiB");
  }
  function releaseResult() {
    result = null;
    resultPanel.hidden = true;
    resultImage.removeAttribute("src");
    download.removeAttribute("href");
    download.removeAttribute("download");
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    resultUrl = null;
  }
  function invalidate(message) {
    revision += 1;
    releaseResult();
    widget.removeAttribute("aria-busy");
    run.disabled = !source;
    setError("");
    if (message) setStatus(message);
  }
  function reset(keepFileSelection) {
    invalidate(words.empty);
    if (source && typeof source.image.close === "function") source.image.close();
    source = null;
    sourcePanel.hidden = true;
    sourceImage.removeAttribute("src");
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    sourceUrl = null;
    controls.disabled = true;
    run.disabled = true;
    clear.disabled = true;
    if (!keepFileSelection) fileInput.value = "";
    widthInput.value = "";
    heightInput.value = "";
  }
  function tooManyPixels(width, height) { return !width || !height || width > MAX_PIXELS / height; }
  function ascii(data, offset, length) {
    var value = "";
    for (var i = offset; i < offset + length && i < data.length; i += 1) value += String.fromCharCode(data[i]);
    return value;
  }
  // Read dimensions before decoding when the standard JPEG/PNG/WebP header is available.
  function inspectHeader(buffer) {
    var data = new Uint8Array(buffer), view = new DataView(buffer), width = 0, height = 0, type = "";
    if (data.length >= 24 && data[0] === 137 && ascii(data, 1, 7) === "PNG\r\n\u001a\n" && ascii(data, 12, 4) === "IHDR") {
      type = "image/png"; width = view.getUint32(16); height = view.getUint32(20);
    } else if (data.length >= 12 && ascii(data, 0, 4) === "RIFF" && ascii(data, 8, 4) === "WEBP") {
      type = "image/webp";
      for (var p = 12; p + 8 <= data.length;) {
        var chunk = ascii(data, p, 4), length = view.getUint32(p + 4, true), start = p + 8;
        if (start + length > data.length) break;
        if (chunk === "VP8X" && length >= 10) {
          width = 1 + data[start + 4] + (data[start + 5] << 8) + (data[start + 6] << 16);
          height = 1 + data[start + 7] + (data[start + 8] << 8) + (data[start + 9] << 16); break;
        }
        if (chunk === "VP8L" && length >= 5 && data[start] === 47) {
          width = 1 + data[start + 1] + ((data[start + 2] & 63) << 8);
          height = 1 + (data[start + 2] >> 6) + (data[start + 3] << 2) + ((data[start + 4] & 15) << 10); break;
        }
        if (chunk === "VP8 " && length >= 10 && data[start + 3] === 157 && data[start + 4] === 1 && data[start + 5] === 42) {
          width = view.getUint16(start + 6, true) & 16383; height = view.getUint16(start + 8, true) & 16383; break;
        }
        p = start + length + (length % 2);
      }
    } else if (data.length >= 4 && data[0] === 255 && data[1] === 216 && data[2] === 255) {
      type = "image/jpeg";
      for (var j = 2; j + 3 < data.length;) {
        if (data[j] !== 255) { j += 1; continue; }
        while (j < data.length && data[j] === 255) j += 1;
        var marker = data[j++];
        if (marker === 217 || marker === 218) break;
        if (marker === 1 || (marker >= 208 && marker <= 215)) continue;
        if (j + 2 > data.length) break;
        var segmentLength = view.getUint16(j);
        if (segmentLength < 2 || j + segmentLength > data.length) break;
        if ([192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207].indexOf(marker) !== -1 && segmentLength >= 7) {
          height = view.getUint16(j + 3); width = view.getUint16(j + 5); break;
        }
        j += segmentLength;
      }
    }
    return { type: type, width: width, height: height };
  }
  function loadImage(file, url) {
    function fallback() {
      return new Promise(function (resolve, reject) {
        var image = new Image();
        image.onload = function () { resolve(image); };
        image.onerror = function () { reject(new Error(words.unreadable)); };
        image.src = url;
      });
    }
    if (typeof window.createImageBitmap !== "function") return fallback();
    // Safari versions with incomplete ImageBitmap support can still decode via Image.
    try { return Promise.resolve(window.createImageBitmap(file, { imageOrientation: "from-image" })).catch(fallback); }
    catch (_) { return fallback(); }
  }
  function fitDimensions(width, height) {
    var ratio = Math.min(1, MAX_SIDE / width, MAX_SIDE / height);
    return { width: Math.max(1, Math.round(width * ratio)), height: Math.max(1, Math.round(height * ratio)) };
  }
  function updateQuality() {
    qualityValue.textContent = qualityInput.value + "%";
    qualityInput.disabled = formatInput.value === "image/png";
  }
  function adjustDimensions(changed) {
    if (!source) return;
    var input = changed === "width" ? widthInput : heightInput;
    var value = Number(input.value);
    if (!input.value || !Number.isInteger(value) || value < 1) return;
    var maxWidth = Math.min(MAX_SIDE, source.width), maxHeight = Math.min(MAX_SIDE, source.height);
    var width, height;
    if (changed === "width") {
      width = Math.min(value, maxWidth);
      height = Math.max(1, Math.round(width * source.height / source.width));
      if (height > maxHeight) { height = maxHeight; width = Math.max(1, Math.round(height * source.width / source.height)); }
    } else {
      height = Math.min(value, maxHeight);
      width = Math.max(1, Math.round(height * source.width / source.height));
      if (width > maxWidth) { width = maxWidth; height = Math.max(1, Math.round(width * source.height / source.width)); }
    }
    widthInput.value = Math.max(1, width);
    heightInput.value = Math.max(1, height);
  }
  function encode(canvas, type, quality) {
    return new Promise(function (resolve, reject) {
      try {
        canvas.toBlob(function (blob) {
          if (!blob || !extensions[blob.type]) reject(new Error(words.encode));
          else resolve(blob);
        }, type, quality);
      } catch (_) { reject(new Error(words.encode)); }
    });
  }

  var probe = document.createElement("canvas");
  if (!probe.getContext || !probe.getContext("2d") || typeof probe.toBlob !== "function" || !window.URL || typeof URL.createObjectURL !== "function") {
    fileInput.disabled = true;
    setError(words.capability);
    return;
  }
  try {
    probe.width = 1; probe.height = 1;
    if (probe.toDataURL("image/webp").indexOf("data:image/webp") !== 0) {
      var webpOption = formatInput.querySelector('option[value="image/webp"]');
      webpOption.disabled = true;
      webpOption.textContent += words.unavailable;
    }
  } catch (_) { /* Actual encoder type is checked again before offering a download. */ }

  fileInput.addEventListener("change", async function () {
    var file = fileInput.files && fileInput.files[0];
    reset(true);
    if (!file) return;
    var token = revision;
    clear.disabled = false;
    setStatus(words.loading);
    widget.setAttribute("aria-busy", "true");
    try {
      if (file.size > MAX_BYTES) throw new Error(words.tooLarge);
      var header = inspectHeader(await file.arrayBuffer());
      if (token !== revision) return;
      if (!header.type) throw new Error(words.unsupported);
      if (header.width && header.height && tooManyPixels(header.width, header.height)) throw new Error(words.tooManyPixels);
      var url = URL.createObjectURL(file);
      sourceUrl = url;
      var decoded = await loadImage(file, url);
      if (token !== revision) { if (typeof decoded.close === "function") decoded.close(); return; }
      var width = decoded.naturalWidth || decoded.width, height = decoded.naturalHeight || decoded.height;
      if (tooManyPixels(width, height)) {
        if (typeof decoded.close === "function") decoded.close();
        throw new Error(words.tooManyPixels);
      }
      source = { file: file, image: decoded, width: width, height: height, type: header.type };
      var fitted = fitDimensions(width, height);
      widthInput.value = fitted.width; heightInput.value = fitted.height;
      widthInput.max = Math.min(MAX_SIDE, width); heightInput.max = Math.min(MAX_SIDE, height);
      sourceImage.src = url;
      sourceImage.width = width; sourceImage.height = height;
      find("input-size").textContent = bytes(file.size);
      find("input-dimensions").textContent = width + " × " + height + " px";
      sourcePanel.hidden = false;
      controls.disabled = false;
      run.disabled = false;
      updateQuality();
      setStatus(words.ready);
    } catch (failure) {
      if (token !== revision) return;
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      sourceUrl = null;
      setStatus(words.empty);
      setError(Object.keys(words).some(function (key) { return words[key] === failure.message; }) ? failure.message : words.unreadable);
    } finally {
      if (token === revision) widget.removeAttribute("aria-busy");
    }
  });
  [widthInput, heightInput].forEach(function (input) {
    input.addEventListener("input", function () {
      invalidate(source ? words.changed : words.empty);
      adjustDimensions(input === widthInput ? "width" : "height");
    });
  });
  [formatInput, qualityInput].forEach(function (input) {
    input.addEventListener("input", function () { invalidate(source ? words.changed : words.empty); updateQuality(); });
    input.addEventListener("change", function () { invalidate(source ? words.changed : words.empty); updateQuality(); });
  });
  clear.addEventListener("click", function () { reset(); fileInput.focus(); });
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!source) return;
    invalidate();
    var width = Number(widthInput.value), height = Number(heightInput.value), type = formatInput.value, quality = Number(qualityInput.value) / 100;
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > Math.min(MAX_SIDE, source.width) || height > Math.min(MAX_SIDE, source.height)) {
      setError(words.dimensions);
      (!widthInput.validity.valid ? widthInput : heightInput).focus();
      return;
    }
    var token = revision, currentSource = source;
    run.disabled = true;
    widget.setAttribute("aria-busy", "true");
    setStatus(words.processing);
    telemetry("tool_start", { input_format: mimeNames[currentSource.type], output_format: mimeNames[type] });
    var canvas = document.createElement("canvas");
    try {
      canvas.width = width; canvas.height = height;
      var context = canvas.getContext("2d");
      if (!context) throw new Error(words.encode);
      if (type === "image/jpeg") { context.fillStyle = "#ffffff"; context.fillRect(0, 0, width, height); }
      context.drawImage(currentSource.image, 0, 0, width, height);
      var blob = await encode(canvas, type, quality);
      if (token !== revision) return;
      resultUrl = URL.createObjectURL(blob);
      result = { blob: blob, type: blob.type, width: width, height: height };
      resultImage.src = resultUrl;
      resultImage.width = width; resultImage.height = height;
      find("output-size").textContent = bytes(blob.size);
      find("output-dimensions").textContent = width + " × " + height + " px";
      var difference = (1 - blob.size / currentSource.file.size) * 100;
      find("savings").textContent = difference === 0 ? words.unchanged : (zh ? (difference > 0 ? words.smaller : words.larger) + " " : "") + Math.abs(difference).toLocaleString(zh ? "zh-CN" : "en", { maximumFractionDigits: 1 }) + "%" + (zh ? "" : " " + (difference > 0 ? words.smaller : words.larger));
      find("output-format").textContent = (blob.type !== type ? words.formatFallback : words.format) + mimeNames[blob.type];
      download.href = resultUrl;
      var basename = currentSource.file.name.replace(/\.[^.]*$/, "").replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").slice(0, 100) || "image";
      download.download = basename + "-optimized." + extensions[blob.type];
      resultPanel.hidden = false;
      setStatus(words.done);
      telemetry("tool_success", { input_format: mimeNames[currentSource.type], output_format: mimeNames[blob.type], output_width: width, output_height: height });
    } catch (failure) {
      if (token === revision) { setStatus(words.ready); setError(failure.message || words.encode); }
    } finally {
      canvas.width = 1; canvas.height = 1;
      if (token === revision) { widget.removeAttribute("aria-busy"); run.disabled = false; }
    }
  });
  download.addEventListener("click", function () {
    if (result) telemetry("tool_download", { output_format: mimeNames[result.type], output_width: result.width, output_height: result.height });
  });
  window.addEventListener("pagehide", function (event) { if (!event.persisted) reset(); });
}());
