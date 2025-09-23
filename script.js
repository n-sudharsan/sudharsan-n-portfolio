// Theme Toggle
(function(){
  const toggle = document.getElementById('theme-toggle');
  if(!toggle) return;
  const stored = localStorage.getItem('theme');
  if(stored === 'light') {
    document.body.classList.add('light');
    toggle.setAttribute('aria-pressed','true');
  }
  toggle.addEventListener('click', () => {
    const toLight = !document.body.classList.contains('light');
    document.body.classList.toggle('light', toLight);
    toggle.setAttribute('aria-pressed', toLight ? 'true': 'false');
    localStorage.setItem('theme', toLight ? 'light':'dark');
  });
})();

// Mobile Nav
(function(){
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if(!btn || !links) return;
  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=>{
    links.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
  }));
})();

// Scroll Spy + Fade-In
(function(){
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const header = document.querySelector('header.site-header');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) e.target.classList.add('visible');
    });
  },{threshold:0.12});
  document.querySelectorAll('.fade-in').forEach(el=>observer.observe(el));

  function onScroll(){
    const scrollPos = window.scrollY + window.innerHeight*0.28;
    let current = null;
    sections.forEach(sec => { if(sec.offsetTop <= scrollPos) current = sec.id; });
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+current));
    // Header shrink
    if(header){
      if(window.scrollY > 60) header.classList.add('shrink'); else header.classList.remove('shrink');
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();

// Smooth Scroll (native)
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if(!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if(target){
    e.preventDefault();
    target.scrollIntoView({behavior:'smooth', block:'start'});
  }
});

// Dynamic year
(function(){
  const yEl = document.getElementById('year');
  if(yEl) yEl.textContent = new Date().getFullYear();
})();

// Simple reveal on load
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .fade-launch').forEach((el,i)=>{
    el.style.opacity = 0; el.style.transform='translateY(24px)';
    setTimeout(()=>{el.style.transition='all .75s cubic-bezier(.65,.05,.36,1)'; el.style.opacity=1; el.style.transform='translateY(0)';}, 120 + i*140);
  });
});

// Contact Form (Formspree basic async submission)
(function(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  const statusEl = document.getElementById('form-status');
  function setStatus(msg, type){
    if(!statusEl) return; statusEl.textContent = msg; statusEl.className = 'form-status ' + (type||'');
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('Sending...', '');
    const submitBtn = form.querySelector('button[type="submit"]');
    if(submitBtn){
      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
    }
    const required = ['cf-name','cf-email','cf-message'];
    let invalid = false;
    required.forEach(id => {
      const el = document.getElementById(id);
      if(el && !el.value.trim()) { invalid = true; el.classList.add('field-error'); }
      else if(el) el.classList.remove('field-error');
    });
    if(invalid){ 
      setStatus('Please fill in required fields.', 'error');
      if(submitBtn){ submitBtn.disabled = false; submitBtn.classList.remove('is-loading'); }
      return; 
    }
    try {
      const data = new FormData(form);
      const res = await fetch(form.action, { method: form.method, body: data, headers: { 'Accept':'application/json' }});
      if(res.ok){
        form.reset();
        setStatus('Message sent! I will get back to you soon.', 'success');
        form.classList.add('form-success');
        setTimeout(()=>form.classList.remove('form-success'), 1400);
      } else {
        const json = await res.json().catch(()=>null);
        setStatus(json && json.error ? json.error : 'Something went wrong. Please try again later.', 'error');
      }
    } catch(err){
      setStatus('Network error. Please retry.', 'error');
    }
    if(submitBtn){
      submitBtn.disabled = false;
      submitBtn.classList.remove('is-loading');
    }
  });
})();

