# 📋 iViDo — Sketchnote & Lámina de Arquitectura Técnica

> **iViDo** (*Interfaz WEB para MyDoc*) es el servicio documental en **Node.js (ESM + Express 5)** diseñado para reemplazar progresivamente el sistema legacy **MyDoc / DQ (PHP)** en `RCSERVER03`, proporcionando contingencia total y servicio de documentos nativos desde `RCSERVER13`.

---

## 🎨 Lámina Visual de Arquitectura (Handwritten Notes)

![](./ivido_sketchnote.jpg)

---

## 🏛️ Topología de Infraestructura y Servidores

```mermaid
flowchart TB
    subgraph Clientes["Clientes & Aplicaciones"]
        Nav["💻 Navegador Web Intranet"]
        ExtApp["⚙️ Apps Externas (X-API-Key)"]
    end

    subgraph RC13["RCSERVER13 — Servidor de Producción iViDo"]
        Master["Master HTTP :3000<br/>(NTLM Central + Smart Proxy)"]
        SoapW["SOAP Worker :5001<br/>(1 Ticket Activo / Descarga)"]
        CacheW["Cache Workers :5002+<br/>(Round-Robin / APIs / UI)"]
        DiskCache[("📁 Caché Compartida PDFs")]
        MariaDB[("🗄️ MariaDB<br/>• ivido (Caché + Nativos)<br/>• diso (Espejo de Permisos)")]
    end

    subgraph RC03["RCSERVER03 — Servidor Legacy"]
        DQDB[("🗄️ MSSQL DQDB<br/>(Cola Tedious)")]
        LegacySoap["🔌 Servicio SOAP MyDoc<br/>(:8000 WcfDllAPI)"]
    end

    subgraph AS400["AS/400 (IBM DB2)"]
        ERP[("🏭 DB2 for i<br/>(ODBC Read-Only CCSID 1208)")]
    end

    subgraph RC12["RCSERVER12"]
        SMTP["✉️ Relay SMTP (Alertas & Avisos)"]
    end

    Nav -->|NTLM Auth| Master
    ExtApp -->|X-API-Key| Master

    Master -->|Fichero no cacheado| SoapW
    Master -->|PDF en disco / APIs / UI| CacheW

    SoapW --> LegacySoap
    SoapW --> DiskCache
    CacheW --> DiskCache
    CacheW --> MariaDB
    CacheW --> DQDB
    CacheW --> ERP
    SoapW -.->|Alertas| SMTP
```

---

## 📦 Módulos Funcionales Clave

| # | Módulo | Fichero Core | Rol y Capacidades Técnicas |
| :---: | :--- | :--- | :--- |
| **1** | **Dashboard** | [`core/dashboard.mjs`](file:///n:/Fuentes/node.js/iViDo/core/dashboard.mjs) | Landing page interactiva (`/`). Muestra tarjetas a módulos accesibles y la sección **Últimos Documentos** (30 más recientes con auto-refresco cada 60 s). |
| **2** | **Workflow** | [`core/paginaPrincipal.mjs`](file:///n:/Fuentes/node.js/iViDo/core/paginaPrincipal.mjs) | Buscador avanzado con filtros por tipo, fecha, personal y columnas dinámicas (`f_*`). Visor modal y cambio de estados con trazabilidad. |
| **3** | **Expedientes Comerciales** | [`core/expedientes.mjs`](file:///n:/Fuentes/node.js/iViDo/core/expedientes.mjs) | Gestión de carpetas de expedientes, vinculación por `IDEXP`, autocompletado de clientes (`/api/clientes/autocomplete`) y cálculo de márgenes. |
| **4** | **Archivar & Ingesta** | [`core/archivar.mjs`](file:///n:/Fuentes/node.js/iViDo/core/archivar.mjs) | Subida manual de PDFs, generación opcional de código de barras Code 128 y depósito en carpetas calientes (`_BD_00025` o nativas). |
| **5** | **Retenciones Documentales** | [`core/retencion.mjs`](file:///n:/Fuentes/node.js/iViDo/core/retencion.mjs) | Mantenimiento para administradores de políticas de caducidad documental (`expedientes_tablas_retencion`) con conteos en tiempo real. |
| **6** | **Bases de Datos Nativas** | [`core/basesDatos.mjs`](file:///n:/Fuentes/node.js/iViDo/core/basesDatos.mjs) | Asistentes para crear agrupaciones 100% iViDo (`idTabla >= 100`), hibridación de tablas MyDoc y editor de mapeos lógicos→físicos. |
| **7** | **Conector EDM (DB2)** | [`conectores/conectorEdm.mjs`](file:///n:/Fuentes/node.js/iViDo/conectores/conectorEdm.mjs) | Resuelve en tiempo real metadatos de pedidos de compra en el ERP AS/400 tras el escaneo de albaranes de entrada de material. |
| **8** | **API de Archivo Externa** | [`docs/API_ARCHIVO.md`](file:///n:/Fuentes/node.js/iViDo/docs/API_ARCHIVO.md) | Endpoints REST (`/api/archivo/existe`, `/api/archivo/subir`) con autenticación machine-to-machine vía `X-API-Key` (hash SHA-256). |

---

## ⚡ Flujo de Vida de una Petición Documental (`pdfDoc`)

```mermaid
sequenceDiagram
    autonumber
    actor Usuario as Navegador / Cliente
    participant Master as Master (cluster.mjs)
    participant Worker as Worker (Cache / SOAP)
    participant MariaDB as MariaDB (ivido / diso)
    participant MSSQL as SQL Server (DQDB)
    participant SOAP as SOAP MyDoc (RC03)

    Usuario->>Master: GET /?idTabla=X&idDocumento=Y (NTLM)
    alt PDF está en disco
        Master->>Worker: Enruta a Cache Worker (Round-Robin)
        Worker->>MariaDB: Consulta metadatos en documentos_cache
    else PDF NO está en disco
        Master->>Worker: Enruta a SOAP Worker (:5001)
        Worker->>SOAP: DownloadFileAsync con ticket único
        Worker->>Worker: Guarda PDF en disco y metadatos en MariaDB
    end

    opt Comprobación de Estado (si MSSQL está activo)
        Worker->>MSSQL: SELECT SYSESTADO (Cola Tedious)
        alt SYSESTADO != 1 (No activo)
            Worker->>MSSQL: Busca sustituto activo con mismo CB
        end
    end

    Worker->>Worker: Estampado al vuelo (pdf-lib):<br/>• Sello/Overlay EST_XX.pdf<br/>• Barcode Code 128 (bwip-js)<br/>• Comentarios, Fechas y Pie de Auditoría AD
    Worker->>MariaDB: Registra visualización (expedientes_visualizacion)
    Worker-->>Usuario: Retorna PDF estampado (o imagen web)
```

---

## 🛡️ Reglas Críticas de Concurrencia y Resiliencia

1. **Ticket SOAP único:** Solo 1 worker atiende SOAP para evitar colisiones de sesión con el servicio legacy.
2. **Cola Serializada Tedious:** SQL Server no admite peticiones concurrentes por el mismo socket; la cola `adQueryQueue` serializa todas las consultas.
3. **Trabajador de Fondo con Backoff:** El bucle asíncrono alterna precarga y limpieza solo cuando hay inactividad de usuario, pausándose de inmediato si entra tráfico web.
4. **Logs compartidos sin colisión:** Pino con rotación por fecha directa (append) y compresión semanal centralizada en el Master.
