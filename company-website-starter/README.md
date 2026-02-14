
# Company Website Starter

Proyek ini berisi **website perusahaan** yang profesional, responsif, dan mudah digunakan, lengkap dengan **handler form kontak** versi **PHP** dan opsi **Node/Express**.

## Struktur Folder
```
company-website-starter/
├─ index.html
├─ assets/
│  ├─ css/style.css
│  └─ js/main.js
└─ server/
   ├─ php/contact.php            # Handler form via PHP (shared hosting, cPanel, dll.)
   └─ node/
      ├─ package.json
      ├─ server.js              # Handler form via Node/Express (SMTP)
      └─ .env.example
```

## Cara Pakai (Cepat)
1. **Ubah identitas brand** di `index.html` dan warna brand pada `assets/css/style.css`.
2. **Form kontak** sudah siap:
   - **Default**: JavaScript mengirimkan ke `server/php/contact.php` (AJAX). Tanpa JS, form akan melakukan POST standar ke file yang sama.
   - **Alternatif Node**: jalankan server Express dan ubah `FORM_ENDPOINT` di `assets/js/main.js` menjadi `/api/contact`.

---

## Opsi A — Deploy dengan PHP (Paling Mudah di Shared Hosting)
1. Unggah seluruh folder `company-website-starter` ke hosting Anda (pastikan PHP aktif).
2. Edit `server/php/contact.php`:
   - Ganti `$TO_EMAIL` dengan email tujuan Anda.
   - Ganti `$FROM_EMAIL` dengan alamat pada domain Anda (lebih dipercaya penyedia SMTP).
3. Buka `index.html` pada domain Anda dan uji form. Jika email tidak masuk:
   - Cek folder spam.
   - Hubungi hosting untuk memastikan fungsi `mail()` diaktifkan atau gunakan opsi Node/SMTP.

## Opsi B — Deploy dengan Node/Express (SMTP)
1. Masuk ke folder `server/node`:
   ```bash
   cd server/node
   npm install
   cp .env.example .env
   # Edit .env sesuai kredensial SMTP (Mailgun, SendGrid, Gmail SMTP, dsb.)
   npm start
   ```
2. **Saat development**: buka `index.html` langsung di browser. Untuk menghindari masalah CORS, jalankan keduanya pada domain yang sama atau aktifkan CORS (sudah diaktifkan di server).
3. Ubah `FORM_ENDPOINT` di `assets/js/main.js` menjadi `/api/contact`.

> **Catatan:** Beberapa penyedia (mis. Gmail) mewajibkan App Password/SMTP khusus. Pastikan kredensial benar.

## Keamanan & Privasi
- Validasi sisi klien **dan** server sudah disertakan.
- Hindari menyimpan data sensitif di `.env.example`. Simpan rahasia di `.env` (jangan commit ke repo publik).
- Tambahkan **reCAPTCHA**/hCaptcha jika form Anda sering menerima spam.

## Kustomisasi Lanjutan
- Pisahkan konten ke file HTML tambahan (About, Services) lalu gunakan router server atau generator statis.
- Kompres gambar (WebP/AVIF) dan aktifkan caching di server.
- Tambahkan header keamanan (CSP, HSTS) di server produksi.

Selamat membangun! 🚀
