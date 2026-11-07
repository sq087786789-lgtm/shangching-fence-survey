'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),materials=require('./fence-materials.js'),report=require('./confirmation.js');
const source=fs.readFileSync(__dirname+'/app.js','utf8'),ctx={sqFenceMaterials:materials,document:{getElementById:()=>({})},localStorage:{getItem:()=>null},structuredClone};vm.createContext(ctx);
vm.runInContext(source.slice(0,source.indexOf("document.addEventListener('change'"))+';globalThis.api={fresh,blankDesign,insertSegment,design,lines,quote,estimate,migrate,validate,segmentSpecs,set:x=>data=x};',ctx);const api=ctx.api;
function single(L=12,n=2){const s=api.blankDesign();Object.assign(s.segments[0],{length:L,height:1.5,postLength:2,spacing:3,railCount:n,railLength:3});api.set(s);return s}
const part=(d,k)=>materials.accessoryCount(d).items.find(p=>p.key===k).total;
let s=single(),d=api.design(),groups=materials.railGroups(d,s.segments);assert.equal(groups[0].qty,8);assert.equal(api.estimate().rail,24);assert.equal(part(d,'through'),6);assert.equal(part(d,'tail'),4);assert.equal(part(d,'corner'),0);
const base=api.lines().filter(l=>l.key!=='rail'&&!l.key.startsWith('part_')).reduce((n,l)=>n+l.qty*l.rate,0);s.rates[groups[0].rateKey]=450;s.rates.part_through=50;s.rates.part_tail=25;
assert.equal(api.lines().find(l=>l.key==='rail').unit,'支');assert.equal(api.quote().subtotal,base+8*450+6*50+4*25);assert.equal(api.quote().tax,Math.round(api.quote().net*.05));assert.equal(s.rates.rail,100);
let snap={...s,design:api.design(),quoteLines:api.lines(),quoteSummary:api.quote()};const model=report.model(snap);assert.equal(model.materials.find(r=>r.name.startsWith('橫桿')).qty,8);assert.equal(model.materials.find(r=>r.name==='橫通管夾').qty,6);assert.ok(!report.build(snap).includes('NT$'));
s.segments[0].length=12.00000000001;assert.equal(materials.railGroups(api.design())[0].qty,8);s.segments[0].length=12.1;assert.equal(materials.railGroups(api.design())[0].qty,10);
s=single(1);api.insertSegment();s.segments[1].length=1;assert.equal(materials.railGroups(api.design())[0].qty,4,'round each segment and row, no leftover pooling');s.segments[1].railLength=6;assert.equal(materials.railGroups(api.design()).length,2);s.segments[1].railLength=3;s.segments[1].railDia=60.5;assert.equal(materials.railGroups(api.design()).length,2);
s=single();s.segments[0].topFix='ring';d=api.design();assert.equal(part(d,'through'),3);assert.equal(part(d,'tail'),4);assert.equal(part(d,'ring'),5);assert.equal(part(d,'link'),3);
s.segments[0].railCount=1;d=api.design();assert.equal(part(d,'through'),0);assert.equal(part(d,'tail'),2);assert.equal(part(d,'link'),3);
s=single(6);api.insertSegment();s.segments[1].length=6;d=api.design();assert.equal(materials.railGroups(d)[0].qty,8);assert.equal(part(d,'through'),6);assert.equal(part(d,'tail'),4,'shared straight support is not an extra end');s.segments.forEach(e=>e.topFix='ring');d=api.design();assert.equal(part(d,'ring'),5);assert.equal(part(d,'link'),3,'a joint between separately bought top pipes needs a connector');
s.segments.forEach(e=>e.topFix='through');s.segments[1].turn=90;d=api.design();assert.equal(part(d,'through'),4);assert.equal(part(d,'tail'),4);assert.equal(part(d,'corner'),2);s.segments[1].railCount=3;d=api.design();assert.equal(part(d,'through'),5);assert.equal(part(d,'tail'),6);assert.equal(part(d,'corner'),2);assert.equal(materials.railGroups(d)[0].qty,10);
for(const flag of ['existing','meshOnly']){s=single();s.segments[0][flag]=true;d=api.design();assert.equal(materials.railGroups(d).length,0);assert.ok(materials.accessoryCount(d).items.every(p=>p.total===0));assert.ok(!api.lines().some(l=>l.key.startsWith('part_')))}
s=single(12,0);d=api.design();assert.equal(materials.railGroups(d).length,0);assert.ok(materials.accessoryCount(d).items.every(p=>p.total===0));s.segments[0].type='gate';assert.equal(materials.railGroups(api.design()).length,0);
assert.equal(materials.accessoryCount({edges:[],nodes:[],accessoryAdjustments:{tail:2}}).items.find(p=>p.key==='tail').total,2,'retain explicit studio adjustments');
s=single();s.railPricing='length';const oldTotal=api.quote().total;const raw=JSON.parse(JSON.stringify(s));delete raw.railPricing;delete raw.segments[0].railLength;delete raw.segments[0].topFix;for(const k of Object.keys(raw.rates))if(k.startsWith('part_')||k==='railPiece')delete raw.rates[k];api.set(api.validate(api.migrate(raw)));assert.equal(raw.railPricing,'piece');assert.equal(raw.previousRailPricing,'length');assert.equal(api.quote().total,oldTotal);assert.equal(api.lines().find(l=>l.key==='rail').qty,8);raw.railPricing='piece';assert.equal(api.lines().find(l=>l.key==='rail').rate,0,'old 100/m is never silently reused as 100/piece');assert.equal(raw.rates.rail,100);
raw.segments[0].railLength=6;raw.segments[0].topFix='ring';const index=api.insertSegment();assert.equal(raw.segments[index].railLength,6);assert.equal(raw.segments[index].topFix,'ring');const restored=api.validate(api.migrate(JSON.parse(JSON.stringify(raw))));assert.equal(restored.segments[index].railLength,6);assert.equal(restored.railPricing,'piece');
for(const bad of [0,13,NaN]){const badCase=structuredClone(restored);badCase.segments[0].railLength=bad;assert.throws(()=>api.validate(badCase))}const badRows=structuredClone(restored);badRows.segments[0].railCount=1.5;assert.throws(()=>api.validate(badRows));
console.log('PASS span quantity 12/3×2=8, per-segment rounding and spec groups, fitting topology and mixed rows, ring/link counts, exclusions, explicit adjustments, unit prices/tax, legacy rates retained without meter-price reuse, JSON/first-segment inheritance and invalid lengths');

