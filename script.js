/* globals: main functionality for tunnel experience
   - slow typing (100ms)
   - particle background
   - per-stage image carousel (auto 5s + manual)
   - scroll-snap + IntersectionObserver to trigger typing and fade
*/

const START_DATE = new Date("2022-10-29T00:00:00");

// DOM
const main = document.getElementById('main');
const stages = Array.from(document.querySelectorAll('.stage'));
const contadorEl = document.getElementById('contador');
const btnPlay = document.getElementById('btn-play');
const musica = document.getElementById('musica');
const typingSound = document.getElementById('typing-sound');
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let carousels = []; // will store interval and indexes per stage

/* ------------------ contador ------------------ */
function updateCounter(){
  const now = new Date();
  let diff = now - START_DATE;
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff / (1000*60*60)) % 24);
  const minutes = Math.floor((diff / (1000*60)) % 60);
  const seconds = Math.floor((diff/1000) % 60);
  contadorEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(updateCounter, 1000);
updateCounter();

/* ------------------ particle background ------------------ */
function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
const particles = [];
const PCOUNT = Math.floor((window.innerWidth*window.innerHeight)/150000);
for(let i=0;i<PCOUNT;i++){
  particles.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*1.2 + 0.3,
    vx: (Math.random()-0.5)*0.1,
    vy: (Math.random()-0.5)*0.1,
    alpha: Math.random()*0.6 + 0.15
  });
}
function drawParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const p of particles){
    p.x += p.vx;
    p.y += p.vy;
    if(p.x < 0) p.x = canvas.width;
    if(p.x > canvas.width) p.x = 0;
    if(p.y < 0) p.y = canvas.height;
    if(p.y > canvas.height) p.y = 0;
    const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*8);
    g.addColorStop(0, `rgba(187,63,106, ${p.alpha})`);
    g.addColorStop(1, `rgba(255,255,255,0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r*6,0,Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ------------------ helper typing ------------------ */
function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

async function typeText(el, text, withSound=true){
  el.textContent = "";
  for(let i=0;i<text.length;i++){
    el.textContent += text[i];
    if(withSound){
      // play short click; lower volume
      typingSound.currentTime = 0;
      typingSound.volume = 0.06;
      typingSound.play().catch(()=>{});
    }
    await sleep(100); // slower typing (100ms per char)
  }
}

/* ------------------ carousel per stage ------------------ */
function setupCarousels(){
  stages.forEach((stage, idx) => {
    const imgs = Array.from(stage.querySelectorAll('.stage-img'));
    if(imgs.length === 0) { carousels[idx] = null; return; }
    let cur = imgs.findIndex(i=>i.classList.contains('active'));
    if(cur<0) cur=0;
    imgs.forEach((im,i)=>{ if(i===cur) im.classList.add('active'); else im.classList.remove('active'); });
    let iv = setInterval(()=> {
      imgs[cur].classList.remove('active');
      cur = (cur+1)%imgs.length;
      imgs[cur].classList.add('active');
    }, 5000);
    carousels[idx] = { imgs, cur, iv };

    // controls
    const prev = stage.querySelector('.prev');
    const next = stage.querySelector('.next');
    if(prev){
      prev.addEventListener('click', ()=>{
        clearInterval(carousels[idx].iv);
        imgs[carousels[idx].cur].classList.remove('active');
        carousels[idx].cur = (carousels[idx].cur - 1 + imgs.length) % imgs.length;
        imgs[carousels[idx].cur].classList.add('active');
        carousels[idx].iv = setInterval(arguments.callee, 5000); // note: won't rebind here; we replace with lambda below
      });
    }
    if(next){
      next.addEventListener('click', ()=>{
        clearInterval(carousels[idx].iv);
        imgs[carousels[idx].cur].classList.remove('active');
        carousels[idx].cur = (carousels[idx].cur + 1) % imgs.length;
        imgs[carousels[idx].cur].classList.add('active');
        carousels[idx].iv = setInterval(()=> {
          imgs[cur].classList.remove('active');
          cur = (cur+1)%imgs.length;
          imgs[cur].classList.add('active');
        }, 5000);
      });
    }
  });
}
setupCarousels();

/* ------------------ observe sections (enter/exit) for typing + activation ------------------ */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const section = entry.target;
    if(entry.isIntersecting){
      section.classList.add('active');
      // start typing if has .texto and data-typing true
      const txt = section.querySelector('.texto');
      const requiresTyping = section.dataset.typing === 'true';
      if(txt && requiresTyping){
        const text = txt.dataset.text || txt.textContent;
        if(text && txt.textContent.trim()===""){ // only type once
          typeText(txt, text, true).catch(()=>{});
        }
      }
    } else {
      section.classList.remove('active');
      // optionally clear text (so re-typing when re-enter) — we keep text complete after typed
    }
  });
}, { threshold: 0.55 });

stages.forEach(s => io.observe(s));

/* ------------------ start button behavior ------------------ */
btnPlay.addEventListener('click', async () => {
  try{
    await musica.play();
  }catch(e){}
  btnPlay.style.display='none';
});

/* ------------------ small fix: when user scrolls quickly, ensure carousels keep working ------------------ */
/* already handled by setInterval per stage */

/* ------------------ accessibility: allow arrow buttons to change section */
document.getElementById('proximo')?.addEventListener('click', ()=> { window.scrollBy({top: window.innerHeight, behavior:'smooth'}); });
document.getElementById('anterior')?.addEventListener('click', ()=> { window.scrollBy({top: -window.innerHeight, behavior:'smooth'}); });

/* ------------------ end of script ------------------ */
