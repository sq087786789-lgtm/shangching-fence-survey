const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=__dirname;
const materials=require('./fence-materials.js');
const confirmation=require('./confirmation.js');
const createRef=require('./reference-drawing.js');

// Load survey app.js helpers
let appSrc=fs.readFileSync(path.join(root,'app.js'),'utf8');
appSrc=appSrc.slice(0,appSrc.indexOf("document.addEventListener('change'"));
appSrc+='\n globalThis.api={fresh,design,estimate,lines,quote,validate,migrate,gateTopFillFields,segmentSummaryText,set:x=>data=x};';
const appCtx={sqFenceMaterials:materials,document:{getElementById:()=>({})},localStorage:{getItem:()=>null},structuredClone};
vm.createContext(appCtx);
vm.runInContext(appSrc,appCtx);
const app=appCtx.api;

// 1. 3m fence + 2m gate => auto overhead fill 1m (flush to 3m), unchanged BOM/quote
const survey=app.fresh();
survey.segments[0].height=3;
survey.segments[0].postLength=3.5;
survey.segments[1].height=3;
survey.segments[1].postLength=3.5;
survey.segments[2].height=2;
survey.segments[2].postLength=2.5; // above ground 2m < 3m
app.validate(survey);
app.set(survey);
const baseEstimate=app.estimate();
const baseQuote=app.quote().total;
const design=app.design();
const gateIndex=design.edges.findIndex(e=>e.style==='gate');
assert.ok(gateIndex>=0);

const autoFill=materials.gateTopFillInfo(design,design.edges[gateIndex]);
assert.ok(autoFill);
assert.equal(autoFill.mode,'auto');
assert.equal(autoFill.bottom,2);
assert.equal(autoFill.top,3);
assert.equal(autoFill.fillHeight,1);

// Summary & form UI in survey
const gateSeg=survey.segments[gateIndex];
assert.ok(app.gateTopFillFields(gateSeg,autoFill).includes('平高 3 m'));
assert.ok(app.segmentSummaryText(gateSeg,autoFill).includes('門上補網 1 m（平高 3 m）'));

// Verify BOM & pricing do not change when switching gateTopFill between auto / none / custom
survey.segments[gateIndex].gateTopFill='none';
app.validate(survey);
app.set(survey);
assert.deepEqual(app.estimate(),baseEstimate);
assert.equal(app.quote().total,baseQuote);
assert.equal(materials.gateTopFillInfo(app.design(),app.design().edges[gateIndex]),null);

survey.segments[gateIndex].gateTopFill='custom';
survey.segments[gateIndex].gateTopHeight=3.2;
app.validate(survey);
app.set(survey);
assert.deepEqual(app.estimate(),baseEstimate);
assert.equal(app.quote().total,baseQuote);
const customDesign=app.design();
const customFill=materials.gateTopFillInfo(customDesign,customDesign.edges[gateIndex]);
assert.deepEqual({mode:customFill.mode,bottom:customFill.bottom,top:customFill.top,fillHeight:customFill.fillHeight},{mode:'custom',bottom:2,top:3.2,fillHeight:1.2});

// Validation guards
assert.throws(()=>app.validate({...survey,segments:survey.segments.map((s,i)=>i===gateIndex?{...s,gateTopFill:'bad'}:s)}));
assert.throws(()=>app.validate({...survey,segments:survey.segments.map((s,i)=>i===gateIndex?{...s,gateTopHeight:0.2}:s)}));
assert.throws(()=>app.validate({...survey,segments:survey.segments.map((s,i)=>i===gateIndex?{...s,gateTopHeight:7}:s)}));

// JSON round-trip preserves gateTopFill & gateTopHeight
const roundTrip=app.validate(app.migrate(JSON.parse(JSON.stringify(survey))));
assert.equal(roundTrip.segments[gateIndex].gateTopFill,'custom');
assert.equal(roundTrip.segments[gateIndex].gateTopHeight,3.2);

// Equal height (1.8m fence + 1.8m gate) => no fill
const equalSurvey=app.fresh();
app.set(equalSurvey);
const equalDesign=app.design();
assert.equal(materials.gateTopFillInfo(equalDesign,equalDesign.edges.find(e=>e.style==='gate')),null);

