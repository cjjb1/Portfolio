# 📝 Reclamaciones-app — Sketchnote & Lámina de Arquitectura Técnica

> **Reclamaciones-app** es la plataforma web corporativa (**React 18 SPA + Node.js / Express + IISNode**) desarrollada para **Walstead Iberia (Rotocobrhi)**, diseñada para digitalizar, auditar y automatizar de extremo a extremo la trazabilidad, valoración económica y envío de **reclamaciones de calidad sobre bobinas y resmas de papel**, integrando en tiempo real el mainframe industrial **IBM AS/400 (DB2)**, repositorios locales en **MySQL (`compras`)**, transcodificación multimedia con **FFmpeg** y distribución segura vía **WITrans**.

---

## 🎨 Lámina Visual de Arquitectura (Handwritten Notes)

![](./reclamaciones_sketchnote.jpg)

---

## 🏗️ Topología de Infraestructura y Servidores

```mermaid
flowchart TB
    subgraph CLIENTES["Estaciones de Trabajo y Navegadores"]
        NAV["💻 Navegador Web Intranet / Extranet<br/>(HTTPS Reverse Proxy / NTLM SSO / AD)"]
        REACT_SPA["⚛️ React 18 / Vite / Tailwind CSS<br/>(SPA Reactiva / React-PDF / Lucide)"]
    end

    subgraph RC12["Servidor de Aplicación (RCSERVER12 - 10.0.3.32)"]
        IIS["🌐 Microsoft IIS 10<br/>URL Rewrite & SSL"]
        IISNODE["⚡ IISNode / Node.js 18+<br/>(app.mjs / Express REST API)"]
        FFMPEG["🎬 FFmpeg CLI<br/>(Transcodificación AVI -> MP4 H.264)"]
        CLEANUP["🧹 Servicio Cleanup Diario<br/>(Purga de temporales >24h)"]
        DATA_ABONOS["📁 Repositorio de Abonos Seguros<br/>(d:/Reclamaciones-app/data/abonos/)"]
    end

    subgraph RC13["Servidor de Integración (RCSERVER13 - 10.0.3.33)"]
        PHP_BRIDGE["🌉 Puente PHP AS/400<br/>api_bobina.php (odbc_pconnect)"]
        DB_COMPRAS[("🗄️ MySQL compras<br/>(reclamaciones, entidades, maquinas)")]
    end

    subgraph RC03["Servidor de Facturación (RCSERVER03 - 10.0.3.42)"]
        DB_FAC[("🗄️ MySQL facturacion<br/>(Maestro de terceros / clientes)")]
    end

    subgraph MAINFRAME["Entorno Industrial IBM iSeries"]
        AS400[("🏭 IBM AS/400 (DB2)<br/>(LDATA2 / LEGSV2 - Bobinas y Mermas)")]
    end

    subgraph EXTERNAL["Servicios Corporativos & Entrega Segura"]
        WITRANS["📦 Servidor WITrans (10.10.2.145:8080)<br/>(Envío cifrado y acuse de recibo)"]
        AD["🔑 Directorio Activo LDAP<br/>(Dominio ROTEDIC - NTLM SSO)"]
        EMAIL_ABONOS["✉️ Notificaciones Financieras<br/>ruben.lopez@walstead.es"]
    end

    NAV -->|HTTPS :443| IIS
    IIS --> IISNODE
    IISNODE --> REACT_SPA
    IISNODE --> FFMPEG
    IISNODE --> CLEANUP
    IISNODE --> DATA_ABONOS

    IISNODE -->|Puente HTTP Rápido| PHP_BRIDGE
    PHP_BRIDGE -->|ODBC Persistente| AS400
    IISNODE -.->|ODBC Directo Fallback| AS400

    IISNODE -->|Sequelize Pool :3306| DB_COMPRAS
    IISNODE -->|Sequelize Pool :3306| DB_FAC

    IISNODE -->|NTLM Handshake / Header| AD
    IISNODE -->|Multipart REST API Token| WITRANS
    WITRANS -.-> EMAIL_ABONOS
```

---

## 🧩 Módulos Funcionales Clave

