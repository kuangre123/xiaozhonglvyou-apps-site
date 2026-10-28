const copy = {
  en: {
    title: "Calculate ride speed, time or distance", privacy: "Calculations stay in this browser. No account or location access is needed.", mode: "What would you like to calculate?", modes: ["Average moving speed", "Moving time", "Distance"], units: "Distance and speed units", metric: "Kilometres · km/h", imperial: "Miles · mph", distance: "Distance", speed: "Average moving speed", moving: "Moving time (exclude stops)", hours: "Hours", minutes: "Minutes", seconds: "Seconds", breaks: "Stops and breaks (minutes, optional)", breaksNote: "Stops are added to moving time to find total elapsed time. Leave this at 0 if you have no stops.", limits: "Limits: distance above 0 and up to 10,000 km; speed above 0 and up to 300 km/h (equivalent limits in miles). Moving time: 1 second to 1,000 hours. Stops: 0–10,000 minutes. Hours, minutes and seconds must be whole numbers; minutes and seconds must be 0–59.", run: "Calculate", sample: "Load example", reset: "Clear inputs", status: "Choose what to calculate, then enter the two known values.", result: "Your calculation", resultDistance: "Distance", resultMoving: "Moving time", resultElapsed: "Total time including stops", resultSpeed: "Average moving speed", resultOverall: "Overall speed including stops", resultBreaks: "Stops and breaks", precision: "Distances and speeds are rounded to two decimal places; positive values below 0.01 are shown as <0.01. Times are rounded to the nearest second. Switching units preserves the underlying quantity.", note: "These are arithmetic estimates using a constant average speed. Hills, wind, traffic and changes in pace affect a real ride. This tool does not record a GPS route or predict a finish time.", unavailable: "Enable JavaScript to use the calculator. The formulas and instructions below remain readable without it."
  },
  zh: {
    title: "计算骑行均速、时间或距离", privacy: "计算在当前浏览器完成，无需账号或定位权限。", mode: "需要计算什么？", modes: ["平均骑行速度", "骑行时间", "骑行距离"], units: "距离与速度单位", metric: "公里 · km/h", imperial: "英里 · mph", distance: "骑行距离", speed: "平均骑行速度", moving: "骑行时间（不含停留）", hours: "小时", minutes: "分钟", seconds: "秒", breaks: "休息与停留（分钟，可选）", breaksNote: "停留时间单独加到骑行时间，得到总时长。没有停留时保留 0。", limits: "范围：距离大于 0、不超过 10,000 公里；速度大于 0、不超过 300 公里/小时（英里使用等值上限）。骑行时间 1 秒至 1,000 小时；停留 0 至 10,000 分钟。小时、分钟和秒只填整数，分钟与秒为 0 至 59。", run: "开始计算", sample: "填入示例", reset: "清空输入", status: "先选择要计算的项目，再输入另外两个已知值。", result: "计算结果", resultDistance: "骑行距离", resultMoving: "骑行时间", resultElapsed: "含停留的总时长", resultSpeed: "平均骑行速度", resultOverall: "含停留的全程均速", resultBreaks: "休息与停留", precision: "距离和速度最多显示两位小数；小于 0.01 的正数显示为 <0.01。时长按最近的 1 秒显示。切换单位会保留实际距离与速度。", note: "这是按固定平均速度进行的数学估算。坡度、风、交通和速度变化会影响实际骑行。工具不记录 GPS 路线，也不预测真实到达时间。", unavailable: "请启用 JavaScript 使用计算器；下方公式和操作说明仍可直接阅读。"
  }
};

