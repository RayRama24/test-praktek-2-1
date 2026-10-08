# Vercel Web App & Serverless Function Demo

Proyek web application modern yang terintegrasi dengan Vercel Serverless Function dan Static Public Frontend.

## 📁 Struktur Folder

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml  # Pipeline CI/CD GitHub Actions
├── api/
│   └── hello.js        # Vercel Serverless Function API
├── public/
│   ├── index.html      # Front-end UI Utama
│   ├── styles.css      # Custom Design System & Glassmorphism Styling
│   └── app.js          # JavaScript Client-side & Fetch API Logic
├── vercel.json         # Konfigurasi Deployment Vercel
├── package.json        # Node.js Project Manifest
└── README.md           # Dokumentasi Proyek
```

## 🚀 Fitur

- **Serverless API Endpoint**: `/api/hello` (Serverless Node.js function)
- **Static Frontend**: `/public/index.html`
- **Vercel Ready**: Konfigurasi `vercel.json` siap dideploy ke Vercel platform.
- **Git & CI/CD Integration**: Terhubung ke repositori GitHub public dengan GitHub Actions (`.github/workflows/deploy.yml`).
- **Secrets Injection**: Menggunakan GitHub Repository Secrets (`VERCEL_TOKEN`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`).

## ⚙️ CI/CD Pipeline Status

Pipeline otomatis terpicu setiap ada push ke branch `main`.
Status workflow dapat dipantau pada tab Actions: [https://github.com/RayRama24/test-praktek-2-1/actions](https://github.com/RayRama24/test-praktek-2-1/actions)