| # | Módulo | Ficheros Core | Rol y Capacidades Técnicas |
| :---: | :--- | :--- | :--- |
| **1** | **Gestor de Incidencias & Autonumeración** | `routes/reclamaciones.js`<br>`ReclamacionForm.jsx` | Generación secuencial inmutable de código de reclamación fiscal (`YY/NNNNN`). Soporte dual para **Bobinas** continuas y **Resmas precortadas para máquina KBA** con validación estricta. |
| **2** | **Puente Industrial AS/400 (DB2)** | `services/as400.js`<br>`api_bobina.php` (RC13) | Consulta en tiempo real de pesos brutos/netos, metros, proveedores y albaranes en tablas `LDATA2/LEGSV2`. Mecanismo de alta velocidad mediante conexiones persistentes PHP en `rcserver13`. |
| **3** | **Motor de Paradas Múltiples y Mermas** | `ReclamacionForm.jsx`<br>`routes/reclamaciones.js` | Cálculo dinámico de 1ª parada, 2ª parada (con opción de **35 min**) y paradas adicionales consecutivas (3ª, 4ª...) con tarifas horarias incrementales (`700 €/h` a `1.300 €/h`) y suma de merma en kg. |
| **4** | **Evidencias y Pipeline FFmpeg** | `services/videoConverter.js`<br>`routes/reclamaciones.js` | Subida drag & drop con compresión en cliente de imágenes (Canvas) y transcodificación asíncrona de vídeo pesado (`.avi`) a formato estándar Web `.mp4` H.264 para aligerar envíos. |
| **5** | **Informes PDF Multilingües** | `ReclamacionPDFDocument.jsx`<br>`ReclamacionOficialPDFDocument.jsx` | Generación client-side con `@react-pdf/renderer` de la **Ficha Técnica** y la **Carta Oficial** maquetadas para impresión corporativa y traducidas a 5 idiomas (`ES`, `EN`, `FR`, `IT`, `DE`). |
| **6** | **Despacho Digital WITrans** | `EnviarPaqueteModal.jsx`<br>`routes/reclamaciones.js` | Empaquetado y subida cifrada con token hacia la pasarela WITrans (`10.10.2.145:8080`), registrando acuses de recibo y log de descargas por parte de proveedores papeleros. |
| **7** | **Módulo Financiero de Abonos & "No Procede"** | `SubirAbonoModal.jsx`<br>`routes/reclamaciones.js` | Detección de estado "Abonado/Cobrado", subida segura con sandbox contra *Path Traversal*, acoplado a la Ficha Técnica PDF y despacho automático a `ruben.lopez@walstead.es`. Manejo del estado `'NO PROCEDE'` con vaciado de importes. |
| **8** | **Directorio de Terceros y Múltiples Direcciones** | `routes/clientes.js`<br>`ClienteDetalle.jsx` | Maestro de Clientes, Papeleros y Proveedores. Almacenamiento JSON de direcciones múltiples (Fábrica, Almacén, Fiscal) con selector interactivo para el estampado en cartas oficiales. |
| **9** | **Exportador Modular Excel Parametrizado** | `ExportarExcelModal.jsx`<br>`Dashboard.jsx` | Exportación CSV con UTF-8 BOM, filtros combinados y selección de hasta 26 campos configurables, garantizando el bloque financiero contiguo (`Importe Cobrado` ➔ `Pendiente` ➔ `Total` ➔ `Seguimiento`). |
| **10** | **SSO Windows NTLM y Control de Acceso** | `authMiddleware.js`<br>`permissions.json` | Autenticación integrada corporativa sin JWT basada en Active Directory Windows. Roles estrictos (`admin`, `editor`, `compras`, `operador`, `pendiente`) y formateo automático de nombres. |

---

## 🔄 Ciclo de Vida de una Reclamación de Calidad

