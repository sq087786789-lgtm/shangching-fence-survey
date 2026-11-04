'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync(__dirname+'/app.js','utf8');
const ctx={document:{getElementById:()=>({})},localStorage:{getItem:()=>null},structuredClone};
vm.createContext(ctx);vm.runInContext(source.slice(0,source.indexOf("document.addEventListener('change'"))+';globalThis.api={fresh,migrate,validate,design,quote,set:x=>data=x};',ctx);
const api=ctx.api,report=require('./confirmation.js'),panel=require('./scene-photos.js');
function fixture(){const s=api.fresh();s.project.phone='0900-000-001';s.project.phone2='08-000-0000';s.segments=[s.segments[0]];s.segments[0].length=10;s.pricing.extra=125;s.pricing.discount=300;api.set(s);return {...s,design:api.design(),quoteLines:api.quote().items,quoteSummary:api.quote()};}
let s=fixture(),before=JSON.stringify(s);assert.equal(s.quoteSummary.total,s.quoteSummary.net+s.quoteSummary.tax);
for(const audience of [true,'internal','quote']){
 const m=report.model(s,audience),html=report.build(s,audience);
 assert.ok(m.prices.includes('未稅金額 NT$ '+Math.round(s.quoteSummary.net).toLocaleString('zh-TW')));
 assert.ok(m.prices.includes('稅金（5%） NT$ '+s.quoteSummary.tax.toLocaleString('zh-TW')));
 assert.ok(m.prices.includes('含稅總額 NT$ '+Math.round(s.quoteSummary.total).toLocaleString('zh-TW')));
 assert.ok(html.includes(s.project.phone2));assert.ok(html.includes(s.project.phone));
}
assert.equal(report.model(s,'customer').prices.length,0);assert.ok(!report.build(s,'customer').includes('NT$'));
assert.equal(report.model(s,'quote').compact,true);assert.equal(report.model(s,'internal').compact,false);assert.equal(JSON.stringify(s),before);
const old=api.fresh();delete old.project.phone2;api.migrate(old);assert.equal(old.project.phone2,'');api.validate(old);old.project.phone2='x'.repeat(61);assert.throws(()=>api.validate(old));
s=fixture();s.pricing.tax=0;api.set(s);s.quoteSummary=api.quote();assert.equal(s.quoteSummary.tax,0);assert.ok(report.build(s,'quote').includes('稅金（0%） NT$ 0'));
s.pricing.discount=1e6;api.set(s);s.quoteSummary=api.quote();assert.equal(s.quoteSummary.net,0);assert.equal(s.quoteSummary.total,0);
s.project.phone2='<img onerror=bad>';assert.ok(!report.build(s,'quote').includes('<img onerror=bad>'));
const design={edges:[{id:'a',style:'clamp'},{id:'b',style:'gate'}],sitePhotoRefs:[{id:'one',name:'現場',caption:'<script>no</script>',segmentId:'a'},{id:'two',name:'門',segmentId:'b'},{id:'three',segmentId:''},{id:'four',segmentId:'deleted'},{id:'../invalid',segmentId:'a'}]};
assert.equal(panel.items(design).length,4);assert.deepEqual(panel.items(design,'a').map(p=>p.id),['one']);assert.equal(panel.items(design,'b')[0].label,'第 2 段大門');assert.equal(panel.items(design,'unassigned')[0].id,'three');assert.match(panel.items(design).at(-1).label,/已刪除/);
class El{
 constructor(tag,doc){this.tagName=tag;this.ownerDocument=doc;this.children=[];this.attributes={};this.events={};this.hidden=false;this.textContent='';}
 setAttribute(k,v){this.attributes[k]=v}append(...nodes){this.children.push(...nodes)}replaceChildren(...nodes){this.children=nodes}addEventListener(k,fn){this.events[k]=fn}remove(){this.removed=true}showModal(){this.open=true}close(){this.open=false;this.events.close?.()}
}
const doc={createElement(tag){return new El(tag,doc)}};doc.body=new El('body',doc);const host=new El('section',doc),reads=[],url='data:image/jpeg;base64,YQ==';let pending;
const ui=panel.mount(host,{read:async id=>{reads.push(id);if(id==='four')throw Error('missing');if(id==='slow')return new Promise(resolve=>pending=resolve);return url}});
const settle=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
 ui.update(design,0);await settle();assert.equal(host.hidden,false);const select=host.children[1],list=host.children[3];assert.equal(list.children.length,4);assert.deepEqual(reads,['one','two','three','four']);assert.match(list.children.at(-1).children[2].textContent,/未載入/);
 assert.equal(list.children[0].children[2].textContent,'<script>no</script>');list.children[0].children[1].onclick();assert.equal(doc.body.children.at(-1).open,true);doc.body.children.at(-1).children[0].onclick();assert.equal(doc.body.children.at(-1).removed,true);
 select.value='b';select.onchange();await settle();assert.equal(list.children.length,1);assert.equal(list.children[0].children[0].textContent,'第 2 段大門');
 ui.update(design,1);await settle();ui.update(design,0);await settle();assert.equal(select.value,'a');assert.equal(list.children.length,1);
 const stale={edges:[],sitePhotoRefs:[{id:'slow'}]};ui.update(stale,-1);await settle();const staleButton=list.children[0].children[1];ui.update({edges:[],sitePhotoRefs:[]},-1);pending(url);await settle();assert.equal(host.hidden,true);assert.equal(staleButton.disabled,true);
 const withPhotos=fixture();withPhotos.photos=[{id:'one',name:'測試',caption:'照片備註不得進客戶PDF',segmentId:withPhotos.segments[0].id,dataUrl:url}];api.set(withPhotos);const d=api.design();assert.equal(d.sitePhotoRefs[0].segmentId,d.edges[0].id);assert.ok(!JSON.stringify(d).includes(url));assert.ok(!report.build({...withPhotos,design:d},'quote').includes('照片備註不得進客戶PDF'));
 const html=fs.readFileSync(__dirname+'/studio.html','utf8');for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(match[1].trim())new vm.Script(match[1]);
 console.log('PASS quotation net/tax/gross, discounts/0% tax, secondary phone migration and escaping, unpriced customer isolation, photo segment labels/filter/read failures/stale loads/dialog return, photo-free report and design image exclusion, studio script syntax');
})().catch(e=>{console.error(e);process.exitCode=1});
