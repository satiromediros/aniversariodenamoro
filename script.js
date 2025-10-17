// Configurações iniciais
const stages = Array.from(document.querySelectorAll('.stage'));
const contadorEl = document.getElementById('contador');
const music = document.getElementById('musica');
const typingSound = document.getElementById('typing-sound');
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
const START_DATE = new Date("2022-10-29T00:00:00");

// Atualizador de tempo juntos
function updateCounter() {
  const now = new Date();
  let diff = now - START_DATE;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  contadorEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(updateCounter, 1000);
updateCounter();

// Função de digitação lenta + som
async function typeText(el) {
  const text = el.dataset.text;
  if (!text) {
    console.warn("Elemento texto sem data-text:", el);
    return;
  }
  el.textContent = "";
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    typingSound.currentTime = 0;
    typingSound.volume = 0.07;
    typingSound.play().catch(() => {});
    await new Promise(r => setTimeout(r, 100));
  }
}

// Observador de seções (quando entram em foco)
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const sec = entry.target;
    if (entry.isIntersecting) {
      sec.classList.add('ativa');
      const txt = sec.querySelector('.texto');
      const doType = sec.dataset.typing === "true";
      if (txt && doType && txt.textContent.trim() === "") {
        typeText(txt);
      }
    } else {
      sec.classList.remove('ativa');
    }
  });
}, { threshold: 0.5 });

stages.forEach(s => observer.observe(s));

// Carrossel de fotos por etapa
stages.forEach(stage => {
  const fotos = Array.from(stage.querySelectorAll('.foto'));
  if (fotos.length < 1) return;
  let index = fotos.findIndex(f => f.classList.contains('ativa'));
  if (index < 0) index = 0;
  fotos.forEach((f,i) => {
    if (i === index) f.classList.add('ativa');
    else f.classList.remove('ativa');
  });

  const nextBtn = stage.querySelector('.next');
  const prevBtn = stage.querySelector('.prev');

  // auto troca
  setInterval(() => {
    fotos[index].classList.remove('ativa');
    index = (index + 1) % fotos.length;
    fotos[index].classList.add('ativa');
  }, 5000);

  // botões manuais
  nextBtn?.addEventListener('click', () => {
    fotos[index].classList.remove('ativa');
    index = (index + 1) % fotos.length;
    fotos[index].classList.add('ativa');
  });
  prevBtn?.addEventListener('click', () => {
    fotos[index].classList.remove('ativa');
    index = (index - 1 + fotos.length) % fotos.length;
    fotos[index].classList.add('ativa');
  });
});

// Partículas de fundo
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particles = [];
const PCOUNT = Math.floor((canvas.width * canvas.height) / 20000);
for (let i = 0; i < PCOUNT; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.5,
    dx: (Math.random() - 0.5) * 0.2,
    dy: (Math.random() - 0.5) * 0.2,
    alpha: Math.random() * 0.5 + 0.2
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
    grad.addColorStop(0, `rgba(255,255,255,${p.alpha})`);
    grad.addColorStop(1, `rgba(255,255,255,0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();