// Existing gate => no auto fill
const existingGateDesign=structuredClone(design);
existingGateDesign.edges[gateIndex].existing=true;
assert.equal(materials.gateTopFillInfo(existingGateDesign,existingGateDesign.edges[gateIndex]),null);

// 2. Confirmation report & CAD SVG verification
delete survey.segments[gateIndex].gateTopFill;
delete survey.segments[gateIndex].gateTopHeight;
app.set(survey);
const autoDesign=app.design();
const snapshot={...survey,design:autoDesign,quoteLines:app.lines(),quoteSummary:app.quote()};
const reportModel=confirmation.model(snapshot);
assert.ok(reportModel.materials.some(r=>r.name.includes('門上補圍籬 1m，平高 3m')));
assert.ok(reportModel.notices.some(t=>t.includes('第 '+(gateIndex+1)+' 段：立柱地上長度低於圍籬／門高')));
const reportDrawings=confirmation.drawings(autoDesign);
const gateDrawing=reportDrawings.find(d=>d.svg.includes('雙開門正面'));
assert.ok(gateDrawing);
assert.ok(gateDrawing.svg.includes('data-gate-top-fill="mesh"'));
assert.ok(gateDrawing.svg.includes('data-gate-top-fill="rail"'));
assert.ok(gateDrawing.svg.includes('data-gate-top-fill="post-ext"'));
assert.ok(gateDrawing.svg.includes('門上補網 1 m'));
assert.ok(gateDrawing.svg.includes('門高 2 m｜門上補圍籬 1 m（平高 3 m）'));

// CAD SVG with gateTopFill = 'none' has no overhead fill
const noneDesign=structuredClone(autoDesign);
noneDesign.edges[gateIndex].gateTopFill='none';
const noneGateDrawing=confirmation.drawings(noneDesign).find(d=>d.svg.includes('雙開門正面'));
assert.ok(noneGateDrawing);
assert.ok(!noneGateDrawing.svg.includes('data-gate-top-fill='));

// 3. Studio 3D drawGateTopFill, spec output & top blank-design button
const studioHtml=fs.readFileSync(path.join(root,'studio.html'),'utf8');
const studioScript=studioHtml.match(/<script>([\s\S]*?)<\/script>/)[1];

// Verify #new is in <header> and NOT in <aside class="left">, and #mobileNewDesign is in .mobileStudioBar
const headerHtml=studioHtml.match(/<header>[\s\S]*?<\/header>/)[0];
const leftAsideHtml=studioHtml.match(/<aside class="left">[\s\S]*?<\/aside>/)[0];
const mobileBarHtml=studioHtml.match(/<nav class="mobileStudioBar"[^>]*>[\s\S]*?<\/nav>/)[0];
assert.ok(headerHtml.includes('id="new"'),'desktop header should contain #new button');
assert.ok(!leftAsideHtml.includes('id="new"'),'left sidebar should no longer contain #new button');
assert.ok(mobileBarHtml.includes('id="mobileNewDesign"'),'mobile top bar should contain #mobileNewDesign button');

