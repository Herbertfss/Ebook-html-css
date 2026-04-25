// ========================================
// DARK-MODE.JS - Tema Escuro
// ========================================

// Verificar preferência do sistema e localStorage
function getInitialTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    return savedTheme;
  }

  // Verificar preferência do sistema
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

// Aplicar tema
function setTheme(theme) {
  const root = document.documentElement;
  const darkModeToggle = document.getElementById("darkModeToggle");
  const icon = darkModeToggle?.querySelector("i");

  if (theme === "dark") {
    // Cores do modo escuro
    root.style.setProperty("--text-primary", "#f1f3f5");
    root.style.setProperty("--text-secondary", "#cbd5e1");
    root.style.setProperty("--text-muted", "#94a3b8");
    root.style.setProperty("--bg-primary", "#0f172a");
    root.style.setProperty("--bg-secondary", "#1e293b");
    root.style.setProperty("--bg-tertiary", "#334155");
    root.style.setProperty("--border-color", "#334155");

    if (icon) {
      icon.className = "fas fa-sun";
    }

    document.body.classList.add("dark-mode");
  } else {
    // Cores do modo claro (reset para variáveis originais do base.css)
    root.style.setProperty("--text-primary", "#1e1e2f");
    root.style.setProperty("--text-secondary", "#4a4a5a");
    root.style.setProperty("--text-muted", "#7a7a8a");
    root.style.setProperty("--bg-primary", "#ffffff");
    root.style.setProperty("--bg-secondary", "#f8f9fa");
    root.style.setProperty("--bg-tertiary", "#f1f3f5");
    root.style.setProperty("--border-color", "#e1e4e8");

    if (icon) {
      icon.className = "fas fa-moon";
    }

    document.body.classList.remove("dark-mode");
  }

  localStorage.setItem("theme", theme);
}

// Alternar tema com animação
function toggleTheme() {
  const currentTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  // Adiciona transição temporária
  const transitionStyle = document.createElement("style");
  transitionStyle.textContent = `
        * {
            transition: background-color 0.3s ease, 
                        color 0.3s ease, 
                        border-color 0.3s ease,
                        box-shadow 0.3s ease !important;
        }
    `;
  document.head.appendChild(transitionStyle);

  setTimeout(() => {
    document.head.removeChild(transitionStyle);
  }, 300);

  setTheme(newTheme);

  // Mostrar feedback
  const message =
    newTheme === "dark" ? "🌙 Modo escuro ativado" : "☀️ Modo claro ativado";
  if (window.showToast) {
    window.showToast(message, "info");
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  const initialTheme = getInitialTheme();
  setTheme(initialTheme);

  // Adicionar evento ao botão
  const toggleBtn = document.getElementById("darkModeToggle");
  if (toggleBtn) {
    // Remove event listener antigo se existir
    const newToggleBtn = toggleBtn.cloneNode(true);
    toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);
    newToggleBtn.addEventListener("click", toggleTheme);
  }

  // Ouvir mudanças na preferência do sistema
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  darkModeMediaQuery.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  });
});

// Keyboard shortcut: Ctrl + D
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "d") {
    e.preventDefault();
    toggleTheme();
  }
});

console.log("🌓 Dark mode initialized");
