// Contador
const contadorEl = document.getElementById('contador');
const startDate = new Date("2022-10-29T00:00:00");
function updateCounter() {
    const now = new Date();
    let diff = now - startDate;
    let seconds = Math.floor(diff / 1000);
    let minutes = Math.floor(seconds/60); seconds %= 60;
    let hours = Math.floor(minutes/60); minutes %= 60;
    let days = Math.floor(hours/24); hours %= 24;
    let months = Math.floor(days/30); days %=30;
    let years = Math.floor(months/12); months %= 12;
    contadorEl.textContent = `${years} anos, ${months} meses, ${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos ❤️`;
}
setInterval(updateCounter, 1000);

// Música
const musica = document.getElementById('musica');
const btnMusica = document.getElementById('btn-musica');
btnMusica.addEventListener('click', ()=>{
    musica.play();
    btnMusica.style.display='none';
});

// Carrossel de fotos
document.querySelectorAll('.stage').forEach(stage=>{
    const carrossel = stage.querySelector('.carrossel');
    if(!carrossel) return;
    const imgs = carrossel.querySelectorAll('img');
    let index = 0;
    function showImg(i){
        imgs.forEach(img=>img.classList.remove('active'));
        imgs[i].classList.add('active');
    }
    // auto
    setInterval(()=>{
        index = (index+1)%imgs.length;
        showImg(index);
    },5000);
    // botões
    const next = stage.querySelector('.next');
    const prev = stage.querySelector('.prev');
    if(next){
        next.addEventListener('click', ()=>{
            index = (index+1)%imgs.length;
            showImg(index);
        });
    }
    if(prev){
        prev.addEventListener('click', ()=>{
            index = (index-1+imgs.length)%imgs.length;
            showImg(index);
        });
    }
});

// Efeito digitação
function typeWriter(el, text, i=0, sound=true){
    if(i<text.length){
        el.textContent += text.charAt(i);
        if(sound) {
            const audio = new Audio('typing.mp3');
            audio.volume = 0.05;
            audio.play();
        }
        setTimeout(()=>typeWriter(el,text,i+1,sound),50);
    }
}
document.querySelectorAll('.texto').forEach(p=>{
    const observer = new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                typeWriter(p,p.dataset.text,0,true);
                observer.unobserve(p);
            }
        });
    }, {threshold:0.5});
    observer.observe(p);
});