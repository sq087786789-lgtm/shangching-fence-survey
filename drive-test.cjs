'use strict';
const assert=require('node:assert/strict'),{createStore,caseFolderName}=require('./drive.js');
assert.equal(caseFolderName({client:'王先生',address:'內埔鄉／農地',name:'東側圍籬'},new Date('2026-10-24T03:04:05Z')),'王先生｜內埔鄉／農地｜2026-10-24_11-04-05｜東側圍籬');
assert.match(caseFolderName({},new Date('2026-10-24T16:00:00Z')),/未填姓名｜未填地點｜2026-10-25_00-00-00｜未命名案件/);
(async()=>{
 const calls=[],uploads=[];let n=0,fail='',token='test-token';
 const fetch=async(url,options)=>{
  calls.push({url,options});assert.equal(options.headers.Authorization,'Bearer test-token');
  if(fail&&url.includes(fail))return {ok:false,status:503};
  if(url.includes('uploadType=multipart')){assert.match(options.headers['Content-Type'],/^multipart\/related/);const raw=await options.body.text(),boundary=options.headers['Content-Type'].split('boundary=')[1],parts=raw.split('--'+boundary);uploads.push({metadata:JSON.parse(parts[1].split('\r\n\r\n')[1].trim()),file:new Blob([parts[2].slice(parts[2].indexOf('\r\n\r\n')+4,-2)])});return {ok:true,json:async()=>({id:'file'+(++n)})}}
  if(options.method==='POST')return {ok:true,json:async()=>({id:'folder'+(++n),name:JSON.parse(options.body).name})};
  if(options.method==='PATCH')return {ok:true,json:async()=>({})};
  if(url.includes('alt=media'))return {ok:true,text:async()=>JSON.stringify({format:'sq-field-survey',photos:[{caption:'測試照片'}]})};
  return {ok:true,json:async()=>({files:[{id:'test-file',name:'完整勘查資料.json',size:'99'}],nextPageToken:'page2'})};
 };
 const store=createStore({fetch,getToken:()=>token});
 const snapshot={project:{name:'合成測試案件'},design:{edges:[{length:150,note:'內部備註',excavator:'需要怪手'}]},photos:[{id:'test-photo',caption:'測試照片',dataUrl:'data:image/jpeg;base64,/9j/'}]};
 const saved=await store.save(snapshot,'root-test');assert.ok(saved.id);assert.match(saved.name,/未填姓名｜未填地點｜.*｜合成測試案件/);
 assert.deepEqual(uploads.map(x=>x.metadata.name),['完整勘查資料.json','3D設計參數.json','01-test-photo.jpg','照片說明.json']);
 const restored=JSON.parse(await uploads[0].file.text());assert.equal(restored.photos[0].dataUrl,snapshot.photos[0].dataUrl);
 const design=JSON.parse(await uploads[1].file.text());assert.equal(design.edges[0].length,150);assert.equal(design.edges[0].note,undefined);assert.equal(design.edges[0].excavator,undefined);assert.equal(snapshot.design.edges[0].note,'內部備註');
 assert.equal(calls.at(-1).options.method,'PATCH');assert.equal(JSON.parse(calls.at(-1).options.body).appProperties.sqComplete,'yes');
 const before=calls.length;fail='uploadType';await assert.rejects(store.save(snapshot,'root-test'),/未完成/);assert.equal(calls.slice(before).some(x=>x.options.method==='PATCH'),false);fail='';
 await store.list('root-test','next-page');const query=new URL(calls.at(-1).url).searchParams;assert.match(query.get('q'),/sqComplete/);assert.match(query.get('q'),/root-test/);assert.equal(query.get('pageToken'),'next-page');
 assert.equal((await store.load('folder-test')).photos[0].caption,'測試照片');
 token='';await assert.rejects(store.list('root-test'),/登入/);await assert.rejects(store.list("bad' injection"),/識別碼/);
 console.log('PASS Drive: complete backup + 3D + separate photos; immutable versions; interrupted uploads excluded; pagination; load; expired login and invalid identifiers');
})().catch(error=>{console.error(error);process.exitCode=1});
