# 🔮 CLASH OF UNXPADTED — REALTIME GAME SYSTEM (PWA FULLSCREEN FINAL)

Sistem game interaktif realtime berbasis **Node.js, Express & Socket.IO** untuk turnamen **Clash of UNXPADTED: Infinix XPAD 30 Pro**. Dilengkapi dengan dukungan penuh **Progressive Web App (PWA) Chrome App Fullscreen**, **Service Worker Caching**, **Wake Lock**, dan deployment otomatis ke **GitHub Pages & Render.com**.

---

## 📲 Panduan Memasang Sebagai Chrome App (Fullscreen)

Aplikasi ini sudah berstandar PWA (*Progressive Web App*) resmi dengan konfigurasi `"display": "fullscreen"` & `"display_override": ["fullscreen", "standalone"]`.

### A. Memasang di Google Chrome (Desktop macOS / Windows / Linux):
1. Buka aplikasi di Chrome (misal `http://localhost:3000/`, `https://event.unxpadted.web.id/`, atau `https://dubidamn.github.io/unxpadted/`).
2. Klik tombol **"📥 PASANG APLIKASI CHROME (PWA)"** di halaman portal, ATAU klik ikon **Install / Pasang (📥)** di ujung kanan bilah alamat (URL bar) browser Chrome.
3. Klik **"Install / Pasang"** pada pop-up konfirmasi.
4. Aplikasi akan otomatis terpasang sebagai aplikasi mandiri di Desktop / Launchpad / Start Menu Anda dan berjalan **borderless & 100% fullscreen**.

### B. Memasang di Tablet / Android / ChromeOS (Infinix XPAD):
1. Buka URL tablet peserta (misal `.../player?team=X`) di browser Chrome.
2. Tap tombol **"📥 INSTALL APP"** di pojok kiri bawah, ATAU buka menu titik tiga (⋮) Chrome ➔ pilih **"Tambahkan ke Layar Utama" / "Pasang Aplikasi"**.
3. Buka ikon aplikasi dari homescreen tablet untuk pengalaman gameplay layar penuh tanpa address bar browser.

### ⌨️ Shortcut Layar Penuh (Fullscreen):
* **Tekan tombol `F`** pada keyboard kapan saja untuk masuk / keluar mode Fullscreen.
* **Klik tombol `FULLSCREEN`** pada HUD kontrol mengambang di pojok kiri bawah layar.
* Sistem otomatis mengaktifkan **Screen Wake Lock** agar layar tablet/monitor tidak pernah redup atau mati selama turnamen.

---

## 🚀 Panduan Menjalankan Sistem

### 1. Menjalankan Secara Lokal (Local / LAN)
```bash
npm install
npm start
```
Server akan otomatis mendeteksi IP lokal Anda (misal `http://192.168.1.10:3000`).

---

## 🌐 Alamat URL & Antarmuka

| Antarmuka | URL Akses Lokal | URL Publik Cloud | GitHub Pages Static | Fungsi & Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **🌌 Tournament Portal Hub** | `http://localhost:3000/` | `https://event.unxpadted.web.id/` | `https://dubidamn.github.io/unxpadted/` | Hub utama untuk memilih mode, install PWA, dan mengatur server target |
| **📺 Layar Broadcast (16:9)** | `http://localhost:3000/broadcast` | `https://event.unxpadted.web.id/broadcast` | `https://dubidamn.github.io/unxpadted/broadcast.html` | Layar panggung utama / OBS projector (*Clean HUD, duel progress bar, scoreboard*) |
| **⚙️ Gamemaster Panel** | `http://localhost:3000/gm` | `https://event.unxpadted.web.id/gm` | `https://dubidamn.github.io/unxpadted/gm.html` | Panel kendali juri & operator (*Scoreboard, Match Clock, JSON Match Set Importer*) |
| **📱 Tablet Peserta Team X** | `http://localhost:3000/player?team=X` | `https://event.unxpadted.web.id/player?team=X` | `https://dubidamn.github.io/unxpadted/player.html?team=X` | Tampilan tablet tim X (*Locked layout, tactile keypad, buzzer, terminal logs*) |
| **📱 Tablet Peserta Team Y** | `http://localhost:3000/player?team=Y` | `https://event.unxpadted.web.id/player?team=Y` | `https://dubidamn.github.io/unxpadted/player.html?team=Y` | Tampilan tablet tim Y |

---

## 🐙 Panduan Deploy ke GitHub Pages (Otomatis via GitHub Actions)

Repositori ini sudah dilengkapi alur kerja otomatis **`.github/workflows/deploy-pages.yml`**:

1. **Push ke GitHub**:
   ```bash
   git add .
   git commit -m "feat: enable Chrome PWA fullscreen app and GitHub Pages deployment"
   git push origin main
   ```
