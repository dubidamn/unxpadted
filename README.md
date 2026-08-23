# 🔮 CLASH OF UNXPADTED — REALTIME GAME SYSTEM (PRODUCTION FINAL)

Sistem game interaktif realtime berbasis **Node.js, Express & Socket.IO** untuk turnamen **Clash of UNXPADTED: Infinix XPAD 30 Pro**.

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

| Antarmuka | URL Akses | Fungsi & Penggunaan |
| :--- | :--- | :--- |
| **📺 Layar Broadcast (16:9)** | `http://localhost:3000/` atau `/broadcast` | Layar panggung utama / OBS projector (*Clean HUD, non-shifting digital clocks, target headline & dual telemetry*) |
| **⚙️ Gamemaster Panel** | `http://localhost:3000/gm` | Panel kendali juri & operator (*Scoreboard, Match Clock, Station Timer, JSON Match Set Importer, Telemetri Live*) |
| **📱 Tablet Peserta Team X** | `http://localhost:3000/player?team=X` | Tampilan tablet tim X (*Locked PWA layout, tactile keypad, responsive buzzer, terminal logs*) |
| **📱 Tablet Peserta Team Y** | `http://localhost:3000/player?team=Y` | Tampilan tablet tim Y |

---

## ☁️ Panduan Deploy ke Render.com

Aplikasi ini sudah dilengkapi dengan blueprint **`render.yaml`** sehingga dapat dideploy secara instan ke **Render.com**:

### Langkah Deploy:
1. Push repositori ini ke GitHub (`https://github.com/dubidamn/unxpadted.git`).
2. Masuk ke [Render.com](https://render.com) dan buat **New Web Service**.
3. Hubungkan repositori GitHub **`unxpadted`**.
4. Konfigurasi Service:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Klik **Deploy Web Service**.
6. Render akan memberikan URL publik HTTPS (contoh: `https://unxpadted.onrender.com`).

---

## 📁 Struktur Paket Soal (`match_sets/`)
* **`match_set_1.json`**: Paket Soal Resmi Babak Penyisihan (X1: 100 Soal, X2: 15 Soal, X3: 10 Soal, X4: Kasus AI Decryption Kunci `[4,3,8]`).
* **`match_set_2.json`**: Paket Soal Resmi Grand Final (X1: 100 Soal, X2: 15 Soal, X3: 10 Soal, X4: Kasus Orbital Satellite Kunci `[8,4,2]`).
* **`match_set_template.json`**: Template format resmi untuk membuat paket soal kustom baru.

---

## 🎮 Penjelasan Stasiun Pertandingan

### 1. **STANDBY (Opening & Persiapan Match)**
- **Layar Siaran:** Background resolusi penuh `Main Screen.jpeg` dengan HUD skor dan logo turnamen.
- **Gamemaster:** Panel Standby ringkas dengan tombol *Upload JSON Match Set* dan indikator jumlah soal tiap stasiun (`X1: nnn, X2: nnn, X3: nnn, X4: nnn`).
- **Tablet Peserta:** Background resolusi penuh tanpa scroll, header menunjukkan status `STANDBY`.

### 2. **STATION X1: Math Speedrun**
- **Format:** Adu cepat kalkulasi mental matematika.
- **Layar Siaran:** Headline besar **`FIRST TO 30!`** di atas *Unified Duel Progress Bar*.
- **Tablet Peserta:** Keypad virtual numerik 4x4 bersudut tumpul (*rounded rectangle*) + tombol `LEWATI SOAL`.

### 3. **STATION X2: Cerdas Cermat**
- **Format:** Trivia berkecepatan tinggi dengan sistem buzzer lockout.
- **Layar Siaran:** Menampilkan judul soal dan 4 pilihan ganda. Banner `"TEKAN TOMBOL SEKARANG UNTUK MENJAWAB"` hanya muncul saat buzzer dibuka oleh GM.
- **Tablet Peserta:** Tombol sentuh buzzer besar (340px). Tim tercepat langsung mendapatkan tampilan 4 pilihan ganda.
- **Gamemaster:** Saklar tunggal dinamis `BUKA BUZZER` / `TUTUP BUZZER` dan tombol navigasi soal.

### 4. **STATION X3: Flash Memory**
- **Format:** Observasi memori visual diikuti fase *recall* pertanyaan pilihan ganda.
- **Gamemaster:** Kartu progres tim real-time menampilkan jumlah jawaban benar aktual (`n / 10 BENAR`), status penguncian, dan rincian per soal (`[Q1:A✓] [Q2:C✗] ...`).
- **Tablet Peserta:** Pertanyaan *recall* 1 per 1 (`SOAL 1`, `SOAL 2`, dst.).

### 5. **STATION X4: AI Unsolved Case**
- **Format:** Pemecahan kasus enkripsi 3 digit angka AI.
- **Layar Siaran:** Dual konsol futuristik berbentuk rounded rectangle untuk Team X dan Team Y secara berdampingan.
- **Tablet Peserta:** Jendela Command Prompt futuristik (`C:\XPAD\SYSTEM\AI_UNSOLVED_CASE.LOG`) dengan animasi *typewriter streaming*, kursor berkedip `█`, dan tab JAWAB dengan tinggi trapezoid yang identik.
- **Gamemaster:** Kode rahasia terupdate otomatis berdasarkan file JSON yang diunggah.

---

## 🔊 Sound Effects (Synthesizer Terintegrasi)
Sistem dilengkapi sound effect berbasis Web Audio API bawaan (`/js/audio.js`) tanpa perlu file eksternal:
- Suara Buzzer Terbuka / Mulai
- Suara Buzzer Ditekan
- Suara Jawaban Benar
- Suara Jawaban Salah / Timeout
- Suara Kemenangan / Victory Fanfare

---

## 📁 Struktur Direktori Bersih (`Unxpadted-Final`)
```
Unxpadted-Final/
├── server.js               # Express + Socket.IO Server Engine
├── package.json            # Dependencies & start scripts
├── render.yaml             # Render.com Deployment Blueprint
├── match_sets/             # Paket Soal JSON (Match 1, Match 2, Template)
├── public/                 # Static web assets
│   ├── broadcast.html      # 16:9 Stage Screen
│   ├── gm.html             # Gamemaster Dashboard
│   ├── player.html         # Tablet Interface (Team X & Y)
│   ├── css/
│   │   ├── design-system.css # Cyber design tokens & fonts
│   │   ├── components.css    # Cards, steppers & badges
│   │   ├── broadcast.css     # Stage 16:9 responsive CSS
│   │   ├── gm.css            # Gamemaster dashboard CSS
│   │   └── player.css        # Tablet numpad & touch CSS
│   ├── js/
│   │   ├── audio.js          # Procedural Web Audio SFX
│   │   ├── broadcast.js      # Broadcast realtime client
│   │   ├── gm.js             # Gamemaster realtime controller
│   │   └── player.js         # Tablet realtime client
│   ├── manifest.json       # PWA Manifest
│   └── sw.js               # Service Worker
├── Skinned-Asset/          # Asset grafis, logo & background
├── Asset-XPAD30Pro/        # Asset branding & visual Infinix XPAD
└── PNG ASSET/              # Typography & HUD elements
```
