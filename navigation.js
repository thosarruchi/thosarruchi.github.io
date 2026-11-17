(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('[data-menu-toggle]');
  const navigation = document.getElementById('site-navigation');
  if (!header || !toggle || !navigation) return;
  document.documentElement.classList.add('nav-ready');
  toggle.hidden = false;
  const mobile = window.matchMedia('(max-width: 850px)');
  function closeMenu(restoreFocus = false) {
    header.classList.remove('navigation-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('span').textContent = 'Menu';
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    header.classList.toggle('navigation-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('span').textContent = open ? 'Close' : 'Menu';
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('navigation-open')) closeMenu(true);
  });
  mobile.addEventListener('change', () => closeMenu());
})();
