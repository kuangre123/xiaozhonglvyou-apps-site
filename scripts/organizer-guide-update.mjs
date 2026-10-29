import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { articleUpdateDate } from './article-update-date.mjs';
const file = 'ai-photo-organizer-guide.html';
const origin = 'https://www.xiaozhonglvyou.com/';
const description = 'Organize iPhone photos with Apple Photos or nine Pro AI categories. Follow five review steps, check free-use limits, and keep important photos before cleanup.';
const sources = ['https://support.apple.com/en-gb/guide/iphone/iph392d77d5f/ios','https://support.apple.com/en-ie/guide/iphone/iphee7aff030/ios'];
const freeAnswer = 'AI Cleaning is free to download. Nine AI classification categories require Pro. Free users get one successful in-app cleanup action across eligible tools, not one per screen; it can include multiple selected items. Further gated cleanup actions require Pro. Check your local App Store for current subscription prices.';
const privacyAnswer = "The developer says photo analysis runs on the iPhone and nothing is uploaded. The App Store privacy label reports Data Not Collected; Apple notes that this disclosure is developer-provided and has not been verified by Apple.";
const steps = [
['Install AI Cleaning - Photo Cleaner','Install the app if you need its review workflow. Nine AI classification categories require Pro; a free download does not unlock them. Check the free allowance and local subscription price before choosing.'],
['Grant photo library access','Choose the photo access you are comfortable granting. The app can review only the photos it can access; selected-photo access does not represent your whole library.'],
['Open AI smart classification','With Pro, review the nine categories: animals, plants, food, restaurants, group photos, documents, invoices, receipts, and ID cards. Check the results rather than treating a category as a deletion recommendation.'],
['Review memory and document categories','Inspect documents, receipts, ID cards, and meaningful memories before cleanup. Keep anything you need or cannot confidently identify.'],
['Identify cleanup candidates','Review duplicate, blurry, screenshot, and large-media groups individually. Similar photos can contain different details. Check what will be removed before confirming any cleanup.']
];
const section = `<section class="section content-section" id="organize-with-apple-photos"><div class="section-inner content-grid"><div><p class="section-kicker">Start with Photos</p><h2>Organize photos without installing another app.</h2><p>Use the built-in Photos app to find related pictures and group the ones you want to keep. Adding photos to an album organizes your view; it does not clear storage.</p><p>Need the app's nine categories? Continue to the <a href="#guided-workflow">five-step Pro classification workflow</a>. For storage recovery, use the <a href="iphone-storage-cleanup-guide.html#free-steps">free iPhone cleanup steps</a>.</p></div><div class="content-list"><div><strong>1. Find a small group</strong><p>Open Photos and use Search with a date, location, or person you have named. Start with one trip or event and review the results. Search results are a starting point, not a complete inventory of every relevant photo.</p></div><div><strong>2. Put keepers in an album</strong><p>Open a photo or video, tap More, choose Add to Album, and select the album you want. Repeat with the items you want together. Labels and control positions vary by iOS version.</p></div><div><strong>3. Review before cleanup</strong><p>Check that the album contains what you need. Removing an item from an album keeps it in the library; deleting it from the library is a different action. Follow the <a href="duplicate-photo-cleaner-guide.html#native-duplicates">duplicate merge instructions</a> if you want to review repeated items.</p></div></div><p>Apple instructions: <a href="${sources[0]}" target="_blank" rel="noopener noreferrer">search photos</a> and <a href="${sources[1]}" target="_blank" rel="noopener noreferrer">add or remove album items</a>. These steps do not require an AI Cleaning subscription.</p></div></section>`;
export function updateOrganizerGuide(html) {
 if (!html.includes(`rel="canonical" href="${origin}${file}"`)) throw new Error('Unexpected organizer canonical');
 html = html.replace(/(<meta\b[^>]*(?:name="description"|property="og:description"|name="twitter:description")[^>]*content=")[^"]*(")/g,`$1${description}$2`);
 html = html.replace(/<p class="hero-summary">.*?<\/p>/,'<p class="hero-summary">Start with Apple Photos search and albums, or follow the five-step AI Cleaning workflow. Its nine AI categories require Pro; review important photos before any cleanup.</p>');
 html = html.replace(/<div class="hero-actions" aria-label="AI photo organizer guide actions">.*?<\/div>/, actions => {
  const store = actions.match(/<a\b[^>]*data-store-product="ai-cleaning-photo-cleaner"[^>]*>.*?<\/a>/)?.[0];
  if (!store) throw new Error('Missing organizer store action');
  const secondary = store.replace('button button-primary','button button-secondary').replace(/aria-label="[^"]*"/,'aria-label="View AI Cleaning on the App Store (opens in a new tab)"').replace(/>[^<]*<\/a>$/, '>View AI Cleaning</a>');
  return `<div class="hero-actions" aria-label="AI photo organizer guide actions"><a class="button button-primary" href="#organize-with-apple-photos">Use Apple Photos first</a> <a class="button button-secondary" href="#guided-workflow">See Pro AI steps</a> ${secondary}</div>`;
 });
 html = html.replace(/<section\b[^>]*id="organize-with-apple-photos"[^>]*>.*?<\/section>/g,'');
 html = html.replace(/<section class="page-hero">.*?<\/section>/, hero => hero+section);
 steps.forEach(([name,text],i) => { html=html.replace(new RegExp(`<div id="step-${i+1}"><strong>.*?<\\/strong><p>.*?<\\/p><\\/div>`),`<div id="step-${i+1}"><strong>${i+1}. ${name}</strong><p>${text}</p></div>`); });
 for (const [q,a] of [['Is AI Cleaning free?',freeAnswer],['Does AI Cleaning upload photos for classification?',privacyAnswer]]) {
  const marker = `<summary>${q}</summary><p>`; const start=html.indexOf(marker);
  if(start<0) throw new Error('Missing organizer FAQ');
  const end=html.indexOf('</p>',start); html=html.slice(0,start)+marker+a+html.slice(end);
 }
 html=html.replace('Animals, plants, food, restaurants, group photos, and daily-life scenes.','Animals, plants, food, restaurants, and group photos.');
 const updated=articleUpdateDate(html,'2026-10-29'); html=updated.html;
 const wordCount=html.match(/<main\b[^>]*>(.*?)<\/main>/)[1].replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().split(/\s+/).length;
 return html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)(.*?)(<\/script>)/g,(_,open,json,close)=>{
  const node=JSON.parse(json);
  const visit=n=>{if(!n||typeof n!=='object')return;
   if(n['@type']==='Article'){n.description=description;n.dateModified=updated.date;n.wordCount=wordCount;n.citation=[...new Set([...(n.citation||[]),...sources])];}
   if(n['@type']==='HowTo'){delete n.totalTime;n.description='Five review steps using AI Cleaning Pro classification. Analysis and review time depend on your library.'; n.step=steps.map(([name,text],i)=>({'@type':'HowToStep',position:i+1,name,text,url:origin+file+'#step-'+(i+1)}));}
   if(n['@type']==='Question'&&n.name==='Is AI Cleaning free?')n.acceptedAnswer.text=freeAnswer;
   if(n['@type']==='Question'&&n.name==='Does AI Cleaning upload photos for classification?')n.acceptedAnswer.text=privacyAnswer;
   Object.values(n).forEach(visit);
  };visit(node);return open+JSON.stringify(node)+close;
 });
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const target=new URL('../'+file,import.meta.url);const before=await readFile(target,'utf8');const after=updateOrganizerGuide(before);if(after!==before)await writeFile(target,after);console.log('Organizer guide updated: '+(after!==before));
}