// Resume Modal (print enabled)
(function(){
  const openBtn = document.getElementById('open-resume');
  const modal = document.getElementById('resume-modal');
  if(!openBtn || !modal) return;
  const closeBtn = document.getElementById('close-resume');
  const printBtn = document.getElementById('print-resume');
  const scrollRegion = modal.querySelector('.resume-scroll');
  let lastFocused = null;
  function openModal(){
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.removeAttribute('aria-hidden');
    document.body.classList.add('modal-open');
    setTimeout(()=> (scrollRegion || modal).focus(), 30);
  }
  function closeModal(){
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
    if(lastFocused && lastFocused.focus) lastFocused.focus();
  }
  openBtn.addEventListener('click', e => { e.preventDefault(); openModal(); });
  closeBtn && closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('mousedown', e => { if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => {
    if(!modal.classList.contains('is-open')) return;
    if(e.key === 'Escape') closeModal();
  });
  if(printBtn){
    printBtn.addEventListener('click', () => {
      const proxy = document.getElementById('print-proxy');
      if(!proxy){ window.print(); return; }
      // Force reload to ensure latest copy each time
      proxy.src = 'Sudharshan_resume_cloud_devops.pdf#view=FitH';
      const onLoad = () => {
        try {
          proxy.contentWindow.focus();
          proxy.contentWindow.print();
        } catch(_) {
          window.print();
        }
        proxy.removeEventListener('load', onLoad);
      };
      proxy.addEventListener('load', onLoad);
    });
  }
})();

// (Removed impact toggle logic after redesign to unified chronological list)

// Lazy-load Contact Form (progressive reveal)
(function(){
  const placeholder = document.getElementById('lazy-contact-placeholder');
  const tpl = document.getElementById('contact-form-template');
  if(!placeholder || !tpl) return;

  let loaded = false;
  function loadForm(){
    if(loaded) return; loaded = true;
    const frag = tpl.content.cloneNode(true);
    placeholder.replaceWith(frag);
    // Re-run contact form binding
    initContactForm();
  }

  // Click / keyboard activation
  placeholder.addEventListener('click', loadForm);
  placeholder.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadForm(); } });

  // Intersection trigger (when ~30% visible)
  const io = new IntersectionObserver(entries => {
    entries.forEach(ent => { if(ent.isIntersecting){ loadForm(); io.disconnect(); } });
  },{threshold:0.3});
  io.observe(placeholder);
})();

// Extracted contact form logic into reusable function so we can call post lazy-load
function initContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  const statusEl = document.getElementById('form-status');
  function setStatus(msg, type){ if(statusEl){ statusEl.textContent = msg; statusEl.className = 'form-status ' + (type||''); } }
  if(form._bound) return; // prevent duplicate listeners
  form._bound = true;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('Sending...', '');
    const submitBtn = form.querySelector('button[type="submit"]');
    if(submitBtn){ submitBtn.disabled = true; submitBtn.classList.add('is-loading'); }
    const required = ['cf-name','cf-email','cf-message'];
    let invalid = false;
    required.forEach(id => {
      const el = document.getElementById(id);
      if(el && !el.value.trim()){ invalid = true; el.classList.add('field-error'); } else if(el){ el.classList.remove('field-error'); }
    });
    if(invalid){
      setStatus('Please fill in required fields.', 'error');
      if(submitBtn){ submitBtn.disabled = false; submitBtn.classList.remove('is-loading'); }
      return;
    }
    try {
      const data = new FormData(form);
      const res = await fetch(form.action, { method: form.method, body: data, headers:{'Accept':'application/json'} });
      if(res.ok){
        form.reset();
        setStatus('Message sent! I will get back to you soon.', 'success');
        form.classList.add('form-success');
        setTimeout(()=>form.classList.remove('form-success'), 1400);
      } else {
        const json = await res.json().catch(()=>null);
        setStatus(json && json.error ? json.error : 'Something went wrong. Please try again later.', 'error');
      }
    } catch(err){
      setStatus('Network error. Please retry.', 'error');
    }
    if(submitBtn){ submitBtn.disabled = false; submitBtn.classList.remove('is-loading'); }
  });
}

// Initialize immediately if form is already present (non-lazy path / no JS modifications)
initContactForm();