// Grouped customer information must preserve quantities and isolate gate/fence/accessory rows.
{const mixed=api.fresh();api.set(mixed);const snap={...mixed,design:api.design(),quoteLines:api.lines(),quoteSummary:api.quote()},before=JSON.stringify(snap),m=report.model(snap);assert.equal(JSON.stringify(snap),before);assert.deepEqual(m.materialSections.map(g=>g.key),['fence','gate','parts']);const all=m.materialSections.flatMap(g=>g.rows).map(r=>[r.name,r.qty,r.unit]).sort();assert.deepEqual(all,m.materials.map(r=>[r.name,r.qty,r.unit]).sort());const fence=m.materialSections.find(g=>g.key==='fence'),gate=m.materialSections.find(g=>g.key==='gate'),parts=m.materialSections.find(g=>g.key==='parts');assert.ok(gate.rows.some(r=>r.name.startsWith('門柱')));assert.ok(gate.rows.some(r=>r.name.includes('大門')));assert.ok(!fence.rows.some(r=>/門柱|門框|大門/.test(r.name)));assert.ok(parts.rows.some(r=>r.name==='橫通管夾'));assert.ok(gate.methods.every(v=>v.includes('／門柱')));assert.ok(fence.methods.every(v=>!v.includes('／門柱')));const html=report.build(snap);for(const title of ['圍籬資訊','大門資訊','配件資訊'])assert.ok(html.includes(title));assert.ok(html.includes('reportInfo'));console.log('PASS grouped fence/gate/accessory sections preserve quantities, method ownership and unchanged source');}


