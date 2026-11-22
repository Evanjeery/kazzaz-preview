/* TEMPORARY no-bird version: logo holds 10 s -> burns to ash/smoke -> gone 20 s -> flames rebuild the logo bottom to top. Previous bird version is in git history. Original header: phoenix (Phoenix by NORBERTO-3D, CC-BY 4.0, rendered sprite sheet) flies in -> fog -> logo (60 s) -> burns to ash -> phoenix rises, shakes off ash, flies away -> repeats 30 s later. Set scene deferred. */
(()=>{
const img=document.querySelector('.arch img');if(!img)return;
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;if(rm)return;
const cfg=Object.assign({hold:10,gap:20,speed:1,first:.4},window.__logoCfg||{});
const mob=innerWidth<820,rnd=(a,b)=>a+Math.random()*(b-a),cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ez=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,eo=t=>1-Math.pow(1-t,3);
const cv=document.createElement('canvas');cv.setAttribute('aria-hidden','true');cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:60;pointer-events:none';document.body.appendChild(cv);
const g=cv.getContext('2d');let W,H,D=Math.min(devicePixelRatio||1,mob?1.25:1.6);
const fit=()=>{W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D};fit();addEventListener('resize',fit);
img.style.transition='none';let ready=false,dead=false;const SP=new Image();SP.decoding='async';SP.onload=()=>{ready=true;img.style.opacity='0'};SP.onerror=()=>{dead=true;cv.remove()};ready=true;const NF=17,FW=360,FH=322,COLS=6;
/* logo shrink a little */
const SC=.84;img.style.transform='scale('+SC+')';
let on=true,vis=true;new IntersectionObserver(e=>{vis=e[0].isIntersecting},{threshold:0}).observe(img.parentElement);
document.addEventListener('visibilitychange',()=>{on=!document.hidden});
/* shapes */
const fg=(y0,y1)=>{const k=g.createLinearGradient(0,y0,0,y1);k.addColorStop(0,'#fafafa');k.addColorStop(1,'#8d8d8d');return k};
const feather=(len,wid)=>{g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(len*.5,-wid,len,0);g.quadraticCurveTo(len*.5,wid*.7,0,0);g.fill()};
function phoenix(x,y,s,f,rot,dir,a,glow){return;if(!ready||a<=.01)return;const fr=Math.floor(performance.now()/1000*22)%NF,k=s*.62;g.save();g.translate(x,y);g.rotate(rot);g.scale(-dir*k,k);g.globalAlpha=cl(a);g.drawImage(SP,(fr%COLS)*FW,((fr/COLS)|0)*FH,FW,FH,-FW/2,-FH/2,FW,FH);g.restore()}
function setFig(x,y,s,lift,a,dir=1){g.save();g.translate(x,y);g.scale(s*dir,s);g.globalAlpha=a;g.shadowColor='rgba(0,0,0,.95)';g.shadowBlur=18;g.shadowOffsetY=6;g.fillStyle=fg(-175,0);g.strokeStyle='#d9d9d9';
 const P=(pts)=>{g.beginPath();g.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)g.lineTo(pts[i],pts[i+1]);g.closePath();g.fill()};
 P([-12,0,-3,0,-1,-52,-12,-52]);P([3,0,22,0,18,-4,12,-52,0,-52]);/* legs, front foot forward */
 P([-14,-82,14,-82,19,-46,-19,-46]);/* kilt */P([-18,-120,18,-120,13,-82,-13,-82]);/* torso */
 P([-6,-120,6,-120,5,-130,-5,-130]);g.beginPath();g.arc(0,-134,11,0,7);g.fill();/* neck head */
 P([6,-139,30,-132,40,-122,38,-117,28,-122,8,-124]);/* long curved snout */
 P([-9,-141,-13,-168,-3,-170,-2,-142]);P([0,-142,0,-171,10,-169,7,-140]);/* square ears */
 P([-13,-78,-24,-92,-44,-116,-39,-120,-18,-102,-8,-84]);P([-13,-78,-26,-84,-38,-100,-34,-104,-20,-92]);/* forked tail */
 g.shadowBlur=6;g.lineCap='round';g.lineWidth=9;
 const hx=34,hy=-70-lift;g.beginPath();g.moveTo(8,-114);g.quadraticCurveTo(26,-104,hx,hy);g.stroke();/* arm */g.beginPath();g.moveTo(-8,-114);g.quadraticCurveTo(-16,-96,-4,-84);g.stroke();
 /* was sceptre */g.lineWidth=5;g.beginPath();g.moveTo(hx,hy+68);g.lineTo(hx,hy-88);g.stroke();g.lineWidth=4;g.beginPath();g.moveTo(hx,hy+68);g.lineTo(hx-7,hy+80);g.moveTo(hx,hy+68);g.lineTo(hx+7,hy+80);g.stroke();
 P2(hx,hy-88);function P2(px,py){g.beginPath();g.moveTo(px-4,py);g.lineTo(px-5,py-14);g.lineTo(px+7,py-13);g.lineTo(px+15,py-8);g.lineTo(px+7,py-5);g.lineTo(px+4,py);g.closePath();g.fill()}
 g.restore();return {tipX:34,tipY:80-70}}
/* particles */
const SM=[],FL=[],AS=[];let heap=0;
const smoke=(x,y,r,a,vx,vy,life)=>SM.push({x,y,r,a,vx,vy,t:0,life,gr:rnd(.6,1.4)});
function drawSmoke(dt){for(let i=SM.length-1;i>=0;i--){const p=SM[i];p.t+=dt;if(p.t>p.life){SM.splice(i,1);continue}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.985;const k=p.t/p.life,r=p.r*(1+k*p.gr),al=p.a*Math.sin(Math.PI*Math.min(1,k*1.15))*(1-k*.3);
 const gr=g.createRadialGradient(p.x,p.y,0,p.x,p.y,r);gr.addColorStop(0,'rgba(6,6,8,'+al+')');gr.addColorStop(.6,'rgba(10,10,12,'+al*.55+')');gr.addColorStop(1,'rgba(10,10,12,0)');g.fillStyle=gr;g.beginPath();g.arc(p.x,p.y,r,0,7);g.fill()}}
const FC=window.__fireColor!=='gray'?{o:'255,120,20',m:'255,190,70',c:'255,245,200'}:{o:'150,150,150',m:'215,215,215',c:'255,255,255'};
function drawFire(dt){g.globalCompositeOperation='lighter';for(let i=FL.length-1;i>=0;i--){const p=FL[i];p.t+=dt;if(p.t>p.life){FL.splice(i,1);continue}p.x+=p.vx*dt+Math.sin(p.t*9+p.ph)*16*dt;p.y+=p.vy*dt;const k=p.t/p.life,h=p.r*4.6*(1-k*.55),w=p.r*(1-k*.6)*.8,al=Math.sin(Math.PI*Math.min(1,k*1.1+.08))*.42;
 const sw=Math.sin(p.t*12+p.ph)*w*.6;
 const tongue=(ww,hh,col,a)=>{const gr=g.createLinearGradient(0,0,0,-hh);gr.addColorStop(0,'rgba('+col+','+a+')');gr.addColorStop(.6,'rgba('+col+','+a*.5+')');gr.addColorStop(1,'rgba('+col+',0)');g.fillStyle=gr;g.beginPath();g.moveTo(0,ww*.45);g.bezierCurveTo(-ww*1.7,ww*.3,-ww*1.1,-hh*.45,sw,-hh);g.bezierCurveTo(ww*1.1,-hh*.45,ww*1.7,ww*.3,0,ww*.45);g.closePath();g.fill()};
 g.save();g.translate(p.x,p.y);tongue(w*2.1,h*1.05,FC.o,al*.3);tongue(w*1.4,h,FC.o,al*.4);tongue(w,h*.8,FC.m,al*.6);tongue(w*.5,h*.5,FC.c,al*.8);g.restore()}g.globalCompositeOperation='source-over'}
function drawAsh(dt,gy){for(let i=AS.length-1;i>=0;i--){const p=AS[i];p.vy+=160*dt*p.m;p.x+=p.vx*dt+Math.sin(p.t*5+p.ph)*8*dt;p.y+=p.vy*dt;p.t+=dt;const gnd=gy-heapH(p.x-p.cx0)*.6;if(p.y>=gnd){if(p.land){heap=Math.min(heap+p.s*.5,260)}AS.splice(i,1);continue}g.fillStyle='rgba('+p.c+','+p.c+','+p.c+','+p.a+')';g.fillRect(p.x,p.y,p.s,p.s*.7)}}
let hcx=0,hs=1;const heapH=dx=>{const w=70*hs;return Math.max(0,(heap/260)*26*hs*(1-Math.min(1,Math.abs(dx)/w)))};
function drawHeap(cx,gy,a){return;if(heap<1)return;const h=(heap/260)*26*hs,w=70*hs;g.save();g.globalAlpha=a;const gr=g.createLinearGradient(0,gy-h,0,gy);gr.addColorStop(0,'#9a9a9a');gr.addColorStop(1,'#2b2b2b');g.fillStyle=gr;g.beginPath();g.moveTo(cx-w,gy);g.quadraticCurveTo(cx-w*.35,gy-h*1.5,cx,gy-h);g.quadraticCurveTo(cx+w*.35,gy-h*1.5,cx+w,gy);g.closePath();g.fill();g.restore()}
/* logo burn */
const oc=document.createElement('canvas'),oz=oc.getContext('2d',{willReadFrequently:true});let base=null,NZ=null,N=64;
const mkNoise=()=>{NZ=new Float32Array(N*N);let a=new Float32Array(N*N).map(()=>Math.random());for(let it=0;it<1;it++){const b=new Float32Array(N*N);for(let y=0;y<N;y++)for(let x=0;x<N;x++){let s=0;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)s+=a[((y+dy+N)%N)*N+((x+dx+N)%N)];b[y*N+x]=s/25}a=b}let lo=1,hi=0;a.forEach(v=>{lo=Math.min(lo,v);hi=Math.max(hi,v)});for(let i=0;i<N*N;i++)NZ[i]=(a[i]-lo)/(hi-lo)};
function prepBase(sz){oc.width=oc.height=sz;oz.clearRect(0,0,sz,sz);oz.drawImage(img,0,0,sz,sz);try{base=oz.getImageData(0,0,sz,sz)}catch(e){base=null}if(!NZ)mkNoise()}
function burnFrame(p,x0,y0,sz,dt,rev){/* p 0..1, x0/y0 top-left */ if(!base)return false;const out=oz.createImageData(sz,sz),s=base.data,o=out.data;const band=.16;let cnt=0;
 for(let y=0;y<sz;y++){const gy=y/sz;for(let x=0;x<sz;x++){const i=(y*sz+x)*4;if(s[i+3]<8)continue;const fx=x*N/sz,fy=y*N/sz,ix=fx|0,iy=fy|0,tx=fx-ix,ty=fy-iy,jx=(ix+1)%N,jy=(iy+1)%N,nv=(NZ[iy*N+ix]*(1-tx)+NZ[iy*N+jx]*tx)*(1-ty)+(NZ[jy*N+ix]*(1-tx)+NZ[jy*N+jx]*tx)*ty;const b=(rev?gy:1-gy)*.4+nv*.6;const th=p*(1+band+.05);
  if(b<th-band){/*burned*/continue}if(b<th){const k=(th-b)/band;const v=cl(235*(1-k)+25*k,0,255);o[i]=o[i+1]=o[i+2]=v;o[i+3]=s[i+3]*(1-k*k*.85);if(Math.random()<.003*60*dt&&cnt<14){cnt++;FL.push({x:cx+(x0+x-cx)*SC,y:cy+(y0+y-cy)*SC,vx:rnd(-12,12),vy:rnd(-70,-30),r:rnd(6,12)*sz/300*SC,t:0,life:rnd(.7,1.3),ph:rnd(0,6)});if(Math.random()<.5)AS.push({x:cx+(x0+x-cx)*SC,y:cy+(y0+y-cy)*SC,vx:rnd(-20,20),vy:rnd(-10,20),m:rnd(.5,1),s:rnd(1.5,3.2)*sz/300*SC,c:(120+Math.random()*110)|0,a:rnd(.6,1),t:0,ph:rnd(0,6),land:true,cx0:hcx})}}else{o[i]=s[i];o[i+1]=s[i+1];o[i+2]=s[i+2];o[i+3]=s[i+3]}}}
 oz.putImageData(out,0,0);g.drawImage(oc,x0,y0);return true}
