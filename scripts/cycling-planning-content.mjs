// Worked arithmetic examples. Speeds are assumptions, not riding recommendations.
export const rideTimeExamples = [5, 10, 20, 30, 50].map(distance => ({
  distance, minutes: [15, 20, 25].map(speed => distance / speed * 60)
}));

function duration(minutes, zh) {
  const hours = Math.floor(minutes / 60), rest = minutes % 60;
  return [hours ? `${hours}${zh ? ' 小时' : ' h'}` : '', rest ? `${rest}${zh ? ' 分钟' : ' min'}` : ''].filter(Boolean).join(' ');
}

export function cyclingPlanningContent(locale, originalSections) {
  const zh = locale === 'zh';
  const quick = {
    id: 'ride-time-examples',
    heading: zh ? '骑行 5 到 50 公里，按假设均速需要多久？' : 'Cycling time for 5 to 50 km at three assumed speeds',
    paragraphs: [zh
      ? '移动时间 = 距离 ÷ 平均速度。例如，20 公里按 20 公里/小时骑行，移动时间为 1 小时；再加 15 分钟休息，全程为 1 小时 15 分钟。下表使用固定的假设均速，不含休息，也不预测具体路线的耗时。'
      : 'Moving time = distance ÷ average speed. For example, 20 km at 20 km/h takes 1 hour of moving time; a 15-minute stop makes the total 1 hour 15 minutes. This table uses fixed speed assumptions, excludes stops and does not predict conditions on your route.'],
    table: {
      caption: zh ? '假设均速下的骑行移动时间（不含休息）' : 'Calculated moving time, excluding stops',
      headers: [zh ? '距离' : 'Distance', '15 km/h', '20 km/h', '25 km/h'],
      rows: rideTimeExamples.map(example => [`${example.distance} km`, ...example.minutes.map(value => duration(value, zh))])
    }
  };
  const weekly = {
    heading: zh ? '每周和全年骑行里程、时间怎么汇总？' : 'Add up weekly and yearly cycling distance and time',
    paragraphs: zh ? [
      '相同路线重复骑行时，每周里程 = 单程距离 × 每天单程次数 × 每周骑行天数。例如，单程 10 公里、每天往返两次、每周 5 天，共 10 × 2 × 5 = 100 公里。若每段均按 20 公里/小时计算，移动时间共 5 小时，停留另外累计。',
      '如果一年实际骑行 48 个这样的星期，累计为 4800 公里、240 小时移动时间。48 周只是这个例子选择的数量，应按自己的假期、天气与计划调整。不同路线或速度应先分别计算，再相加距离和时间；不要直接对每次均速取平均。'
    ] : [
      'For a repeated route, weekly distance = one-way distance × one-way trips per day × riding days per week. A 10 km journey ridden out and back on five days totals 10 × 2 × 5 = 100 km. At an assumed 20 km/h for every leg, moving time totals 5 hours; add stopped time separately.',
      'If you actually repeat that week 48 times, the yearly total is 4,800 km and 240 moving hours. The 48 weeks are a chosen example; adjust for holidays, weather and your own plans. For different routes or speeds, calculate each ride first and add distances and times, rather than averaging the individual speeds.'
    ]
  };
  return {
    dateModified: '2026-11-13', toolMode: 'time',
    actionLabel: zh ? '计算我的骑行时间' : 'Calculate my ride time',
    title: zh ? '骑行10、20、30、50公里要多久？耗时表与计算公式' : 'How Long to Cycle 10, 20 or 50 km? Times & Formula',
    heading: zh ? '骑行 10、20、30、50 公里分别需要多久？' : 'How long does it take to cycle 10, 20 or 50 km?',
    description: zh
      ? '按15、20、25公里/小时的假设均速查看5至50公里的骑行耗时，用距离除以速度计算移动时间，再单独加入休息。附20公里与30公里实例、每周及全年里程汇总方法，并可直接进入骑行时间计算模式。'
      : 'Compare cycling times for 5–50 km at three assumed speeds. Use distance ÷ speed, add breaks, and open the calculator in time mode for your own ride.',
    summary: zh
      ? '20 公里按 20 公里/小时骑行，移动时间为 1 小时；休息 15 分钟则全程为 1 小时 15 分钟。先查看不同距离的耗时表，再用自己的距离和假设均速计算。'
      : 'At an assumed 20 km/h, cycling 20 km takes 1 hour moving, or 1 hour 15 minutes with a 15-minute stop. Compare distances in the table, then calculate using your own distance and speed assumption.',
    keywords: zh ? ['骑行20公里要多久', '骑行时间计算公式', '每周骑行里程计算', '骑行均速与全程均速'] : ['how long to cycle 20 km', 'cycling time by distance', 'weekly cycling distance', 'moving vs overall average speed'],
    sections: [quick, ...originalSections, weekly]
  };
}
