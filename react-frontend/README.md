# React frontend

The game-server dashboard uses React 19, React Router 7, Apollo Client 4 and Vite 8 with Strapi 5's native GraphQL API. Records and relations are flat objects/arrays, and public identifiers are string `documentId` values; no Strapi 4 response wrappers or compatibility mode are used. Authentication endpoints retain their existing contract.

## Requirements and installation

Use Node.js 24 LTS **24.21.0** and npm 10 or newer. The dependency engine ranges also permit Node 22.22.2+ and Node 26+. Older Node releases cannot run the current jsdom/Vitest toolchain. The Docker build pins Node **24.21.0** on Debian Bookworm slim; the runtime uses `nginx:stable-alpine`.

```sh
npm ci
```

The lockfile pins the complete dependency tree; do not use `--legacy-peer-deps` or `--force`.

## Configuration and local development

```sh
REACT_APP_API_URL=http://localhost:1337 npm start
```

Open [http://localhost:3000](http://localhost:3000). The port is fixed so Auth0 redirect URLs do not change. Vite serves all application routes with SPA fallback.

`REACT_APP_API_URL` remains the backend origin, defaults to `http://localhost:1337`, and must not end in a slash. It is a **build-time public setting**, not a secret. Vite reads it from the shell or `.env`/`.env.local` files. The frontend calls `<origin>/graphql`, links to `<origin>/api/connect/auth0`, and handles the authentication response at `/connect/auth0` by calling `<origin>/api/auth/auth0/callback` with the returned query parameters. Configure the backend/Auth0 provider to redirect to `http://localhost:3000/connect/auth0` locally, or the deployed frontend origin in production, and allow that frontend origin in backend CORS settings.

The `/` dashboard and `/config/:id` details view require the `auth-token` localStorage entry. The `:id` route value is the game instance's string `documentId`, not a numeric database ID. Unauthenticated visits redirect to `/login`; logout clears the token and returns to login. A running backend with valid Auth0 configuration is required for real login and game-server operations.

## Scripts and verification

- `npm start`: development server on port 3000.
- `npm run build`: TypeScript checking followed by the production build in `build/`.
- `npm run preview`: serve the production bundle locally (default port 4173).
- `npm test`: Vitest in interactive watch mode.
- `npm run test:run`: run tests once with jsdom and Testing Library.
- `npm run eslint`: lint TypeScript/TSX using ESLint's flat configuration.
- `npm run eslint:fix`: apply automatic lint fixes.

After installation, verify with `npm ls --all`, `npm run build`, `npm run test:run`, and `npm run eslint`. Tests and a production build do not require a live backend; exercising authentication, dashboard data and start/stop mutations does.

## Strapi 5 operations and smoke scenario

- `GameConfigs` reads the flat `gameInstances` list, game/version/flavour relations and the latest deployment status. Configure links use each instance's `documentId`.
- `GameConfigDetails($documentId: ID!)` reads `gameInstance(documentId: $documentId)` and its deployments sorted by descending start time. The view polls every second, renders deployment history, and displays DNS, IPs and native `game_server_ports { port protocol is_open }` for a running server.
- The details query also reads the oldest configured `cloudInstances` record (`createdAt:asc`, limit 1) for the default cloud server. Its `documentId` replaces the former hardcoded numeric cloud ID. Start is disabled if no cloud server is configured.
- `StartGameDeployment` calls `createGameDeployment` with the instance and cloud **document IDs**, an ISO timestamp and `status: STARTING`. `StopGameDeployment` calls `updateGameDeployment(documentId: ...)` with `status: STOPPING`. Both return flat `documentId`/`status` fields and refetch details.

For a local smoke check, seed a game, flavour/version, related game instance, cloud instance and deployment with draft/publish disabled. Allow the authenticated role to read these types (including game-instance `findOne` and cloud-instance `find`) and create/update deployments. The custom port resolver requires its existing service at `http://localhost:8080/ports`; a fixture response such as `[{"port":25565,"protocol":"TCP","is_open":true}]` exercises port rendering.

Log in, open `/`, confirm the instance name/game/latest status and follow Configure to `/config/<instanceDocumentId>`. With a stopped deployment, click Start and check that the mutation's two relation IDs are strings and the UI shows STARTING. Let the local provisioner transition the record to RUNNING (or update the disposable fixture directly); polling should reveal Stop, the server addresses and `25565/TCP` with a green indicator. Click Stop, confirm the update targets the deployment's `documentId` and the UI shows STOPPING, then confirm a STOPPED transition restores Start. Keep production infrastructure out of fixture checks. Finally verify logout, a protected-route redirect and the Auth0 callback using the existing URLs.

Eight behavioral tests cover flat fixture rendering, document-ID navigation and start/stop mutations, custom ports, polling, unauthenticated redirects, and logout removing credentials and leaving the protected dashboard. They do not require a live backend.

## Deployment

```sh
docker build --build-arg API_URL=https://backend.example.com -t cloud-gameserver-frontend .
docker run --rm -p 8080:7070 cloud-gameserver-frontend
```

The image installs with `npm ci`, builds into `build/`, and serves it through nginx on container port 7070 with SPA fallback. The command above exposes it at `http://localhost:8080`. `API_URL` continues to populate `REACT_APP_API_URL` during the Docker build. Changing the backend URL requires rebuilding the frontend bundle.

## Dependency compatibility

Direct dependencies are pinned to registry releases. TypeScript is held at **6.0.3** because `@typescript-eslint` 8.71.0 requires TypeScript `<6.1.0`, so TypeScript 7 is not compatible. ESLint is held at **9.39.5** because `eslint-plugin-react` 7.37.5 and `eslint-plugin-import` 2.32.0 do not declare ESLint 10 support; npm marks ESLint 9 as no longer supported upstream, but it is the newest peer-compatible version for these plugins. `@types/node` follows the recommended Node 24 runtime (**24.19.1**) instead of Node 26 types. Apollo Client 4 requires RxJS, which is now explicit.

Create React App/react-scripts and its unused service-worker scaffolding are replaced by Vite; Jest-specific types are replaced by Vitest types. React Router supplies its own types. Unused Apollo render-prop components, Airbnb lint configuration, accessibility/Jest lint plugins and legacy router type packages have been removed rather than retaining incompatible peer dependencies.
