const stages = document.querySelectorAll('.stage');
const contador = document.getElementById('contador');
const music = document.getElementById('music');
const typing = document.getElementById('typing');
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
const startDate = new Date("2022-10-29T00:00:00");

// contador de tempo
function atualizarContador(){
  let agora = new Date();
  let diff = agora - startDate;
  let d = Math.floor(diff / (1000*60*60*24));
  let h = Math.floor((diff / (1000*60*60)) % 24);
  let m = Math.floor((diff / (1000*60)) % 60);
  let s = Math.floor((diff / 1000) % 60);
  contador.textContent = `${d}d ${h}h ${m}m ${s}s`;
}
setInterval(atualizarContador,1000);
atualizarContador();

// tipagem
async function digitarTexto(el){
  const texto = el.dataset.text;
  el.textContent = "";
  for(let i=0;i<texto.length;i++){
    el.textContent += texto[i];
    typing.currentTime=0;
    typing.volume=0.07;
    typing.play().catch(()=>{});
    await new Promise(r=>setTimeout(r,100));
  }
}

// ativação das seções
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('ativa');
      const txt = entry.target.querySelector('.texto');
      if(txt && !txt.textContent) digitarTexto(txt);
    }
  });
},{threshold:0.5});
stages.forEach(s=>observer.observe(s));

// carrossel de fotos
stages.forEach(stage=>{
  const fotos = stage.querySelectorAll('.foto');
  if(fotos.length>1){
    let index = 0;
    const nextBtn = stage.querySelector('.next');
    const prevBtn = stage.querySelector('.prev');
    function show(n){
      fotos.forEach(f=>f.classList.remove('ativa'));
      fotos[n].classList.add('ativa');
    }
    nextBtn?.addEventListener('click',()=>{
      index=(index+1)%fotos.length;show(index);
    });
    prevBtn?.addEventListener('click',()=>{
      index=(index-1+fotos.length)%fotos.length;show(index);
    });
    setInterval(()=>{index=(index+1)%fotos.length;show(index);},5000);
  }
});

// partículas
function resizeCanvas(){
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize',resizeCanvas);

const particles=[];
for(let i=0;i<120;i++){
  particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    r:Math.random()*1.5,
    dx:(Math.random()-0.5)*0.2,
    dy:(Math.random()-0.5)*0.2,
    alpha:Math.random()*0.5+0.2
  });
}

function drawParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const p of particles){
    p.x+=p.dx;p.y+=p.dy;
    if(p.x<0)p.x=canvas.width;if(p.x>canvas.width)p.x=0;
    if(p.y<0)p.y=canvas.height;if(p.y>canvas.height)p.y=0;
    const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);
    g.addColorStop(0,`rgba(255,255,255,${p.alpha})`);
    g.addColorStop(1,`rgba(255,255,255,0)`);
    ctx.fillStyle=g;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r*4,0,Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();
