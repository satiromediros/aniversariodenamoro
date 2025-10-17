const stages = document.querySelectorAll('.stage');
const contador = document.getElementById('contador');
const music = document.getElementById('music');
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startButton');
const intro = document.getElementById('intro');
const nextBtn = document.getElementById('nextStage');
let currentStage = 0;
const startDate = new Date("2022-10-29T00:00:00");

// contador
function atualizarContador(){
  const agora = new Date();
  let diff = agora - startDate;
  let d = Math.floor(diff/(1000*60*60*24));
  let h = Math.floor((diff/(1000*60*60))%24);
  let m = Math.floor((diff/(1000*60))%60);
  let s = Math.floor((diff/1000)%60);
  contador.textContent = `${d}d ${h}h ${m}m ${s}s`;
}
setInterval(atualizarContador,1000);
atualizarContador();

// texto digitando
async function digitarTexto(el){
  const texto = el.dataset.text;
  if(!texto) return;
  el.textContent="";
  for(let i=0;i<texto.length;i++){
    el.textContent+=texto[i];
    await new Promise(r=>setTimeout(r,70));
  }
  el.classList.add("show");
}

// mostrar etapa
function mostrarEtapa(i){
  stages.forEach(s=>s.classList.remove("active"));
  stages[i].classList.add("active");
  const txt = stages[i].querySelector(".texto");
  if(txt) digitarTexto(txt);
}

// próxima etapa
function proximaEtapa(){
  if(currentStage < stages.length-1){
    currentStage++;
    mostrarEtapa(currentStage);
    window.scrollTo({top:0,behavior:"smooth"});
  }
}

// teclas e botão
document.addEventListener('keydown',e=>{
  if(e.key==="ArrowDown") proximaEtapa();
});
nextBtn.addEventListener('click',proximaEtapa);

// botão inicial
startBtn.addEventListener('click',()=>{
  intro.style.opacity='0';
  setTimeout(()=>{
    intro.style.display='none';
    mostrarEtapa(currentStage);
  },800);
  music.play().catch(()=>{
    document.body.addEventListener('click',()=>music.play(),{once:true});
  });
});

// carrossel fotos
stages.forEach(stage=>{
  const fotos = stage.querySelectorAll('.foto');
  if(fotos.length>1){
    let idx=0;
    const next = stage.querySelector('.next');
    const prev = stage.querySelector('.prev');
    function show(n){
      fotos.forEach(f=>f.classList.remove('ativa'));
      fotos[n].classList.add('ativa');
    }
    next?.addEventListener('click',()=>{idx=(idx+1)%fotos.length;show(idx);});
    prev?.addEventListener('click',()=>{idx=(idx-1+fotos.length)%fotos.length;show(idx);});
  }
});

// partículas
function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}
resize();window.addEventListener('resize',resize);
const p=[];
for(let i=0;i<150;i++){
  p.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.5,
  dx:(Math.random()-0.5)*0.3,dy:(Math.random()-0.5)*0.3,a:Math.random()*0.6+0.2});
}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const s of p){
    s.x+=s.dx;s.y+=s.dy;
    if(s.x<0)s.x=canvas.width;if(s.x>canvas.width)s.x=0;
    if(s.y<0)s.y=canvas.height;if(s.y>canvas.height)s.y=0;
    const g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*8);
    g.addColorStop(0,`rgba(255,255,255,${s.a})`);
    g.addColorStop(1,`rgba(255,255,255,0)`);
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(s.x,s.y,s.r*4,0,Math.PI*2);ctx.fill();
  }
  requestAnimationFrame(draw);
}
draw();
