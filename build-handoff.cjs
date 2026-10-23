const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=__dirname;
const files=['index.html','app.js','style.css','studio.html','README.md','AI_README.md','AGENTS.md','test.cjs','build-handoff.cjs','ai.html','.nojekyll','.gitignore'];
const entries=files.map(file=>{const content=fs.readFileSync(path.join(root,file),'utf8');return {path:file,bytes:Buffer.byteLength(content),sha256:crypto.createHash('sha256').update(content).digest('hex'),content};});
fs.writeFileSync(path.join(root,'ai-source.json'),JSON.stringify({format:'sq-fence-source',version:1,files:entries},null,2));
fs.writeFileSync(path.join(root,'ai-manifest.json'),JSON.stringify({format:'sq-fence-source-manifest',version:1,entry:'index.html',handoff:'AI_README.md',source:'ai-source.json',repository:'https://github.com/sq087786789-lgtm/shangching-fence-survey',files:entries.map(({content,...x})=>({...x,url:x.path}))},null,2));
console.log('Generated '+entries.length+' source files and SHA-256 manifest');