2. **Aktifkan GitHub Pages**:
   - Masuk ke repositori GitHub: **`https://github.com/dubidamn/unxpadted`**.
   - Buka menu **Settings** ➔ pilih tab **Pages** di menu kiri.
   - Pada bagian **Build and deployment** ➔ **Source**, pilih **`GitHub Actions`**.
   - GitHub Actions akan otomatis menjalankan build dan menerbitkan website ke:
     **`https://dubidamn.github.io/unxpadted/`**

---

## ☁️ Panduan Deploy Backend ke Render.com (`event.unxpadted.web.id`)

Aplikasi ini dilengkapi blueprint **`render.yaml`** untuk menjalankan backend Node.js + Socket.IO:

1. Repositori GitHub: **`https://github.com/dubidamn/unxpadted.git`**
2. Masuk ke [Render.com Dashboard](https://dashboard.render.com/) ➔ Klik **New +** ➔ **Web Service**.
3. Hubungkan repositori **`dubidamn/unxpadted`**.
4. Konfigurasi:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. DNS Custom Domain CNAME: arahkan `event` ke `<service-name>.onrender.com`.

---

## 📁 Struktur Paket Soal (`match_sets/`)
* **`match_set_1.json`**: Paket Soal Resmi Babak Penyisihan (X1: 100 Soal, X2: 15 Soal, X3: 10 Soal, X4: Kasus AI Decryption Kunci `[4,3,8]`).
* **`match_set_2.json`**: Paket Soal Resmi Grand Final (X1: 100 Soal, X2: 15 Soal, X3: 10 Soal, X4: Kasus Orbital Satellite Kunci `[8,4,2]`).
* **`match_set_template.json`**: Template format resmi untuk membuat paket soal kustom baru.

---

## 🎮 Penjelasan Stasiun Pertandingan

### 1. **STANDBY (Opening & Persiapan Match)**
- **Layar Siaran:** Background resolusi penuh `Main Screen.jpeg` dengan HUD skor dan logo turnamen.
- **Gamemaster:** Panel Standby ringkas dengan tombol *Upload JSON Match Set* dan indikator jumlah soal tiap stasiun.
- **Tablet Peserta:** Background resolusi penuh tanpa scroll, header menunjukkan status `STANDBY`.

### 2. **STATION X1: Math Speedrun**
- **Format:** Adu cepat kalkulasi mental matematika.
- **Layar Siaran:** Headline besar **`FIRST TO 30!`** di atas *Unified Duel Progress Bar*.
- **Tablet Peserta:** Keypad virtual numerik 4x4 bersudut tumpul (*rounded rectangle*) + tombol `LEWATI SOAL`.

### 3. **STATION X2: Cerdas Cermat**
- **Format:** Trivia berkecepatan tinggi dengan sistem buzzer lockout.
- **Layar Siaran:** Menampilkan judul soal dan 4 pilihan ganda. Banner `"TEKAN TOMBOL SEKARANG UNTUK MENJAWAB"` muncul saat buzzer dibuka GM.
- **Tablet Peserta:** Tombol sentuh buzzer besar (340px). Tim tercepat langsung mendapatkan pilihan ganda.
- **Gamemaster:** Saklar tunggal dinamis `BUKA BUZZER` / `TUTUP BUZZER` dan navigasi soal.

### 4. **STATION X3: Flash Memory**
- **Format:** Observasi memori visual diikuti fase *recall* pertanyaan pilihan ganda.
- **Gamemaster:** Kartu progres tim real-time menampilkan jumlah jawaban benar aktual (`n / 10 BENAR`), status penguncian, dan rincian per soal.
- **Tablet Peserta:** Pertanyaan *recall* 1 per 1 (`SOAL 1`, `SOAL 2`, dst.).

### 5. **STATION X4: AI Unsolved Case**
- **Format:** Pemecahan kasus enkripsi 3 digit angka AI.
- **Layar Siaran:** Dual konsol futuristik berbentuk rounded rectangle untuk Team X dan Team Y secara berdampingan.
- **Tablet Peserta:** Command Prompt futuristik (`C:\XPAD\SYSTEM\AI_UNSOLVED_CASE.LOG`) dengan animasi *typewriter streaming*, kursor berkedip `█`, dan digit locks.
- **Gamemaster:** Kode rahasia terupdate otomatis berdasarkan file JSON yang diunggah.

---

## 🔊 Sound Effects (Synthesizer Terintegrasi)
Sistem dilengkapi sound effect berbasis Web Audio API bawaan (`/js/audio.js`) tanpa perlu file eksternal:
- Suara Buzzer Terbuka / Mulai
- Suara Buzzer Ditekan
- Suara Jawaban Benar
- Suara Jawaban Salah / Timeout
- Suara Kemenangan / Victory Fanfare
