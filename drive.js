/* Google Drive stores immutable case versions. OAuth tokens live only in memory. */
(function(root){
'use strict';
const FOLDER='application/vnd.google-apps.folder',MAX=15*1024*1024;
const id=value=>{if(!/^[a-zA-Z0-9_-]{1,150}$/.test(value||''))throw Error('雲端識別碼不正確');return value};
function createStore({fetch:fetcher,getToken}){
 async function request(path,options={}){
  const token=getToken();if(!token)throw Error('請先登入 Google，登入逾時請重新連線');
  const response=await fetcher('https://www.googleapis.com/'+path,{...options,headers:{...options.headers,Authorization:'Bearer '+token}});
  if(!response.ok)throw Error(response.status===401?'Google 登入已逾時，請重新連線':response.status===403?'Google 尚未允許存取，請確認帳號、API 設定及重新選擇資料夾':'雲端操作失敗（'+response.status+'），請檢查網路後重試');
  return response;
 }
 async function metadata(fileId){return (await request('drive/v3/files/'+id(fileId)+'?fields=id,name,mimeType,size,trashed,capabilities(canAddChildren)')).json()}
 async function createFolder(name,parent,extra={}){return (await request('drive/v3/files?fields=id,name',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,mimeType:FOLDER,parents:[id(parent)],...extra})})).json()}
 async function upload(name,parent,blob){
  const boundary='sq_'+Math.random().toString(36).slice(2)+Date.now();
  const metadata=JSON.stringify({name,parents:[id(parent)]});
  const body=new Blob(['--'+boundary+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+metadata+'\r\n--'+boundary+'\r\nContent-Type: '+blob.type+'\r\n\r\n',blob,'\r\n--'+boundary+'--']);
  return (await request('upload/drive/v3/files?uploadType=multipart&fields=id,name',{method:'POST',headers:{'Content-Type':'multipart/related; boundary='+boundary},body})).json();
 }
 async function save(snapshot,parent,progress=()=>{}){
  id(parent);const json=JSON.stringify(snapshot,null,2);if(new Blob([json]).size>MAX)throw Error('完整案件超過15MB，請先減少照片');
  const name=String(snapshot.project?.name||'未命名案件').slice(0,80)+' · '+new Date().toISOString().replace(/[:.]/g,'-');
  const folder=await createFolder(name,parent,{appProperties:{sqKind:'survey-case',sqComplete:'no'}});
  try{
   progress('保存完整勘查資料…');await upload('完整勘查資料.json',folder.id,new Blob([json],{type:'application/json'}));
   const customerDesign=structuredClone(snapshot.design);customerDesign.edges=customerDesign.edges.map(({note,excavator,...edge})=>edge);
   progress('保存 3D 設計參數…');await upload('3D設計參數.json',folder.id,new Blob([JSON.stringify(customerDesign,null,2)],{type:'application/json'}));
   const photos=snapshot.photos||[];
   if(photos.length){const imageFolder=await createFolder('勘場照片',folder.id);
    for(const [index,p]of photos.entries()){
     if(!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p.dataUrl||'')||p.dataUrl.length>480000)throw Error('照片資料不完整，請重新匯出檢查');
     const [head,encoded]=p.dataUrl.split(','),mime=head.slice(5,head.indexOf(';')),ext={"image/jpeg":"jpg","image/png":"png","image/webp":"webp"}[mime];
     const decoded=atob(encoded),bytes=Uint8Array.from(decoded,c=>c.charCodeAt(0));
     progress('保存照片 '+(index+1)+' / '+photos.length+'…');await upload(String(index+1).padStart(2,'0')+'-'+p.id+'.'+ext,imageFolder.id,new Blob([bytes],{type:mime}));
    }
    await upload('照片說明.json',imageFolder.id,new Blob([JSON.stringify(photos.map(({dataUrl,...p})=>p),null,2)],{type:'application/json'}));
   }
   await request('drive/v3/files/'+id(folder.id)+'?fields=id',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({appProperties:{sqKind:'survey-case',sqComplete:'yes'}})});
   return folder;
  }catch(error){throw Error(error.message+'。本次可能留下未完成的資料夾，舊案件未覆寫；請重新儲存新版本。')}
 }
 async function list(parent,pageToken=''){
  const q="'"+id(parent)+"' in parents and trashed = false and mimeType = '"+FOLDER+"' and appProperties has { key='sqKind' and value='survey-case' } and appProperties has { key='sqComplete' and value='yes' }";
  const query=new URLSearchParams({q,fields:'files(id,name,modifiedTime),nextPageToken',pageSize:'100',orderBy:'modifiedTime desc'});if(pageToken)query.set('pageToken',pageToken);
  return (await request('drive/v3/files?'+query)).json();
 }
 async function load(folderId){
  const q="'"+id(folderId)+"' in parents and trashed = false and name = '完整勘查資料.json'";
  const result=await (await request('drive/v3/files?'+new URLSearchParams({q,fields:'files(id,name,size)',pageSize:'2'}))).json();
  if(result.files?.length!==1)throw Error('找不到唯一的完整勘查資料，請選擇其他案件');
  return readFile(result.files[0]);
 }
 async function readFile(file){
  if(Number(file.size)>MAX)throw Error('雲端案件超過15MB');
  const response=await request('drive/v3/files/'+id(file.id)+'?alt=media');
  const text=await response.text();if(new Blob([text]).size>MAX)throw Error('雲端案件超過15MB');return JSON.parse(text);
 }
 return {save,list,load,metadata,loadFile:async fileId=>readFile(await metadata(fileId))};
}
if(typeof module==='object'&&module.exports)module.exports={createStore};
root.surveyDrive={start({snapshot,restore}){
 const $=key=>document.getElementById(key),config=root.SQ_DRIVE_CONFIG||{};
 let token='',expires=0,busy=false,folder=null,store=createStore({fetch:(...a)=>fetch(...a),getToken:()=>Date.now()<expires?token:''}),client;
 const message=text=>{$('driveMessage').textContent=text};
 const controls=()=>{for(const key of ['driveConnect','driveFolder','driveSave','driveLoad','driveImport','driveDisconnect'])$(key).disabled=busy||(key!=='driveConnect'&&!token);$('driveSave').disabled=busy||!token||!folder;$('driveLoad').disabled=busy||!token||!folder};
 const work=async fn=>{if(busy)return;busy=true;controls();try{await fn()}catch(error){message(error.message)}finally{busy=false;controls()}};
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
 $('driveFolder').onclick=()=>work(async()=>{const selected=await chooseFile(true);if(!selected)return;const info=await store.metadata(selected.id);if(info.mimeType!==FOLDER||info.trashed||!info.capabilities?.canAddChildren)throw Error('請選擇可新增案件的資料夾');folder={id:info.id,name:info.name};$('driveFolderName').textContent=info.name;message('已選好資料夾。儲存會新增一份含日期的版本，保留舊案件。')});
 $('driveImport').onclick=()=>work(async()=>{const selected=await chooseFile(false);if(!selected)return;message('下載並驗證雲端 JSON…');await restore(await store.loadFile(selected.id));message('已載入雲端 JSON，原案件已備份為本機上一案。')});
 $('driveSave').onclick=()=>work(async()=>{message('準備完整案件與照片…');const current=await snapshot();const saved=await store.save(current,folder.id,message);message('已儲存至「'+folder.name+'」：'+saved.name);const link=$('driveResult');link.href='https://drive.google.com/drive/folders/'+saved.id;link.hidden=false;link.textContent='查看本次案件資料夾 ↗'});
 let nextPage='',choices=[];
 async function refresh(more=false){message('讀取雲端案件清單…');const result=await store.list(folder.id,more?nextPage:'');choices=more?choices.concat(result.files||[]):result.files||[];nextPage=result.nextPageToken||'';const list=$('driveCases');list.replaceChildren();for(const item of choices){const option=document.createElement('option');option.value=item.id;option.textContent=item.name;list.append(option)}$('driveMore').hidden=!nextPage;$('driveRestore').disabled=!choices.length;$('driveDialog').showModal();message(choices.length?'請選擇要載入的案件版本。':'此資料夾尚無本網站完整儲存的案件。')}
 $('driveLoad').onclick=()=>work(()=>refresh());$('driveMore').onclick=()=>work(()=>refresh(true));
 $('driveRestore').onclick=()=>work(async()=>{const selected=choices.find(item=>item.id===$('driveCases').value);if(!selected)throw Error('請先選擇案件');message('下載並驗證案件與照片…');const incoming=await store.load(selected.id);await restore(incoming);$('driveDialog').close();message('已載入「'+selected.name+'」，原案件已備份為本機上一案。')});
 $('driveClose').onclick=()=>{if(!busy)$('driveDialog').close()};$('driveDialog').addEventListener('cancel',event=>{if(busy)event.preventDefault()});
 $('driveDisconnect').onclick=()=>{const previous=token;token='';expires=0;folder=null;choices=[];$('driveFolderName').textContent='尚未選擇資料夾';$('driveResult').hidden=true;controls();if(previous)root.google?.accounts?.oauth2.revoke(previous,()=>{});message('已中斷 Google 連線，本機案件仍保留。')};
 controls();message('雲端需連網並登入 Google。本機案件不會自動上傳。');
}};
})(typeof window==='undefined'?globalThis:window);
