window.I18N.es.veeam = {
  "pageTitle": "Veeam Tape Monitor | Carlos Juárez",
  "pageDescription": "Veeam Tape Monitor, panel end-to-end para diagnóstico, seguimiento y gestión de copias en cinta con Veeam Backup & Replication.",
  "cat": "Infraestructura · Copias de seguridad",
  "status": "Aplicación interna",
  "pitch": "Panel web interno que amplía la visión operativa de <strong>Veeam Backup &amp; Replication</strong>. Integra los logs y el catálogo de Veeam en una <strong>API propia</strong> para explicar esperas, seguir el progreso de las copias, preparar rotaciones y gestionar medios de cinta.",
  "back": "Volver al catálogo",
  "home": "Inicio",
  "contact": "Contacto",
  "preview": "Interfaz operativa",
  "previewDesc": "Vista del trabajo en ejecución, el último cartucho aceptado, el calendario y el progreso de la copia.",
  "arch": "Arquitectura técnica",
  "archDesc": "Recorrido desde los logs y el catálogo de Veeam hasta el panel web.",
  "gallery": "Colección visual",
  "galleryIntro": "Explora el flujo de datos, el diagnóstico, la gestión de cartuchos y el despliegue. Cada lámina incluye un diagrama de flujo editable.",
  "expand": "Ampliar lámina",
  "flow": "Ver diagrama de flujo",
  "editable": "Descargar diagrama editable (Mermaid)",
  "doc": "Documentación técnica",
  "docDownload": "Descargar documentación (Markdown)",
  "sectionContext": "Necesidad operativa",
  "context": "Durante una espera de cinta, el operador necesita saber qué cartucho solicita el trabajo, por qué se ha rechazado el que está montado y qué evidencia respalda el diagnóstico. El panel añade esa vista a la operación diaria de Veeam, junto con los históricos y la preparación del siguiente ciclo.",
  "sectionIntegration": "Integración y flujo de datos",
  "integration": "El monitor lee los logs de forma incremental, guarda eventos y puntos de lectura en SQLite y reconstruye sesiones y solicitudes. El módulo PowerShell de Veeam aporta catálogo, trabajos, tareas y progreso. Fastify publica la API REST y usa SSE para avisar al panel React cuando hay cambios.",
  "sectionRules": "Evidencia y reglas de decisión",
  "rules": "El diagnóstico conserva la línea original y distingue entre un rechazo explícito y una generación inferida. La recomendación requiere una espera vigente y un medio libre que cumpla las reglas de biblioteca, pool, capacidad y protección. Al abrir un ZIP, la evidencia se consulta dentro de su propio histórico.",
  "sectionDeploy": "Operación y despliegue",
  "deploy": "WinSW aloja el servicio en Windows Server con almacenamiento SQLite local. El servicio autentica el acceso local y el HTTPS privado opcional. Las operaciones de medios requieren permisos específicos, se registran y conservan su estado para consultar el resultado.",
  "stack": "Tecnologías utilizadas",
  "source": "Documentación del portfolio basada en el código y las pruebas del proyecto. El gráfico de progreso de la colección usa datos ilustrativos.",
  "sheetsIndex": "Índice de láminas",
  "catalogNav": "Navegación entre proyectos",
  "previous": "Anterior",
  "next": "Siguiente",
  "close": "Cerrar imagen",
  "title-arquitectura": "Arquitectura del monitor",
  "desc-arquitectura": "Dos fuentes alimentan el diagnóstico y el catálogo. El panel recibe las vistas mediante REST y las actualizaciones mediante SSE.",
  "title-diagnostico": "Diagnóstico de esperas",
  "desc-diagnostico": "El monitor agrupa señales por sesión y muestra qué tipo de Media Set pidió Veeam, cuál observó y qué evidencia sustenta la conclusión.",
  "title-progreso": "Seguimiento de la copia",
  "desc-progreso": "Las lecturas del catálogo alimentan la evolución del porcentaje, con el momento de la última consulta.",
  "title-medios": "Catálogo, unidades y cintas",
  "desc-medios": "La vista de Medios reúne bibliotecas, unidades, cartuchos y pools, con información de ubicación y capacidad cuando está disponible.",
  "title-seleccion": "Selección y rotación de cintas",
  "desc-seleccion": "La preparación diaria consulta la programación y las cintas asignadas. Durante una espera, la recomendación exige una solicitud vigente y un cartucho elegible.",
  "title-historico": "Históricos ZIP y evidencia",
  "desc-historico": "Cada paquete ZIP se valida y se procesa en un ámbito independiente de la monitorización en directo.",
  "title-operaciones": "Operaciones de medios",
  "desc-operaciones": "El administrador puede solicitar inventario, catalogación, verificación, importación, exportación o renombrado y seguir el resultado en el panel.",
  "title-despliegue": "Despliegue y acceso",
  "desc-despliegue": "Un servicio WinSW ejecuta el monitor en Windows Server. El acceso autenticado puede habilitarse mediante HTTPS en la red privada."
};

