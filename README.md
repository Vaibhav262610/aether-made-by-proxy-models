# AETHER landing page

A static Next.js landing page with animated 3D scenes. Signup, documentation, and social destinations are placeholders.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. For a production build, run `npm run build` followed by `npm start`.

## Check changes

```sh
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Browser tests use the installed Microsoft Edge on Windows. On other platforms, install Chromium first with `npx playwright install chromium`. Set `PLAYWRIGHT_CHANNEL` to override the browser. The tests cover desktop rendering, mobile navigation and sizing, the manifest icon, and the fallback when WebGL is unavailable.
