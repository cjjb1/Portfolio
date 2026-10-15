// ==========================================
// 1. Alternador de tema diurno / nocturno (Light / Dark Mode)
// ==========================================
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

// ==========================================
// 2. Sistema de Internacionalización (i18n ES / EN)
// ==========================================
function getNestedTranslation(obj, keyPath) {
  if (!obj) return null;
  const parts = keyPath.split('.');
  let cur = obj;
  for (const part of parts) {
    if (!cur || cur[part] === undefined) return null;
    cur = cur[part];
  }
  return cur;
}

function setLanguage(lang) {
  if (!window.I18N || !window.I18N[lang]) {
    lang = 'es';
  }

  const dict = window.I18N[lang];
  htmlEl.lang = lang;
  localStorage.setItem('portfolio-lang', lang);

  // Meta & Page Title
  if (dict.meta) {
    if (dict.meta.title) document.title = dict.meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict.meta.desc) metaDesc.setAttribute('content', dict.meta.desc);
  }

  // Text translations
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = getNestedTranslation(dict, key);
    if (val !== null) el.textContent = val;
  });

  // HTML markup translations (preserve <strong>, <code>, <br>)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const val = getNestedTranslation(dict, key);
    if (val !== null) el.innerHTML = val;
  });

  // Title and Aria attributes
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const val = getNestedTranslation(dict, key);
    if (val !== null) el.setAttribute('title', val);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    const val = getNestedTranslation(dict, key);
    if (val !== null) el.setAttribute('aria-label', val);
  });

  // Update open/closed state of drawer toggle buttons on language switch
  document.querySelectorAll('.btn-drawer-toggle').forEach(btn => {
    const textSpan = btn.querySelector('.btn-drawer-text');
    if (!textSpan) return;
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    const isIvido = btn.id === 'btn-drawer-ivido' || (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes('ivido'));
    if (dict && dict.projects) {
      if (isIvido) {
        textSpan.textContent = isExpanded 
          ? (dict.projects.pIvidoDrawerCollapse || 'Plegar Memoria Técnica')
          : (dict.projects.pIvidoDrawerBtn || 'Desplegar Memoria Técnica & Arquitectura');
      } else {
        textSpan.textContent = isExpanded 
          ? (dict.projects.drawerCollapse || 'Plegar Ficha Técnica')
          : (dict.projects.drawerExpand || 'Desplegar Arquitectura, Módulos & Pipeline');
      }
    }
  });

  // Dynamic CV Links & Previews (ES vs EN)
  const heroCvBtn = document.getElementById('hero-cv-btn');
  const cvPdfBtn = document.getElementById('cv-pdf-btn');
  const cvDocxBtn = document.getElementById('cv-docx-btn');
  const cvPreviewImg = document.getElementById('cv-preview-img');
  const cvPreviewWrapper = document.getElementById('cv-preview-wrapper');

  if (lang === 'en') {
    if (heroCvBtn) heroCvBtn.setAttribute('href', 'docs/Carlos_Juarez_CV_EN.pdf');
    if (cvPdfBtn) cvPdfBtn.setAttribute('href', 'docs/Carlos_Juarez_CV_EN.pdf');
    if (cvDocxBtn) cvDocxBtn.setAttribute('href', 'docs/Carlos_Juarez_CV_EN.docx');
    if (cvPreviewImg) {
      cvPreviewImg.setAttribute('src', 'images/cv-preview-en.png');
      cvPreviewImg.setAttribute('alt', 'Curriculum Vitae Carlos Juárez (English)');
    }
    if (cvPreviewWrapper) {
      cvPreviewWrapper.setAttribute('onclick', "openLightbox('images/cv-preview-en.png', 'Professional Curriculum Vitae - Carlos Juárez')");
    }
  } else {
    if (heroCvBtn) heroCvBtn.setAttribute('href', 'docs/Carlos_Juarez_CV.pdf');
    if (cvPdfBtn) cvPdfBtn.setAttribute('href', 'docs/Carlos_Juarez_CV.pdf');
    if (cvDocxBtn) cvDocxBtn.setAttribute('href', 'docs/Carlos_Juarez_CV.docx');
    if (cvPreviewImg) {
      cvPreviewImg.setAttribute('src', 'images/cv-preview.png');
      cvPreviewImg.setAttribute('alt', 'Curriculum Vitae Carlos Juárez (Español)');
    }
    if (cvPreviewWrapper) {
      cvPreviewWrapper.setAttribute('onclick', "openLightbox('images/cv-preview.png', 'Curriculum Vitae Profesional - Carlos Juárez')");
    }
  }

  // Update Navbar Language Toggle Pill UI
  const esCode = document.querySelector('.lang-code.es');
  const enCode = document.querySelector('.lang-code.en');
  if (esCode && enCode) {
    if (lang === 'en') {
      esCode.classList.remove('active');
      enCode.classList.add('active');
    } else {
      esCode.classList.add('active');
      enCode.classList.remove('active');
    }
  }

  const langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn && dict.nav) {
    langToggleBtn.setAttribute('title', dict.nav.langTitle);
    langToggleBtn.setAttribute('aria-label', dict.nav.langAria);
  }

  // Sync URL cleanly without breaking subpath or root
  try {
    const url = new URL(window.location.href);
    if (lang === 'en') {
      url.searchParams.set('lang', 'en');
    } else {
      url.searchParams.delete('lang');
    }
    const cleanSearch = url.searchParams.toString() ? '?' + url.searchParams.toString() : '';
    window.history.replaceState({ lang }, '', url.pathname + cleanSearch + url.hash);
  } catch (e) {
    // Fallback
  }
}

