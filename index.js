export default function () {
  // elements
  const root = document.querySelector('[data-ccs="root"]');
  const themeMenu = document.querySelector('[data-ccs="menu"]');
  const unsetTheme = document.querySelector('[data-ccs-field~="unset-theme"]');
  const invertBtn = document.querySelector('[data-ccs-input="mode"]');
  const modeLight = document.querySelector('[data-ccs-input="light-mode"]');
  const modeDark = document.querySelector('[data-ccs-input="dark-mode"]');
  const modeAuto = document.querySelector('[data-ccs-input="auto-mode"]');
  const unsetBtn = document.querySelector('[data-ccs-input="unset"]');

  // selecting elements
  const selectElements = {
    theme: document.querySelector('[data-ccs-input~="theme"]'),
    hue: document.querySelector('[data-ccs-input="hue"]'),
    sat: document.querySelector('[data-ccs-input="saturation"]'),
    light: document.querySelector('[data-ccs-input="lightness"]'),
    contrast: document.querySelector('[data-ccs-input="contrast"]'),
  };

  const resetSelect = () =>
    Object.keys(selectElements).forEach((type) => {
      const el = selectElements[type];
      selectElements[type].value = el.getAttribute('data-default');
    });

  const setSelection = (type, selection) => {
    setValue(type, selection);
    if (type === 'theme' && unsetTheme) {
      clearThemeValues();
      resetSelect();
      clearStore();
    }
    setValue(type, selection);
  };
  // set a value
  const setValue = (type, to, toStore = true) => {
    if (to) {
      if (attrs[type]) {
        root.setAttribute(attrs[type], to);
      } else if (props[type]) {
        root.style.setProperty(props[type], to);
      }

      if (toStore && store[type]) {
        localStorage.setItem(store[type], to);
        unsetBtn.removeAttribute('hidden');
      }
    }
  };
  // attributes
  const attrs = {
    theme: 'data-ccs-theme',
  };
  // properties
  const props = {
    hue: '--ccs-prime--user',
    sat: '--ccs-s--user',
    light: '--ccs-l--user',
    contrast: '--ccs-contrast--user',
    mode: '--ccs-mode--user',
  };
  // local storage
  const store = {
    theme: 'ccsTheme',
    mode: 'ccsMode',
    hue: 'ccsHue',
    sat: 'ccsSat',
    light: 'ccsLight',
    contrast: 'ccsContrast',
  };

  const clearThemeValues = () => {
    const themeValues = Object.values(store).filter((k) => k !== store.mode);
    const themeProps = Object.values(props).filter((p) => p !== props.mode);
    Object.values(props).forEach((prop) => {
      if (themeProps.includes(prop)) {
        root.style.removeProperty(prop);
      }
    });
    themeValues.forEach((item) => localStorage.removeItem(item));
  };

  const clearProps = () =>
    Object.keys(props).forEach((prop) =>
      root.style.removeProperty(props[prop])
    );

  const clearStore = () =>
    Object.keys(store).forEach((type) => localStorage.removeItem(store[type]));

  // clear all settings on reset
  const unset = () => {
    setValue('theme', selectElements.theme.getAttribute('data-default'), false);
    clearStore();
    clearProps();
    resetSelect();
    unsetBtn.setAttribute('hidden', '');
  };

  // modes
  const getMode = () => {
    return Number(getComputedStyle(root).getPropertyValue('--ccs-mode').trim());
  };
  const changeMode = (scheme) => {
    const schemeMap = {
      light: 1,
      dark: -1,
      auto: 0,
    };
    const setting = schemeMap[scheme];
    if (setting) {
      setValue('mode', setting);
    } else {
      // if auto, remove mode props from root and store
      localStorage.removeItem('ccsMode');
      root.style.removeProperty(props.mode);
    }
  };
  const toggleMode = () => setValue('mode', getMode() * -1);

  // initialize everything
  const initMenu = () => {
    themeMenu.removeAttribute('hidden');
  };
  const initValue = (type) => {
    selectElements[type].setAttribute(
      'data-default',
      selectElements[type].value
    );
    const to = localStorage.getItem(store[type]);
    if (to) {
      setValue(type, to, false);
      selectElements[type].value = to;
      unsetBtn.removeAttribute('hidden');
    }
  };
  const initMode = () => {
    let to = localStorage.getItem(store.mode);
    if (to) {
      setValue('mode', to);
      unsetBtn.removeAttribute('hidden');
    }
  };

  /* init defaults */
  document.onload = initMenu();
  document.onload = initMode();

  /* attach eventlistners */
  invertBtn.addEventListener('click', () => toggleMode());
  modeLight.addEventListener('click', () => changeMode('light'));
  modeDark.addEventListener('click', () => changeMode('dark'));
  modeAuto.addEventListener('click', () => changeMode('auto'));
  unsetBtn.addEventListener('click', () => unset());
  Object.keys(selectElements).forEach((type) => {
    if (selectElements[type]) {
      document.onload = initValue(type);
      selectElements[type].addEventListener('change', (e) =>
        setSelection(type, e.target.value)
      );
    }
  });
}
