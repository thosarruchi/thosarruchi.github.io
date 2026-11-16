(() => {
  const key = 'ruchi-portfolio-theme';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;

  try {
    const saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch (_) {
    // The switch still works when browser storage is unavailable.
  }

  function applyTheme() {
    const theme = preference || (system.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    const target = theme === 'dark' ? 'light' : 'dark';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#191c19' : '#ffffff';
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      const label = `Switch to ${target} theme`;
      button.setAttribute('aria-label', label);
      button.title = label;
      button.querySelector('.theme-label').textContent = target === 'dark' ? 'Dark' : 'Light';
      button.hidden = false;
    });
  }

  // Apply before the stylesheet paints to avoid a flash of the other theme.
  applyTheme();
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.addEventListener('click', () => {
        preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem(key, preference); } catch (_) {}
        applyTheme();
      });
    });
  });
  system.addEventListener('change', () => { if (!preference) applyTheme(); });
  window.addEventListener('storage', event => {
    if (event.key !== key) return;
    preference = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
    applyTheme();
  });
})();
