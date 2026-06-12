# API Flow — WMS Tile Proxy

## Overview

SafeMap requires a secret API key to serve tile images. Instead of exposing that key in the browser, all tile requests are proxied through a Next.js API route running on Vercel's server.

---

## Flow Diagram

```
Map.tsx
  └── renders <WmsLayer />
        └── reads layer URLs from layersConfig.ts
              └── url: "/api/tiles/IF_0079_WMS"
                    └── Leaflet adds map params
                          └── Browser: GET /api/tiles/IF_0079_WMS?SERVICE=WMS&BBOX=...&WIDTH=256&HEIGHT=256
                                └── route.ts (Vercel server)
                                      └── adds SAFEMAP_KEY from environment
                                            └── safemap.go.kr?serviceKey=SECRET&SERVICE=WMS&BBOX=...
                                                  └── PNG tile → back to browser
```

---

## Files Involved

| File | Role |
|---|---|
| `src/features/map/components/Map.tsx` | Renders the map, mounts `<WmsLayer />` |
| `src/features/map/components/layers/WmsLayer.tsx` | Reads visible layers from Zustand store, renders `<WMSTileLayer>` for each |
| `src/features/map/config/layersConfig.ts` | Defines layer metadata and sets tile URL to `/api/tiles/[layerId]` |
| `src/app/api/tiles/[layerId]/route.ts` | Runs on server — attaches secret key, forwards request to SafeMap, returns PNG |

---

## Why Proxy?

**Without proxy** — key is exposed in the browser:
```
Browser → https://www.safemap.go.kr/openapi2/IF_0079_WMS?serviceKey=SECRET
                                                                       ^^^^^^
                                                          visible in DevTools
```

**With proxy** — key stays on the server:
```
Browser → /api/tiles/IF_0079_WMS        ← no key, just a path
              ↓
          Vercel server reads SAFEMAP_KEY from environment
              ↓
          safemap.go.kr?serviceKey=SECRET ← only server sees this
```

---

## Caching

The proxy sets `Cache-Control: public, max-age=2592000` (30 days) on every tile response.

```
First visit to an area:
  Browser → Vercel → SafeMap → PNG downloaded and saved

Same area again (within 30 days):
  Browser uses saved copy → instant, no network request
```

---

## Environment Variables

| Variable | Where | Value |
|---|---|---|
| `SAFEMAP_KEY` | `.env.local` (local) / Vercel dashboard (production) | SafeMap API key |
| `NEXT_PUBLIC_BACKEND_API_URL` | `.env.local` → `http://localhost:5001` / Vercel → `http://3.27.0.30:5001` | Express API on EC2 |

`SAFEMAP_KEY` has no `NEXT_PUBLIC_` prefix — Next.js keeps it server-side only and never bundles it into browser JavaScript.

---

## Future: Lambda + CloudFront

The current Vercel proxy adds one extra hop per tile on first load (~50-200ms). When real users arrive, this will be replaced by:

```
Browser → CloudFront (edge cache) → Lambda → SafeMap
```

CloudFront caches tiles globally — all users share the same cache, not just per-browser. First load becomes fast for everyone after the first request warms a tile.
