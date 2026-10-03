# Strapi backend

## Runtime and dependencies

Use **Node.js 24.21.0 (24.x only)** and **npm 11.x**. All backend build/development/API images pin `node:24.21.0-bookworm-slim`; the separate admin runtime remains `nginx:stable-alpine`. Install the committed lockfile with `npm ci`, without `--force` or `--legacy-peer-deps`.

| Dependency | Version | Compatibility |
| --- | --- | --- |
| Strapi, GraphQL, Users & Permissions | 5.56.0 | Aligned current Strapi 5 releases. i18n is integrated into Strapi core; its old standalone dependency is removed. |
| React / React DOM | 18.3.1 | Strapi 5 requires React 18. |
| React Router DOM | 6.30.6 | Current v6 patch satisfying Strapi's `^6.30.3` peer range. |
| styled-components | 6.5.3 | Strapi 5 requires v6. |
| Blueprint | 0.1.2 | Published `@qkix/strapi-plugin-blueprint`, explicitly supports Strapi 5 and Node 24. Replaces the Strapi 4 entity-relationship-chart plugin. |
| Datadog tracing | 6.19.0 | Supports Node 22 and newer; preloaded before Strapi imports by `npm start` and `npm run develop`. |
| mysql2 | 3.24.5 | Driver retained; Strapi's database configuration now uses its supported `mysql` client name. |

