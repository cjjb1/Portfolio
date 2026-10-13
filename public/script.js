// Alternador de tema diurno / nocturno (Light / Dark Mode)
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

function applyTheme(theme) {
  if (theme === 'light') {
    htmlEl.setAttribute('data-theme', 'light');
    localStorage.setItem('portfolio-theme', 'light');
  } else {
    htmlEl.removeAttribute('data-theme');
    localStorage.setItem('portfolio-theme', 'dark');
  }
}

// Inicializar tema respetando guardado o preferencia del sistema
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
  applyTheme('light');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = htmlEl.getAttribute('data-theme') === 'light';
    applyTheme(isLight ? 'dark' : 'light');
  });
}

// Navegación móvil
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// Filtro de proyectos
const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectItems.forEach(item => {
      const categories = item.getAttribute('data-category') || '';
      if (filter === 'all' || categories.includes(filter)) {
        item.style.display = 'grid';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Modal Lightbox para visualización de infografías y arquitecturas
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDownload = document.getElementById('lightbox-download');

function openLightbox(imgSrc, title) {
  if (!lightbox) return;
  lightboxImg.src = imgSrc;
  lightboxTitle.textContent = title || 'Infografía de Arquitectura Técnica';
  lightboxDownload.href = imgSrc;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

// Cerrar con la tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});
