(function(){
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const statusEl = document.getElementById('formStatus');
  const form = document.getElementById('contactForm');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // 主题切换（保存到 localStorage）
  if (themeBtn){
    const saved = localStorage.getItem('theme') || 'dark';
    if (saved === 'light') html.setAttribute('data-theme','light');
    themeBtn.addEventListener('click', ()=>{
      const isLight = html.getAttribute('data-theme') === 'light';
      html.setAttribute('data-theme', isLight ? 'dark' : 'light');
      localStorage.setItem('theme', isLight ? 'dark' : 'light');
      themeBtn.setAttribute('aria-pressed', String(!isLight));
    });
  }

  // 简单表单校验（不做真实发送）
  if (form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = document.getElementById('email');
      const msg = document.getElementById('message');
      if (!email.checkValidity()){
        speak('Please enter a valid email.');
        return;
      }
      if (!msg.checkValidity()){
        speak('Please write at least 10 characters.');
        return;
      }
      speak('✅ Message validated (demo only).');
      form.reset();
    });
  }

  function speak(text){
    if (statusEl){
      statusEl.classList.remove('visually-hidden');
      statusEl.textContent = text;
      setTimeout(()=>{ statusEl.classList.add('visually-hidden'); }, 2500);
    } else {
      alert(text);
    }
  }
})();
