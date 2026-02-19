// script.js — upgraded interactions
// Features implemented:
// - Theme toggle (persisted)
// - Smooth nav scrolling + active link highlight
// - Reveal animations + animated progress bars
// - Floating hero responsiveness to mouse
// - Subtle CSS-only 3D hover on project cards (no automatic rotation)
// - Contact form fallback via mailto

const doc = document;

/* ----------------------------- Theme ----------------------------- */
const themeToggle = doc.getElementById('theme-toggle');
function applyTheme(theme){
  if(theme === 'light') doc.documentElement.setAttribute('data-theme','light');
  else doc.documentElement.removeAttribute('data-theme'); // default dark
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}
const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
applyTheme(saved);
themeToggle.addEventListener('click', ()=> applyTheme((doc.documentElement.getAttribute('data-theme') === 'light') ? 'dark' : 'light'));

/* ----------------------------- Utilities ----------------------------- */
// current year
document.getElementById('year').textContent = new Date().getFullYear();

// view projects button
const vp = doc.getElementById('view-projects'); if(vp) vp.addEventListener('click', ()=> location.href = '#projects');

/* ----------------------------- Reveal on scroll ----------------------------- */
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('visible');
      // animate progress bars when skills appear
      if(e.target.querySelectorAll) e.target.querySelectorAll('.progress > div').forEach(el => el.style.width = getComputedStyle(el).getPropertyValue('--val') || '0%');
    }
  });
},{threshold:0.12});
document.querySelectorAll('section, .card, .skill, .hero-illustration').forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });

/* ----------------------------- Contact form ----------------------------- */
const form = doc.getElementById('contact-form');
const status = doc.getElementById('form-status');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');
    status.textContent = 'Thanks! Preparing your message...';
    const subject = encodeURIComponent(`Message from ${name} via portfolio`);
    const body = encodeURIComponent(`Name: ${name}%0AEmail: ${email}%0A%0A${message}`);
    setTimeout(()=>{
      window.location.href = `mailto:saravanan@example.com?subject=${subject}&body=${body}`;
      status.textContent = 'If your mail client did not open, please send an email to saravanan@example.com';
      form.reset();
    }, 700);
  });
}

/* ----------------------------- Nav active link ----------------------------- */
const navLinks = Array.from(document.querySelectorAll('.nav a'));
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href')));
window.addEventListener('scroll', ()=>{
  const y = window.scrollY + Math.max(window.innerHeight * 0.15, 120);
  let idx = sections.findIndex(s => s && s.offsetTop + s.offsetHeight > y && s.offsetTop <= y);
  if(idx === -1) idx = 0;
  navLinks.forEach((a,i)=> a.classList.toggle('active', i === idx));
});

/* ----------------------------- Button micro-interactions ----------------------------- */
document.querySelectorAll('.btn').forEach(b => b.addEventListener('click', ()=> b.animate([{transform:'translateY(0)'},{transform:'translateY(-4px)'},{transform:'translateY(0)'}],{duration:260}))); 

/* ----------------------------- Hero floating + parallax ----------------------------- */
const heroIllustration = document.getElementById('hero-illustration');
if(heroIllustration){
  // small parallax on mouse move
  let hx=0, hy=0, tx=0, ty=0;
  heroIllustration.addEventListener('mousemove', (e)=>{
    const r = heroIllustration.getBoundingClientRect();
    hx = (e.clientX - (r.left + r.width/2)) / r.width; // -0.5 .. 0.5
    hy = (e.clientY - (r.top + r.height/2)) / r.height;
  });
  heroIllustration.addEventListener('mouseleave', ()=>{ hx = 0; hy = 0; });
  function heroLoop(){
    tx += (hx - tx) * 0.08; ty += (hy - ty) * 0.08;
    const card = heroIllustration.querySelector('.float-card');
    if(card) card.style.transform = `rotateY(${tx*10}deg) rotateX(${ -ty*8 }deg) translateZ(20px)`;
    requestAnimationFrame(heroLoop);
  }
  heroLoop();
}

/* ----------------------------- Profile image tilt (mouse tracked) ----------------------------- */
const profileCard = document.getElementById('profile-card');
const profileImg = document.getElementById('profile-img');
if(profileCard && profileImg){
  // disable on touch / small screens
  const disableTilt = ('ontouchstart' in window) || window.innerWidth < 720;
  if(disableTilt){ profileCard.classList.add('is-idle'); }
  else{
    let px=0, py=0, tx=0, ty=0, rafp=null;
    const sens = 14; // tilt sensitivity
    function updateBounds(){ const r = profileCard.getBoundingClientRect(); profileCard._w = r.width; profileCard._h = r.height; profileCard._l = r.left; profileCard._t = r.top; }
    updateBounds(); window.addEventListener('resize', updateBounds);

    let lastMove = 0;
    profileCard.addEventListener('mousemove', (e)=>{
      lastMove = Date.now();
      const x = (e.clientX - profileCard._l) - profileCard._w/2;
      const y = (e.clientY - profileCard._t) - profileCard._h/2;
      px = (x / (profileCard._w/2)); py = (y / (profileCard._h/2));
    });
    profileCard.addEventListener('mouseleave', ()=>{ px=0; py=0; });

    function profileLoop(){
      tx += (px - tx) * 0.12; ty += (py - ty) * 0.12;
      const rotY = tx * sens; const rotX = -ty * (sens*0.75);
      const scale = 1 + (Math.abs(tx)+Math.abs(ty)) * 0.03;
      profileCard.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
      profileImg.style.transform = `translateZ(20px)`;
      // idle float if no movement for 2s
      if(Date.now() - lastMove > 2000) profileCard.classList.add('is-idle'); else profileCard.classList.remove('is-idle');
      rafp = requestAnimationFrame(profileLoop);
    }
    profileLoop();
  }
}

/* Project cards: subtle CSS-only hover handled in CSS.
   No automatic or infinite rotation is applied. Interactive tilt by mouse move
   has been removed to keep the effect subtle and consistent across devices. */

/* ----------------------------- Init progress bars on load ----------------------------- */
window.addEventListener('load', ()=>{
  document.querySelectorAll('.progress > div').forEach(el => { el.style.width = getComputedStyle(el).getPropertyValue('--val') || '0%'; });
});

