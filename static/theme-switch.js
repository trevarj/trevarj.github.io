(() => {
  "use strict";

  const doc = document.documentElement;
  const themes = [
    { value: "amber", label: "Amber CRT" },
    { value: "nord", label: "Nord" },
    { value: "jade", label: "Jade" },
    { value: "monochrome", label: "Monochrome" },
  ];
  const legacyThemeMap = {
    mickeyds: "monochrome",
  };

  const defaultTheme = themes[0].value;
  const storageKey = "trev-theme";
  const fallbackTheme = "amber";
  const isThemeValid = (theme) =>
    themes.some((candidate) => candidate.value === theme);

  const getSavedTheme = () => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (isThemeValid(saved)) {
        return saved;
      }

      if (saved && Object.hasOwn(legacyThemeMap, saved)) {
        return legacyThemeMap[saved];
      }

      return null;
    } catch (_error) {
      return null;
    }
  };

  const applyTheme = (theme) => {
    if (theme === fallbackTheme) {
      doc.removeAttribute("data-theme");
      return;
    }

    doc.setAttribute("data-theme", theme);
  };

  const persistTheme = (theme) => {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (_error) {
      // no-op: localStorage may be unavailable in strict privacy modes
    }
  };

  const getCurrentTheme = () => {
    const savedTheme = getSavedTheme();
    if (savedTheme) {
      return savedTheme;
    }

    const htmlTheme = doc.getAttribute("data-theme");
    if (isThemeValid(htmlTheme)) {
      return htmlTheme;
    }

    return defaultTheme;
  };

  const buildSelect = () => {
    const footer = document.querySelector("body > footer");
    const placeholder = footer
      ? footer.querySelector(".theme-selector[data-theme-picker]")
      : null;

    if (!footer) {
      return;
    }

    if (document.getElementById("theme-select")) {
      return;
    }

    const wrapper = placeholder || document.createElement("div");
    wrapper.className = "theme-selector";
    const label = document.createElement("label");
    const select = document.createElement("select");
    const selectId = "theme-select";

    label.setAttribute("for", selectId);
    label.textContent = "Theme";
    select.id = selectId;
    select.name = "theme";

    for (const theme of themes) {
      const option = document.createElement("option");
      option.value = theme.value;
      option.textContent = theme.label;
      select.appendChild(option);
    }

    if (!placeholder || !placeholder.children.length) {
      wrapper.append(label, select);
    }

    if (!footer.contains(wrapper)) {
      footer.appendChild(wrapper);
    }

    const currentTheme = getCurrentTheme();
    select.value = currentTheme;
    applyTheme(currentTheme);

    select.addEventListener("change", (event) => {
      const nextTheme = event.target.value;
      applyTheme(nextTheme);
      persistTheme(nextTheme);
    });
  };

  const promotePlayLinks = () => {
    const playLinks = document.querySelectorAll("a[href*='/skifree-rs/'], a[href*='/skifree-rs']");
    for (const link of playLinks) {
      const text = link.textContent.trim().toLowerCase();
      if (text === "play here" || text.includes("play here")) {
        link.classList.add("button");
      }
    }
  };

  const initialTheme = getCurrentTheme();
  applyTheme(initialTheme);
  persistTheme(initialTheme);
  promotePlayLinks();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      promotePlayLinks();
      buildSelect();
    }, { once: true });
  } else {
    promotePlayLinks();
    buildSelect();
  }
})();
