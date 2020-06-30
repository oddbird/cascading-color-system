export default function () {
  // root elements
  const root = document.querySelector('[data-ccs="root"]');
  const themeMenu = document.querySelector('[data-ccs="menu"]');
  const invertBtn = document.querySelector('[data-ccs-input="mode"]');
  const modeLight = document.querySelector('[data-ccs-input="light-mode"]');
  const modeDark = document.querySelector('[data-ccs-input="dark-mode"]');
  const modeAuto = document.querySelector('[data-ccs-input="auto-mode"]');
  const unsetBtn = document.querySelector('[data-ccs-input="unset"]');

  // controls
  const controls = {
    theme: document.querySelector('[data-ccs-input~="theme"]'),
    hue: document.querySelector('[data-ccs-input="hue"]'),
    sat: document.querySelector('[data-ccs-input="saturation"]'),
    light: document.querySelector('[data-ccs-input="lightness"]'),
    contrast: document.querySelector('[data-ccs-input="contrast"]'),
  };

  const showUnsetBtn = (show = true) => {
    if (unsetBtn) {
      show
        ? unsetBtn.removeAttribute("hidden")
        : unsetBtn.setAttribute("hidden", "");
    }
  };

  // attributes
  const attrs = {
    theme: "data-ccs-theme",
  };

  // properties
  const props = {
    hue: "--ccs-prime--user",
    sat: "--ccs-s--user",
    light: "--ccs-l--user",
    contrast: "--ccs-contrast--user",
    mode: "--ccs-mode--user",
  };

  // local storage
  const store = {
    theme: "ccsTheme",
    mode: "ccsMode",
    hue: "ccsHue",
    sat: "ccsSat",
    light: "ccsLight",
    contrast: "ccsContrast",
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
        showUnsetBtn();
      }
    }
  };

  const clearProps = (sub = null) =>
    Object.keys(props).forEach((prop) => {
      if (!sub || sub.includes(prop)) {
        root.style.removeProperty(props[prop]);
      }
    });

  const clearStore = (sub = null) =>
    Object.keys(store).forEach((type) => {
      if (!sub || sub.includes(type)) {
        localStorage.removeItem(store[type]);
      }
    });

  const resetControls = (sub = null) =>
    Object.keys(controls).forEach((type) => {
      if (!sub || sub.includes(type)) {
        const el = controls[type];
        if (el) {
          el.value = el.getAttribute("data-default");
        }
      }
    });

  const subTheme = ["hue", "sat", "light", "contrast"];

  const setSelection = (type, selection) => {
    const unsetTheme =
      controls.theme &&
      controls.theme.dataset.ccsInput &&
      controls.theme.dataset.ccsInput.includes("unset-values");

    if (type === "theme" && unsetTheme) {
      clearProps(subTheme);
      clearStore(subTheme);
      resetControls(subTheme);
    }
    setValue(type, selection);
  };

  // clear all settings on reset
  const unset = () => {
    if (controls.theme) {
      setValue("theme", controls.theme.getAttribute("data-default"), false);
    }
    clearStore();
    clearProps();
    resetControls();
    showUnsetBtn(false);
    if (modeAuto) {
      modeAuto.checked = true;
    }
  };

  // modes
  const getMode = () =>
    parseInt(getComputedStyle(root).getPropertyValue("--ccs-mode").trim(), 10);

  const changeMode = (scheme) => {
    const schemeDict = {
      light: 1,
      dark: -1,
      auto: 0,
    };
    const setting = schemeDict[scheme];
    if (setting) {
      setValue("mode", setting);
    } else {
      // if auto, remove mode props from root and store
      clearStore(["mode"]);
      clearProps(["mode"]);
    }
  };

  const toggleMode = () => {
    const modeDict = {
      1: modeLight,
      [-1]: modeDark,
    };
    const mode = getMode();
    setValue("mode", mode * -1);
    const modeBtn = modeDict[mode * -1];
    if (modeBtn) {
      modeBtn.checked = true;
    }
  };

  // initialize everything
  const initMenu = () => {
    if (themeMenu) {
      themeMenu.removeAttribute("hidden");
    }
  };
  const initMode = () => {
    let to = localStorage.getItem(store.mode);
    if (to) {
      const modeDict = {
        1: modeLight,
        [-1]: modeDark,
      };
      const modeBtn = modeDict[to];
      setValue("mode", to);
      if (modeBtn) {
        modeBtn.checked = true;
      }
    } else if (modeAuto) {
      modeAuto.checked = true;
    }
  };
  const initValue = (type) => {
    controls[type].setAttribute("data-default", controls[type].value);
    const to = localStorage.getItem(store[type]);
    if (to) {
      setValue(type, to, false);
      controls[type].value = to;
      showUnsetBtn();
    }
  };

  /* init defaults */
  window.onload = initMenu();
  window.onload = initMode();

  /* attach event listeners */
  invertBtn && invertBtn.addEventListener("click", toggleMode);
  modeLight && modeLight.addEventListener("change", () => changeMode("light"));
  modeDark && modeDark.addEventListener("change", () => changeMode("dark"));
  modeAuto && modeAuto.addEventListener("change", () => changeMode("auto"));
  unsetBtn && unsetBtn.addEventListener("click", unset);

  Object.keys(controls).forEach((type) => {
    if (controls[type]) {
      window.onload = initValue(type);
      controls[type].addEventListener("change", (e) =>
        setSelection(type, e.target.value)
      );
    }
  });
}
