/* Local photo references only. Images stay in the existing IndexedDB store. */
(function(root){
'use strict';
function items(design,selection='all'){
 const edges=design.edges||[],refs=Array.isArray(design.sitePhotoRefs)?design.sitePhotoRefs:[];
 return refs.slice(0,20).filter(p=>p&&typeof p.id==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(p.id)).map(p=>{
  const index=edges.findIndex(e=>e.id===p.segmentId),label=!p.segmentId?'全場／未指定路段':index<0?'原路段已刪除，請重新指定':'第 '+(index+1)+' 段'+(edges[index].style==='gate'?'大門':'圍籬');
  return{id:p.id,name:String(p.name||'勘場照片').slice(0,180),caption:String(p.caption||'').slice(0,500),segmentId:String(p.segmentId||''),index,label};
 }).filter(p=>selection==='all'||(selection==='unassigned'?!p.segmentId:p.segmentId===selection));
}
function mount(host,{read,onSelect}={}){
 if(!host)return null;
 const doc=host.ownerDocument,heading=doc.createElement('h3'),select=doc.createElement('select'),list=doc.createElement('div'),hint=doc.createElement('p');
 heading.textContent='勘場照片對照';select.setAttribute('aria-label','照片對應路段');list.className='scenePhotoList';hint.className='scenePhotoHint';hint.textContent='照片獨立顯示，不遮擋圍籬。點照片可放大。';host.replaceChildren(heading,select,hint,list);
 let current={edges:[]},selection='all',signature='',revision=0,dialog=null,lastSelected;
 function close(){const old=dialog;dialog=null;if(old){old.close();old.remove()}}
 function show(p,url){close();const opened=doc.createElement('dialog');dialog=opened;opened.className='scenePhotoDialog';opened.setAttribute('aria-label','勘場照片放大');const back=doc.createElement('button'),title=doc.createElement('h3'),image=doc.createElement('img'),note=doc.createElement('p');back.type='button';back.textContent='← 返回圖面';back.onclick=close;title.textContent=p.label;image.src=url;image.alt=p.name;note.textContent=p.caption;opened.append(back,title,image,note);opened.addEventListener('click',e=>{if(e.target===opened)close()});opened.addEventListener('close',()=>{opened.remove();if(dialog===opened)dialog=null},{once:true});doc.body.append(opened);opened.showModal();}
 async function render(){
  const rev=++revision,photos=items(current,selection);list.replaceChildren();
  if(!photos.length){const empty=doc.createElement('p');empty.textContent='此範圍尚無照片，請在勘查表的照片區加入並指定路段。';list.append(empty);return}
  await Promise.all(photos.map(async p=>{
   const card=doc.createElement('figure'),label=doc.createElement('figcaption'),button=doc.createElement('button'),image=doc.createElement('img'),note=doc.createElement('p');
   button.type='button';button.disabled=true;button.setAttribute('aria-label','放大 '+p.label+' '+p.name);image.alt=p.name;label.textContent=p.label;note.textContent=p.caption;button.append(image);card.append(label,button,note);list.append(card);
   try{const url=await read(p.id);if(rev!==revision)return;if(typeof url!=='string'||url.length>480000||!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(url))throw Error('missing');image.src=url;button.disabled=false;button.onclick=()=>show(p,url)}catch{if(rev===revision){image.alt='照片未在此裝置，請回勘查表載入含照片的完整案件';note.textContent=(p.caption?p.caption+'；':'')+'照片檔未載入'}}
  }));
 }
 select.onchange=()=>{selection=select.value;signature='';if(selection!=='all'&&selection!=='unassigned')onSelect?.(current.edges.findIndex(e=>e.id===selection));render()};
 return{update(design,selected){
  current=design;if(lastSelected!==undefined&&selected!==undefined&&selected!==lastSelected)selection=design.edges[selected]?.id||'all';lastSelected=selected;const next=JSON.stringify([design.edges.map(e=>[e.id,e.style]),design.sitePhotoRefs||[],selection]);if(next===signature)return;signature=next;
  const options=[['all','全部照片'],['unassigned','全場／未指定路段'],...design.edges.map((e,i)=>[e.id,'第 '+(i+1)+' 段'+(e.style==='gate'?'大門':'圍籬')]).filter(([id])=>id)];
  if(!options.some(([id])=>id===selection))selection='all';select.replaceChildren(...options.map(([value,text])=>{const o=doc.createElement('option');o.value=value;o.textContent=text;return o}));select.value=selection;host.hidden=!(design.sitePhotoRefs||[]).length;close();render();
 },selectSegment(id){selection=id||'all';signature='';this.update(current)},close};
}
const api={items,mount};if(typeof module==='object'&&module.exports)module.exports=api;else root.scenePhotoPanel=api;
})(typeof window==='object'?window:globalThis);
