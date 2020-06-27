export default function () {
  // elements
  const root = document.querySelector('[data-ccs="root"]');
  const themeMenu = document.querySelector('[data-ccs="menu"]');
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

  const showUnsetBtn = (show = true) => {
    if (unsetBtn) {
      show
        ? unsetBtn.removeAttribute('hidden')
        : unsetBtn.setAttribute('hidden', '')
    }
  }
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
        showUnsetBtn();
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

  const subTheme = [
    'hue',
    'sat',
    'light',
    'contrast',
  ]

  const resetSelect = (sub = null) =>
  Object.keys(selectElements).forEach((type) => {
    if (!sub || sub.includes(type)) {
      const el = selectElements[type];
      selectElements[type].value = el.getAttribute('data-default');
    }
  });

  const setSelection = (type, selection) => {
    const unsetTheme = selectElements.theme?.dataset.ccsInput.includes('unset-values');

    if (type === 'theme' && unsetTheme) {
      clearProps(subTheme);
      clearStore(subTheme);
      resetSelect(subTheme);
    }
    setValue(type, selection);
  };

  const clearProps = (sub = null) =>
    Object.keys(props).forEach((prop) => {
      if (!sub || sub.includes(prop)) {
        root.style.removeProperty(props[prop])
      }
    });

  const clearStore = (sub = null) =>
    Object.keys(store).forEach((type) => {
      if (!sub || sub.includes(type)) {
        localStorage.removeItem(store[type])
      }
    });

  // clear all settings on reset
  const unset = () => {
    setValue('theme', selectElements.theme.getAttribute('data-default'), false);
    clearStore();
    clearProps();
    resetSelect();
    showUnsetBtn(false);
    if (modeAuto) {
      modeAuto.checked = true
    }
  };

  // modes
  const getMode = () => {
    return Number(getComputedStyle(root).getPropertyValue('--ccs-mode').trim());
  };
  const changeMode = (scheme) => {
    const schemeDict = {
      light: 1,
      dark: -1,
      auto: 0,
    };
    const setting = schemeDict[scheme];
    if (setting) {
      setValue('mode', setting);
    } else {
      // if auto, remove mode props from root and store
      localStorage.removeItem('ccsMode');
      root.style.removeProperty(props.mode);
    }
  };
  const toggleMode = () => {
    const modeDict = {
      1: modeLight,
      [-1]: modeDark,
    };
    setValue('mode', getMode() * -1)
    if (modeLight || modeDark ) {
      modeDict[getMode()].checked = true;
    }
  };

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
      showUnsetBtn();
    }
  };
  const initMode = () => {
    let to = localStorage.getItem(store.mode);
    if (to) {
      const modeDict = {
        1: modeLight,
        [-1]: modeDark,
      };
      setValue('mode', to);
      showUnsetBtn();
      modeDict[to].checked = true
    }
    else if (modeAuto) {
      modeAuto.checked = true
    }
  };

  /* init defaults */
  document.onload = initMenu();
  document.onload = initMode();

  /* attach eventlistners */
  invertBtn && invertBtn.addEventListener('click', () => toggleMode());
  modeLight && modeLight.addEventListener('change', () => changeMode('light'));
  modeDark && modeDark.addEventListener('change', () => changeMode('dark'));
  modeAuto && modeAuto.addEventListener('change', () => changeMode('auto'));
  unsetBtn && unsetBtn.addEventListener('click', () => unset());
  Object.keys(selectElements).forEach((type) => {
    if (selectElements[type]) {
      document.onload = initValue(type);
      selectElements[type].addEventListener('change', (e) =>
        setSelection(type, e.target.value)
      );
    }
  });
}
