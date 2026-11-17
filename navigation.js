(() => {
  const header = document.querySelector('.header');
  const toggle = document.querySelector('[data-menu-toggle]');
  const navigation = document.getElementById('site-navigation');
  const cases = document.querySelector('.case-menu');
  const mobile = window.matchMedia('(max-width: 850px)');
  if (!header || !toggle || !navigation) return;
  document.documentElement.classList.add('nav-ready');
  toggle.hidden = false;

  function closeMenu(restoreFocus = false) {
    header.classList.remove('navigation-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('span').textContent = 'Menu';
    if (cases) cases.open = false;
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    header.classList.toggle('navigation-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('span').textContent = open ? 'Close' : 'Menu';
    if (!open && cases) cases.open = false;
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('click', event => {
    if (cases && !cases.contains(event.target)) cases.open = false;
    if (!header.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (cases && cases.open) {
      cases.open = false;
      cases.querySelector('summary').focus();
    } else if (header.classList.contains('navigation-open')) closeMenu(true);
  });
  mobile.addEventListener('change', () => closeMenu());
})();
