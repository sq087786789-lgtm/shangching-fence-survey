/* Google Drive keeps one case folder with staged, recoverable data revisions. OAuth tokens live only in memory. */
(function(root){
'use strict';
const FOLDER='application/vnd.google-apps.folder',MAX=15*1024*1024;
const newCaseId=()=> 'case-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
const id=value=>{if(!/^[a-zA-Z0-9_-]{1,150}$/.test(value||''))throw Error('雲端識別碼不正確');return value};
function caseFolderName(project={},now=new Date()){
 const clean=(v,fallback,max)=>String(v||fallback).trim().replace(/[\\/:*?"<>|\r\n]/g,'_').slice(0,max)||fallback;
 const stamp=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(now).replace(' ','_').replaceAll(':','-');
 return clean(project.client,'未填姓名',40)+'｜'+clean(project.address,'未填地點',70)+'｜'+stamp+'｜'+clean(project.name,'未命名案件',40);
}
function createStore({fetch:fetcher,getToken}){
 async function request(path,options={}){
  const token=getToken();if(!token)throw Error('請先登入 Google，登入逾時請重新連線');
  const response=await fetcher('https://www.googleapis.com/'+path,{...options,headers:{...options.headers,Authorization:'Bearer '+token}});
  if(!response.ok)throw Error(response.status===401?'Google 登入已逾時，請重新連線':response.status===403?'Google 尚未允許存取，請確認帳號、API 設定及重新選擇資料夾':response.status===412?'雲端已有較新的修改，請重新載入後再儲存，或另存新案':'雲端操作失敗（'+response.status+'），請檢查網路後重試');
  return response;
 }
 async function metadata(fileId){const response=await request('drive/v3/files/'+id(fileId)+'?fields=id,name,mimeType,size,trashed,parents,appProperties,capabilities(canAddChildren,canEdit)');const info=await response.json();info._etag=response.headers?.get?.('ETag')||'';return info;}
 async function createFolder(name,parent,extra={}){return (await request('drive/v3/files?fields=id,name',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,mimeType:FOLDER,parents:[id(parent)],...extra})})).json()}
 async function upload(name,parent,blob){
  const boundary='sq_'+Math.random().toString(36).slice(2)+Date.now();
  const metadata=JSON.stringify({name,parents:[id(parent)]});
  const body=new Blob(['--'+boundary+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+metadata+'\r\n--'+boundary+'\r\nContent-Type: '+blob.type+'\r\n\r\n',blob,'\r\n--'+boundary+'--']);
  return (await request('upload/drive/v3/files?uploadType=multipart&fields=id,name',{method:'POST',headers:{'Content-Type':'multipart/related; boundary='+boundary},body})).json();
 }
 function revisionOf(info){return info.appProperties?.sqCurrent||'legacy';}
 function caseReference(info,parent,revision=revisionOf(info)){return {parentId:id(parent),folderId:id(info.id),revisionId:id(revision)};}
 function checkCase(info,parent){if(info.trashed||info.mimeType!==FOLDER||info.appProperties?.sqKind!=='survey-case'||!info.parents?.includes(parent))throw Error('案件不在目前選取的資料夾，請重新選擇或另存新案');}
 async function patch(fileId,body,etag=''){return (await request('drive/v3/files/'+id(fileId)+'?fields=id,name',{method:'PATCH',headers:{'Content-Type':'application/json',...(etag?{'If-Match':etag}:{})},body:JSON.stringify(body)})).json();}
 async function findCase(parent,caseId){const q="'"+id(parent)+"' in parents and trashed = false and appProperties has { key='sqKind' and value='survey-case' } and appProperties has { key='sqComplete' and value='yes' } and appProperties has { key='sqCaseId' and value='"+id(caseId)+"' }";return (await (await request('drive/v3/files?'+new URLSearchParams({q,fields:'files(id)',pageSize:'2'}))).json()).files||[];}
 async function writeBundle(snapshot,folderId,progress){
  progress('保存完整勘查資料…');await upload('完整勘查資料.json',folderId,new Blob([JSON.stringify(snapshot,null,2)],{type:'application/json'}));
  const customerDesign=structuredClone(snapshot.design);customerDesign.edges=customerDesign.edges.map(({note,excavator,...edge})=>edge);
  progress('保存 3D 設計參數…');await upload('3D設計參數.json',folderId,new Blob([JSON.stringify(customerDesign,null,2)],{type:'application/json'}));
  const photos=snapshot.photos||[],imageFolder=await createFolder('勘場照片',folderId);
  for(const [index,p]of photos.entries()){const [head,encoded]=p.dataUrl.split(','),mime=head.slice(5,head.indexOf(';')),ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[mime],bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));progress('保存照片 '+(index+1)+' / '+photos.length+'…');await upload(String(index+1).padStart(2,'0')+'-'+p.id+'.'+ext,imageFolder.id,new Blob([bytes],{type:mime}));}
  await upload('照片說明.json',imageFolder.id,new Blob([JSON.stringify(photos.map(({dataUrl,...p})=>p),null,2)],{type:'application/json'}));
 }
 async function save(snapshot,parent,progress=()=>{},options={}){
  id(parent);if(new Blob([JSON.stringify(snapshot)]).size>MAX-1024)throw Error('完整案件接近或超過15MB，請先減少照片');
  for(const p of snapshot.photos||[])if(!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p.dataUrl||'')||p.dataUrl.length>480000)throw Error('照片資料不完整，請重新匯出檢查');
  const asNew=options.asNew===true,caseId=id(asNew?newCaseId():snapshot.caseId||newCaseId()),binding=asNew?null:snapshot.cloudCase;let folder,expected='legacy';
  if(binding){if(binding.parentId!==parent)throw Error('目前案件來自另一個雲端資料夾，請選回原資料夾，或按「另存新案」');folder=await metadata(binding.folderId);checkCase(folder,parent);if(!folder.capabilities?.canEdit||!folder.capabilities?.canAddChildren)throw Error('這個案件沒有修改權限，請另存新案');expected=id(binding.revisionId);if(revisionOf(folder)!==expected)throw Error('雲端已有較新的修改，請先載入最新案件，或另存新案');if(folder.appProperties.sqCaseId&&folder.appProperties.sqCaseId!==caseId)throw Error('案件識別不同，請重新載入或另存新案');}
  else {if(!asNew&&snapshot.caseId&&(await findCase(parent,caseId)).length)throw Error('雲端已有這個案件，請先載入最新案件，或按「另存新案」');folder=await createFolder(caseFolderName(snapshot.project),parent,{appProperties:{sqKind:'survey-case',sqComplete:'no',sqCaseId:caseId}});}
  try{const revision=await createFolder('資料版本_'+caseFolderName({},new Date()).split('｜')[2],folder.id,{appProperties:{sqKind:'survey-revision',sqComplete:'no',sqOwner:folder.id}}),reference=caseReference(folder,parent,revision.id),complete={...structuredClone(snapshot),caseId,cloudCase:reference};
   await writeBundle(complete,revision.id,progress);await patch(revision.id,{appProperties:{sqComplete:'yes'}});
   const current=await metadata(folder.id);checkCase(current,parent);if(binding&&revisionOf(current)!==expected)throw Error('儲存期間雲端又有新的修改，請載入最新案件後再儲存，或另存新案');
   progress(binding?'更新原案件…':'完成案件存檔…');await patch(folder.id,{modifiedTime:new Date().toISOString(),appProperties:{sqKind:'survey-case',sqComplete:'yes',sqCaseId:caseId,sqCurrent:revision.id,sqPrevious:binding?expected:null,sqUpdated:new Date().toISOString()}},current._etag);
   return {...folder,caseId,reference,currentFolderId:revision.id,updated:Boolean(binding)};
  }catch(error){throw Error(error.message+'。尚未確認本次更新完成，請重新載入雲端確認；本機與既有備份仍保留。');}
 }
 async function list(parent,pageToken=''){
  const q="'"+id(parent)+"' in parents and trashed = false and mimeType = '"+FOLDER+"' and appProperties has { key='sqKind' and value='survey-case' } and appProperties has { key='sqComplete' and value='yes' }";
  const query=new URLSearchParams({q,fields:'files(id,name,modifiedTime,appProperties),nextPageToken',pageSize:'100',orderBy:'modifiedTime desc'});if(pageToken)query.set('pageToken',pageToken);
  return (await request('drive/v3/files?'+query)).json();
 }
 async function readBundle(folderId){const q="'"+id(folderId)+"' in parents and trashed = false and name = '完整勘查資料.json'";const result=await (await request('drive/v3/files?'+new URLSearchParams({q,fields:'files(id,name,size)',pageSize:'2'}))).json();if(result.files?.length!==1)throw Error('找不到唯一的完整勘查資料，請選擇其他案件');return readFile(result.files[0]);}
 async function load(folderId,previous=false){const info=await metadata(folderId);if(info.trashed||info.mimeType!==FOLDER||info.appProperties?.sqKind!=='survey-case'||info.appProperties.sqComplete!=='yes')throw Error('這不是已完成的雲端案件');const parent=info.parents?.[0];if(!parent)throw Error('案件沒有可識別的上層資料夾');const current=revisionOf(info),source=previous?info.appProperties.sqPrevious:current;if(!source)throw Error('這個案件尚無上一版備份');if(source!=='legacy'){const revision=await metadata(source);if(revision.appProperties?.sqOwner!==info.id||revision.appProperties.sqComplete!=='yes'||!revision.parents?.includes(info.id))throw Error('雲端案件版本資料不完整，請重新載入');}
  const snapshot=await readBundle(source==='legacy'?info.id:source);return {...snapshot,caseId:info.appProperties.sqCaseId||snapshot.caseId||newCaseId(),cloudCase:caseReference(info,parent,current)};
 }
 async function readFile(file){
  if(Number(file.size)>MAX)throw Error('雲端案件超過15MB');
  const response=await request('drive/v3/files/'+id(file.id)+'?alt=media');
  const text=await response.text();if(new Blob([text]).size>MAX)throw Error('雲端案件超過15MB');return JSON.parse(text);
 }
 return {save,list,load,loadPrevious:folderId=>load(folderId,true),metadata,loadFile:async fileId=>readFile(await metadata(fileId))};
}
if(typeof module==='object'&&module.exports)module.exports={createStore,caseFolderName,newCaseId};
root.surveyDrive={start({snapshot,restore,getIdentity=()=>({}),saved=()=>true}){
 const $=key=>document.getElementById(key),config=root.SQ_DRIVE_CONFIG||{};
 let token='',expires=0,busy=false,folder=null,store=createStore({fetch:(...a)=>fetch(...a),getToken:()=>Date.now()<expires?token:''}),client;
 const message=text=>{$('driveMessage').textContent=text};
 const controls=()=>{for(const key of ['driveConnect','driveFolder','driveSave','driveSaveAs','driveLoad','driveImport','driveDisconnect'])$(key).disabled=busy||(key!=='driveConnect'&&!token);for(const key of ['driveSave','driveSaveAs','driveLoad'])$(key).disabled=busy||!token||!folder;const bound=getIdentity().cloudCase;$('driveSave').textContent=bound?'儲存變更／更新原案':'儲存完整案件至雲端';$('driveRestore').disabled=busy||!$('driveCases').options.length;$('driveMore').disabled=busy;$('drivePrevious').disabled=busy||!choices.find(x=>x.id===$('driveCases').value)?.appProperties?.sqPrevious;$('driveCaseStatus').textContent=folder&&bound&&bound.parentId!==folder.id?'此案在另一個雲端資料夾，請選回原資料夾，或按「另存新案」。':bound?'此案已連結雲端案件，儲存會更新原案。要複製另一案請按「另存新案」。':'此案尚未連結雲端，第一次儲存會建立專屬案件資料夾。';};
 root.surveyDrive.caseChanged=controls;
 const work=async fn=>{if(busy)return;busy=true;controls();try{await fn()}catch(error){message(error.message)}finally{busy=false;controls();syncPrevious()}};
 function script(src,ready){if(ready())return Promise.resolve();return new Promise((resolve,reject)=>{let el=document.querySelector('script[src="'+src+'"]');if(el)el.remove();el=document.createElement('script');el.src=src;el.onload=resolve;el.onerror=()=>{el.remove();reject(Error('Google 元件載入失敗，請檢查網路再重試'))};document.head.append(el)})}
 async function sdk(){
  if(!config.clientId||!config.apiKey||!config.appId)throw Error('Google 登入尚在設定，請先用完整 JSON 匯出備份');
  await Promise.all([script('https://accounts.google.com/gsi/client',()=>root.google?.accounts?.oauth2),script('https://apis.google.com/js/api.js',()=>root.gapi)]);
  if(!root.google?.picker)await new Promise((resolve,reject)=>root.gapi.load('picker',{callback:resolve,onerror:()=>reject(Error('Google 資料夾選擇器載入失敗'))}));
 }
 function chooseFile(folderOnly){return new Promise((resolve,reject)=>{
  if(Date.now()>=expires)return reject(Error('Google 登入已逾時，請重新連線'));
  const picker=root.google.picker,view=folderOnly?new picker.DocsView(picker.ViewId.FOLDERS).setIncludeFolders(true).setSelectFolderEnabled(true).setMimeTypes(FOLDER):new picker.DocsView(picker.ViewId.DOCS).setMimeTypes('application/json,text/plain');
  new picker.PickerBuilder().addView(view).setOAuthToken(token).setDeveloperKey(config.apiKey).setAppId(config.appId).setOrigin(location.origin).setTitle(folderOnly?'選擇「上慶圍籬勘查案件」資料夾':'選取完整勘查 JSON 檔案').setLocale('zh-TW').setCallback(event=>{
   if(event.action===picker.Action.PICKED)resolve(event.docs[0]);else if(event.action===picker.Action.CANCEL)resolve(null);
  }).build().setVisible(true);
 })}
 $('driveConnect').onclick=()=>work(async()=>{
  await sdk();
  await new Promise((resolve,reject)=>{
   client=root.google.accounts.oauth2.initTokenClient({client_id:config.clientId,scope:'https://www.googleapis.com/auth/drive.file',include_granted_scopes:false,
    callback:response=>{if(response.error)return reject(Error('Google 登入未完成，請重新連線'));if(!root.google.accounts.oauth2.hasGrantedAllScopes(response,'https://www.googleapis.com/auth/drive.file'))return reject(Error('需要允許選取案件檔案才能使用雲端功能'));token=response.access_token;expires=Date.now()+Number(response.expires_in)*1000-60000;resolve()},
    error_callback:()=>reject(Error('登入視窗已關閉或遭封鎖，請重新連線'))});client.requestAccessToken({prompt:'consent'});
  });
  folder=null;$('driveFolderName').textContent='尚未選擇資料夾';message('已連線 Google，請選擇「上慶圍籬勘查案件」資料夾。');
 });
 $('driveFolder').onclick=()=>work(async()=>{const selected=await chooseFile(true);if(!selected)return;const info=await store.metadata(selected.id);if(info.mimeType!==FOLDER||info.trashed||!info.capabilities?.canAddChildren)throw Error('請選擇可新增案件的資料夾');folder={id:info.id,name:info.name};$('driveFolderName').textContent=info.name;message('已選好資料夾。同一案儲存會更新原案件，備份保留在案件資料夾內。')});
 $('driveImport').onclick=()=>work(async()=>{const selected=await chooseFile(false);if(!selected)return;message('下載並驗證雲端 JSON…');await restore(await store.loadFile(selected.id));message('已載入雲端 JSON，原案件已備份為本機上一案。')});
 async function saveCurrent(asNew=false){message(asNew?'準備另存新案…':'準備完整案件與照片…');const current=await snapshot(),result=await store.save(current,folder.id,message,{asNew}),linked=saved(result,current.caseId);message((result.updated?'已更新原案件：':'已建立雲端案件：')+result.name+'。參數、3D資料與照片已存妥，備份保留在同案內。'+(linked===false?'目前畫面已切案，或瀏覽器未能記住連結；下次請從雲端載入此案。':''));const link=$('driveResult');link.href='https://drive.google.com/drive/folders/'+result.currentFolderId;link.hidden=false;link.textContent='查看此案件最新資料 ↗';}
 $('driveSave').onclick=()=>work(()=>saveCurrent(false));$('driveSaveAs').onclick=()=>work(()=>saveCurrent(true));
 let nextPage='',choices=[];
 function drawChoices(){const list=$('driveCases'),q=$('driveSearch').value.trim().toLocaleLowerCase();list.replaceChildren();for(const item of choices.filter(item=>item.name.toLocaleLowerCase().includes(q))){const option=document.createElement('option');option.value=item.id;option.textContent=item.name;list.append(option)}if(list.options.length)list.selectedIndex=0;$('driveRestore').disabled=!list.options.length;syncPrevious();$('driveSearchCount').textContent='符合 '+list.options.length+' / 已載入 '+choices.length+' 案；可搜尋姓名、地點或日期，較舊案件請載入更多。';}
 function syncPrevious(){const item=choices.find(x=>x.id===$('driveCases').value);$('drivePrevious').disabled=busy||!item?.appProperties?.sqPrevious;}
 $('driveCases').onchange=syncPrevious;$('driveSearch').oninput=drawChoices;
 async function refresh(more=false){message('讀取雲端案件清單…');const result=await store.list(folder.id,more?nextPage:'');choices=more?choices.concat(result.files||[]):result.files||[];nextPage=result.nextPageToken||'';drawChoices();$('driveMore').hidden=!nextPage;$('driveRestore').disabled=!$('driveCases').options.length;$('driveDialog').showModal();message(choices.length?'請選擇案件；預設載入最新資料，也可取回上一版。':'此資料夾尚無本網站完整儲存的案件。')}
 $('driveLoad').onclick=()=>work(()=>refresh());$('driveMore').onclick=()=>work(()=>refresh(true));
 async function loadChoice(previous=false){const selected=choices.find(item=>item.id===$('driveCases').value);if(!selected)throw Error('請先選擇案件');message(previous?'下載上一版備份…':'下載並驗證案件與照片…');const incoming=await (previous?store.loadPrevious(selected.id):store.load(selected.id));await restore(incoming);$('driveDialog').close();message('已載入'+(previous?'上一版備份':'最新資料')+'「'+selected.name+'」，原畫面案件已備份為本機上一案；接著儲存會更新同一案。');}
 $('driveRestore').onclick=()=>work(()=>loadChoice(false));$('drivePrevious').onclick=()=>work(()=>loadChoice(true));
 $('driveClose').onclick=()=>{if(!busy)$('driveDialog').close()};$('driveDialog').addEventListener('cancel',event=>{if(busy)event.preventDefault()});
 $('driveDisconnect').onclick=()=>{const previous=token;token='';expires=0;folder=null;choices=[];$('driveFolderName').textContent='尚未選擇資料夾';$('driveResult').hidden=true;controls();if(previous)root.google?.accounts?.oauth2.revoke(previous,()=>{});message('已中斷 Google 連線，本機案件仍保留。')};
 controls();message('雲端需連網並登入 Google。本機案件不會自動上傳。');
}};
})(typeof window==='undefined'?globalThis:window);
