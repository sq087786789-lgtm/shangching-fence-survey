/* Compress exported pages only; original artwork and design data remain unchanged. */
(function(root){'use strict';
const maxWidth=1120,maxHeight=1584,quality=.78;
function encode(source){const scale=Math.min(1,maxWidth/source.width,maxHeight/source.height),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(source.width*scale));canvas.height=Math.max(1,Math.round(source.height*scale));const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(source,0,0,canvas.width,canvas.height);return{png:canvas.toDataURL('image/png'),jpeg:canvas.toDataURL('image/jpeg',quality),width:canvas.width,height:canvas.height,compressed:true};}
const bytes=url=>Uint8Array.from(atob(url.split(',')[1]),c=>c.charCodeAt(0));
function file(page,name){const result=new File([bytes(page.jpeg)],name+'.jpg',{type:'image/jpeg'});Object.defineProperty(result,'clipboardImage',{value:new File([bytes(page.png)],name+'.png',{type:'image/png'})});return result;}
const api={encode,file,bytes,maxWidth,maxHeight,quality};root.sqOutputCompression=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
