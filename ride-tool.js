(function (root) {
  "use strict";
  var MILE_KM = 1.609344;
  var limits = Object.freeze({ distanceKm: 10000, speedKph: 300, movingSeconds: 3600000, breakMinutes: 10000 });
  function invalid(code, field) { var error = new Error(code); error.code = code; error.field = field; throw error; }
  function number(value, field, optional) {
    if (optional && (value === "" || value === undefined || value === null)) return 0;
    if (typeof value !== "number" && (typeof value !== "string" || !/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value.trim()))) invalid("number", field);
    var result = Number(value);
    if (!Number.isFinite(result) || result < 0) invalid("number", field);
    return result;
  }
  function bounded(value, max, code, field) {
    if (!Number.isFinite(value) || value <= 0 || value > max + max * 1e-12) invalid(code, field);
    return value;
  }
  function timeParts(hours, minutes, seconds) {
    var h = number(hours, "hours"), m = number(minutes, "minutes"), s = number(seconds, "seconds");
    if (!Number.isInteger(h) || h > 1000) invalid("hours", "hours");
    if (!Number.isInteger(m) || m > 59) invalid("minuteSecond", "minutes");
    if (!Number.isInteger(s) || s > 59) invalid("minuteSecond", "seconds");
    var total = h * 3600 + m * 60 + s;
    if (total < 1 || total > limits.movingSeconds) invalid("time", "hours");
    return total;
  }
  function calculate(input) {
    var mode = input.mode, unit = input.unit;
    if (["speed", "time", "distance"].indexOf(mode) < 0) invalid("mode", "mode");
    if (unit !== "km" && unit !== "mi") invalid("unit", "unit");
    var factor = unit === "mi" ? MILE_KM : 1;
    var distance = mode === "distance" ? null : bounded(number(input.distance, "distance") * factor, limits.distanceKm, "distance", "distance");
    var speed = mode === "speed" ? null : bounded(number(input.speed, "speed") * factor, limits.speedKph, "speed", "speed");
    var moving = mode === "time" ? null : timeParts(input.hours, input.minutes, input.seconds);
    var breaks = number(input.breakMinutes, "breaks", true);
    if (breaks > limits.breakMinutes) invalid("breaks", "breaks");
    if (mode === "speed") speed = distance / moving * 3600;
    if (mode === "time") moving = distance / speed * 3600;
    if (mode === "distance") distance = speed * moving / 3600;
    bounded(distance, limits.distanceKm, "distanceResult", null);
    bounded(speed, limits.speedKph, "speedResult", null);
    if (!Number.isFinite(moving) || moving < 1 - 1e-9 || moving > limits.movingSeconds + 1e-6) invalid("timeResult", null);
    var elapsed = moving + breaks * 60;
    return Object.freeze({ distanceKm: distance, speedKph: speed, movingSeconds: moving, breakSeconds: breaks * 60, elapsedSeconds: elapsed, overallKph: distance / elapsed * 3600 });
  }
  function duration(seconds) {
    var rounded = Math.round(seconds);
    return { hours: Math.floor(rounded / 3600), minutes: Math.floor(rounded % 3600 / 60), seconds: rounded % 60 };
  }
  root.RideCalculator = Object.freeze({ mileKm: MILE_KM, limits: limits, calculate: calculate, duration: duration });
  if (typeof document === "undefined") return;
  var widget = document.querySelector("[data-ride-tool]");
  if (!widget) return;
  var zh = /^zh(?:-|$)/i.test(document.documentElement.lang || "");
  var words = zh ? {
    empty: "先选择要计算的项目，再输入另外两个已知值。", changed: "输入已更改，请重新计算。", done: "计算完成。结果中的总时长包含休息与停留。", sample: "已填入示例：30 公里、骑行 1 小时 30 分、停留 15 分钟。点击“开始计算”查看结果。", sampleOther: "已填入同一组示例数据。点击“开始计算”查看结果。",
    number: "请输入完整、非负的数字；已知的距离、速度和骑行总时间必须大于 0。", hours: "小时必须是 0 至 1000 的整数，骑行总时间不能超过 1000 小时。", minuteSecond: "分钟和秒必须是 0 至 59 的整数。", time: "骑行时间必须介于 1 秒与 1000 小时之间，不包含停留。", distance: "距离必须大于 0、不超过 10000 公里（英里使用等值上限）。", speed: "平均骑行速度必须大于 0、不超过 300 公里/小时（英里使用等值上限）。", breaks: "停留时间必须介于 0 与 10000 分钟之间。", distanceResult: "算出的距离超出范围，请调整输入，使距离大于 0 且不超过 10000 公里。", speedResult: "算出的均速超出范围，请检查距离与骑行时间；最大为 300 公里/小时。", timeResult: "算出的骑行时间超出范围，请调整距离或速度，使结果介于 1 秒与 1000 小时之间。", mode: "请选择要计算的项目。", unit: "请选择公里或英里。", hoursLabel: " 小时 ", minutesLabel: " 分 ", secondsLabel: " 秒"
  } : {
    empty: "Choose what to calculate, then enter the two known values.", changed: "Inputs changed. Calculate again to update the result.", done: "Calculation complete. Total time includes stops and breaks.", sample: "Example loaded: 30 km, 1 hour 30 minutes moving, and 15 minutes stopped. Select Calculate to see the result.", sampleOther: "The same example values are loaded. Select Calculate to see the result.",
    number: "Enter a complete, non-negative number. Known distance, speed and total moving time must be above zero.", hours: "Hours must be a whole number from 0 to 1,000; total moving time cannot exceed 1,000 hours.", minuteSecond: "Minutes and seconds must be whole numbers from 0 to 59.", time: "Moving time must be between 1 second and 1,000 hours, excluding stops.", distance: "Distance must be above 0 and at most 10,000 km, or its equivalent in miles.", speed: "Average moving speed must be above 0 and at most 300 km/h, or its equivalent in mph.", breaks: "Stops must be between 0 and 10,000 minutes.", distanceResult: "The calculated distance is outside the supported range. Adjust the inputs for a distance above 0 and at most 10,000 km.", speedResult: "The calculated speed is outside the supported range. Check distance and moving time; the maximum is 300 km/h.", timeResult: "The calculated moving time is outside the supported range. Adjust distance or speed for a result from 1 second to 1,000 hours.", mode: "Choose what you want to calculate.", unit: "Choose kilometres or miles.", hoursLabel: " h ", minutesLabel: " min ", secondsLabel: " s"
  };
  function find(name) { return widget.querySelector("[data-ride-" + name + "]"); }
  var fields = {};
  ["mode", "unit", "distance", "speed", "hours", "minutes", "seconds", "breaks"].forEach(function (name) { fields[name] = find(name); });
  var form = find("form"), errorNode = find("error"), status = find("status"), resultNode = find("result");
  var activeUnit = fields.unit.value;
  var canonical = { distance: null, speed: null };
  function clearError() {
    errorNode.hidden = true; errorNode.textContent = "";
    Object.keys(fields).forEach(function (name) { fields[name].removeAttribute("aria-invalid"); });
  }
  function invalidate(message) { resultNode.hidden = true; clearError(); status.textContent = message || words.changed; }
  function showError(error) {
    resultNode.hidden = true; errorNode.textContent = words[error.code] || words.number; errorNode.hidden = false;
    if (fields[error.field] && !fields[error.field].disabled) { fields[error.field].setAttribute("aria-invalid", "true"); fields[error.field].focus(); }
    status.textContent = words.changed;
  }
  function fromField(name) {
    var text = fields[name].value;
    if (canonical[name] && canonical[name].text === text && canonical[name].unit === activeUnit) return canonical[name].value;
    var value = number(text, name) * (activeUnit === "mi" ? MILE_KM : 1);
    canonical[name] = { text: text, unit: activeUnit, value: value };
    return value;
  }
  function updateMode() {
    var mode = fields.mode.value;
    [["distance", mode !== "distance"], ["speed", mode !== "speed"]].forEach(function (pair) { find(pair[0] + "-group").hidden = !pair[1]; fields[pair[0]].disabled = !pair[1]; });
    find("time-group").hidden = mode === "time";
    ["hours", "minutes", "seconds"].forEach(function (name) { fields[name].disabled = mode === "time"; });
  }
  function updateUnits() {
    var imperial = activeUnit === "mi";
    find("distance-unit").textContent = imperial ? "mi" : "km";
    find("speed-unit").textContent = imperial ? "mph" : "km/h";
    fields.distance.max = String(limits.distanceKm / (imperial ? MILE_KM : 1));
    fields.speed.max = String(limits.speedKph / (imperial ? MILE_KM : 1));
  }
  function displayNumber(value) { return value > 0 && value < 0.01 ? "<0.01" : value.toLocaleString(zh ? "zh-CN" : "en", { maximumFractionDigits: 2 }); }
  function displayDuration(seconds) { var t = duration(seconds); return t.hours + words.hoursLabel + t.minutes + words.minutesLabel + t.seconds + words.secondsLabel; }
  function telemetry(name) {
    if (typeof window.trackAnalyticsEvent === "function") {
      try { window.trackAnalyticsEvent(name, { tool: "ride_calculator", mode: fields.mode.value, unit: activeUnit }); } catch (_) { /* Analytics must not interrupt a calculation. */ }
    }
  }
  Object.keys(fields).filter(function (name) { return name !== "mode" && name !== "unit"; }).forEach(function (name) {
    fields[name].addEventListener("input", function () { if (name === "distance" || name === "speed") canonical[name] = null; invalidate(); });
  });
  fields.mode.addEventListener("change", function () { updateMode(); invalidate(); });
  fields.unit.addEventListener("change", function () {
    var nextUnit = fields.unit.value, pending = {};
    try {
      if (nextUnit !== "km" && nextUnit !== "mi") invalid("unit", "unit");
      ["distance", "speed"].forEach(function (name) {
        if (fields[name].value === "") return;
        try { pending[name] = fromField(name); }
        catch (error) { if (!fields[name].disabled) throw error; }
      });
      activeUnit = nextUnit;
      Object.keys(pending).forEach(function (name) {
        var text = Number((pending[name] / (nextUnit === "mi" ? MILE_KM : 1)).toPrecision(12)).toString();
        fields[name].value = text; canonical[name] = { value: pending[name], text: text, unit: nextUnit };
      });
      updateUnits(); invalidate();
    } catch (error) { fields.unit.value = activeUnit; showError(error); }
  });
  form.addEventListener("submit", function (event) {
    event.preventDefault(); invalidate(); telemetry("tool_start");
    try {
      var mode = fields.mode.value;
      var result = calculate({ mode: mode, unit: "km", distance: mode === "distance" ? null : fromField("distance"), speed: mode === "speed" ? null : fromField("speed"), hours: fields.hours.value, minutes: fields.minutes.value, seconds: fields.seconds.value, breakMinutes: fields.breaks.value });
      var factor = activeUnit === "mi" ? MILE_KM : 1, unit = activeUnit === "mi" ? "mi" : "km", speedUnit = activeUnit === "mi" ? "mph" : "km/h";
      find("result-distance").textContent = displayNumber(result.distanceKm / factor) + " " + unit;
      find("result-speed").textContent = displayNumber(result.speedKph / factor) + " " + speedUnit;
      find("result-overall").textContent = displayNumber(result.overallKph / factor) + " " + speedUnit;
      find("result-moving").textContent = displayDuration(result.movingSeconds);
      find("result-breaks").textContent = displayDuration(result.breakSeconds);
      find("result-elapsed").textContent = displayDuration(result.elapsedSeconds);
      resultNode.hidden = false; status.textContent = words.done; telemetry("tool_success");
    } catch (error) { showError(error); }
  });
  find("sample").addEventListener("click", function () {
    var factor = activeUnit === "mi" ? MILE_KM : 1;
    [["distance", 30], ["speed", 20]].forEach(function (pair) { var text = Number((pair[1] / factor).toPrecision(12)).toString(); fields[pair[0]].value = text; canonical[pair[0]] = { value: pair[1], text: text, unit: activeUnit }; });
    fields.hours.value = "1"; fields.minutes.value = "30"; fields.seconds.value = "0"; fields.breaks.value = "15";
    invalidate(activeUnit === "km" ? words.sample : words.sampleOther);
  });
  find("reset").addEventListener("click", function () {
    fields.distance.value = ""; fields.speed.value = "";
    ["hours", "minutes", "seconds", "breaks"].forEach(function (name) { fields[name].value = "0"; });
    canonical = { distance: null, speed: null }; invalidate(words.empty);
    (fields.mode.value === "distance" ? fields.speed : fields.distance).focus();
  });
  updateMode(); updateUnits();
})(typeof globalThis !== "undefined" ? globalThis : this);
