'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),materials=require('./fence-materials.js'),confirmation=require('./confirmation.js');
const source=fs.readFileSync(__dirname+'/app.js','utf8'),handlers={},messages=[];
const document={getElementById:()=>({querySelector:()=>({focus(){}}),addEventListener:(event,handler)=>handlers['segment-'+event]=handler}),addEventListener:(event,handler)=>handlers[event]=handler};
const c={document,localStorage:{getItem:()=>null},sqFenceMaterials:materials,structuredClone};vm.createContext(c);
vm.runInContext(source.slice(0,source.indexOf("document.addEventListener('change'"))+';globalThis.api={fresh,blankDesign,insertSegment,validate,migrate,design,quote,lines,gateOpeningValue,setGateOpening,setComponentStyle,setGateKind,segmentSpecs,componentStyleField,siteNoteRows,gateFinishFields,setSegmentHeading,segmentHeading,startDirectionField,set:x=>data=x,get:()=>data};render=()=>{};update=()=>{};notice=()=>{};',c);
vm.runInContext(source.split(/\r?\n/).find(line=>line.startsWith("document.addEventListener('change'")),c);
vm.runInContext(source.split(/\r?\n/).find(line=>line.startsWith("document.addEventListener('input'")),c);
vm.runInContext(source.split(/\r?\n/).find(line=>line.startsWith("$('segments').addEventListener('click'")),c);
const api=c.api,job=api.blankDesign();api.set(job);api.insertSegment('gate');const gate=job.segments[1],originalFence=JSON.stringify(job.segments[0]);
assert.equal(gate.gateOpening,4);assert.equal(gate.length,4.0891);assert.equal(gate.base,'buried');
function edit(key,value,pendingOpening=api.gateOpeningValue(gate)){
 const input={value:String(pendingOpening),validity:{valid:true}},box={dataset:{index:'1'},querySelector:selector=>selector==='input[data-key="gateOpening"]'?input:null};
 handlers.change({target:{dataset:{key},value:String(value),validity:{valid:true},closest:selector=>selector==='.segment'?box:null}});
 assert.equal(api.get(),job,'a valid edit must not silently roll back to another object');
}
for(const kind of ['single','double','sliding']){edit('componentStyle','gate-'+kind);assert.equal(gate.gate,kind);assert.equal(api.design().edges[1].gateType,kind);assert.equal(api.gateOpeningValue(gate),4);}
for(const diameter of [101,114,117.7,48.6,89.1]){edit('gatePostDia',diameter);assert.equal(api.gateOpeningValue(gate),4);assert.ok(Math.abs(gate.length-(4+diameter/1000))<1e-8);}
// A typed opening must survive a different control change even before a blur event fires.
edit('gatePostDia',114,4.5);assert.equal(api.gateOpeningValue(gate),4.5);edit('gateOpening',4);
edit('gatePostThickness',2.7);edit('gatePostKind','zinc-square');assert.equal(gate.gatePostThickness,2.7);assert.equal(gate.gatePostShape,'square');
edit('gateFrameKind','galv-round');edit('railDia',101);edit('railThickness',2.1);edit('gateFoundationNote','門柱基礎依現場確認 <保留>');
for(const [key,value]of [['gatePostThickness','2.9'],['railThickness','2.4'],['gateFoundationNote','未離開欄位也保留']])handlers.input({target:{tagName:key==='gateFoundationNote'?'TEXTAREA':'INPUT',type:key==='gateFoundationNote'?'textarea':'number',dataset:{key},value,validity:{valid:true},closest:()=>({dataset:{index:'1'}})}});
assert.equal(gate.gatePostThickness,2.9);assert.equal(gate.railThickness,2.4);assert.equal(gate.gateFoundationNote,'未離開欄位也保留');edit('gatePostThickness',2.7);edit('railThickness',2.1);edit('gateFoundationNote','門柱基礎依現場確認 <保留>');
assert.equal(JSON.stringify(job.segments[0]),originalFence);
let d=api.design(),edge=d.edges[1];assert.equal(edge.postShape,'square');assert.equal(edge.material,'zinc');assert.equal(edge.railShape,'round');assert.equal(edge.railMaterial,'galv');assert.equal(edge.railDia,101);assert.equal(edge.railThickness,2.1);assert.equal(edge.gateFoundationNote,gate.gateFoundationNote);assert.equal(edge.gateType,'sliding');
const fields=api.segmentSpecs(gate);assert.ok(fields.includes('門柱管材')&&fields.includes('門框種類')&&fields.includes('基礎工法備註'));assert.ok(!fields.includes('埋入深度')&&!fields.includes('value="direct"'));assert.ok(fields.includes('value="101"')&&fields.includes('value="114"'));assert.ok(fields.includes('data-key="railThickness"')&&fields.includes('data-pipe="railThickness"'));
const old=api.fresh(),legacy=old.segments.find(s=>s.type==='gate'),oldGeometry=legacy.length;api.migrate(old);assert.equal(legacy.length,oldGeometry);assert.ok(!Object.hasOwn(legacy,'gateOpening'));assert.ok(api.segmentSpecs(legacy).includes('原案工法（保留）'));
const roundTrip=api.validate(api.migrate(JSON.parse(JSON.stringify(job))));assert.equal(roundTrip.segments[1].gateOpening,4);assert.equal(roundTrip.segments[1].gatePostShape,'square');assert.equal(roundTrip.segments[1].gateFrameMaterial,'galv');
const bad=structuredClone(job);bad.segments[1].gatePostShape='triangle';assert.throws(()=>api.validate(bad));

