/* Shared physical quantities for the survey, studio and customer reports. */
(function(root){
'use strict';
const names={through:'橫通管夾',tail:'尾管夾',ring:'環帽',link:'連結片',corner:'轉角配件'};
const length=(e,s)=>Math.hypot(s.nodes[e.b].x-s.nodes[e.a].x,s.nodes[e.b].z-s.nodes[e.a].z);
const spans=(L,p)=>Math.max(1,Math.ceil((L-1e-8)/p));
const stock=e=>e.railLength??3;
const active=e=>e.style!=='gate'&&!e.meshOnly&&!e.existing&&(e.railCount??2)>0;
const levels=e=>{const n=e.railCount??2;return n===1?[e.height-.025]:Array.from({length:n},(_,i)=>.05+(e.height-.075)*i/(n-1))};
function railGroups(s,specs=s.edges){
 const groups=new Map();
 s.edges.forEach((e,i)=>{
  if(!active(e))return;const spec=specs[i]||e,L=length(e,s),pipe=stock(e),dia=spec.railDia??null,wall=spec.railThickness??null;
  const rateKey='railPiece_'+[pipe,dia??'u',wall??'u'].map(v=>String(v).replaceAll('.','p')).join('_');
  if(!groups.has(rateKey))groups.set(rateKey,{rateKey,length:pipe,dia,thickness:wall,name:'橫桿（管長 '+pipe+'m）／Ø'+(dia??'待確認')+'mm／'+(wall==null?'厚度待確認':'厚'+wall+'mm'+(wall===1.4?' 亞管':wall===1.8?' 鍍鋅管':'')),qty:0,installedLength:0});
  const group=groups.get(rateKey);group.qty+=spans(L,e.spacing)*(e.railCount??2);group.installedLength+=L*(e.railCount??2);
 });
 return [...groups.values()];
}
function accessoryCount(s){
 const edges=s.edges.filter(active),points=new Map(),endpoints=[],adj=new Map();
 for(const e of edges)for(const i of [e.a,e.b]){const p=s.nodes[i];if(!endpoints.some(q=>Math.hypot(p.x-q.x,p.z-q.z)<=.005+1e-9))endpoints.push(p)}
 const key=p=>{const q=endpoints.find(q=>Math.hypot(p.x-q.x,p.z-q.z)<=.005+1e-9)||p;return q.x.toFixed(4)+','+q.z.toFixed(4)};
 function add(p,q,e,j){const k=key(p);if(!points.has(k))points.set(k,{p,arms:[]});const L=Math.hypot(q.x-p.x,q.z-p.z);points.get(k).arms.push({x:(q.x-p.x)/L,z:(q.z-p.z)/L,e,j})}
 edges.forEach((e,j)=>{const a=s.nodes[e.a],b=s.nodes[e.b],n=spans(length(e,s),e.spacing);add(a,b,e,j);add(b,a,e,j);for(let i=1;i<n;i++){const p={x:a.x+(b.x-a.x)*i/n,z:a.z+(b.z-a.z)*i/n};add(p,a,e,j);add(p,b,e,j)}for(const p of [a,b]){const k=key(p);if(!adj.has(k))adj.set(k,[]);adj.get(k).push(j)}});
 const opposite=(a,b)=>Math.abs(a.x*b.x+a.z*b.z+1)<1e-6;
 const kind=arms=>arms.length===1?'end':arms.length===2?(opposite(arms[0],arms[1])?'middle':'corner'):'junction';
 const auto={through:0,tail:0,ring:0,link:0,corner:0};let middle=0,ends=0,corners=0,junctionArms=0;
 for(const p of points.values()){
  const k=kind(p.arms);if(k==='middle')middle++;else if(k==='end')ends++;else if(k==='corner')corners++;else junctionArms+=p.arms.length;
  if(p.arms.some(a=>a.e.topFix==='ring'))auto.ring++;
  const rows=new Map();for(const arm of p.arms){const heights=levels(arm.e);heights.forEach((y,i)=>{const id=y.toFixed(5);if(!rows.has(id))rows.set(id,[]);rows.get(id).push({...arm,ring:arm.e.topFix==='ring'&&i===heights.length-1})})}
  for(const arms of rows.values()){const type=kind(arms);if(type==='middle'){if(!arms.some(a=>a.ring))auto.through++}else if(type==='end')auto.tail++;else if(type==='corner')auto.corner++;else auto.tail+=arms.length}
 }
 // Each span is one installed rail. A straight shared top joint needs a link too.
 const visited=new Set(),runs=[];edges.forEach((edge,j)=>{
  if(edge.topFix!=='ring'||visited.has(j))return;const queue=[j];let meters=0,pieces=0;
  while(queue.length){const i=queue.pop();if(visited.has(i))continue;visited.add(i);const e=edges[i];meters+=length(e,s);pieces+=spans(length(e,s),e.spacing);for(const p of [s.nodes[e.a],s.nodes[e.b]]){const k=key(p),node=points.get(k);if(kind(node.arms)!=='middle')continue;for(const next of adj.get(k)||[])if(!visited.has(next)&&edges[next].topFix==='ring'&&Math.abs(edges[next].height-e.height)<1e-5)queue.push(next)}}
  runs.push(meters);auto.link+=Math.max(0,pieces-1);
 });
 const adjustment=s.accessoryAdjustments||{};
 const items=Object.entries(names).map(([key,name])=>({key,name,unit:key==='corner'?'組':key==='link'?'片':'個',automatic:auto[key],adjustment:adjustment[key]||0,total:Math.max(0,auto[key]+(adjustment[key]||0))}));
 return{railCount:edges[0]?.railCount??0,topFix:edges.length?(edges.every(e=>e.topFix==='ring')?'環帽':edges.every(e=>e.topFix!=='ring')?'橫通管夾':'逐段設定'):'不適用',stockLength:edges.length&&edges.every(e=>stock(e)===stock(edges[0]))?stock(edges[0]):null,geometry:{posts:points.size,middle,ends,corners,junctionArms,straightRuns:runs},rules:'橫桿依各段跨數×排數計支，管長只供採購參考；中間柱每排1個橫通，起迄每排1個尾管夾，轉角每排1組取代管夾。環帽式頂排不計中間橫通，上橫桿每個管接頭1片連結片。門本體配件另計；只裝網、既有及無橫桿段排除。不同高度、分岔及混用固定方式請覆核。',items};
}
const api={railGroups,accessoryCount,names};if(typeof module==='object'&&module.exports)module.exports=api;else root.sqFenceMaterials=api;
})(globalThis);
