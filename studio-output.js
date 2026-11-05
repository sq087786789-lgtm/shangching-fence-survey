/* Local-only studio proposal pages. PNG sharing; PDF uses the native open/download route. */
(function(root){
'use strict';
function renderPages({scene,title,totals,rows},{createCanvas=()=>document.createElement('canvas')}={}){
 const W=1120,H=1584,M=62,pages=[];let canvas,ctx,y;
 function finish(){if(!canvas)return;ctx.fillStyle='#64748b';ctx.font='20px Microsoft JhengHei,system-ui,sans-serif';ctx.fillText('上慶企業社｜提案示意，製作尺寸依確認圖面。',M,H-62);ctx.fillText('第 '+(pages.length+1)+' 頁',W-155,H-32);pages.push(canvas);}
 function fresh(){finish();canvas=createCanvas();canvas.width=W;canvas.height=H;ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.fillStyle='#127565';ctx.fillRect(0,0,W,14);y=58;}
 function text(value,size=25,bold=false){const lines=[];ctx.font=(bold?'bold ':'')+size+'px Microsoft JhengHei,system-ui,sans-serif';for(const para of String(value).split('\n')){let line='';for(const ch of para){if(ctx.measureText(line+ch).width>W-M*2&&line){lines.push(line);line=ch;}else line+=ch;}lines.push(line);}for(const line of lines){if(y+size*1.5>H-115)fresh();ctx.font=(bold?'bold ':'')+size+'px Microsoft JhengHei,system-ui,sans-serif';ctx.fillStyle='#213547';ctx.fillText(line,M,y+size);y+=size*1.5;}}
 fresh();text('上慶企業社｜圍籬配置提案',28,true);text(title||'圍籬提案',34,true);text(new Date().toLocaleDateString('zh-TW'),20);y+=15;const sceneH=(W-M*2)*scene.height/scene.width;ctx.drawImage(scene,M,y,W-M*2,sceneH);y+=sceneH+24;text(totals,25,true);y+=15;text('材料規格與工法',28,true);for(const row of rows){text(row);y+=10;}finish();return pages;
}
async function lineworkPage(svg,{createCanvas=()=>document.createElement('canvas'),loadImage=url=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('線稿圖片轉換失敗'));img.src=url;})}={}){
 const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));
 try{const img=await loadImage(url);if(!(img.width>0&&img.height>0))throw Error('線稿尺寸無效');const page=createCanvas();page.width=2240;page.height=3168;const ctx=page.getContext('2d'),margin=48,scale=Math.min((page.width-margin*2)/img.width,(page.height-margin*2)/img.height),w=img.width*scale,h=img.height*scale;ctx.fillStyle='#fff';ctx.fillRect(0,0,page.width,page.height);ctx.drawImage(img,(page.width-w)/2,margin,w,h);return page;}
 finally{URL.revokeObjectURL(url);}
}
function fromDataURL(url,name,type){const bytes=Uint8Array.from(atob(url.split(',')[1]),c=>c.charCodeAt(0));return new File([bytes],name,{type});}
function start({capture,pdfFromJpegs,notice}){
 const $=id=>document.getElementById(id),dialog=$('studioOutputDialog');let files=[],pdf=null,urls=[],opener=null;
 const status=t=>$('studioOutputStatus').textContent=t;
 function clear(){for(const url of urls)URL.revokeObjectURL(url);urls=[];files=[];pdf=null;$('studioOutputPages').replaceChildren();}
 function download(file){const url=URL.createObjectURL(file),a=document.createElement('a');a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
 function prepare(button,source){try{source=source||capture();if(!source)return false;clear();const pages=source.pages||renderPages(source),name=String(source.title||'圍籬提案').replace(/[\\/:*?"<>|\x00-\x1f]/g,'_').slice(0,60)+'-'+(source.suffix||'配置提案');files=pages.map((p,i)=>fromDataURL(p.toDataURL('image/png'),name+'-'+(i+1)+'.png','image/png'));const jpegs=pages.map(p=>Uint8Array.from(atob(p.toDataURL('image/jpeg',.92).split(',')[1]),c=>c.charCodeAt(0)));pdf=new File([pdfFromJpegs(jpegs,pages[0].width,pages[0].height)],name+'.pdf',{type:'application/pdf'});
 files.forEach((file,i)=>{const url=URL.createObjectURL(file);urls.push(url);const figure=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption'),a=document.createElement('a');img.src=url;img.alt=(source.label||'圍籬配置提案')+'第 '+(i+1)+' 頁';a.href=url;a.download=file.name;a.textContent='下載第 '+(i+1)+' 頁圖片';caption.append(a);figure.append(img,caption);$('studioOutputPages').append(figure);});opener=button;$('studioOutputTitle').textContent=source.label||'客戶配置提案';$('studioOutputClose').textContent=source.returnLabel||'← 返回工作室';dialog.showModal();status('已產生 '+files.length+' 頁圖片與PDF。可分享圖片，或長按圖片儲存。');return true;
 }catch(e){clear();notice('出圖失敗，請再試一次：'+e.message);return false;}}
 async function shareImages(){if(!files.length)return;try{if(navigator.share&&navigator.canShare?.({files})){await navigator.share({files});status('已交由系統分享，請選擇LINE與收件人。');}else status('請長按圖片儲存，或點圖片下方下載，再從LINE附加傳送。');}catch(e){status(e.name==='AbortError'?'已取消分享，可再次分享或下載圖片。':'請長按圖片儲存，或下載圖片後從LINE附加傳送。');}}
 function savePdf(){if(!pdf)return;status('已下載 PDF。iPhone若顯示預覽，請點下方分享圖示，選「儲存到檔案」或 LINE。');download(pdf);}
 for(const id of ['studioPdf','mobileStudioPdf','studioOutputPdf'])$(id).textContent='儲存PDF';
 for(const id of ['image','mobileShareImage'])$(id).onclick=()=>{if(prepare($(id)))void shareImages();};
 for(const id of ['studioPdf','mobileStudioPdf'])$(id).onclick=()=>{if(prepare($(id)))savePdf();};
 $('studioOutputShare').onclick=shareImages;$('studioOutputPdf').onclick=savePdf;
 $('studioOutputClose').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{clear();opener?.focus({preventScroll:true});});
 return {openLinework(page,title,button,action){if(prepare(button,{pages:[page],title,label:'參照線稿',returnLabel:'← 返回參照線稿',suffix:'參照線稿'})){if(action==='pdf')savePdf();else void shareImages();}}};
}
if(typeof module==='object'&&module.exports)module.exports={renderPages,lineworkPage,fromDataURL,start};
root.studioOutput={renderPages,lineworkPage,start};
})(typeof window==='undefined'?globalThis:window);
