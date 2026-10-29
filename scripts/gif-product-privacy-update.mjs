import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const configs={
 'gif-maker.html':{
  language:'Interface languages: English, Simplified Chinese, Traditional Chinese, Japanese, Korean, German and Spanish. Turkish is not listed.',
  section:'<p class="section-kicker">Privacy by feature</p><h2>Local editing and optional online features.</h2><p>The developer describes personal-photo processing on-device. The App Store privacy label is developer-provided and has not been verified by Apple.</p>',
  cards:'<div><strong>Personal-media editing</strong><p>Core editing does not require an app account or uploading your photos to an editing service.</p></div><div><strong>Optional online features</strong><p>iCloud can sync exported history and editable projects when available. Web search and downloads contact external websites; these features are separate from local editing.</p></div><div><strong>Before importing</strong><p>Choose the feature you intend to use and review its permissions. A local editor does not make every linked website or cloud action local.</p></div>',
  answers:{
   'Does GIFmaker upload my photos or require an account?':'Personal-photo editing is described as on-device, with no app account required. Optional iCloud history sync and web search involve online services. The developer reports Data Not Collected in the App Store; Apple has not verified this privacy disclosure.',
   'How do I share a GIF in WeChat without losing the animation?':'Save the original GIF to Photos, then select it from Photos inside the WeChat chat. Check the received copy plays, rather than relying on its thumbnail. If it becomes static, reopen the saved original and compare it with what the receiving app shows.'
  }
 },
 'gif-maker-cn.html':{
  language:'界面语言：英语、简体中文、繁体中文、日语、韩语、德语和西班牙语；当前未列出土耳其语。',
  section:'<p class="section-kicker">按功能理解隐私</p><h2>本地编辑与可选联网功能分开看。</h2><p>开发者说明个人照片在设备端处理。App Store 的“不收集数据”标签由开发者提供，未经 Apple 验证。</p>',
  cards:'<div><strong>个人素材编辑</strong><p>核心编辑不要求注册应用账号，也不需要把照片上传到编辑服务。</p></div><div><strong>可选联网功能</strong><p>iCloud 可在可用时同步导出历史和可编辑项目；网页搜索和下载会访问外部网站。这些功能与本地编辑不同。</p></div><div><strong>导入前先确认</strong><p>按实际要用的功能检查权限。本地编辑并不代表所访问的网站和云端操作也在本机完成。</p></div>',
  answers:{
   'GIFmaker 会上传照片或要求注册账号吗？':'开发者说明个人照片编辑在本机完成，无需注册应用账号。可选 iCloud 历史同步和网页搜索涉及联网服务；App Store 的“不收集数据”标签由开发者提供，未经 Apple 验证。',
   '怎样把 GIF 分享到微信并保留动画？':'先把原始 GIF 保存到“照片”，再在微信聊天中从“照片”选择发送。检查接收端实际播放的内容，不要只看缩略图。如果变成静态图，重新打开本地原文件，再与接收结果比较。'
  }
 }
};
export function updateGifProductPrivacy(html,file){
 const c=configs[file];if(!c||!html.includes(`rel="canonical" href="https://www.xiaozhonglvyou.com/${file}"`))throw new Error('Unexpected GIF product');
 const cn=file.endsWith('-cn.html');
 let found=false;
 html=html.replace(/<section\b[^>]*>.*?<\/section>/g,s=>{
  if(!s.includes('<h2>Your source media stays on your device.</h2>')&&!s.includes('<h2>原始素材留在你的设备上。</h2>')&&!s.includes('id="gifmaker-privacy-features"'))return s;
  found=true;return `<section class="section content-section" id="gifmaker-privacy-features"><div class="section-inner content-grid"><div>${c.section}</div><div class="content-list">${c.cards}</div></div></section>`;
 });if(!found)throw new Error('Missing GIF privacy section');
 html=html.replace(/(<p class="article-meta" data-gifmaker-languages="[^"]*">).*?(<\/p>)/,`$1${c.language}$2`);
 html=html.replace('GIFmaker-Gif Studio 提供动画实时预览、逐帧调速、文字、回旋循环和画布控制，整个过程都在 iPhone 本机完成。','GIFmaker 提供动画实时预览、逐帧调速、文字、回旋循环和画布控制。个人素材编辑在本机进行，另有可选 iCloud 同步和网页搜索。');
 html=html.replace('Current product facts were checked against the public App Store listing on October 2, 2026.','Feature and privacy descriptions were reviewed against the US App Store listing on October 29, 2026.');
 html=html.replace('页面信息已于 2026 年 9 月 23 日对照公开 App Store 页面核验。','功能、隐私和界面语言说明于 2026 年 10 月 29 日对照公开美国区 App Store 页面核对。');
 html=html.replace(/<p class="article-meta">(?:Version|版本).*?<\/p>/,s=>s.replace(/<time[^>]*>.*?<\/time>/,`<time datetime="2026-10-29">${cn?'2026年10月29日':'October 29, 2026'}</time>`));
 for(const[q,a]of Object.entries(c.answers)){const mark=`<summary>${q}</summary><p>`,i=html.indexOf(mark);if(i<0)throw new Error('Missing GIF FAQ');const end=html.indexOf('</p>',i);html=html.slice(0,i)+mark+a+html.slice(end);}
 return html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)(.*?)(<\/script>)/g,(_,o,j,e)=>{const v=JSON.parse(j);const visit=n=>{if(!n||typeof n!=='object')return;if(n['@type']==='WebPage')n.dateModified='2026-10-29';if(n['@type']==='Question'&&c.answers[n.name])n.acceptedAnswer.text=c.answers[n.name];Object.values(n).forEach(visit);};visit(v);return o+JSON.stringify(v)+e;});
}
if(process.argv[1]===fileURLToPath(import.meta.url))for(const f of Object.keys(configs)){const p=new URL('../'+f,import.meta.url),a=await readFile(p,'utf8'),b=updateGifProductPrivacy(a,f);if(a!==b)await writeFile(p,b);console.log(f+': '+(a!==b));}
