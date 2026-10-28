/* Shared CAD reference renderer used by the studio and confirmation reports. */
(function(root){
'use strict';
function create({length,outputEnabled,spanCount,railLevels,customerReport,accessoryCount}){
function cadEscape(t){return String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));}
function cadConnectionKind(s,e,end){const p=s.nodes[end==='a'?e.a:e.b],q=s.nodes[end==='a'?e.b:e.a],dx=q.x-p.x,dz=q.z-p.z;const neighbors=[];for(const other of s.edges){if(other===e||other.style==='gate')continue;for(const [i,j]of [[other.a,other.b],[other.b,other.a]]){const a=s.nodes[i],b=s.nodes[j];if(Math.hypot(a.x-p.x,a.z-p.z)<=.005+1e-9)neighbors.push({x:b.x-a.x,z:b.z-a.z});}}if(!neighbors.length)return 'tail';return neighbors.some(v=>Math.abs(dx*v.z-dz*v.x)>1e-6||dx*v.x+dz*v.z>0)?'corner':'through';}
function cadFittingSymbol(kind,x,y,scale=1){
 const path=d=>`<path d="${d}"/>`,rect=(x,y,w,h,r=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`,ellipse=(x,y,rx,ry)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`,bolt=(x,y)=>ellipse(x,y,4,4)+ellipse(x,y,1.8,1.8);
 const post=()=>rect(62,12,25,108)+ellipse(74.5,12,12.5,4)+path('M67 21V111');
 const horizontal=(left,right,cy)=>rect(left,cy-9,right-left,18)+ellipse(right,cy,3,9)+path(`M${left+2} ${cy-5}H${right-4}`);
 let body='';
 if(kind==='tail'){body=post()+horizontal(94,155,65)+path('M60 48Q53 65 60 82H91L96 77H116V53H96L91 48Z')+rect(62,51,25,28,3)+path('M64 55H84M64 75H84')+bolt(106,65)+rect(54,56,7,6)+rect(54,69,7,6);}
 if(kind==='through'){body=post()+horizontal(10,155,65)+path('M36 51H60Q74 42 89 51H130V79H89Q74 88 60 79H36Z')+rect(62,49,25,32,4)+path('M66 54H83M66 76H83')+bolt(47,65)+bolt(119,65);}
 if(kind==='ring'){body=rect(62,43,25,77)+ellipse(74.5,43,12.5,4)+horizontal(10,155,31)+path('M60 44V19Q60 7 75 7Q91 7 91 19V44M66 43V20Q66 13 75 13Q85 13 85 20V43')+path('M63 48H87M66 57V110');}
 if(kind==='link'){body=horizontal(10,155,65)+rect(53,53,45,24,6)+path('M57 55V75M75 53V77M94 55V75')+bolt(64,65)+bolt(87,65);}
 if(kind==='corner'){body=post()+rect(58,52,33,26,6)+path('M64 53L26 31L15 50L60 75M88 54L131 30L144 49L88 75')+ellipse(75,65,10,10)+bolt(75,65)+path('M24 33L61 54M139 47L89 75');}
 if(kind==='cap'){body=rect(53,66,43,54)+ellipse(74.5,66,21.5,6)+path('M52 48Q57 26 75 14Q93 26 97 48Q74 61 52 48ZM75 14L60 51M75 14L88 51')+rect(53,50,44,12,4)+path('M59 54V59M91 54V59M58 77V110');}
 if(kind==='band'){body=post()+path('M57 52Q75 46 91 53L120 69L114 83L89 74Q73 80 57 73Z')+path('M61 56Q74 52 86 57L114 72M61 69Q75 74 87 68L115 79')+bolt(111,75)+path('M121 66V83');}
 return `<g data-fitting="${kind}" transform="translate(${x} ${y}) scale(${scale})" fill="white" stroke="#111" stroke-width="1.2" stroke-linejoin="round">${body}</g>`;
}
function cadFittingCards(s,e,options,y){
 if(options.fittings===false||e.style==='gate')return {svg:'',height:0};
 const items=accessoryCount(s).items.filter(item=>item.total>0&&outputEnabled(s,'part-'+item.key));const names={tail:'尾管夾',through:'橫通管夾',ring:'環帽',link:'連結片',corner:'轉角配件',cap:'管帽',band:'束夾'};
 const kinds=items.map(item=>item.key);if((e.topFix!=='ring'||e.railCount===0)&&outputEnabled(s,'fitting-cap'))kinds.push('cap');if(outputEnabled(s,'fitting-band'))kinds.push('band');if(!kinds.length)return {svg:'',height:0};let svg=`<text class="label" x="45" y="${y}">C｜配件外觀參照與指引</text><text class="spec" x="45" y="${y+24}">外觀依提供的參考圖繪製，非配件製造尺寸；管帽與束夾不新增估算數量。</text>`;
 for(let i=0;i<kinds.length;i++){const kind=kinds[i],x=45+(i%3)*335,top=y+43+Math.floor(i/3)*220;svg+=`<rect x="${x}" y="${top}" width="320" height="204" fill="none" stroke="#bbb" stroke-width=".6"/><text class="label" x="${x+14}" y="${top+25}">${names[kind]}</text>`+cadFittingSymbol(kind,x+55,top+38,.9);
 const pipe=[];if(kind!=='link'&&outputEnabled(s,'postDia'))pipe.push('立柱外徑 Ø'+e.postDia+' mm');if(!['cap','band'].includes(kind)&&outputEnabled(s,'railDia'))pipe.push('橫桿外徑 Ø'+e.railDia+' mm');
 svg+=`<path class="dim" d="M${x+138} ${top+96}L${x+220} ${top+64}H${x+300}"/><text class="dimension" x="${x+213}" y="${top+58}">${names[kind]}</text>`;
 for(let j=0;j<pipe.length;j++)svg+=`<text class="spec" x="${x+14}" y="${top+174+j*18}">${pipe[j]}</text>`;
 }
 return {svg,height:48+Math.ceil(kinds.length/3)*220};
}

function cadSVG(s,index,options={front:true,plan:false,mesh:true}){
 options={...options,fittings:false};const e=s.edges[index];if(!e)throw Error('請先選取一段圍籬或大門');if(!options.front&&!options.plan)throw Error('請至少勾選一個參照面');
 const panels=[],parts=[],width=1100;let y=80;
 const line=(x1,y1,x2,y2,cls='outline')=>`<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
 const rect=(x,y,w,h,cls='outline')=>`<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
 const txt=(x,y,t,cls='label',anchor='start')=>`<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${cadEscape(t)}</text>`;
 function dimension(x1,y1,x2,y2,label){parts.push(line(x1,y1,x2,y2,'dim'));const dx=x2-x1,dy=y2-y1,n=Math.hypot(dx,dy);if(n<.001)return;const ux=dx/n,uy=dy/n;for(const [x,y,sign]of [[x1,y1,1],[x2,y2,-1]]){parts.push(line(x,y,x+sign*ux*8-uy*3,y+sign*uy*8+ux*3,'dim'),line(x,y,x+sign*ux*8+uy*3,y+sign*uy*8-ux*3,'dim'));}parts.push(txt((x1+x2)/2-uy*12,(y1+y2)/2-ux*10,label,'dimension','middle'));}
 const m=n=>Number(n.toFixed(3))+' m',burial=e.base==='plate'?0:e.depth,postLength=e.postLength??e.height+.04+burial,postTop=postLength-burial;
 const L=length(e,s),dims=outputEnabled(s,'diagramDims'),totalSpans=e.style==='gate'?1:spanCount(L,e.spacing),drawnSpans=e.style==='gate'||options.full?totalSpans:Math.min(2,totalSpans),isDetail=drawnSpans<totalSpans,frontL=e.style==='gate'||options.full?L:Math.min(L,drawnSpans*e.spacing);
 if(options.front){const top=y+45,scale=Math.min(870/(frontL+e.postDia/1000),205/(Math.max(e.height,postTop)+.08)),x=115+(870-frontL*scale)/2,ground=top+205,h=e.height*scale,postH=postTop*scale,r=e.postDia/1000*scale,n=drawnSpans,below=['buried','direct'].includes(e.base)?e.depth*scale:0;parts.push(txt(45,y,'A｜第 '+(index+1)+' 段'+(e.style==='gate'?(e.gateType==='sliding'?'推拉門正面（關閉參照）':e.gateType==='single'?'單開門正面（關閉參照）':'雙開門正面（關閉參照）'):(isDetail?'圍籬正面（局部 2 跨參照）':'圍籬正面'))));parts.push(line(x-30,ground,x+frontL*scale+30,ground,'ground'));
  for(let i=0;i<=n;i++){const px=x+frontL*scale*i/n;parts.push(`<rect data-post="above" class="outline" x="${px-r/2}" y="${ground-postH}" width="${r}" height="${postH}"/>`);if(e.base==='plate')parts.push(rect(px-(e.baseSize??15)/200*scale,ground-.012*scale,(e.baseSize??15)/100*scale,.012*scale));else parts.push(rect(px-r/2,ground,r,below,'hidden'));}
  const addMesh=(left,right,low,high)=>{if(options.mesh)parts.push(`<rect class="mesh" x="${left}" y="${high}" width="${Math.max(0,right-left)}" height="${Math.max(0,low-high)}"/>`);};
  if(e.style==='gate'){const gap=.03*scale,mid=x+frontL*scale/2,rr=e.railDia/1000*scale,bottom=ground-.08*scale,upper=ground-(e.height-.025)*scale;for(const [left,right]of (['single','sliding'].includes(e.gateType)?[[x+r/2+gap,x+frontL*scale-r/2-gap]]:[[x+r/2+gap,mid-.01*scale],[mid+.01*scale,x+frontL*scale-r/2-gap]])){addMesh(left,right,bottom,upper);parts.push(rect(left,upper,right-left,bottom-upper),rect(left+rr,upper+rr,Math.max(0,right-left-2*rr),Math.max(0,bottom-upper-2*rr)));if(e.brace)parts.push(line(left,bottom,right,upper));}}
  else {addMesh(x+r/2,x+frontL*scale-r/2,ground-.05*scale,ground-(e.height-.025)*scale);for(const level of railLevels(e)){const ry=ground-level*scale,rr=e.railDia/1000*scale;parts.push(rect(x+r/2,ry-rr/2,frontL*scale-r,rr));}}
  if(e.style!=='gate'){
   const shown=new Map();const levels=railLevels(e).filter(level=>level<=postTop+.001),endKind=cadConnectionKind(s,e,'a');
   function remember(kind,px,py){if(!shown.has(kind))shown.set(kind,{x:px,y:py});}
   for(let i=0;i<=n;i++){const px=x+frontL*scale*i/n,kind=i===0?endKind:i===n&&!isDetail?cadConnectionKind(s,e,'b'):'through';
    if(levels.length&&e.topFix==='ring'){const ry=ground-levels[levels.length-1]*scale,seat=Math.max(r*.65,5),rr=Math.max(e.railDia/1000*scale/2,3),strap=Math.max(r*.25,2.4);parts.push(`<g data-mounted="ring" fill="white" stroke="#111" stroke-width=".9"><path d="M${px-seat} ${ry+rr+1}V${ry+rr+7}Q${px} ${ry+rr+10} ${px+seat} ${ry+rr+7}V${ry+rr+1}Z"/><path d="M${px-strap} ${ry+rr+3}V${ry-rr-1}Q${px} ${ry-rr-5} ${px+strap} ${ry-rr-1}V${ry+rr+3}Z"/><path d="M${px-strap+1} ${ry+rr+2}V${ry-rr}Q${px} ${ry-rr-3} ${px+strap-1} ${ry-rr}V${ry+rr+2}"/></g>`);remember('ring',px,ry);}


    for(let j=0;j<levels.length;j++){if(j===levels.length-1&&e.topFix==='ring')continue;const ry=ground-levels[j]*scale;
     if(kind==='tail'||kind==='through'){const collar=Math.max(5,r*.65),arm=Math.max(11,r*1.8),hh=Math.max(4,e.railDia/1000*scale*.6),mirror=kind==='tail'&&i===n&&!isDetail?-1:1;
      const bolt=(bx)=>`<circle cx="${bx}" cy="0" r="1.7"/><circle cx="${bx}" cy="0" r=".65"/>`;
      const body=kind==='through'?`<path d="M${-arm} ${-hh}H${-collar}Q0 ${-hh-3} ${collar} ${-hh}H${arm}V${hh}H${collar}Q0 ${hh+3} ${-collar} ${hh}H${-arm}Z"/>`+bolt(-arm+3.5)+bolt(arm-3.5):`<path d="M${-collar} ${-hh-2}Q${-collar-3} 0 ${-collar} ${hh+2}H${collar}L${collar+3} ${hh}H${arm}V${-hh}H${collar+3}L${collar} ${-hh-2}Z"/>`+bolt(arm-3.5);
      parts.push(`<g data-mounted="${kind}" transform="translate(${px} ${ry}) scale(${mirror} 1)" fill="white" stroke="#111" stroke-width=".8" stroke-linejoin="round">${body}<rect x="${-collar}" y="${-hh-1}" width="${collar*2}" height="${hh*2+2}" rx="1"/><path d="M${-collar+1} ${-hh+1}H${collar-1}M${-collar+1} ${hh-1}H${collar-1}"/></g>`);remember(kind,px,ry);
     }else parts.push(rect(px-r*.65,ry-3,r*1.3,6));
    }

   }
   const clampNames={ring:'環帽',through:'橫通管夾',tail:'尾管夾'};for(const [kind,p]of shown){if(!clampNames[kind]||!outputEnabled(s,'part-'+kind))continue;const left=kind==='tail',tx=kind==='ring'?p.x+85:left?Math.max(145,x-50):Math.min(950,x+frontL*scale+40),ty=kind==='ring'?ground-h-30:ground-h*.22,midX=left?tx+10:tx-10;parts.push(`<path class="dim" d="M${p.x} ${p.y}L${midX} ${ty+8}H${tx}"/>`,txt(tx,ty,clampNames[kind],'dimension',left?'end':'start'));}
    if(dims&&outputEnabled(s,'postDia'))parts.push(txt(Math.max(150,x-90),ground-h*.55,'立柱 Ø'+e.postDia+' mm','dimension','end'));
    if(dims&&levels.length&&outputEnabled(s,'railDia'))parts.push(txt(Math.min(930,x+frontL*scale+90),ground-h*.55,'橫桿 Ø'+e.railDia+' mm','dimension'));
    if(dims&&e.base==='plate'&&outputEnabled(s,'baseSize'))parts.push(txt(Math.max(150,x-90),ground+18,'底板 '+(e.baseSize??15)+' × '+(e.baseSize??15)+' cm','dimension','end'));
   if(dims&&outputEnabled(s,'spacing')&&n<=4)for(let i=0;i<n;i++)dimension(x+frontL*scale*i/n,ground+below+63,x+frontL*scale*(i+1)/n,ground+below+63,'柱距 '+m(e.spacing));
  }

  if(dims&&outputEnabled(s,'length')&&(e.style==='gate'||options.full)){parts.push(line(x,ground+8,x,ground+below+42,'dim'),line(x+frontL*scale,ground+8,x+frontL*scale,ground+below+42,'dim'));dimension(x,ground+below+34,x+frontL*scale,ground+below+34,m(frontL)+' '+(e.style==='gate'?'門柱心':'全段總長'));if(e.style==='gate')parts.push(txt(x+frontL*scale/2,ground+below+60,'淨開口 '+Math.round((frontL-e.postDia/1000)*1000)+' mm','dimension','middle'));}
  if(dims&&['buried','direct'].includes(e.base)&&outputEnabled(s,'depth')){dimension(x-48,ground,x-48,ground+below,Number((e.depth*100).toFixed(2))+' cm 埋深');parts.push(txt(Math.min(930,x+frontL*scale+90),ground+below/2,'埋入固定','dimension'));}
  if(dims&&outputEnabled(s,'height'))dimension(x-48,ground,x-48,ground-h,'網高 '+m(e.height));if(dims&&outputEnabled(s,'postLength'))dimension(x+frontL*scale+55,ground+below,x+frontL*scale+55,ground-postH,'立柱總長 '+m(postLength));if(dims&&e.style!=='gate'&&outputEnabled(s,'spacing'))parts.push(txt(115,top+5,n+' 跨參照｜設定柱距 '+m(e.spacing)+'｜地上立柱 '+m(postTop),'dimension'));
  if(isDetail){const right=x+frontL*scale;parts.push(txt(right+25,ground-h/2,'⋯','label'));parts.push(txt(115,ground+below+85,'局部 '+drawnSpans+' 跨｜其餘 '+(totalSpans-drawnSpans)+' 跨續接'+(outputEnabled(s,'length')?'｜全段總長 '+m(L):''),'dimension'));}
  y+=355+below;panels.push('A');
 }
 if(options.plan){parts.push(txt(45,y,'B｜全案平面配置'));const planIndices=options.planIndices??s.edges.map((_,i)=>i);if(!planIndices.length||planIndices.some(i=>!Number.isInteger(i)||!s.edges[i]))throw Error('平面圖路段不正確');const used=[...new Set(planIndices.flatMap(i=>[s.edges[i].a,s.edges[i].b]))].map(i=>s.nodes[i]).concat(planIndices.flatMap(i=>{const e=s.edges[i];if(e.gateType!=='sliding')return [];const a=s.nodes[e.a],b=s.nodes[e.b],t=(e.slideOpen??0)/100*(e.direction??1);return [a,b].map(p=>({x:p.x+(b.x-a.x)*t,z:p.z+(b.z-a.z)*t}));})),xs=used.map(p=>p.x),zs=used.map(p=>p.z),minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs),scale=Math.min(870/Math.max(1,maxX-minX),200/Math.max(1,maxZ-minZ)),cx=(minX+maxX)/2,cz=(minZ+maxZ)/2,point=p=>({x:550+(p.x-cx)*scale,y:y+145+(p.z-cz)*scale});
  for(const i of planIndices){const edge=s.edges[i],a=point(s.nodes[edge.a]),b=point(s.nodes[edge.b]);parts.push(line(a.x,a.y,b.x,b.y,edge.style==='gate'?'hidden':'outline'));parts.push(txt((a.x+b.x)/2,(a.y+b.y)/2-9,'第 '+(i+1)+' 段'+(edge.style==='gate'?' 門':''),'dimension','middle'));if(dims&&outputEnabled(s,'length'))parts.push(txt((a.x+b.x)/2,(a.y+b.y)/2+21,m(length(edge,s)),'dimension','middle'));if(edge.style==='gate'&&edge.gateType==='sliding'){const start=s.nodes[edge.a],end=s.nodes[edge.b],t=(edge.slideOpen??0)/100*(edge.direction??1),p=point({x:start.x+(end.x-start.x)*t,z:start.z+(end.z-start.z)*t}),q=point({x:end.x+(end.x-start.x)*t,z:end.z+(end.z-start.z)*t});parts.push(line(p.x,p.y,q.x,q.y),txt((p.x+q.x)/2,(p.y+q.y)/2-25,'推拉門 '+(edge.slideOpen??0)+'%','dimension','middle'));}else if(edge.style==='gate'){const L=length(edge,s),ux=(s.nodes[edge.b].x-s.nodes[edge.a].x)/L,uz=(s.nodes[edge.b].z-s.nodes[edge.a].z)/L,leaf=(L-edge.postDia/1000-.08)/(edge.gateType==='single'?1:2),th=edge.angle*Math.PI/180;for(const [p,sign]of (edge.gateType==='single'?[[s.nodes[edge.a],1]]:[[s.nodes[edge.a],1],[s.nodes[edge.b],-1]])){const start=point(p),end=point({x:p.x+leaf*(ux*sign*Math.cos(th)-uz*Math.sin(th)*edge.direction),z:p.z+leaf*(uz*sign*Math.cos(th)+ux*Math.sin(th)*edge.direction)});parts.push(line(start.x,start.y,end.x,end.y));}}else if(options.postMarkers===true){const n=spanCount(length(edge,s),edge.spacing);for(let k=1;k<n;k++){const p=point({x:s.nodes[edge.a].x+(s.nodes[edge.b].x-s.nodes[edge.a].x)*k/n,z:s.nodes[edge.a].z+(s.nodes[edge.b].z-s.nodes[edge.a].z)*k/n});parts.push(`<circle class="outline" cx="${p.x}" cy="${p.y}" r="3"/>`);}}}
  if(options.postMarkers===true)for(const p of used){const q=point(p);parts.push(`<circle class="post" cx="${q.x}" cy="${q.y}" r="4"/>`);}y+=320;panels.push('B');
 }
 const fittingCards=cadFittingCards(s,e,options,y);parts.push(fittingCards.svg);y+=fittingCards.height;
 if(options.specifications!==false){const report=customerReport(s),row=report.rows[index]||[],specs=row.flatMap((v,i)=>v===''?[]:[report.columns[i]+'：'+v]);parts.push(txt(45,y+5,'選取段參照規格（依輸出項目勾選）'));y+=30;let text='';for(const piece of specs){if((text+piece).length>70){parts.push(txt(45,y,text,'spec'));y+=22;text='';}text+=(text?'｜':'')+piece;}if(text){parts.push(txt(45,y,text,'spec'));y+=25;}
 }
 parts.push(txt(45,y+20,'參照線稿｜長度 m／埋深 cm／管徑 mm｜各視圖自動適配，非固定比例｜菱形網與配件為示意，依確認圖面製作。','spec'));const height=y+70;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><title>${cadEscape(s.name)} 參照線稿</title><defs><pattern id="diamond" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M-8 0L8 16M0 -8L16 8M8 0L24 16M0 8L8 0M8 16L16 8" fill="none" stroke="#777" stroke-width=".4"/></pattern></defs><style>text{font-family:Microsoft JhengHei,Arial,sans-serif;fill:#111}.label{font-size:17px;font-weight:bold}.dimension{font-size:12px}.spec{font-size:12px}.outline{fill:none;stroke:#111;stroke-width:1.2}.ground{stroke:#555;stroke-width:.7}.dim{fill:none;stroke:#333;stroke-width:.6}.hidden{fill:none;stroke:#333;stroke-width:1;stroke-dasharray:6 4}.post{fill:white;stroke:#111;stroke-width:1.2}.mesh{fill:url(#diamond);stroke:none}</style><rect width="100%" height="100%" fill="white"/><rect x="20" y="20" width="1060" height="${height-40}" fill="none" stroke="#111"/>${txt(45,53,'上慶企業社｜'+(s.name||'圍籬提案').slice(0,40)+'｜參照線稿')}${parts.join('')}</svg>`;
}

return {cadSVG,cadConnectionKind,cadFittingSymbol};
}
if(typeof module==='object'&&module.exports)module.exports=create;
root.createFenceReference=create;
})(typeof window==='undefined'?globalThis:window);