// Inicializar idioma (URL ?lang=, /en, localStorage o por defecto 'es')
const pathLower = window.location.pathname.toLowerCase();
const pathIsEn = pathLower.endsWith('/en') || pathLower.includes('/en/');
const urlParams = new URLSearchParams(window.location.search);
const savedLang = localStorage.getItem('portfolio-lang');
const initialLang = urlParams.get('lang') || (pathIsEn ? 'en' : (savedLang || 'es'));

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setLanguage(initialLang));
} else {
  setLanguage(initialLang);
}

const langToggle = document.getElementById('lang-toggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    const cur = htmlEl.lang === 'en' ? 'en' : 'es';
    const target = cur === 'en' ? 'es' : 'en';
    setLanguage(target);
  });
}

// ==========================================
// 3. Navegación móvil
// ==========================================
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

// ==========================================
// 4. Filtro de proyectos
// ==========================================
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

// ==========================================
// 5. Modal Lightbox para infografías y CV
// ==========================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDownload = document.getElementById('lightbox-download');

function openLightbox(imgSrc, title) {
  if (!lightbox) return;
  const currentLang = htmlEl.lang === 'en' ? 'en' : 'es';
  const defaultTitle = window.I18N && window.I18N[currentLang] && window.I18N[currentLang].lightbox 
    ? window.I18N[currentLang].lightbox.defaultTitle 
    : 'Infografía de Arquitectura Técnica';

  lightboxImg.src = imgSrc;
  lightboxTitle.textContent = title || defaultTitle;
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

// Cerrar con la tecla ESC (Lightbox)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});

// ==========================================
// 6. Cajón Desplegable de Ficha Técnica & Arquitectura
// ==========================================
function toggleTechDrawer(drawerId, btn) {
  const drawer = document.getElementById(drawerId);
  if (!drawer) return;

  const isOpen = drawer.classList.contains('is-open');
  const currentLang = htmlEl.lang === 'en' ? 'en' : 'es';
  const dict = window.I18N && window.I18N[currentLang] ? window.I18N[currentLang].projects : null;
  const isIvido = drawerId === 'drawer-ivido';

  const defaultExpand = isIvido && dict && dict.pIvidoDrawerBtn 
    ? dict.pIvidoDrawerBtn 
    : (dict && dict.drawerExpand ? dict.drawerExpand : 'Desplegar Arquitectura, Módulos & Pipeline');
  const defaultCollapse = isIvido && dict && dict.pIvidoDrawerCollapse 
    ? dict.pIvidoDrawerCollapse 
    : (dict && dict.drawerCollapse ? dict.drawerCollapse : 'Plegar Ficha Técnica');

  // Encontrar botones relacionados con este drawer
  const toggleButtons = document.querySelectorAll(`button[onclick*="'${drawerId}'"], button[onclick*='"${drawerId}"']`);

  if (isOpen) {
    drawer.classList.remove('is-open');
    toggleButtons.forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.classList.remove('active', 'is-open');
      const textSpan = b.querySelector('.btn-drawer-text');
      if (textSpan) textSpan.textContent = defaultExpand;
    });
  } else {
    drawer.classList.add('is-open');
    toggleButtons.forEach(b => {
      b.setAttribute('aria-expanded', 'true');
      b.classList.add('active', 'is-open');
      const textSpan = b.querySelector('.btn-drawer-text');
      if (textSpan) textSpan.textContent = defaultCollapse;
    });

    // Si se activa desde el botón del pitch, scroll suave hacia el inicio del cajón
    if (btn && btn.classList.contains('pitch-read-more')) {
      setTimeout(() => {
        drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }
}