export function renderRideToolWidget(locale = "en") {
  const zh = /^zh(?:-|$)/i.test(locale), t = copy[zh ? "zh" : "en"];
  return `<section class="tool-widget" data-ride-tool aria-labelledby="ride-tool-heading">
  <h2 id="ride-tool-heading">${t.title}</h2><p class="tool-privacy">${t.privacy}</p>
  <form class="tool-form" data-ride-form novalidate>
    <div class="tool-field-grid">
      <div class="tool-field"><label for="ride-tool-mode">${t.mode}</label><select id="ride-tool-mode" data-ride-mode><option value="speed">${t.modes[0]}</option><option value="time">${t.modes[1]}</option><option value="distance">${t.modes[2]}</option></select></div>
      <div class="tool-field"><label for="ride-tool-unit">${t.units}</label><select id="ride-tool-unit" data-ride-unit><option value="km">${t.metric}</option><option value="mi">${t.imperial}</option></select></div>
    </div>
    <div class="tool-field-grid">
      <div class="tool-field" data-ride-distance-group><label for="ride-tool-distance">${t.distance} (<span data-ride-distance-unit>km</span>)</label><input id="ride-tool-distance" data-ride-distance type="number" inputmode="decimal" min="0" max="10000" step="any" required aria-describedby="ride-tool-limits"></div>
      <div class="tool-field" data-ride-speed-group hidden><label for="ride-tool-speed">${t.speed} (<span data-ride-speed-unit>km/h</span>)</label><input id="ride-tool-speed" data-ride-speed type="number" inputmode="decimal" min="0" max="300" step="any" required disabled aria-describedby="ride-tool-limits"></div>
    </div>
    <fieldset data-ride-time-group><legend>${t.moving}</legend><div class="tool-field-grid">
      <div class="tool-field"><label for="ride-tool-hours">${t.hours}</label><input id="ride-tool-hours" data-ride-hours type="number" inputmode="numeric" min="0" max="1000" step="1" value="0" required aria-describedby="ride-tool-limits"></div>
      <div class="tool-field"><label for="ride-tool-minutes">${t.minutes}</label><input id="ride-tool-minutes" data-ride-minutes type="number" inputmode="numeric" min="0" max="59" step="1" value="0" required aria-describedby="ride-tool-limits"></div>
      <div class="tool-field"><label for="ride-tool-seconds">${t.seconds}</label><input id="ride-tool-seconds" data-ride-seconds type="number" inputmode="numeric" min="0" max="59" step="1" value="0" required aria-describedby="ride-tool-limits"></div>
    </div></fieldset>
    <div class="tool-field"><label for="ride-tool-breaks">${t.breaks}</label><input id="ride-tool-breaks" data-ride-breaks type="number" inputmode="decimal" min="0" max="10000" step="any" value="0" aria-describedby="ride-tool-breaks-note ride-tool-limits"><p class="tool-help" id="ride-tool-breaks-note">${t.breaksNote}</p></div>
    <p class="tool-help" id="ride-tool-limits">${t.limits}</p>
    <div class="tool-actions"><button class="btn btn-primary" type="submit" data-ride-run>${t.run}</button><button class="btn btn-secondary" type="button" data-ride-sample>${t.sample}</button><button class="btn btn-secondary" type="button" data-ride-reset>${t.reset}</button></div>
  </form>
  <p class="tool-status" data-ride-status role="status" aria-live="polite" aria-atomic="true">${t.status}</p><p class="tool-error" data-ride-error role="alert" hidden></p>
  <section class="tool-result" data-ride-result hidden aria-labelledby="ride-tool-result-heading"><h3 id="ride-tool-result-heading">${t.result}</h3><dl class="tool-metrics">
    <div><dt>${t.resultDistance}</dt><dd data-ride-result-distance></dd></div><div><dt>${t.resultMoving}</dt><dd data-ride-result-moving></dd></div><div><dt>${t.resultBreaks}</dt><dd data-ride-result-breaks></dd></div><div><dt>${t.resultElapsed}</dt><dd data-ride-result-elapsed></dd></div><div><dt>${t.resultSpeed}</dt><dd data-ride-result-speed></dd></div><div><dt>${t.resultOverall}</dt><dd data-ride-result-overall></dd></div>
  </dl><p class="tool-help">${t.precision.replace(/</g, "&lt;")}</p></section>
  <p class="tool-privacy-note">${t.note}</p><noscript><p>${t.unavailable}</p></noscript>
</section>`;
}
