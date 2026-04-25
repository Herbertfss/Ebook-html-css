// ========================================
// MAIN.JS - Funcionalidades Principais
// ========================================

// Barra de Progresso de Leitura
function updateProgressBar() {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const progressBar = document.getElementById("progressBar");

  if (progressBar) {
    progressBar.style.width = scrolled + "%";
  }
}

// Função para Copiar Código
window.copyCode = function (button) {
  const codeBlock = button.closest(".code-block");
  const code = codeBlock.querySelector("code");
  const textToCopy = code.textContent;

  // Copiar para clipboard
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      // Mostrar feedback visual
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> Copiado!';

      setTimeout(() => {
        button.innerHTML = originalText;
      }, 2000);

      // Mostrar toast de sucesso
      showToast("Código copiado com sucesso! 📋", "success");
    })
    .catch((err) => {
      console.error("Erro ao copiar:", err);
      showToast("Erro ao copiar código. Tente novamente.", "error");
    });
};

// Função para mostrar toast
function showToast(message, type = "success") {
  // Remove toast existente
  const existingToast = document.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  // Criar novo toast
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}" 
               style="color: ${type === "success" ? "#2ecc71" : "#e74c3c"}"></i>
            <span>${message}</span>
        </div>
    `;

  document.body.appendChild(toast);

  // Remover após 3 segundos
  setTimeout(() => {
    toast.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Adicionar animação de saída
const style = document.createElement("style");
style.textContent = `
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Funções de Compartilhamento
window.shareOnTwitter = function () {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(
    "Aprendendo HTML e CSS com este ebook incrível! 📚",
  );
  window.open(
    `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    "_blank",
  );
  showToast("Compartilhando no Twitter 📱");
};

window.shareOnLinkedIn = function () {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(
    "Ebook HTML & CSS - Do Zero ao Profissional",
  );
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`,
    "_blank",
  );
  showToast("Compartilhando no LinkedIn 💼");
};

window.shareOnWhatsApp = function () {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent("Confira este ebook gratuito de HTML e CSS!");
  window.open(`https://wa.me/?text=${text}%20${url}`, "_blank");
  showToast("Compartilhando no WhatsApp 📱");
};

// Scroll suave para links do sumário
document.querySelectorAll(".toc-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Atualizar URL sem recarregar
      history.pushState(null, null, targetId);

      // Destacar o elemento alvo
      targetElement.style.transition = "all 0.3s";
      targetElement.style.backgroundColor = "rgba(74, 111, 165, 0.1)";
      setTimeout(() => {
        targetElement.style.backgroundColor = "";
      }, 1000);
    }
  });
});

// Destacar link do sumário ativo baseado no scroll
function highlightActiveTocLink() {
  const sections = document.querySelectorAll(".chapter");
  const tocLinks = document.querySelectorAll(".toc-link");

  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 150) {
      current = section.getAttribute("id");
    }
  });

  tocLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
      // Estilo para link ativo
      link.style.background = "var(--primary-color)";
      link.style.color = "white";
    } else {
      link.style.background = "";
      link.style.color = "";
    }
  });
}

// Salvar posição de leitura
function saveReadingPosition() {
  const scrollPosition = window.pageYOffset;
  localStorage.setItem("ebook_scroll_position", scrollPosition);
}

function restoreReadingPosition() {
  const savedPosition = localStorage.getItem("ebook_scroll_position");
  if (savedPosition && !sessionStorage.getItem("position_restored")) {
    window.scrollTo({
      top: parseInt(savedPosition),
      behavior: "smooth",
    });
    sessionStorage.setItem("position_restored", "true");
    showToast("🔄 Continuando de onde você parou...", "info");
  }
}

// Verificar se é primeira visita
function checkFirstVisit() {
  if (!localStorage.getItem("ebook_visited")) {
    setTimeout(() => {
      showToast(
        "✨ Bem-vindo! Clique no sumário para navegar entre os capítulos.",
        "info",
      );
    }, 1000);
    localStorage.setItem("ebook_visited", "true");
  }
}

// Event Listeners
window.addEventListener("scroll", () => {
  updateProgressBar();
  highlightActiveTocLink();
  saveReadingPosition();
});

window.addEventListener("load", () => {
  restoreReadingPosition();
  checkFirstVisit();
});

// Salvar posição antes de sair
window.addEventListener("beforeunload", () => {
  saveReadingPosition();
});

// Keyboard Shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl + D para dark mode (será implementado no dark-mode.js)
  if (e.ctrlKey && e.key === "d") {
    e.preventDefault();
    const toggleBtn = document.getElementById("darkModeToggle");
    if (toggleBtn) toggleBtn.click();
  }

  // Ctrl + Home para voltar ao topo
  if (e.ctrlKey && e.key === "Home") {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

// Adicionar estatísticas de leitura
function updateReadingStats() {
  const totalChapters = document.querySelectorAll(".chapter").length;
  const readChapters = JSON.parse(
    localStorage.getItem("read_chapters") || "[]",
  );

  if (readChapters.length === totalChapters && totalChapters > 0) {
    showToast("🎉 Parabéns! Você completou todos os capítulos!", "success");
  }
}

// Marcar capítulo como lido
function markChapterAsRead(chapterId) {
  let readChapters = JSON.parse(localStorage.getItem("read_chapters") || "[]");
  if (!readChapters.includes(chapterId)) {
    readChapters.push(chapterId);
    localStorage.setItem("read_chapters", JSON.stringify(readChapters));
    updateReadingStats();
  }
}

// Observar capítulos sendo visualizados
const observerOptions = {
  threshold: 0.5,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const chapterId = entry.target.getAttribute("id");
      if (chapterId) {
        markChapterAsRead(chapterId);
      }
    }
  });
}, observerOptions);

document.querySelectorAll(".chapter").forEach((chapter) => {
  observer.observe(chapter);
});

console.log("🚀 Site carregado com sucesso! Aproveite o ebook!");
