import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { articleUpdateDate } from './article-update-date.mjs';
const source='https://apps.apple.com/us/app/ai-cleaning-photo-cleaner/id6768019606';
const configs={
 'ai-photo-classification.html':{
  description:'AI Cleaning sorts iPhone photos into nine on-device categories with Pro. Compare Apple Photos, review classification limits, and check terms before downloading.',
  summary:'Sort photos into nine on-device categories with AI Cleaning Pro, then review what to keep. The app is free to download; AI classification requires a subscription.',
  label:'View AI Cleaning and Pro options',
  section:'<p class="section-kicker">Before choosing</p><h2>Choose the workflow and check what requires Pro.</h2><div class="content-list"><div><strong>Find and group photos with Apple Photos</strong><p>For everyday search and albums, start with the built-in app. Follow the <a href="ai-photo-organizer-guide.html#organize-with-apple-photos">Apple Photos organization steps</a>; no AI Cleaning subscription is required.</p></div><div><strong>Use nine AI categories with Pro</strong><p>The App Store labels Auto-Categorize as Pro. Free download does not include this classification feature. Check the current monthly or yearly subscription terms before confirming a purchase.</p></div><div><strong>Review before deleting</strong><p>A category describes likely content; it does not establish that a photo is unimportant. Inspect the original, keep uncertain items, and review the <a href="best-iphone-photo-cleaner-app.html">free cleanup allowance</a> separately from classification.</p></div></div>',
  answers:{
   'Is AI Cleaning free to download?':'Yes, the app is free to download. Auto-Categorize and its nine AI categories require Pro. Free download does not mean free AI classification; check the current subscription terms in your App Store before purchasing.',
   'Does AI Cleaning upload photos to a server?':"The developer describes on-device photo analysis with no uploads. The App Store label reports Data Not Collected; Apple states that this developer-provided privacy disclosure has not been verified by Apple."
  }
 },
 'ai-photo-classification-cn.html':{
  description:'AI Cleaning 中文照片分类指南：九类设备端 AI 分类需要 Pro。对比系统相册与付费分类，检查照片原图和分类结果，再决定是否清理。',
  summary:'AI Cleaning 的九类设备端 AI 分类需要 Pro；免费下载不等于免费使用 AI 分类。先按需求选择系统相册或付费分类，再复查重要照片和清理候选。',
  label:'查看 App 与 Pro 订阅',
  section:'<p class="section-kicker">选择前先看</p><h2>系统相册、Pro 分类和照片清理分别适合什么任务？</h2><div class="content-list"><div><strong>找照片、整理相簿</strong><p>先用系统“照片”的搜索与相簿功能。可按日期、地点或已命名的人物查找，再把需要的照片加入相簿。查看<a href="ai-photo-organizer-guide.html#organize-with-apple-photos" lang="en" hreflang="en">系统相册整理步骤（英文）</a>，这一流程不需要 AI Cleaning 订阅。</p></div><div><strong>使用九类 AI 分类</strong><p>官方 App Store 将 Auto-Categorize 标为 Pro 功能。应用可以免费下载，九类 AI 分类需要订阅；购买前核对当地商店显示的月度或年度订阅条款。</p></div><div><strong>删除前检查原图</strong><p>分类只辅助判断照片内容，不能证明一张照片已经没有价值。不确定的照片先保留；需要处理重复或相似照片时，先看<a href="duplicate-photo-cleaner-cn.html">重复照片复查指南</a>。分类、分组与确认删除是不同的操作。</p></div></div>',
  answers:{
   'AI 照片分类和普通相册搜索有什么区别？':'系统“照片”已经支持内容搜索、人物与宠物、相簿及多种分类。AI Cleaning 的九类 Pro 分类把日常主体与文档类别接入清理复查流程；是否需要额外应用，取决于系统功能能否满足你的整理任务。',
   '照片 AI 分析是否需要上传整本相册？':'开发者说明核心照片分析在设备端进行，不上传照片。App Store 隐私标签显示“不收集数据”；Apple 同时注明，这份隐私声明由开发者提供，未经 Apple 验证。',
   'AI 分类会把照片上传到云端吗？':'开发者说明核心照片分类在设备端进行，不上传照片；这是开发者对产品工作方式的说明。分类结果仍需用户检查，不能代替对照片内容和保留价值的判断。',
   '分类结果不准确怎么办？':'先打开原图检查内容，不要仅凭分类名称决定删除。不确定的证件、票据、文档或回忆照片先保留；分类结果用于辅助复查，不代表照片可以安全删除。'
  }
 }
};
export function updateClassificationAccess(html,file){
 const c=configs[file];if(!c||!html.includes(`rel="canonical" href="https://www.xiaozhonglvyou.com/${file}"`))throw new Error('Unexpected classification page');
 html=html.replace(/(<meta\b[^>]*(?:name="description"|property="og:description"|name="twitter:description")[^>]*content=")[^"]*(")/g,`$1${c.description}$2`);
 html=html.replace(/<section class="page-hero">.*?<\/section>/,hero=>hero.replace(/(<h1>.*?<\/h1>)<p[^>]*>.*?<\/p>/,`$1<p class="hero-summary">${c.summary}</p>`));
 html=html.replace(/<a\b[^>]*data-store-product="ai-cleaning-photo-cleaner"[^>]*>.*?<\/a>/g,a=>a.replace(/aria-label="[^"]*"/,`aria-label="${c.label}"`).replace(/>[^<]*<\/a>$/,`>${c.label}</a>`));
 html=html.replace(/<section\b[^>]*id="classification-access"[^>]*>.*?<\/section>/g,'');
 const section=`<section class="section content-section" id="classification-access"><div class="section-inner">${c.section}<p><a href="${source}?uo=4" target="_blank" rel="noopener noreferrer" data-analytics-event="app_store_click" data-store-product="ai-cleaning-photo-cleaner" data-storefront="ios-app-store" aria-label="${c.label}">${file.endsWith('-cn.html')?'官方 App Store 功能与订阅说明':'Official App Store features and subscription terms'}</a></p></div></section>`;
 html=html.replace(/<section class="page-hero">.*?<\/section>/,hero=>hero+section);
 for(const[q,a]of Object.entries(c.answers)){
  const marker=`<summary>${q}</summary><p>`,start=html.indexOf(marker);if(start<0)throw new Error('Missing FAQ '+q);
  const end=html.indexOf('</p>',start);html=html.slice(0,start)+marker+a+html.slice(end);
 }
 const updated=articleUpdateDate(html,'2026-10-29');html=updated.html;
 const count=html.match(/<main\b[^>]*>(.*?)<\/main>/)[1].replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().split(/\s+/).length;
 return html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)(.*?)(<\/script>)/g,(_,open,json,close)=>{
  const value=JSON.parse(json);const visit=n=>{if(!n||typeof n!=='object')return;
   if(n['@type']==='Article'){n.description=c.description;n.dateModified=updated.date;n.wordCount=count;n.citation=[...new Set([...(n.citation||[]),source])];}
   if(n['@type']==='Question'&&c.answers[n.name])n.acceptedAnswer.text=c.answers[n.name];
   Object.values(n).forEach(visit);
  };visit(value);return open+JSON.stringify(value)+close;
 });
}
if(process.argv[1]===fileURLToPath(import.meta.url))for(const file of Object.keys(configs)){
 const path=new URL('../'+file,import.meta.url);const a=await readFile(path,'utf8'),b=updateClassificationAccess(a,file);if(a!==b)await writeFile(path,b);console.log(file+': '+(a!==b));
}