Registry references: [Strapi](https://registry.npmjs.org/@strapi%2fstrapi), [GraphQL](https://registry.npmjs.org/@strapi%2fplugin-graphql), [Blueprint](https://registry.npmjs.org/@qkix%2fstrapi-plugin-blueprint), [Datadog](https://registry.npmjs.org/dd-trace), [mysql2](https://registry.npmjs.org/mysql2). Upgrade references: [official v4-to-v5 procedure](https://docs.strapi.io/cms/migration/v4-to-v5/step-by-step), [GraphQL changes](https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/graphql-api-updated), [document identity](https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/use-document-id), and [supported database configuration](https://docs.strapi.io/cms/configurations/database).

Blueprint is enabled under the `blueprint` plugin key. Open **Blueprint** in the admin menu to view the real SVG entity-relationship diagram, including content types, components, fields and relations. Non-super-admin roles need the `blueprint.read` permission under Settings → Administration panel → Roles. Verify diagram rendering and SVG export after upgrading; the plugin's [documentation](https://community.strapi.io/marketplace/blueprint) describes its controls and limitations.

## Strapi 4 to 5 cutover and backup

This is a coordinated backend, frontend and provisioner migration, not a v4 compatibility mode. GraphQL explicitly sets `v4CompatibilityMode: false`. Do not enable `STRAPI_GRAPHQL_V4_COMPATIBILITY_MODE` or send the v4 REST response-format header.

**Starting Strapi 5 changes the database.** Before a production cutover:

1. Stop the Strapi 4 application and provisioner so that neither writes during backup/migration. Keep the database running.
2. Back up the existing MySQL database with a consistent dump (for example, `mysqldump --single-transaction --routines --triggers`, using credentials appropriate to that environment), uploads and existing configuration/secrets. Retain the old application revision and container images for rollback. Keep dumps out of git and all image build contexts.
3. Restore the dump to a **disposable database** and point Strapi 5 at that database using environment overrides. Never use production for a smoke test. Strapi performs its internal migration and schema synchronization on first startup; do not rerun the major-upgrade tool against the already migrated source.
4. Verify content, relations, user/provider settings, API tokens, the custom GraphQL field, admin login, and provisioner SQL identity before scheduling the real cutover. Take a fresh backup immediately before the approved cutover and migrate backend/frontend/provisioner together.
5. If rollback is necessary, stop all writers and restore the pre-v5 database plus the matching Strapi 4/frontend/provisioner images and configuration. Do not run Strapi 4 against the migrated database.

The local pre-upgrade dump is `backend/.tmp/strapi4-pre-v5.sql`; it is git-ignored and excluded from Docker contexts. Do not overwrite it or copy it into an image. This file is not a substitute for a fresh production backup.

All six application content types retain `draftAndPublish: false`, their existing collection names, attributes and relations. The deployment status enumeration remains `STARTING`, `RUNNING`, `STOPPING`, `STOPPED`, `FAILED`; `consumer_uuid` remains private. The custom Users & Permissions `game_instances` relation and Auth0 provider routes are retained. Existing Auth0 provider settings live in the database and must survive the restored-copy migration, including `/api/connect/auth0` and `/api/auth/auth0/callback`.

Strapi 5 introduces string `documentId` values (`document_id` in SQL). GraphQL queries, mutations and content relations use them and return flat objects/arrays, without `data` or `attributes` wrappers. REST retains its outer `data` envelope but flattens fields within it. API responses are not a source of numeric infrastructure identity: the provisioner continues claiming/updating `game_deployments.id` via SQL, and maps a GraphQL game-instance `documentId` back to the existing `game_instances.id` before constructing Terraform workspace names or metadata. Do not replace those numeric IDs with document strings. With drafts disabled, each game-instance document has one database row. Preserve any provisioner-managed tables such as `game_deployment_logs` as well; there is no declared backend content-type schema for that table.

The GraphQL extension now registers with the explicit Strapi instance and resolves `GameDeployment.game_server_ports` directly on the flat deployment object. Its existing `{ port, protocol, is_open }` object-list contract and `http://localhost:8080/ports` service dependency are unchanged; no numeric GraphQL ID is needed. Repeatable game-version `ports`, `backup_paths`, and `log_files` remain GraphQL component-object lists.

Obsolete Strapi 4 generated declarations and the unused webpack customization example are removed. Regenerate declarations with `npm run types:generate` against the disposable migrated environment before committing generated types; do not copy old `Attribute` imports/three-argument relation declarations forward. This generation command loads application configuration and is not an offline migration prerequisite. There are no production package patches or v4 compatibility aliases.

## Configuration

For a new environment, copy `.env.example` to `.env` and supply nonempty, independently generated `APP_KEYS` (comma-separated keys), `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, and `JWT_SECRET`. **Preserve existing secrets during migration** so existing users, sessions and API tokens retain their identity. `ENCRYPTION_KEY` is the Strapi 5 API-token visibility encryption key; supply a stable independently generated value for new deployments. It is not a replacement for `API_TOKEN_SALT`. Keep real `.env` files private.

Set `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, and `DATABASE_SSL` for MySQL. Defaults remain `127.0.0.1:3306`, database `strapi`, user `root`, password `strapi`, without TLS. Strapi 5 requires MySQL 8.0 or newer (8.4 recommended); this upgrade does not recreate the production database or change cloud resources.

`SERVER_URL` must be the public backend URL. The existing reverse-proxy trust setting is migrated to `server.proxy.koa`. For integrated administration, use `ADMIN_URL=/admin/` and `SERVE_ADMIN_PANEL=true`. For the separate admin image, use `ADMIN_URL=/`, `SERVE_ADMIN_PANEL=false`, and build with the public API `SERVER_URL`. That Dockerfile explicitly embeds `STRAPI_ADMIN_BACKEND_URL=$SERVER_URL`; otherwise Strapi can generate relative API URLs that incorrectly target the nginx-only admin origin. The authentication cookie path follows `ADMIN_URL` with its trailing slash removed (except `/`), so cookies remain readable on the `/admin` dashboard after login. These values are embedded in the admin bundle, so rebuild when they change. Cross-origin deployments must retain their working CORS/proxy/cookie setup and verify authenticated admin requests, not just the login page.

Datadog uses the normal `DD_*` variables; set `DD_TRACE_ENABLED=false` when working locally without an agent. Direct `strapi start` invocations bypass the application's tracing preload; use `npm start` or explicitly preload `dd-trace/init`.

## Install and run

From `backend/`, with the required runtime and environment:

```sh
npm ci
npm run develop
```

The Compose development source mount is overlaid with an anonymous `/usr/src/app/node_modules` volume, keeping Linux-native dependencies separate from host macOS/Windows modules. After changing dependencies, rebuild and renew that volume from the repository root:

```sh
docker compose up -d --build --force-recreate --renew-anon-volumes --no-deps strapi
```

The database must already be running for `--no-deps`; omit that flag for initial startup. Use the same rebuild/renew command with `consumer` for the provisioner. Compose waits for Strapi's `/_health` endpoint before starting the consumer, preventing queue queries against a database whose Strapi 5 migration is still running. During a major cutover, keep the consumer stopped until the migrated backend is healthy; do not bypass this dependency with an independently started consumer. Do not delete database volumes to address dependency/native-module errors.

For an integrated production process:

```sh
NODE_ENV=production npm run build
NODE_ENV=production npm start
```

The production API image defaults `SERVE_ADMIN_PANEL=false`, while the separate admin image builds and serves administration with nginx. From the repository root:

```sh
docker build -f backend/Dockerfile-prod-be -t cloud-gameserver-backend .
docker build -f backend/Dockerfile-prod-fe -t cloud-gameserver-admin --build-arg SERVER_URL=https://your-backend.example backend
```

The API Dockerfile uses the repository root as its context; development and admin Dockerfiles use `backend/`. Context exclusions keep host dependencies, generated builds, `.tmp` backups and real `.env` files out of images. Supply database credentials and application secrets at runtime.

## Verification on a restored database

No repository backend test/lint scripts are defined. Run the following only with a disposable restored database and all required environment overrides:

```sh
npm ci
npm ls --all
npm run types:generate
NODE_ENV=production DD_TRACE_ENABLED=false npm run build
NODE_ENV=production DD_TRACE_ENABLED=false npm start
```

Use both integrated administration and the separate-admin build (`ADMIN_URL=/ SERVE_ADMIN_PANEL=false SERVER_URL=http://localhost:1337 NODE_ENV=production npm run build`). Check admin login, navigation, content editing, role permissions, Blueprint rendering/export and callback/provider configuration. Production disables GraphQL introspection; use development for schema discovery.

In a second terminal, with a test API token authorized to read the fixture content:

```sh
curl --fail http://localhost:1337/_health
curl --fail -H "Authorization: Bearer $TEST_API_TOKEN" -H 'Content-Type: application/json' --data '{"query":"{ games { documentId name } gameDeployments { documentId status game_instance { documentId name } game_server_ports { port protocol is_open } } }"}' http://localhost:1337/graphql
```

The ports field requires the existing service or a local fixture server on port 8080 returning, for example, `[{"port":25565,"protocol":"TCP","is_open":true}]` at `/ports`. GraphQL can return HTTP 200 with errors, so inspect the JSON and require the expected values, not just a successful HTTP status.

Before migrating the restored database, seed representative **Strapi 4** fixtures: a game, flavour, version with ports/backup paths/log files, game instance linked to a user, cloud instance and deployment. Record their numeric SQL IDs, statuses, costs, component values, join relations and provider settings. After migration, confirm those IDs and values survive and each content row gains a usable `document_id`. Also create/query/update/delete an isolated **Strapi 5** game-instance/deployment using document IDs, exercise its relations and all deployment status transitions, and verify SQL queue claims and numeric Terraform identity without applying cloud infrastructure. Check that any unmanaged provisioner log table remains usable. Never run those fixture mutations against production.

## Verified local migration

The restored Strapi 4 fixture retained numeric game/instance/deployment IDs, relations, version ports/backup paths/log files, and existing admin credentials. Authenticated native REST/GraphQL reads, document-ID create/update/delete operations, all five deployment statuses, integrated admin login, Blueprint rendering and SVG export passed. Browser checks exercised dashboard/details navigation, start/stop mutations, polling, server addresses/ports, history, and logout. The provisioner claimed both start and stop work against the migrated database and retained numeric Terraform workspace/metadata identity without cloud calls.

The local development database was then migrated with its original admin record and unchanged Auth0 configuration. The pre-migration dump remains at `backend/.tmp/strapi4-pre-v5.sql`. Auth0 is disabled in that local configuration; its routes still return the disabled-provider error. A real Auth0 authorization round trip and Hetzner/AWS provisioning were not exercised.

Current backend installation reports **45 audit findings: 34 high, 10 moderate, 1 low, no critical**. The current Strapi GraphQL plugin still pulls in end-of-life Apollo Server 4 and other deprecated transitive packages. Updating direct dependencies does not eliminate these upstream risks; no incompatible forced overrides were applied.

Development and production container builds passed for backend, frontend and provisioner, including the separate nginx-hosted Strapi admin. The production API passed authenticated REST/GraphQL reads; the separate admin authenticated against the configured backend origin. The final frontend container rendered migrated deployment data and ports, enforced protected routes and logged out to `/login`; the production provisioner passed the real SQL-to-GraphQL queue/identity scenario against that API. The local Compose backend is healthy and the consumer starts only afterward. Disposable services and fixture scripts were removed; the local database and pre-migration backup were retained.
