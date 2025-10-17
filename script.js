const stages = document.querySelectorAll('.stage');
const contador = document.getElementById('contador');
const music = document.getElementById('music');
const typing = document.getElementById('typing');
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startButton');
const intro = document.getElementById('intro');
const startDate = new Date("2022-10-29T00:00:00");

// contador
function atualizarContador() {
  const agora = new Date();
  let diff = agora - startDate;
  let d = Math.floor(diff / (1000 * 60 * 60 * 24));
  let h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  let m = Math.floor((diff / (1000 * 60)) % 60);
  let s = Math.floor((diff / 1000) % 60);
  contador.textContent = `${d}d ${h}h ${m}m ${s}s`;
}
setInterval(atualizarContador, 1000);
atualizarContador();

// digitação das frases
async function digitarTexto(el) {
  const texto = el.dataset.text;
  if (!texto) return;
  el.textContent = "";
  for (let i = 0; i < texto.length; i++) {
    el.textContent += texto[i];
    typing.currentTime = 0;
    typing.volume = 0.06;
    typing.play().catch(() => {});
    await new Promise(r => setTimeout(r, 90));
  }
}

// ativa frases automaticamente
window.addEventListener("load", () => {
  stages.forEach(stage => {
    const txt = stage.querySelector('.texto');
    if (txt && txt.dataset.text) {
      setTimeout(() => digitarTexto(txt), 600);
    }
  });
});

// carrossel de fotos
stages.forEach(stage => {
  const fotos = stage.querySelectorAll('.foto');
  if (fotos.length > 1) {
    let idx = 0;
    const next = stage.querySelector('.next');
    const prev = stage.querySelector('.prev');
    function show(n) {
      fotos.forEach(f => f.classList.remove('ativa'));
      fotos[n].classList.add('ativa');
    }
    next?.addEventListener('click', () => { idx = (idx + 1) % fotos.length; show(idx); });
    prev?.addEventListener('click', () => { idx = (idx - 1 + fotos.length) % fotos.length; show(idx); });
    setInterval(() => { idx = (idx + 1) % fotos.length; show(idx); }, 5000);
  }
});

// esconde imagens com erro
document.querySelectorAll("img.foto").forEach(img => {
  img.addEventListener("error", () => {
    console.warn("Imagem não encontrada:", img.src);
    img.style.display = "none";
  });
});

// partículas de fundo
function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
window.addEventListener('resize', resize);
const p = [];
for (let i = 0; i < 120; i++) {
  p.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5,
    dx: (Math.random() - 0.5) * 0.2,
    dy: (Math.random() - 0.5) * 0.2,
    a: Math.random() * 0.5 + 0.2
  });
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of p) {
    s.x += s.dx; s.y += s.dy;
    if (s.x < 0) s.x = canvas.width;
    if (s.x > canvas.width) s.x = 0;
    if (s.y < 0) s.y = canvas.height;
    if (s.y > canvas.height) s.y = 0;
    const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 8);
    g.addColorStop(0, `rgba(255,255,255,${s.a})`);
    g.addColorStop(1, `rgba(255,255,255,0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
draw();

// botão inicial
startBtn.addEventListener('click', () => {
  intro.style.opacity = '0';
  setTimeout(() => {
    intro.style.display = 'none';
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }, 800);

  music.volume = 0.6;
  music.play().then(() => {
    console.log("🎵 Música tocando!");
  }).catch(err => {
    console.warn("⚠️ Autoplay bloqueado:", err);
    document.body.addEventListener('click', () => music.play(), { once: true });
  });
});
