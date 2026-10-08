# Vercel Web App & Serverless Function Demo

Proyek web application modern yang terintegrasi dengan Vercel Serverless Function dan Static Public Frontend.

## 📁 Struktur Folder

```
/
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
- **Git Integration**: Terhubung ke repositori GitHub public.

## 🛠️ Menjalankan Lokal

```bash
# Menggunakan Vercel CLI
npx vercel dev
```