// Verify createBlankDesign works from both #new and #mobileNewDesign and is undoable
const btnElements={};
let blankToasts=[],blankFitCalls=0,allowConfirm=true;
const blankCtx={
 document:{getElementById:id=>btnElements[id]??=(id==='scene'?{getContext:()=>({})}:{})},
 console,
 confirm:()=>allowConfirm,
 persist(){},sync(){},draw(){},
 fit(){blankFitCalls++;},
 toast(msg){blankToasts.push(msg);},
 sqFenceMaterials:materials
};
vm.createContext(blankCtx);
const blankSlice=studioScript.slice(0,studioScript.indexOf('try{const s=localStorage'))
 +'\nconst clone=o=>JSON.parse(JSON.stringify(o));'
 +'\n'+studioScript.match(/^function length\([^\n]+/m)[0]
 +'\n'+studioScript.match(/^function change\([^\n]+/m)[0]
 +'\n'+studioScript.match(/^function undo\([^\n]+/m)[0]
 +'\n'+studioScript.match(/^function createBlankDesign\([^\n]+/m)[0]
 +'\n'+studioScript.match(/\$\('new'\)\.onclick=[^\n]+/)[0];
vm.runInContext(blankSlice,blankCtx);
const initialCount=vm.runInContext('state.edges.length',blankCtx);
assert.ok(initialCount>0);
allowConfirm=false;
btnElements.new.onclick();
assert.equal(vm.runInContext('state.edges.length',blankCtx),initialCount,'cancel confirm should keep existing design');
allowConfirm=true;
btnElements.new.onclick();
assert.equal(vm.runInContext('state.edges.length',blankCtx),0);
assert.equal(vm.runInContext('state.nodes.length',blankCtx),0);
assert.equal(vm.runInContext('selected',blankCtx),-1);
assert.ok(blankToasts.at(-1).includes('已建立空白設計圖'));
assert.equal(blankFitCalls,1);
vm.runInContext('undo()',blankCtx);
assert.equal(vm.runInContext('state.edges.length',blankCtx),initialCount);
btnElements.mobileNewDesign.onclick();
assert.equal(vm.runInContext('state.edges.length',blankCtx),0);
assert.equal(blankFitCalls,2);

// Verify 3D drawGateTopFill draws mesh/rails between y=2 and y=3 independent of gate opening angle
const drawnMesh=[],drawnTubes=[];
const drawCtx={
 sqFenceMaterials:materials,
 document:{getElementById:()=>({getContext:()=>({})})},
 console,
 mesh:(a,b,bottom,top,e)=>drawnMesh.push({a,b,bottom,top,e}),
 tube:(a,b,r,mat,sq)=>drawnTubes.push({a,b,r,mat,sq})
};
vm.createContext(drawCtx);
vm.runInContext(
 studioScript.slice(0,studioScript.indexOf('try{const s=localStorage'))
 +'\n'+studioScript.match(/^function length\([^\n]+/m)[0]
 +'\n'+studioScript.match(/^const lift=[^\n]+/m)[0]
 +'\n'+studioScript.match(/^function drawGateTopFill\([^\n]+/m)[0]
 +'\nstate='+JSON.stringify(autoDesign)+';view="three";state.edges['+gateIndex+'].angle=60;drawGateTopFill(state.edges['+gateIndex+']);',
 drawCtx
);
assert.equal(drawnMesh.length,1);
assert.equal(drawnMesh[0].bottom,2);
assert.equal(drawnMesh[0].top,3);
assert.ok(drawnTubes.some(t=>t.a.y>=2&&t.a.y<=3&&Math.abs(t.a.y-t.b.y)<1e-6),'overhead rails should be drawn horizontally between 2m and 3m');
assert.ok(drawnTubes.some(t=>Math.abs(t.a.y-2)<0.01&&Math.abs(t.b.y-3)<0.01),'gate post visual extension should reach 3m when postAbove < 3m');

// 4. Verify swing gate opening mode uses 外開 (1) / 內開 (-1) (not 左側開 / 右側開) while preserving sliding labels & direction values
assert.ok(studioHtml.includes('<span id="directionLabel">開啟方式</span>'));
assert.ok(studioHtml.includes('<option value="1">外開</option><option value="-1">內開</option>'));
assert.ok(!studioHtml.includes('朝配置左側開')&&!studioHtml.includes('朝配置右側開'));
assert.ok(studioHtml.includes("e.gateType==='sliding'?'往 B 端推開':'外開'"));
assert.ok(studioHtml.includes("e.gateType==='sliding'?'往 A 端推開':'內開'"));
const fullAppSrc=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert.ok(fullAppSrc.includes("field('開啟方式','direction',s.direction??1,[[1,'外開'],[-1,'內開']])"));
const cadDialogHtml=studioHtml.match(/<dialog id="cadDialog">[\s\S]*?<\/dialog>/)[0];
assert.ok(cadDialogHtml.includes('id="cadFittings"'),'CAD dialog should include compact #cadFittings toggle');
assert.ok(!cadDialogHtml.includes('id="cadRailDia"'),'CAD dialog should replace #cadRailDia with #cadFittings');
assert.ok(!cadDialogHtml.includes('data-fitting-picker'),'CAD dialog should not render oversized standalone picker block');

console.log('PASS gate overhead flush fill (auto/none/custom, CAD/3D/confirmation/BOM preservation), top blank-design button, inward/outward gate labels and CAD fitting toggle');
