# Veeam Tape Monitor

## Scope

An end-to-end project for tape backup operations with Veeam Backup & Replication. During a tape wait, the dashboard answers which Media Set the job requests, which cartridge is mounted, why Veeam rejected it and which cartridge is eligible. It also brings together progress, daily tape preparation and support archives.

## Architecture

| Component | Responsibility |
| --- | --- |
| React, TypeScript and Vite | Operator dashboard, job and task views, media, calendars and archives |
| Node.js, Fastify and Zod | REST API, input validation and Server-Sent Events (SSE) update notifications |
| SQLite with WAL | Events, read checkpoints, archives, progress samples and operations |
| Veeam PowerShell module | Backup & Replication catalog queries and authorized media operations |
| Windows Server and WinSW | Runs the monitor as a service with local storage |

React calls the monitor's own API. The Veeam integration combines incremental log reading with queries through its PowerShell module. The service updates its state and sends SSE notifications so the dashboard can refresh its views.

## Diagnostic flow

1. The monitor reads job files incrementally and stores events and checkpoints atomically.
2. Rules turn log lines into typed events and deduplicate copies of the same line during rotation.
3. Events reconstruct sessions and group tape loading attempts. Each finding can be traced to its timestamp, source file and original line.
4. The dashboard shows diagnostic confidence. An explicit rejection, a contextual inference and a wait with insufficient evidence have distinct levels.
5. To recommend a cartridge, the service matches a current wait to the library, pool and Media Set. It checks free capacity, location, retention, protection, locks and WORM status. The manual inventory is a supporting record. A session change, the end of the wait or stale catalog data withdraws the recommendation.

## Monitor API

| Resource | Purpose |
| --- | --- |
| `/api/status`, `/api/requests`, `/api/sessions`, `/api/events` | Diagnostics and evidence. Queries support live monitoring or an imported archive scope. |
| `/api/veeam/:view` | Catalog views for jobs, agent tasks, media and daily preparation. |
| `/api/inventory`, `/api/imports` | Supporting inventory and archive management. |
| `/api/stream` | SSE notifications for refreshing dashboard views. |

## Views and operations

- **Dashboard and progress.** Job status, observed cartridge, compatibility, wait duration, evidence and progress trend based on Veeam readings.
- **Jobs, tasks and media.** Recent sessions, tape and agent tasks, libraries, drives, cartridges and pools.
- **Preparation.** Scheduling and assigned cartridges for daily rotation. The calendar marks the last Friday of each month as monthly tape day.
- **Archives.** ZIP import validates paths, size and integrity, deduplicates packages and provides a query scope independent of live monitoring.
- **Media operations.** Inventory, catalog, verify, export, import and rename. The service records requests and tracks their outcomes in Veeam. If execution remains unconfirmed, its outcome stays indeterminate for review.

## Deployment and validation

WinSW hosts one monitor instance on Windows Server. Authenticated local access and optional private HTTPS have distinct permissions. Media actions require the authorized account. SQLite is local to the service. The project test suite covers parsing, diagnostics, log rotation, API behavior, imports, catalog data and media operations.

The portfolio screenshot shows a running job, the last accepted cartridge and overall progress. The chart in the visual collection uses an illustrative series.

## System flow

[View flow diagram](flujo-general-en.svg) · [Download Mermaid](flujo-general-en.mmd)

| Module | Purpose |
| --- | --- |
| Tape wait diagnostics | Compares requested and observed Media Sets and shows the evidence. |
| Copy progress | Shows the latest readings and progress over a session. |
| Tape selection and rotation | Checks the current wait, scheduling and cartridge eligibility. |
| Media catalog | Brings together libraries, drives, cartridges and pools. |
| ZIP archives | Validates and opens archives in a separate scope from live data. |
| Media operations | Records authorized actions and tracks their outcome. |

## Editable diagrams

- [Monitor architecture](arquitectura-en.mmd)
- [Tape wait diagnostics](diagnostico-en.mmd)
- [Copy progress](progreso-en.mmd)
- [Catalog, drives and tapes](medios-en.mmd)
- [Tape selection and rotation](seleccion-en.mmd)
- [ZIP archives and evidence](historico-en.mmd)
- [Media operations](operaciones-en.mmd)
- [Deployment and access](despliegue-en.mmd)
