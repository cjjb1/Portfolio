# Veeam Tape Monitor

## Alcance

Proyecto end-to-end para operaciones de copia en cinta con Veeam Backup & Replication. El panel responde a preguntas concretas durante una espera: qué Media Set solicita el trabajo, qué medio está montado, por qué Veeam lo rechazó y qué cartucho cumple las condiciones para continuar. También reúne el seguimiento, la preparación diaria de cintas y los históricos de soporte.

## Arquitectura

| Componente | Responsabilidad |
| --- | --- |
| React, TypeScript y Vite | Panel operativo, vistas de trabajos y tareas, medios, calendarios e históricos |
| Node.js, Fastify y Zod | API REST, validación de entradas y avisos de actualización por Server-Sent Events (SSE) |
| SQLite con WAL | Eventos, puntos de lectura, históricos, muestras de progreso y operaciones |
| PowerShell de Veeam | Consulta del catálogo de Backup & Replication y ejecución de operaciones autorizadas |
| Windows Server y WinSW | Ejecución del monitor como servicio con almacenamiento local |

La API que consume React pertenece al monitor. La integración con Veeam combina lectura incremental de logs y consultas a su módulo PowerShell. El servicio actualiza el estado y avisa por SSE para que el panel vuelva a consultar sus vistas.

## Flujo de diagnóstico

1. El monitor lee los archivos de trabajo, conserva el punto de avance y guarda eventos junto al cursor de forma atómica.
2. Las reglas convierten líneas en eventos tipados y deduplican las copias de una misma línea durante la rotación.
3. Los eventos reconstruyen las sesiones y agrupan los intentos de cargar cinta. Cada conclusión puede consultarse con la hora, el archivo y la línea original.
4. El panel indica la confianza del diagnóstico. Un rechazo explícito, una inferencia de contexto y una espera con datos insuficientes tienen niveles distintos.
5. Para recomendar un cartucho, el servicio cruza una espera vigente con biblioteca, pool y Media Set. Comprueba capacidad libre, ubicación, retención, protección, bloqueo y WORM. El inventario manual es un registro auxiliar. La recomendación se retira al cambiar la sesión, cerrar la espera o caducar el catálogo.

## API del monitor

| Recurso | Uso |
| --- | --- |
| `/api/status`, `/api/requests`, `/api/sessions`, `/api/events` | Diagnóstico y evidencia. Las consultas admiten el ámbito directo o un histórico importado. |
| `/api/veeam/:view` | Proyecciones del catálogo para trabajos, tareas de agentes, medios y preparación diaria. |
| `/api/inventory`, `/api/imports` | Inventario auxiliar y gestión de paquetes históricos. |
| `/api/stream` | Notificaciones SSE para actualizar las vistas del panel. |

## Vistas y operaciones

- **Panel y progreso.** Estado del trabajo, cartucho observado, compatibilidad, duración de la espera, evidencia y evolución del porcentaje según las lecturas de Veeam.
- **Trabajos, tareas y medios.** Sesiones recientes, tareas de cinta y de agentes, bibliotecas, unidades, cartuchos y pools.
- **Preparación.** Programación y cintas asignadas a la rotación diaria. El calendario señala el último viernes del mes como fecha de cinta mensual.
- **Históricos.** Importación de ZIP con validación de rutas, tamaños e integridad, deduplicación de paquetes y un ámbito de consulta independiente del directo.
- **Operaciones de medios.** Inventario, catalogación, verificación, exportación, importación y renombrado. El servicio registra la solicitud y sigue el resultado en Veeam. Cuando la ejecución queda sin confirmar, el resultado se conserva como indeterminado para su revisión.

## Despliegue y validación

WinSW aloja una instancia del monitor en Windows Server. El acceso local autenticado y el HTTPS privado opcional tienen permisos diferenciados. La ejecución de acciones de medios requiere la cuenta autorizada. SQLite vive junto al servicio. La suite del proyecto cubre parser, diagnóstico, rotación de logs, API, importaciones, catálogo y operaciones de medios.

La captura del portfolio muestra un trabajo en ejecución, el último cartucho aceptado y el avance global. El gráfico de la colección muestra una serie ilustrativa.

## Diagramas editables

- [Arquitectura del monitor](arquitectura-es.mmd)
- [Diagnóstico de esperas](diagnostico-es.mmd)
- [Seguimiento de la copia](progreso-es.mmd)
- [Catálogo, unidades y cintas](medios-es.mmd)
- [Selección y rotación de cintas](seleccion-es.mmd)
- [Históricos ZIP y evidencia](historico-es.mmd)
- [Operaciones de medios](operaciones-es.mmd)
- [Despliegue y acceso](despliegue-es.mmd)