/* timeline */
let ph='hold',pt=0,dir=1,seed=0;const T={fly:2.8,morph:1.0,rise:1.1,strike:.35,fog:3.2,burn:5.5,ret:5.5,emerge:2.0,shake:1.6,away:3.2};
let struck=false,fogDone=false,sz=300,cx=0,cy=0,gy=0,u=1,lastBurnP=0;
const rect=()=>{const r=img.getBoundingClientRect();sz=Math.round(r.width/SC*SC);cx=r.left+r.width/2;cy=r.top+r.height/2;u=r.width/(300*SC)/1;gy=cy+r.height*.52;return r};
window.__logo={get ph(){return ph},get t(){return pt},go(p,t){ph=p;pt=t||0;struck=false;fogDone=false}};
const setPh=(p)=>{ph=p;pt=0};
let last=performance.now();
function tick(now){requestAnimationFrame(tick);let rdt=Math.min(1,(now-last)/1000)*cfg.speed,dt=Math.min(.05,(now-last)/1000)*cfg.speed;last=now;if(!on)return;
 const r=rect();const viewable=vis;
 g.setTransform(D,0,0,D,0,0);g.clearRect(0,0,W,H);
 pt+=rdt;hcx=cx;hs=u*.9;
 const ux=u*1.25,S=u*1.2; /* figure scales */
 const hoverX=cx,hoverY=cy+8*u;
 if(dead)return;if(!ready){return}
 if(ph==='wait'){heap=Math.max(0,heap-dt*25);if(pt>=0){setPh('fog');struck=false;fogDone=false;heap=0;AS.length=0;img.style.opacity='0'}}
 else if(ph==='fly'){const k=eo(cl(pt/T.fly));const sx=dir>0?-160:W+160;const x=sx+(hoverX-sx)*k,yy=hoverY-(1-k)*cy*.6+Math.sin(pt*3)*8*(1-k)-Math.sin(k*Math.PI)*40*u;const f=Math.sin(pt*(10-6*k));phoenix(x,yy,ux*.95,f,-.1*(1-k)*dir,dir,1,0);if(pt>=T.fly){setPh('fog')}}
 else if(ph==='morph'){const k=cl(pt/T.morph);const f=Math.sin(pt*5)*.3;phoenix(hoverX,hoverY+Math.sin(pt*4)*3,ux*.95,f,0,dir,1-ez(cl(k*1.4)),k);setFig(hoverX-14*S,hoverY+88*S,S,0,ez(cl((k-.35)*1.6)),1);
  if(Math.random()<.9)smoke(hoverX+rnd(-40,40)*u,hoverY+rnd(-30,30)*u,rnd(25,50)*u,.5,rnd(-20,20),rnd(-20,5),rnd(.9,1.6));if(pt>=T.morph)setPh('rise')}
 else if(ph==='rise'){const k=ez(cl(pt/T.rise));setFig(hoverX-14*S,hoverY+88*S,S,k*46,1);if(pt>=T.rise)setPh('strike')}
 else if(ph==='strike'){const k=cl(pt/T.strike);const l=46*(1-k*k);setFig(hoverX-14*S,hoverY+88*S,S,l,1);if(k>=1&&!struck){struck=true;
   const gx=hoverX-14*S+34*S,gyy=hoverY+88*S;for(let i=0;i<(mob?26:44);i++)smoke(gx+rnd(-20,20)*u,gyy+rnd(-8,6)*u,rnd(35,90)*u,rnd(.55,.9),rnd(-140,140)*u,rnd(-110,-5)*u,rnd(2.4,3.8))}
  if(pt>=T.strike+.05)setPh('fog')}
 else if(ph==='fog'){const k=cl(pt/T.ret);if(!base)prepBase(Math.round(r.width/SC*SC));const s2=Math.round(r.width/SC*SC);const x1=cx-s2/2,y1=cy-s2/2;
  img.style.opacity='0';g.save();g.translate(cx,cy);g.scale(SC,SC);g.translate(-cx,-cy);const pp=1-1.25*k;if(!burnFrame(pp,x1,y1,s2,dt,true)){img.style.opacity=String(k)}g.restore();
  if(!base){for(let i=0;i<3;i++)FL.push({x:cx+rnd(-80,80)*u,y:cy+(.5-k)*160*u,vx:0,vy:-60,r:rnd(8,18)*u,t:0,life:.8,ph:rnd(0,6)})}
  if(pt>=T.ret){img.style.opacity='1';setPh('hold')}}
 else if(ph==='hold'){img.style.opacity='1';if(pt>=cfg.hold){prepBase(Math.round(r.width/SC*SC));setPh('burn');img.style.opacity='1'}}
 else if(ph==='burn'){const p=cl(pt/T.burn);const s2=Math.round(r.width/SC*SC);const x0=cx-r.width/2,y0=cy-r.height/2;/* draw burning logo at scaled size */
  img.style.opacity='0';g.save();g.translate(cx,cy);g.scale(SC,SC);g.translate(-cx,-cy);const x1=cx-s2/2,y1=cy-s2/2;if(!burnFrame(p,x1,y1,s2,dt)){img.style.opacity=String(1-p)}g.restore();
  if(!base){for(let i=0;i<3;i++)FL.push({x:cx+rnd(-80,80)*u,y:cy+(p-.5)*-160*u,vx:0,vy:-60,r:rnd(8,18)*u,t:0,life:.8,ph:rnd(0,6)})}
  if(pt>=T.burn){setPh('wait');pt=-cfg.gap;img.style.opacity='0';for(let i=0;i<(mob?10:18);i++)smoke(cx+rnd(-60,60)*u,cy+rnd(-40,60)*u,rnd(40,80)*u,rnd(.5,.8),rnd(-50,50)*u,rnd(-60,-10)*u,rnd(2.2,3.6))}}
 else if(ph==='emerge'){const k=ez(cl(pt/T.emerge));const px=cx,py=gy-8*u-k*70*u;if(Math.random()<.6)AS.push({x:px+rnd(-30,30)*u*k,y:py+rnd(-20,10)*u,vx:rnd(-30,30),vy:rnd(-20,10),m:1,s:rnd(1.5,3)*u,c:(110+Math.random()*100)|0,a:.9,t:0,ph:rnd(0,6),land:false,cx0:hcx});
  heap=Math.max(0,heap-dt*18);phoenix(px,py,ux*.95*(.25+.75*k),Math.sin(pt*3)*.3*k,0,dir,k,0);if(pt>=T.emerge)setPh('shake')}
 else if(ph==='shake'){const px=cx,py=gy-78*u;const rt=Math.sin(pt*18)*.1*(1-pt/T.shake);if(Math.random()<.9)AS.push({x:px+rnd(-50,50)*u,y:py+rnd(-30,30)*u,vx:rnd(-80,80)*u,vy:rnd(-30,10),m:1,s:rnd(1.5,3.5)*u,c:(120+Math.random()*110)|0,a:.9,t:0,ph:rnd(0,6),land:false,cx0:hcx});
  heap=Math.max(0,heap-dt*30);phoenix(px+Math.sin(pt*30)*3*u*(1-pt/T.shake),py,ux*.95,Math.sin(pt*6)*.35,rt,dir,1,0);if(pt>=T.shake)setPh('away')}
 else if(ph==='away'){const k=cl(pt/T.away),e=k*k;const ex=dir>0?W+200:-200;const px=cx+(ex-cx)*e,py=gy-78*u-e*cy*.9-Math.sin(k*5)*10*u;heap=Math.max(0,heap-dt*40);phoenix(px,py,ux*.95*(1-k*.45),Math.sin(pt*11),-.25*dir*k,dir,1-cl((k-.8)/.2),0);if(pt>=T.away){setPh('wait');pt=-cfg.gap;img.style.opacity='0';heap=0}}
 if(viewable||true){drawHeap(cx,gy,ph==='away'?cl(1-pt/T.away*2.4):1);drawSmoke(dt);drawFire(dt);drawAsh(dt,gy)}}
requestAnimationFrame(tick);
})();
