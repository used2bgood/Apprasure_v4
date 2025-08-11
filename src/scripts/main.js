(function(){
  // Hamburger toggle
  const btn = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('open');
      // Move focus to first link when opening
      if (!expanded) {
        const firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });
  }

  // Smooth scroll for in-page anchors
  const header = document.querySelector('header');
  const headerHeight = header ? header.offsetHeight : 0;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length <= 1) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.pageYOffset - (headerHeight + 12);
    window.scrollTo({ top: y, behavior: 'smooth' });
    history.replaceState(null, '', id);
  });
})();