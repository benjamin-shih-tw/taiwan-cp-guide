(() => {
  const root = document.documentElement;
  const dialog = document.getElementById('appearance-dialog');
  const fontSelect = document.getElementById('appearance-font');
  const modeSelect = document.getElementById('appearance-mode');
  const codeSelect = document.getElementById('appearance-code-theme');
  const fontStacks = {
    'noto-sans-tc': "'Noto Sans TC', sans-serif",
    genseki: "'GenSeki Gothic TW', sans-serif",
    'noto-serif-tc': "'Noto Serif TC', serif",
    huninn: "'Huninn', sans-serif",
    gensen: "'GenSen Rounded TW', sans-serif",
    chenyu: "'Reader LuoYan Web', serif"
  };
  const googleFonts = {
    'noto-serif-tc': 'Noto+Serif+TC:wght@400;500;600;700',
    huninn: 'Huninn'
  };
  const get = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const fontKey = 'taiwan_cp_font_v1';
  const codeKey = 'taiwan_cp_code_theme_v1';
  let options;

  function applyFont(id) {
    const selected = fontStacks[id] ? id : 'default';
    if (googleFonts[selected] && !document.getElementById(`font-${selected}`)) {
      const link = document.createElement('link');
      link.id = `font-${selected}`;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${googleFonts[selected]}&display=swap`;
      document.head.appendChild(link);
    }
    root.style.setProperty('--sans', fontStacks[selected] || "'Inter','Noto Sans TC',system-ui,sans-serif");
    fontSelect.value = selected;
    save(fontKey, selected);
  }

  function applyCodeTheme(id) {
    if (!options) return;
    const selected = options.codeThemes.find(theme => theme.id === id);
    const fallback = root.dataset.theme === 'dark' ? 'dark-2026' : 'light-2026';
    const theme = selected || options.codeThemes.find(item => item.id === fallback);
    const palette = options.palettes[theme.palette];
    for (const [key, value] of Object.entries(palette)) root.style.setProperty(`--code-${key}`, value);
    root.dataset.codeTheme = theme.id;
    codeSelect.value = selected ? id : 'auto';
    save(codeKey, selected ? id : 'auto');
  }

  fetch(new URL('appearance-options.json', document.currentScript.src))
    .then(response => { if (!response.ok) throw new Error('appearance options'); return response.json(); })
    .then(data => {
      options = data;
      for (const font of options.fonts) fontSelect.add(new Option(font.label, font.id));
      codeSelect.add(new Option('自動（配合背景）', 'auto'));
      for (const group of ['淺色', '深色', '高對比']) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = group;
        for (const theme of options.codeThemes.filter(item => item.group === group)) optgroup.appendChild(new Option(theme.label, theme.id));
        codeSelect.appendChild(optgroup);
      }
      applyFont(get(fontKey) || 'default');
      applyCodeTheme(get(codeKey) || 'auto');
      modeSelect.value = get('taiwan_cp_theme_v2') || 'system';
    })
    .catch(error => console.warn('Appearance settings unavailable:', error));

  document.getElementById('appearance-open').addEventListener('click', () => dialog.showModal());
  fontSelect.addEventListener('change', event => applyFont(event.target.value));
  codeSelect.addEventListener('change', event => applyCodeTheme(event.target.value));
  modeSelect.addEventListener('change', event => window.setCourseTheme(event.target.value));
  document.addEventListener('course-theme-change', event => {
    modeSelect.value = event.detail;
    if (codeSelect.value === 'auto') applyCodeTheme('auto');
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (modeSelect.value === 'system') window.setCourseTheme('system');
  });
})();
