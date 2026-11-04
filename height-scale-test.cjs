'use strict';
const assert=require('assert/strict'),fs=require('fs'),vm=require('vm');
const renderer=require('./reference-drawing.js')({length:(e,s)=>Math.hypot(s.nodes[e.b].x-s.nodes[e.a].x,s.nodes[e.b].z-s.nodes[e.a].z),outputEnabled:()=>true,spanCount:(l,p)=>Math.ceil(l/p),railLevels:e=>e.railCount===0?[]:[.05,e.height-.025],customerReport:()=>({columns:[],rows:[]})});
const design={name:'合成比例測試',nodes:[{x:0,z:0},{x:8,z:0}],edges:[{a:0,b:1,style:'clamp',height:1.5,postLength:2,depth:.5,base:'direct',postDia:48.6,railDia:48.6,spacing:2,railCount:2,topFix:'through'}]};
const edge=design.edges[0],svg=()=>renderer.cadSVG(design,0,{front:true,plan:false,mesh:true,specifications:false});
function rect(source,tag){const match=source.match(new RegExp('<rect '+tag+'[^>]*>'));assert.ok(match,tag);return Object.fromEntries([...match[0].matchAll(/(x|y|width|height)="([\d.e+-]+)"/g)].map(m=>[m[1],Number(m[2])]))}
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const base=svg(),post=rect(base,'data-post="above"'),mesh=rect(base,'data-mesh="true"');close(post.height,mesh.height);close(post.y,mesh.y);
edge.postLength=2.5;let drawing=svg(),taller=rect(drawing,'data-post="above"'),sameMesh=rect(drawing,'data-mesh="true"');close(taller.height/post.height,2/1.5);close(sameMesh.height,mesh.height);close(taller.height/sameMesh.height,2/1.5);close(taller.y+taller.height,sameMesh.y+sameMesh.height);
edge.height=2;drawing=svg();close(rect(drawing,'data-mesh="true"').height/mesh.height,2/1.5);close(rect(drawing,'data-post="above"').height,taller.height);
edge.base='plate';drawing=svg();close(rect(drawing,'data-post="above"').height/rect(drawing,'data-mesh="true"').height,2.5/2);
edge.base='direct';edge.depth=.7;edge.height=2;edge.postLength=2;drawing=svg();close(rect(drawing,'data-post="above"').height/rect(drawing,'data-mesh="true"').height,1.3/2);
edge.postLength=10;drawing=svg();const extreme=rect(drawing,'data-post="above"'),frameHeight=Number(drawing.match(/height="([\d.]+)" viewBox/)[1]);assert.ok(extreme.y>80);assert.ok(extreme.y+extreme.height<frameHeight-60);close(extreme.height/rect(drawing,'data-mesh="true"').height,9.3/2);
// Exercise the actual studio draw functions with geometry capture, not a duplicate model.
const source=fs.readFileSync(__dirname+'/studio.html','utf8'),calls=[],scope={view:'three',lift:(p,y)=>({...p,y}),mesh:(a,b,low,top)=>calls.push({kind:'mesh',low,top}),tube:(a,b)=>calls.push({kind:'tube',a,b}),line:()=>{}};
vm.createContext(scope);for(const [start,end]of [['function railLevels(',"const defaults="],['function postAbove(','function validate('],['function panel(','function allPosts('],['function renderPost(','function mesh(']]){
 const a=source.indexOf(start);assert.ok(a>=0);let b=source.indexOf(end,a+start.length);if(start==='function railLevels(')b=source.indexOf('\n',a);if(start==='function renderPost(')b=source.indexOf('\n',a);assert.ok(b>a);vm.runInContext(source.slice(a,b),scope);
}
scope.e={...edge,height:1.5,postLength:2.5,depth:.5,material:'galv'};vm.runInContext('panel({x:0,z:0},{x:2,z:0},e);renderPost({x:0,z:0},e,false)',scope);
assert.equal(calls.find(c=>c.kind==='mesh').low,0);assert.equal(calls.find(c=>c.kind==='mesh').top,1.5);assert.ok(calls.some(c=>c.kind==='tube'&&c.a.y===0&&c.b.y===2));
console.log('PASS actual CAD/studio independent post and mesh proportions, stable normal scale, ground alignment, plate/burial, shorter posts and extreme fitting');