```mermaid
sequenceDiagram
    autonumber
    actor Operador as Técnico de Taller / Calidad
    actor RespCompras as Responsable de Compras / Calidad
    participant UI as React 18 SPA (Frontend)
    participant Core as API Express (RCSERVER12)
    participant Bridge as Puente PHP (RCSERVER13)
    participant AS400 as Mainframe AS/400 (DB2)
    participant DB as MySQL compras (10.0.3.33)
    participant WITrans as Plataforma WITrans
    actor Proveedor as Fabricante de Papel

    Operador->>UI: 1. Detecta defecto en máquina (rotura, impurezas, gramaje)
    Operador->>UI: 2. Nueva Reclamación (Selecciona Año Fiscal -> Formulario)
    UI->>Core: GET /reclamaciones/siguiente-numero?ano=2026
    Core->>DB: SELECT MAX(consecutivo) FROM reclamaciones WHERE ano=2026
    Core-->>UI: Devuelve siguiente número inmutable (ej: 26/00145)

    Operador->>UI: 3. Introduce Número de Bobina / Código Interno
    UI->>Bridge: Consulta autocompletado bobina
    Bridge->>AS400: SELECT en LDATA2.BBM001F / ALB001F (odbc_pconnect)
    AS400-->>Bridge: Peso, Proveedor, Cliente, Tarifa y Medidas
    Bridge-->>UI: Rellena automáticamente campos técnicos

    Operador->>UI: 4. Imputa paradas de máquina y merma en kg
    UI->>UI: Calcula en vivo: 1ª parada + 2ª parada (+ tarifa incremental) + Paradas adicionales
    Operador->>UI: 5. Adjunta fotos/vídeos y guarda
    UI->>Core: POST /reclamaciones (Datos + Archivos)
    opt Vídeo es .AVI pesado
        Core->>Core: FFmpeg convierte asíncronamente a MP4 H.264
    end
    Core->>DB: INSERT en compras.reclamaciones

    RespCompras->>UI: 6. Revisa Ficha, traduce al idioma del proveedor (EN, FR, DE, IT)
    RespCompras->>UI: 7. Enviar Paquete a Papelero (Mod EnviarPaquete)
    UI->>Core: POST /reclamaciones/:id/enviar-paquete
    Core->>WITrans: Sube paquete cifrado (Carta PDF + Ficha + Multimedia)
    WITrans-->>Proveedor: Enlace seguro de descarga con acuse de recibo

    alt Proveedor Emite Abono (Estado ABONADO)
        RespCompras->>UI: 8. Cambia estado a "ABONADO" y sube justificante
        UI->>Core: POST /reclamaciones/:id/subir-abono (PDF Abono + Ficha PDF)
        Core->>Core: Valida extensiones seguras y aplica sanitización Path Traversal
        Core->>DB: Actualiza estado, fecha_abono y archivo_abono
        Core->>WITrans: Despacha automáticamente notificación a ruben.lopez@walstead.es
    else Incidencia desestimada (Estado NO PROCEDE)
        RespCompras->>UI: 8b. Marca como "NO PROCEDE"
        UI->>Core: PUT /reclamaciones/:id (estado='NO PROCEDE')
        Core->>DB: Anula y pone a 0 importes y kilos (papel_kgs=0, importe_economico=0...)
    end
```

---

## ⚡ Motor de Cálculo de Costes y Paradas de Taller

El coste total de una reclamación de papel integra tanto el valor de la merma de material como el lucro cesante por parada de rotativa:

$$\text{Coste Papel (€)} = \text{Kilos Papel} \times \left(\frac{\text{Precio Tonelada}}{1000}\right)$$

$$\text{Coste 1ª Parada (€)} = \left(\frac{\text{Minutos 1ª Parada}}{60}\right) \times \text{Tarifa Base Máquina (€/h)}$$

$$\text{Tarifa 2ª Parada (€/h)} = \text{Tarifa Base} + \text{Tarifa Extra Incremental}$$

$$\text{Coste 2ª Parada (€)} = \left(\frac{\text{Minutos 2ª Parada (ej: 35m)}}{60}\right) \times \text{Tarifa 2ª Parada}$$

$$\text{Coste Paradas Adicionales (€)} = \sum_{i=3}^{n} \left(\text{Horas}_i \times \text{Tarifa}_i\right)$$

$$\text{Coste Total Reclamado (€)} = \text{Coste Papel} + \text{Coste 1ª Parada} + \text{Coste 2ª Parada} + \text{Coste Paradas Adic.} + \text{Otros Costes}$$

### Tarifas Horarias Incrementales de Rotativa:
- **Litho IV y V:** `1.300,00 €/h`
- **Litho II y VII:** `900,00 €/h`
- **M-606 y Rotoman:** `700,00 €/h`
- **KBA (Plana) y Sunday:** Tarifa configurable según pliego de condiciones de taller.