window.I18N.en.veeam = {
  "pageTitle": "Veeam Tape Monitor | Carlos Juárez",
  "pageDescription": "Veeam Tape Monitor, an end-to-end dashboard for diagnosing, tracking and managing Veeam Backup & Replication tape backups.",
  "cat": "Infrastructure · Backup",
  "status": "Internal application",
  "pitch": "An internal web dashboard that extends the operational view of <strong>Veeam Backup &amp; Replication</strong>. It brings Veeam logs and catalog data together through its <strong>own API</strong> to explain waits, track backup progress, prepare rotations and manage tape media.",
  "back": "Back to the catalog",
  "home": "Home",
  "contact": "Contact",
  "preview": "Operator dashboard",
  "previewDesc": "View of the running job, the last accepted cartridge, the calendar and copy progress.",
  "arch": "Technical architecture",
  "archDesc": "From Veeam logs and catalog data to the web dashboard.",
  "gallery": "Visual collection",
  "galleryIntro": "Explore data flow, diagnostics, cartridge management and deployment. Each sheet includes an editable flowchart.",
  "expand": "Enlarge sheet",
  "flow": "View flowchart",
  "editable": "Download editable diagram (Mermaid)",
  "doc": "Technical documentation",
  "docDownload": "Download documentation (Markdown)",
  "sectionContext": "Operational need",
  "context": "During a tape wait, the operator needs to know what the job is asking for, why the mounted cartridge was rejected and what evidence supports the diagnosis. The dashboard adds that view to daily Veeam operations, alongside historical records and preparation for the next cycle.",
  "sectionIntegration": "Integration and data flow",
  "integration": "The monitor reads logs incrementally, stores events and checkpoints in SQLite, and reconstructs sessions and requests. The Veeam PowerShell module provides catalog, job, task and progress data. Fastify serves the REST API and uses SSE to tell the React dashboard when data changes.",
  "sectionRules": "Evidence and decision rules",
  "rules": "The diagnosis keeps the original log line and distinguishes an explicit rejection from an inferred generation. A recommendation requires a current wait and free media meeting library, pool, capacity and protection rules. Opening a ZIP makes its evidence available in its own archive scope.",
  "sectionDeploy": "Operations and deployment",
  "deploy": "WinSW hosts the service on Windows Server with local SQLite storage. Both local access and optional private HTTPS require authentication. Media operations require specific permissions, and their state is recorded so the outcome can be reviewed.",
  "stack": "Technology stack",
  "source": "Portfolio documentation based on the project source and tests. The progress chart in the visual collection uses illustrative data.",
  "sheetsIndex": "Sheet index",
  "catalogNav": "Project navigation",
  "previous": "Previous",
  "next": "Next",
  "close": "Close image",
  "title-arquitectura": "Monitor architecture",
  "desc-arquitectura": "Two sources feed diagnostics and the catalog. The dashboard receives views through REST and updates through SSE.",
  "title-diagnostico": "Tape wait diagnostics",
  "desc-diagnostico": "The monitor groups signals by session and shows the requested and observed Media Set types and the evidence behind the finding.",
  "title-progreso": "Copy progress",
  "desc-progreso": "Catalog samples power the progress trend and show when the last reading was taken.",
  "title-medios": "Catalog, drives and tapes",
  "desc-medios": "The Media view brings together libraries, drives, tapes and pools, including location and capacity where available.",
  "title-seleccion": "Tape selection and rotation",
  "desc-seleccion": "Daily preparation uses scheduling and assigned tapes. During a wait, a recommendation requires a current request and an eligible cartridge.",
  "title-historico": "ZIP archives and evidence",
  "desc-historico": "Each ZIP archive is validated and processed in a scope separate from live monitoring.",
  "title-operaciones": "Media operations",
  "desc-operaciones": "The administrator can request inventory, cataloging, verification, import, export or rename operations and track the outcome in the dashboard.",
  "title-despliegue": "Deployment and access",
  "desc-despliegue": "A WinSW service runs the monitor on Windows Server. Authenticated HTTPS access can be enabled on the private network."
};

const veeamAssets = document.querySelectorAll('[data-veeam-asset]');
if (veeamAssets.length) {
  const syncVeeamAssets = () => {
    const lang = document.documentElement.lang === 'en' ? 'en' : 'es';
    veeamAssets.forEach(asset => {
      const [name, suffix, extension] = asset.dataset.veeamAsset.split('|');
      const url = `images/projects/veeam-tape-monitor/${name}-${lang}${suffix}.${extension}`;
      asset.setAttribute(asset.tagName === 'IMG' ? 'src' : 'href', url);
    });
  };
  syncVeeamAssets();
  new MutationObserver(syncVeeamAssets).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang'],
  });

  const dialog = document.getElementById('lightbox');
  const closeButton = dialog.querySelector('.lightbox-close');
  let trigger;
  document.querySelectorAll('[data-veeam-lightbox]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      const lang = document.documentElement.lang;
      const key = link.dataset.veeamLightbox.split('.')[1];
      const title = window.I18N[lang].veeam[key];
      openLightbox(link.getAttribute('href'), title);
      dialog.querySelector('#lightbox-img').alt = title;
      closeButton.focus();
    });
  });
  new MutationObserver(() => {
    if (!dialog.classList.contains('active') && trigger) {
      trigger.focus();
      trigger = undefined;
    }
  }).observe(dialog, { attributes: true, attributeFilter: ['class'] });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const next = document.activeElement === closeButton
      ? dialog.querySelector('#lightbox-download')
      : closeButton;
    event.preventDefault();
    next.focus();
  });
}
