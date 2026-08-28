# KontenKU — Video Ad & AI Content Studio

KontenKU adalah prototipe studio pembuatan iklan video e‑commerce (short form) yang menggabungkan React + Vite frontend dengan Express TypeScript backend yang menyediakan endpoint AI (Google GenAI) untuk analisis produk, pembuatan storyboard, TTS, dsb. Cocok sebagai prototipe lokal / internal untuk menjajaki integrasi AI pada alur produksi konten.

## Stack singkat
- Bahasa: TypeScript (frontend & backend)
- Frontend: React + Vite
- Backend: Express (server.ts) + Google GenAI client (@google/genai)
- Tooling: esbuild, tsx, vite, tailwindcss

## Quickstart (development)
Persyaratan: Node 18+ atau bun, dan (opsional) GEMINI_API_KEY jika ingin memanggil model Google GenAI.

1. Install dependencies

```bash
# npm
npm install
# atau bun
# bun install
```

2. Salin konfigurasi environment

```bash
cp .env.example .env
# edit .env dan set GEMINI_API_KEY (opsional), API_KEY, APP_URL, PORT
```

3. Jalankan mode development (server + vite middleware)

```bash
npm run dev
```

4. Build & start untuk production (bundles server dengan esbuild)

```bash
npm run build
npm start
```

## Environment variables (penting)
- GEMINI_API_KEY: (opsional) API key untuk Google GenAI. Jika kosong, server akan berjalan di MOCK MODE dan mengembalikan fallback JSON.
- API_KEY: Shared API key minimal untuk mengamankan /api endpoints; kirimkan sebagai header `x-api-key: <API_KEY>` atau `Authorization: Bearer <API_KEY>`.
- APP_URL: URL publik aplikasi (digunakan untuk callback atau self-referential links).
- PORT: Port server (default 3000).
- NODE_ENV: `development` | `production` (production = fail-fast jika GEMINI_API_KEY diperlukan).
- ALLOWED_ORIGINS: Komma-separaed list domain yang diperbolehkan via CORS (mis. http://localhost:5173,http://localhost:3000)
- SENTRY_DSN: (opsional) untuk integrasi error reporting

## API examples
Semua endpoint penting berada di `POST /api/*` pada host `http://localhost:3000` (development default). Endpoint memerlukan API_KEY via header `x-api-key`.

1) Health check

```bash
curl -v http://localhost:3000/api/health
```

2) Analyze product (contoh)

```bash
curl -X POST http://localhost:3000/api/analyze-product \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"url":"https://example.com/product/123"}'
```

3) Generate storyboard (contoh menggunakan hasil analyze-product)

```bash
curl -X POST http://localhost:3000/api/generate-storyboard \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"productAnalysis": {"productName":"Example","category":"Gadget","uniqueSellingPoints":[]}, "duration":"15s"}'
```

Catatan: Server akan menggunakan response fallback jika GEMINI_API_KEY tidak diisi.

## Security & next steps (recommended)
Prioritas perbaikan yang saya kerjakan pada branch `improve/high-priority-fixes`:
1. Menambahkan API key auth middleware + rate limiting + helmet & CORS.
2. Menambah validasi request (zod) dan central error handler.
3. Memecah server.ts menjadi modul route + logger + storage adapter.
4. Menambahkan README, CI, tests, dan Dockerfile.

Jika Anda ingin saya lanjut, saya akan commit perubahan pertama (README + .env.example) lalu menerapkan middleware keamanan dan validasi pada server.

---

README dibuat dan ditambahkan pada branch `improve/high-priority-fixes`.
