# 📝 iMagina — Sketchnote & Lámina de Arquitectura Técnica

> **iMagina** es el portal web corporativo (**Single Page Application - SPA MDI**) en **PHP 7.4 / FastCGI (Nginx) + MariaDB + jQuery 3.7** alojado en el NAS Synology RS2418RP+ (**`RMNAS10`**), diseñado para la gestión integral de proyectos gráficos, preimpresión, control de tiempos, subcontratación, planificación de recursos y pasarela de facturación automática para **Rhapsody Media S.L.U.** (Grupo Walstead / Rotocobrhi).

---

## 🎨 Lámina Visual de Arquitectura (Handwritten Notes)

![](./imagina_sketchnote.jpg)

---

## 🏗️ Topología de Infraestructura y Servidores

```mermaid
flowchart TB
    subgraph CLIENTES["Clientes & Estaciones de Trabajo"]
        NAV["💻 Navegador Web Intranet / Extranet<br/>(HTTPS Reverse Proxy / Token + 2FA / AD)"]
        PROY_SYNC["🔄 Sincronización Inter-Pestañas<br/>(BroadcastChannel & localStorage)"]
    end

    subgraph NAS_RM["Synology RS2418RP+ (RMNAS10 - 10.10.2.145)"]
        NGINX["Nginx 1.23.1<br/>Reverse Proxy HTTPS"]
        FPM["PHP-FPM 7.4.33<br/>(Web Station / OPcache 2s)"]
        MARIADB_LOCAL[("🗄️ MariaDB Local<br/>BD: imagina<br/>(p:localhost)")]
        FTP_SRV["📁 Servidor FTP Virtual<br/>(/volume1/FTPVIRTUAL/)"]
    end

    subgraph RC03["RCSERVER03 (10.0.3.42)"]
        DB_FAC[("🗄️ MySQL facturacion2<br/>(Rhapsody Media S.L.U.)")]
        MYDOC[("📑 MS SQL Server DQDB<br/>(Archivo Documental MyDoc)")]
    end

    subgraph RC13["RCSERVER13 (10.0.3.33)"]
        IIS_FAC["🌐 IIS / Facturación Web<br/>interface.php (Robot Facturación)"]
        DB_RRHH[("🗄️ MySQL rrhh<br/>(Recursos Humanos / Personal)")]
    end

    subgraph CORP_NET["Servicios Corporativos & Control Horario"]
        AD["🔑 Directorio Activo LDAP<br/>(10.0.3.31 - Dominio ROTEDIC)"]
        DIGITEK[("⏱️ SQL Server DIGITEK<br/>(Fichajes / Presencia)")]
        SMTP["✉️ Relay SMTP Local / RC12<br/>(Notificaciones / Prefacturas)"]
    end

    NAV -->|HTTPS :443| NGINX
    PROY_SYNC <--> NAV
    NGINX --> FPM
    FPM --> MARIADB_LOCAL
    FPM --> FTP_SRV

    FPM -->|facConnect| DB_FAC
    FPM -->|HTTP Basic Auth| IIS_FAC
    IIS_FAC --> MYDOC
    FPM -->|rrhhConnect| DB_RRHH
    FPM -->|LDAP :389| AD
    FPM -->|FreeTDS pdo_dblib| DIGITEK
    FPM -.->|PHPMailer| SMTP
```

---

## 🧩 Módulos Funcionales Clave

| # | Módulo | Ficheros Core | Rol y Capacidades Técnicas |
| :---: | :--- | :--- | :--- |
| **1** | **Ficha de Proyecto (127)** | `mods/proyecto.php`<br>`mods/proyecto.js` | Centro neurálgico del proyecto. Edición de cabecera, clientes, publicaciones, fechas, estados y **dashboard financiero reactivo en tiempo real** (partes + pedidos vs. ingreso previsto / facturado). |
| **2** | **Partes de Trabajo (105)** | `mods/partes.php`<br>`mods/partes.js` | Registro y cronometraje de horas invertidas por operario y sección. Multiplica unidades/tiempo por coste horario para imputación directa al coste del proyecto. |
| **3** | **Pedidos Externos (118)** | `mods/pedidos.php`<br>`mods/pedidos.js` | Gestión de compras y subcontratación técnica a terceros (encuadernación, fotomecánica, transportes, manipulados). Imputa costes externos en tiempo real al proyecto. |
| **4** | **Prefacturación & Factura (106)** | `mods/factura.php`<br>`mods/factura.js` | Confección de líneas de prefactura valoradas. Botón **FACTURAR** con enlace desatendido al robot de `facturacion/interface.php` en `RCSERVER13` y botón **ECHAR ATRÁS** para refacturación controlada. |
| **5** | **Control & Monitorización (107)** | `mods/control.php`<br>`mods/control.js` | Cuadro de mando operativo para jefes de producción. Semáforos de avance, fechas de entrega, estados y alertas de desviación. |
| **6** | **Turnos & Fichajes (125 / 116)** | `mods/turnos.php`<br>`mods/presencia.php` | Planificación de cuadrantes rotativos, bolsas de horas extras/compensadas, generación de informes Excel/PDF e integración con marcajes de **DIGITEK SQL Server**. |
| **7** | **Planificación de Taller (121)** | `mods/plan.php`<br>`mods/plan_edit.php` | Diagramas visuales de carga de trabajo, asignación de proyectos a operadores, líneas temporales y hojas de producción para impresión (`plan_edit_prn.php`). |
| **8** | **Campaña El Corte Inglés (126)** | `mods/eci.php`<br>`mods/eci.js` | Ingesta masiva y validación mediante `OpenSpout` de hojas XLSX maestras de catálogos y promociones de El Corte Inglés, asignando subcampañas y páginas. |
| **9** | **Servidores & Cuentas FTP (113-115)** | `mods/ftp.php`<br>`mods/ftpeditor.php` | Administración del servidor FTP en el NAS (`/volume1/FTPVIRTUAL/`), gestión de credenciales por cliente y aislamiento de árboles de carpetas para intercambio de artes finales. |
| **10** | **Informe Financiero Mensual** | `informes/proyecto.php`<br>`informes/proyecto.js` | Reporte global de rentabilidad mensual. Agrupa proyectos facturados y previstos, clasifica el cumplimiento de margen objetivo y sincroniza selección bidireccional vía `BroadcastChannel`. |