// Explicit cap and fixing selections drive estimated and adjusted quantities across the app.
{
 const job=single(12),segment=job.segments[0];
 Object.assign(segment,{spacing:2,meshFix:'band',postCap:'ring'});
 let d=api.design();
 assert.equal(part(d,'band'),45,'7 two-metre posts × 3 plus 12 two-metre rails × 2');
 assert.equal(part(d,'ring'),7);
 assert.equal(part(d,'link'),2);
 assert.equal(part(d,'through'),5,'only lower rails need middle through-clamps');
 for(const [metres,links] of [[2,1],[6,1],[6.01,2],[12,2]]){segment.length=metres;assert.equal(part(api.design(),'link'),links);}
 segment.length=12;
 job.accessoryAdjustments={band:-5,link:1};job.rates.part_band=8;
 d=api.design();
 assert.equal(part(d,'band'),40);assert.equal(part(d,'link'),3);
 assert.equal(api.lines().find(l=>l.key==='part_band').qty*8,320);
 const model=report.model({...job,design:d});
 assert.ok(model.methods.some(m=>m.includes('束夾固定')&&m.includes('環帽')));
 assert.equal(model.materials.find(m=>m.name==='結合片').qty,3);
 assert.match(report.build({...job,design:d}),/data-mounted="ring"/);
 assert.ok(api.segmentSpecs(segment).includes('菱形網固定工法'));
 const restored=api.validate(api.migrate(JSON.parse(JSON.stringify(job))));
 assert.equal(restored.accessoryAdjustments.band,-5);
 assert.equal(restored.segments[0].postCap,'ring');
 assert.throws(()=>api.validate({...job,accessoryAdjustments:{band:1.5}}));
 delete job.accessoryAdjustments;
 for(const [postCap,key] of [['rubber','rubberCap'],['galvanized','galvanizedCap']]){
  segment.postCap=postCap;d=api.design();
  assert.equal(part(d,key),7);assert.equal(part(d,'ring'),0);assert.equal(part(d,'link'),0);
  assert.match(report.build({...job,design:d}),new RegExp('data-mounted="'+postCap+'-cap"'));
 }
 segment.railCount=0;assert.equal(part(api.design(),'band'),21);assert.equal(part(api.design(),'galvanizedCap'),7);
 for(const meshFix of ['wire','plate']){segment.meshFix=meshFix;assert.equal(part(api.design(),'band'),0);}
 segment.meshFix='band';
 segment.existing=true;assert.equal(part(api.design(),'band'),0);assert.equal(part(api.design(),'galvanizedCap'),0);
 segment.existing=false;segment.meshOnly=true;assert.equal(part(api.design(),'band'),0);assert.equal(part(api.design(),'galvanizedCap'),0);
 console.log('PASS cap and mesh fixing presets, band and ring/link counts, manual adjustment, quote, JSON and CAD');
}
{
 const job=single(4);Object.assign(job.segments[0],{spacing:2,meshFix:'band',postCap:'ring'});api.insertSegment();
 const second=job.segments[1];second.length=4;
 assert.equal(second.postCap,'ring');assert.equal(second.meshFix,'band');
 assert.equal(part(api.design(),'ring'),5,'shared posts count once');
 assert.equal(part(api.design(),'band'),31,'shared post bands count once plus four spans with two rails');
 assert.equal(part(api.design(),'link'),2,'contiguous equal-height runs pool before rounding');
 second.length=2;assert.equal(part(api.design(),'link'),1);
 second.turn=90;assert.equal(part(api.design(),'link'),2,'corner splits the run');
 second.postCap='rubber';assert.equal(part(api.design(),'ring'),3);assert.equal(part(api.design(),'rubberCap'),1,'a shared post uses one cap, with ring taking priority');
}