const html=fs.readFileSync(__dirname+'/studio.html','utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const sc={document:{getElementById:()=>({getContext:()=>({})})},sqFenceMaterials:materials};vm.createContext(sc);
const names=['length','endpointShared','availableNode','detachEndpoint','moveSegmentEndpoint','resizeSegment'];
const functions=names.map(name=>script.match(new RegExp('^function '+name+'\\([^\\n]+','m'))[0]).join('\n');
vm.runInContext(script.slice(0,script.indexOf('try{const s=localStorage'))+functions+script.slice(script.indexOf('const meshNames='),script.indexOf('const {cadSVG'))+';globalThis.api={gatePaintColor,validate,setSegmentSpec,setGateKind,customerReport,exportDesign,length};',sc);
const studio=sc.api;studio.validate(d);const existingFence=JSON.stringify(d.edges[0]),gateIndex=1;
for(const diameter of [101,114,119.2]){studio.setSegmentSpec(d,gateIndex,'postDia',diameter);studio.validate(d);assert.ok(Math.abs(studio.length(edge,d)-edge.postDia/1000-4)<1e-7);}
studio.setGateKind(d,gateIndex,'post','galv-square');studio.setGateKind(d,gateIndex,'frame','zinc-square');assert.equal(edge.thickness,2.7);assert.equal(edge.railThickness,2.1);assert.equal(edge.railMaterial,'zinc');assert.equal(edge.postShape,'square');assert.equal(JSON.stringify(d.edges[0]),existingFence);
const table=studio.customerReport(d),items=table.displayRows[1];assert.ok(items.some(i=>i.key==='gatePostKind'&&i.value==='鍍鋅方管'));assert.ok(items.some(i=>i.key==='gateFrameKind'&&i.value==='亞方管'));assert.ok(items.some(i=>i.key==='gateWidth'&&i.value==='4 m'));assert.ok(items.some(i=>i.key==='gateFoundationNote'&&i.value===gate.gateFoundationNote));
const legacySteel=structuredClone(d);legacySteel.edges[1].material='steel';delete legacySteel.edges[1].railMaterial;studio.setGateKind(legacySteel,1,'frame','steel-square');assert.equal(legacySteel.edges[1].railMaterial,'steel');assert.equal(legacySteel.edges[1].railShape,'square');
const ref=require('./reference-drawing.js')({length:(e,s)=>studio.length(e,s),outputEnabled:()=>true,spanCount:()=>1,railLevels:()=>[],customerReport:s=>studio.customerReport(s),accessoryCount:()=>({items:[]})});
const groups=ref.specGroups(d,edge,items);assert.equal(groups.find(g=>g.title==='門柱').items[0].key,'gatePostKind');assert.equal(groups.find(g=>g.title==='門框').items[0].key,'gateFrameKind');assert.ok(ref.cadSVG(d,1).includes('門柱 □119.2 mm'));assert.ok(ref.cadSVG(d,1).includes('&lt;保留&gt;'));
const model=confirmation.model({...job,design:api.design()});assert.ok(model.materials.some(r=>r.name.startsWith('門柱 □114mm')&&r.name.includes('2.7mm 亞管')));assert.ok(model.materials.some(r=>r.name.startsWith('門框 Ø101mm')&&r.name.includes('2.1mm 鍍鋅管')));assert.ok(model.methods.some(r=>r.includes(gate.gateFoundationNote)));
const basic={...gate,gatePostThickness:1.4,railThickness:1.8,railDia:101};const basicFields=api.segmentSpecs(basic);assert.ok(basicFields.includes('data-custom-field="gatePostThickness" hidden'));assert.ok(basicFields.includes('data-custom-field="gatePostDia" hidden'));assert.ok(basicFields.includes('data-custom-field="railDia" hidden'));assert.ok(basicFields.includes('data-custom-field="railThickness" hidden'));assert.ok(!basicFields.includes('門框常用邊長')&&basicFields.includes('管材大小'));const styleField=api.componentStyleField(gate);assert.equal((styleField.match(/<option /g)||[]).length,3);assert.ok(styleField.includes('>單開</option>')&&styleField.includes('>雙開</option>'));
const manualNotes=job.notes;gate.note='側門留通行';let notes=api.siteNoteRows(job);assert.equal(notes.length,2);assert.ok(notes.some(row=>row.text===gate.gateFoundationNote));assert.equal(job.notes,manualNotes);gate.note='改為朝內開';notes=api.siteNoteRows(job);assert.ok(!notes.some(row=>row.text==='側門留通行'));gate.note='';assert.equal(api.siteNoteRows(job).length,1);
edit('gateFinish','paint');handlers.input({target:{tagName:'INPUT',type:'text',dataset:{key:'gateFinishColor'},value:'#1e5631',validity:{valid:true},closest:()=>({dataset:{index:'1'}})}});assert.equal(api.design().edges[1].gateFinishColor,'#1e5631');assert.equal(studio.gatePaintColor(api.design().edges[1]),'#1e5631');edit('gateFinish','none');assert.equal(gate.gateFinishColor,'#1e5631');assert.equal(studio.gatePaintColor(api.design().edges[1]),null);assert.ok(api.gateFinishFields(gate).includes('data-gate-color hidden'));edit('gateFinish','baked');assert.ok(!api.gateFinishFields(gate).includes('data-gate-color hidden'));const finishModel=confirmation.model({...job,design:api.design()});assert.ok(finishModel.materials.some(row=>row.name.includes('烤漆／#1e5631')));assert.equal(api.validate(api.migrate(JSON.parse(JSON.stringify(job)))).segments[1].gateFinishColor,'#1e5631');const invalidFinish=structuredClone(job);invalidFinish.segments[1].gateFinish='invalid';assert.throws(()=>api.validate(invalidFinish));
console.log('PASS gate-only styles, preset/custom visibility, derived note updates without mutation, coating modes/colors, 3D/report and JSON preservation');
console.log('PASS 4m gate opening preserved across types, post diameters, pending edits, JSON and studio transfer; independent round/square post/frame materials and custom thickness, foundation choices/notes, legacy geometry and escaped customer specs');

// Stainless can be specified independently and survives the survey-to-studio transfer.
{
 const stainless=api.blankDesign();api.set(stainless);api.insertSegment('gate');
 const fence=stainless.segments[0],wall=fence.postThickness;
 const editFence=(key,value)=>handlers.change({target:{dataset:{key},value,validity:{valid:true},closest:selector=>selector==='.segment'?{dataset:{index:'0'},querySelector:()=>null}:null}});
 editFence('meshMat','steel');editFence('postMaterialPreset','steel');editFence('railMaterial','steel');editFence('railThickness','1.8');
 assert.equal(fence.meshMat,'steel');assert.equal(fence.postMaterial,'steel');assert.equal(fence.postThickness,wall);assert.equal(fence.railMaterial,'steel');
 assert.ok(!api.segmentSpecs(fence).includes('1.8 mm 鍍鋅管</option></select>'));
 const door=stainless.segments[1];api.setGateKind(door,'post','steel-square');api.setGateKind(door,'frame','steel-round');
 door.gateFinish='none';
 assert.ok(api.segmentSpecs(door).includes('表面塗層'));
 api.insertSegment('fence');
 const ordinary=stainless.segments[2];assert.equal(ordinary.railMaterial,'steel');
 ordinary.railMaterial='galv';
 const design=api.design();studio.validate(design);api.validate(api.migrate(JSON.parse(JSON.stringify(stainless))));
 const report=studio.customerReport(design);
 for(const [i,key,value]of [[0,'railMaterial','不鏽鋼'],[1,'gatePostKind','不鏽鋼方管'],[1,'gateFrameKind','不鏽鋼圓管']]){
  assert.ok(report.displayRows[i].some(item=>item.key===key&&item.value===value),key);
 }
 const parts=materials.railGroups(design,stainless.segments);
 assert.equal(parts.length,2);assert.ok(parts.some(p=>p.name.includes('1.8mm 不鏽鋼')&&p.rateKey.endsWith('_steel')));
 assert.ok(parts.some(p=>p.name.includes('1.8mm 鍍鋅管')&&p.rateKey.endsWith('_galv')));
 const customer=confirmation.model({...stainless,design});
 assert.ok(customer.materials.some(row=>row.name.startsWith('不鏽鋼菱形網')));
 assert.ok(customer.materials.some(row=>row.name.startsWith('大門表面塗層')));
 assert.ok(customer.materials.some(row=>row.name.startsWith('門框 ')&&row.name.includes('不鏽鋼')));
 console.log('PASS stainless survey selection, thickness, 3D transfer, independent rail rates and customer specs');
}

// Every added fence uses screen directions while JSON continues to store relative turns.
{const route=api.blankDesign();route.segments[0].turn=90;api.set(route);api.insertSegment('fence',0);const idx=1,L=route.segments[idx].length;
function choose(heading){const button={dataset:{turn:String(heading),startDirection:String(heading)},closest:()=>({dataset:{index:String(idx)}})};handlers['segment-click']({target:{closest:selector=>selector==='[data-turn]'?button:null}});}
for(const [heading,dx,dz]of [[90,0,-L],[-90,0,L],[180,-L,0],[0,L,0]]){choose(heading);const d=api.design(),a=d.nodes[1],b=d.nodes[2];assert.ok(Math.abs(b.x-a.x-dx)<1e-7);assert.ok(Math.abs(b.z-a.z-dz)<1e-7);}
const box={dataset:{index:'1'},querySelector:()=>null};handlers.change({target:{dataset:{key:'heading'},value:'37.5',validity:{valid:true},closest:selector=>selector==='.segment'?box:null}});assert.ok(Math.abs(api.segmentHeading(1)-37.5)<1e-8);assert.ok(!Object.hasOwn(route.segments[1],'heading'));assert.ok(api.startDirectionField(route.segments[1],1).includes('其他第 2 段方向角度'));
const gateIndex=api.insertSegment('gate',1);assert.equal(route.segments[gateIndex].turn,0);const d=api.design(),p=d.nodes[1],q=d.nodes[2],end=d.nodes[3],u={x:q.x-p.x,z:q.z-p.z},v={x:end.x-q.x,z:end.z-q.z};assert.ok(Math.abs(u.x*v.z-u.z*v.x)<1e-6);assert.ok(u.x*v.x+u.z*v.z>0);
const converted={...route.segments[1],turn:135};api.setComponentStyle(converted,'gate-single');assert.equal(converted.turn,0);assert.equal(converted.angle,0);const legacy=structuredClone(route);legacy.segments[gateIndex].turn=-45;const restored=api.validate(api.migrate(JSON.parse(JSON.stringify(legacy))));assert.equal(restored.segments[gateIndex].turn,-45,'loading legacy geometry must not silently rotate it');console.log('PASS added-fence absolute direction clicks/custom input, relative JSON compatibility, gate alignment and legacy preservation');}


{
 const job=api.blankDesign();api.set(job);
 Object.assign(job.segments[0],{meshFix:'plate',postCap:'galvanized'});
 const plan=studio.validate(api.design()),row=studio.customerReport(plan).displayRows[0];
 assert.ok(row.some(item=>item.key==='meshFix'&&item.value==='白鐵片固定'));
 assert.ok(row.some(item=>item.key==='postCap'&&item.value==='鍍鋅管帽'));
 assert.throws(()=>studio.validate({...plan,edges:[{...plan.edges[0],postCap:'unknown'}]}));
 assert.match(html,/<select id="postCap">/);
 assert.match(html,/<select id="meshFix">/);
 console.log('PASS studio fitting method and cap controls, validation and output');
}