---

## 🔄 Flujo de Vida de un Proyecto Gráfico en iMagina

```mermaid
sequenceDiagram
    autonumber
    actor Gestor as Gestor de Cuentas / Producción
    actor Operador as Técnico / Maquetador
    participant UI as Portal iMagina (SPA)
    participant Core as Backend PHP (RMNAS10)
    participant DB as MariaDB (imagina)
    participant Digitek as DIGITEK / RRHH
    participant FacRobot as Robot Facturación (RC13)
    participant FacDB as MySQL (facturacion2 RC03)

    Gestor->>UI: 1. Alta de Proyecto (Ficha 127)
    UI->>Core: POST tip=SAVE (Cliente, Publicación, Ingreso Previsto, Fecha Entrega)
    Core->>DB: INSERT / UPDATE imagina.proyectos
    
    Gestor->>UI: 2. Planificación (Mod 121)
    UI->>Core: Asigna proyecto a operadores y calendario
    
    loop Durante la producción
        Operador->>UI: 3. Imputa Horas en Partes (Mod 105)
        UI->>Core: Inicia / Finaliza tarea
        Core->>DB: Registra tiempos y calcula coste (Horas x Coste Horario)
        opt Subcontratación externa
            Gestor->>UI: Genera Pedido de Compra (Mod 118)
            Core->>DB: Registra coste externo en pedidos_externos
        end
        UI->>UI: Recalcula en vivo: Margen Bruto, Desviación y GAP
    end

    Gestor->>UI: 4. Cierre y Prefactura (Mod 106)
    UI->>Core: Confecciona líneas de prefactura
    Core->>DB: Guarda detalle valorado en imagina.prefacturas

    Gestor->>UI: 5. Facturar (tip=fac)
    UI->>Core: Ejecuta Facturación Automática
    Core->>FacRobot: GET /facturacion/interface.php?idp=XXX (Basic Auth)
    FacRobot->>FacDB: Crea Factura Oficial en facturacion2 (facturas_cab / lin)
    FacRobot->>DB: Actualiza imagina.proyectos (Ano, NumFac, FechaFacturado, idEstado=3)
    FacRobot-->>Core: OK Factura generada (Ej: 2026-000621)
    Core-->>UI: Refresca Ficha con Factura Definitiva Vinculada
```

---

## ⚡ Motor Financiero en Tiempo Real

El cálculo de rentabilidad del módulo 127 y del informe mensual opera de forma dinámica:

$$\text{Coste Total} = \sum \text{Pedidos Externos} + \sum (\text{Horas Partes} \times \text{Coste Horario})$$

$$\text{Base de Resultado} = \begin{cases} \text{Total Facturado (o Prefactura)}, & \text{si el proyecto está facturado} \\ \text{Ingreso Previsto}, & \text{si el proyecto está en curso} \end{cases}$$

$$\text{Margen Bruto (€)} = \text{Base de Resultado} - \text{Coste Total}$$

$$\text{Margen Bruto (\%)} = \left(\frac{\text{Margen Bruto (€)}}{\text{Base de Resultado}}\right) \times 100$$

$$\text{Margen Objetivo (€)} = \text{Base de Resultado} \times \left(\frac{\text{Margen Objetivo Publicación (\%)}}{100}\right)$$

$$\text{GAP Financiero (€)} = \text{Margen Bruto (€)} - \text{Margen Objetivo (€)}$$

### Estados Financieros Dinámicos:
- ⚪ **SIN PREVISTO:** $\text{Base} \le 0$
- 🔴 **PÉRDIDA (REAL o PREVISTA):** $\text{Margen Bruto} < 0$
- 🟠 **BAJO OBJETIVO:** $\text{Margen Bruto (\%)} < \text{Margen Objetivo} - 5\%$
- 🟡 **RIESGO:** Entre $\text{Margen Objetivo} - 5\%$ y $\text{Margen Objetivo}$
- 🟢 **OBJETIVO OK:** $\text{Margen Bruto (\%)} \ge \text{Margen Objetivo}$
