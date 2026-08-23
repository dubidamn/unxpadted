# PRODUCT REQUIREMENT DOCUMENT (PRD)
# CLASH OF UNXPADTED — INTERACTIVE LIVE GAME SYSTEM

---

**Informasi Dokumen**
* **Nama Proyek:** Clash of Unxpadted (Interactive Live Competition System)
* **Kemitraan:** Infinix Mobility (XPAD 30 Pro) × Ruangguru
* **Versi Dokumen:** 2.0 (Full Production Specification)
* **Status:** Approved / Production Ready
* **Target Rilis:** Roadshow Sekolah & Turnamen Esports-Akademik Nasional 2026
* **Penulis:** Lead Product Manager & Systems Architect

---

## 1. Ringkasan Eksekutif & Latar Belakang

### 1.1 Latar Belakang Produk
**Clash of Unxpadted** adalah turnamen panggung pameran *hybrid* pertama di Indonesia yang menggabungkan kompetisi **esports profesional** dan **tantangan akademik berkecepatan tinggi** dalam satu panggung arena (*XPAD Arena*).

Turnamen ini dirancang sebagai platform peluncuran strategis untuk **Infinix XPAD 30 Pro**, dibangun berdasarkan *insight* generasi muda Indonesia (*"Slash Gen"*, usia 18–25 tahun) yang secara konstan berpindah peran antara siswa berprestasi, anak yang membanggakan orang tua, dan *gamer/esports player* kompetitif. Perangkat Infinix XPAD 30 Pro diposisikan sebagai satu-satunya *device* yang cukup tangguh untuk memenangkan turnamen dan cukup cepat untuk mendukung produktivitas belajar.

Bekerja sama secara resmi dengan **Ruangguru** (pengembangan dari program *Clash of Champions*), sistem game interaktif ini menjadi motor penggerak utama pada stasiun-stasiun tantangan akademik di panggung *live*.

### 1.2 Tujuan Produk (Product Objectives)
1. **Menghadirkan Pengalaman Kompetisi Real-Time yang Adil dan Responsif:** Menyediakan sistem kuis dan adu kecepatan berbasis web lokal dengan latensi ultra-rendah (<100 ms) di tablet Infinix XPAD 30 Pro.
2. **Kontrol Panggung Terpusat untuk Gamemaster:** Memberikan panel kendali penuh bagi wasit/operator panggung untuk memuat bank soal, mengatur timer pertandingan, mengendalikan buzzer, menilai jawaban terbuka, dan melakukan *override* skor secara instan.
3. **Visualisasi Panggung Spektakuler untuk Penonton:** Menyediakan layar panggung raksasa (*Main Display Screen*) yang menampilkan scoreboard, dynamic match tracker, duel progress bar, tayangan media memori, dan status buzzer secara dramatis.
4. **Portabilitas & Keandalan Offline (Zero Cloud Dependency):** Beroperasi 100% pada jaringan lokal panggung (Local Area Network / Wi-Fi LAN) tanpa bergantung pada koneksi internet publik.

### 1.3 Ruang Lingkup (Scope of System)
* **In-Scope:**
  * Software sistem tantangan akademik 4 stasiun (*X1: Math Speedrun, X2: Cerdas Cermat / Math Matrix, X3: AI Unsolved Case, X4: Flash Memory Recall*).
  * Web application terpadu mencakup 4 interface: **Tablet Tim X & Y**, **Gamemaster Control Panel**, **Main Display Stage**, dan **Multiview Testing Simulator**.
  * Sinkronisasi data real-time via WebSocket (Socket.io).
  * Mesin timer ganda (Match Timer 55 menit & Station Timer).
  * Sistem buzzer presisi tinggi (*first-buzz lock*).
  * Sistem import bank soal via CSV.
  * Audio synthesizer sound effects berbasis Web Audio API.
* **Out-of-Scope:**
  * Modul game esports (Mobile Legends: Bang Bang, Free Fire) yang berjalan pada aplikasi *client game native* masing-masing.
  * Database akun pemain jangka panjang atau sistem leaderboard multi-musim (sistem dirancang *event-scoped / single match state*).

---

## 2. Pengguna & Peran Sistem (User Roles & Hardware Setup)

| Peran Pengguna | Perangkat Keras | Interface URL | Tanggung Jawab Utama |
| :--- | :--- | :--- | :--- |
| **Team X (Kelas A)** | 1x Infinix XPAD 30 Pro | `/team.html?team=X`<br>`/team-skinned.html?team=X` | Membaca soal stasiun, mengetik jawaban hitung cepat, memencet buzzer, memilih opsi trivia, mengirim analisis kasus, dan menjawab tes recall. |
| **Team Y (Kelas B)** | 1x Infinix XPAD 30 Pro | `/team.html?team=Y`<br>`/team-skinned.html?team=Y` | Peran identik dengan Tim X di sudut panggung lawan. |
| **Gamemaster (GM)** | Laptop / Tablet Kontrol Operator | `/gm.html` | Membuka/mengunci buzzer, memilih stasiun aktif, memulai/menjeda timer, mengimpor bank soal CSV, menilai jawaban uraian, dan mengatur skor panggung. |
| **Penonton / Host / Audience** | TV / LED Wall Stage Raksasa (16:9) | `/display.html` | Menyaksikan jalannya pertandingan, visualisasi timer, duel progress bar, scoreboard, dan status stasiun secara real-time. |
| **Broadcast & Rehearsal Ops** | Laptop Operator Broadcast | `/multiview.html` | Monitoring 4 interface sekaligus dalam satu layar untuk gladi resik dan kontrol teknis broadcast. |

---

## 3. Arsitektur Interface & Fitur Utama

### 3.1 Interface Tablet Tim (Team Tablet Client)
Interface tablet tim dirancang dengan ergonomi layar sentuh tinggi (10.9" – 12.4") berbasis *Infinix AdaptoX Dark Theme*.

* **Header Terpadu:** Menampilkan badge nama tim (`TEAM X` / `TEAM Y`), *Overall Match Timer* (durasi match), *Station Timer* (durasi stasiun), dan total poin tim saat ini.
* **Sub-Header Status:** Menampilkan indikator stasiun yang sedang aktif (`STATION X1`, `STATION X2`, dll.).
* **Dynamic Workspace Area:** Ruang kerja yang otomatis berganti tampilan sesuai stasiun yang diaktifkan oleh Gamemaster:
  1. **Tampilan Standby (Idle):** Tampilan bertema *Hero Background* dengan branding *Clash of Unxpadted* saat pertandingan belum dimulai atau masa jeda antar stasiun.
  2. **Tampilan X1 (Math Speedrun):** Kotak soal ukuran besar, kolom input hasil, virtual *on-screen numeric keypad* (0–9, Delete, Clear, Enter), tombol aksi cepat **SKIP SOAL** berwarna kuning, dan progress bar individu.
  3. **Tampilan X2 (Cerdas Cermat & Buzzer):** Kartu status buzzer dinamis, tombol **BUZZ** raksasa di tengah layar dengan feedback visual 3 kondisi (*Open / Pressed / Locked*), serta panel pilihan ganda (A, B, C, D) yang otomatis muncul jika tim tercepat memencet buzzer.
  4. **Tampilan X3 (AI Forensic Case):** Formulir investigasi kejahatan dengan selector tersangka (*Radio buttons*: Dika, Sita, Boni) dan kolom textarea untuk mengetik justifikasi analisis bukti forensik.
  5. **Tampilan X4 (Flash Memory Recall):** Banner peringatan pada Fase 1 (*"Perhatikan Layar Utama!"*), diikuti formulir kartu soal bertahap pada Fase 2 dengan kontrol navigasi `PREV`, `NEXT`, dan `SUBMIT TEST`.
* **Reaction Overlay Modal:** Popup animasi instan kartu reaksi jawaban (*Jawaban Benar* [Hijau] / *Jawaban Salah* [Merah]) setelah pengiriman jawaban.

---

### 3.2 Interface Gamemaster Control Panel (GM Panel)
Panel komando utama yang dilengkapi sistem proteksi keamanan *passcode modal* sebelum dapat diakses operator panggung.

* **Keamanan Akses:** Dilindungi modal autentikasi *Passcode Gamemaster*.
* **Manajemen Tim & Scoreboard:**
  * Pengaturan nama tim secara fleksibel (misal: "XII MIPA 1" vs "XII IPS 2").
  * Penyesuaian warna indikator *Point Tracker* per tim menggunakan color picker.
  * Tombol penyesuaian skor manual (+1 / -1) per tim.
* **Mesin Pengatur Timer Ganda:**
  * **Match Timer:** Mengontrol jam utama pertandingan (maksimal 55 menit / 3.300 detik).
  * **Station Timer:** Mengontrol waktu stasiun dengan preset otomatis (X1: 300s, X2: 600s, X3: 600s, X4: 300s) disertai tombol cepat koreksi waktu `+30S` dan `-30S`.
* **Kontrol Stasiun & Navigasi Soal:**
  * Pemilihan stasiun aktif melalui tab navigasi.
  * **X1 Manager:** Monitoring progres soal live, reset progres X1, dan penilaian instan.
  * **X2 Manager:** Tombol **BUKA BUZZER**, **KUNCI BUZZER**, **RESET BUZZER**, navigasi soal `PREV QUESTION` dan `NEXT QUESTION`, serta review jawaban terpilih.
  * **X3 Manager:** Form review teks justifikasi kasus Tim X & Tim Y beserta tombol penilaian manual (*Benar: +1 Pts* / *Salah: 0 Pts*).
  * **X4 Manager:** Tombol **START FLASH MEDIA** (memulai penayangan 4 media berurutan secara otomatis), **FORCE START RECALL** (membuka lembar jawab tablet), dan review auto-score tim.
* **Bank Soal CSV Importer:** Modul parser CSV internal yang memungkinkan GM mengunggah bank soal baru per stasiun saat turnamen berlangsung.

---

### 3.3 Interface Main Display Screen (Layar Raksasa Panggung)
Interface visual panggung 16:9 beresolusi Full HD/4K yang diproyeksikan ke layar LED utama panggung arena.

* **Header Panggung:** Menampilkan logo resmi *Clash of Unxpadted*, label status stasiun aktif, dan jam pertandingan (*Match Clock*).
* **Scoreboard & Dynamic Match Tracker (11 Poin):**
  * Kotak skor raksasa Tim X dan Tim Y dengan tipografi dinamis.
  * **11-Dot Dynamic Match Tracker:** Visualisasi 11 bulatan target kemenangan yang terisi warna tim secara dinamis, dengan penanda khusus titik ke-6 sebagai *Match Point*.
* **Area Konten Panggung Spesifik Stasiun:**
  * **Mode Standby:** Grafis visual *Hero Stage* beranimasi halus.
  * **Mode X1:** **Single Unified Duel Progress Bar** — Satu progress bar horizontal panjang tempat kedua tim saling mengejar target 30 jawaban benar secara dramatis.
  * **Mode X2:** Teks soal trivia raksasa dengan 4 kartu pilihan (A, B, C, D) serta **Buzzer Announcement Banner** yang secara tegas menampilkan tim mana yang menekan buzzer tercepat.
  * **Mode X3:** Tampilan visual berkas kasus forensik (Waktu, Tempat, Kronologi, Daftar Terduga, dan Foto Bukti Forensik).
  * **Mode X4:** Penayangan media visual (gambar/video) dengan *countdown timer* per media selama Fase Flashing, diikuti transisi status Fase Recall.
  * **Mode Victory:** Animasi selebrasi penobatan pemenang turnamen (*"CLASS OF UNXPADTED"*).

---

## 4. Mekanisme Detail Gameplay & Spesifikasi Stasiun

### 4.1 Stasiun X1: Math Speedrun

#### A. Konsep & Peserta
* **Format:** 1 vs 1 Fast Arithmetic Speedrun.
* **Peserta:** 1 perwakilan per tim, bermain secara independen di unit tablet XPAD masing-masing.
* **Durasi Stasiun:** 5 Menit (300 detik).

#### B. Bank Soal & Tingkat Kesulitan
Bank soal terdiri dari hingga 100 soal operasi hitung aritmatika (penjumlahan & perkalian) bertingkat:
* **Tingkat Dasar (Kelas X) — 40% (40 Soal):** Operasi 1 langkah, angka 2 digit (contoh: `47 + 58 = 105`, `6 × 9 = 54`, `12 × 8 = 96`).
* **Tingkat Menengah (Kelas XI) — 35% (35 Soal):** Operasi 1 langkah angka 2–3 digit atau perkalian 2 digit × 2 digit (contoh: `34 × 12 = 408`, `256 + 489 = 745`, `45 × 23 = 1.035`).
* **Tingkat Lanjut (Kelas XII) — 25% (25 Soal):** Kombinasi 2 operasi atau perkalian 3 digit (contoh: `(15 × 8) + 40 = 160`, `234 × 12 = 2.808`, `(250 + 150) × 2 = 800`).

#### C. Alur & Mekanisme Permainan
1. Soal muncul satu per satu di layar tablet XPAD masing-masing peserta.
2. Peserta menginput jawaban menggunakan virtual numeric keypad di layar dan menekan tombol **SUBMIT**.
3. Sistem secara otomatis memvalidasi jawaban di sisi server:
   * **Jika Benar:** Counter `correctCount` bertambah +1, memicu popup reaksi hijau dan efek suara nada tinggi (*correct chime*).
   * **Jika Salah:** Counter `wrongCount` bertambah +1, memicu popup reaksi merah dan efek suara nada rendah (*wrong buzzer*).
4. **Fitur SKIP SOAL:** Peserta dapat menekan tombol kuning **SKIP SOAL** untuk melewati soal yang dirasa sulit tanpa penalti, langsung beralih ke nomor berikutnya.
5. **Visualisasi Main Screen:** Layar utama panggung menampilkan pergerakan bar duel Tim X vs Tim Y secara real-time berdasarkan akumulasi jawaban benar masing-masing tim menuju angka 30.

#### D. Aturan Kemenangan (Winning Condition)
* **Kemenangan Instan (Instant Verdict):** Peserta pertama yang berhasil mengumpulkan **30 jawaban BENAR** langsung otomatis memenangkan stasiun X1 seketika itu juga tanpa perlu menunggu waktu 5 menit habis.
* **Fallback Waktu Habis:** Jika waktu 5 menit habis sebelum ada yang mencapai 30 benar, pemenang ditentukan dari tim dengan jumlah jawaban benar terbanyak.
* **Tie-Breaker:** Jika jumlah benar sama, tim dengan total waktu pengerjaan tercepat dinyatakan sebagai pemenang; jika masih imbang, diberikan 1 soal *sudden-death*.

---

### 4.2 Stasiun X2: Cerdas Cermat (Buzzer Battle / Math Matrix)

#### A. Konsep & Peserta
* **Format:** 2 vs 2 Live Toss-Up Trivia & Buzzer Battle.
* **Peserta:** 2 perwakilan per kelas yang berbagi 1 unit tablet XPAD sebagai konsol buzzer dan input jawaban.
* **Durasi Stasiun:** 10 Menit (600 detik) atau hingga bank 30 soal habis.

#### B. Bank Soal & Kategori
Terdiri dari 30 soal pilihan ganda 4 opsi (A, B, C, D) dengan komposisi seimbang antara **Sejarah (Nasional & Dunia)** dan **Sains (Fisika, Kimia, Biologi)** tingkat SMA/SMK.

#### C. Alur & Mekanisme Buzzer
1. Gamemaster menayangkan teks soal dan 4 pilihan jawaban secara serentak di Main Display dan Tablet kedua tim.
2. Gamemaster menekan tombol **BUKA BUZZER** di GM Panel:
   * State buzzer server berubah menjadi `open: true`.
   * Tombol buzzer di tablet kedua tim aktif dan berdenyut warna hijau neon.
   * Efek suara pembukaan buzzer berbunyi di arena.
3. **Mekanisme Rebutan (Toss-Up):**
   * Kedua tim berebut menekan tombol **BUZZ**.
   * Server memproses event socket tercepat berdasarkan *microsecond timestamp*.
   * Tim tercepat (misal Tim X) mendapatkan hak jawab (`buzzedTeam = "X"`).
   * Tombol buzzer Tim X berubah menjadi status *Pressed* (Hijau Mantap) dan panel pilihan A, B, C, D terbuka di tabletnya.
   * Tim lawan (Tim Y) otomatis terkena **Lockout** (tombol terkunci dan meredup merah).
   * Main Display secara dramatis mengumumkan tim yang berhasil merebut hak jawab.
4. **Mekanisme Eksekusi Jawaban:**
   * Tim yang berhasil buzz memiliki jendela waktu 5 detik untuk memilih salah satu opsi (A, B, C, atau D) di tabletnya.
   * **Jika Jawaban Benar:** Tim mendapat +1 poin leg stasiun X2, efek suara benar berbunyi, dan GM beralih ke soal berikutnya.
   * **Jika Jawaban Salah:** Tim tersebut terkunci (*lockout*) dari sisa soal tersebut. GM dapat melemparkan soal ke tim lawan atau menggugurkan soal.

#### D. Aturan Kemenangan
Tim dengan perolehan jawaban benar terbanyak dalam durasi 10 menit memenangkan leg stasiun X2 dan membawa pulang poin pertandingan.

---

### 4.3 Stasiun X3: AI Unsolved Case

#### A. Konsep & Peserta
* **Format:** 2 vs 2 AI Forensic Investigation & Deductive Reasoning Challenge.
* **Peserta:** 2 perwakilan kelas per tim.
* **Durasi Stasiun:** 10 Menit (600 detik).
* **Tema Kasus:** Pemecahan Kasus Kriminal Kampus/Sekolah (Contoh: *"Misteri Hilangnya Piala Bergilir di Lab Kimia SMA 303"*).

#### B. Komponen Data & Berkas Bukti Forensik
Setiap kasus memuat 4 pilar data:
1. **Waktu & Lokasi Kejadian:** Waktu presisi insiden dan kondisi lingkungan (misal: *Selasa Sore pukul 16:30 setelah hujan deras di Lab Kimia*).
2. **Deskripsi Insiden:** Detail barang yang hilang atau kondisi tempat kejadian perkara (TKP).
3. **Profil Terduga (3 Suspects):**
   * *Suspect 1 (Dika - Kapten Basket):* Berada di koridor dekat lab usai latihan, memakai jersey biru.
   * *Suspect 2 (Sita - Ketua Klub Kimia):* Berada di lab merapikan alat, terobsesi dengan piala.
   * *Suspect 3 (Boni - Siswa Remedial):* Terlihat terburu-buru keluar gedung sekolah saat hujan reda, memakai hoodie biru.
4. **Hasil Analisis Bukti Forensik AI (Gemini Forensics):**
   * *Bukti 1:* Goresan lemari kaca akibat pintu dibuka paksa/terburu-buru.
   * *Bukti 2:* Jejak kaki berlumpur basah dengan pola sol sneaker casual (bukan sepatu basket dan bukan sepatu formal).
   * *Bukti 3:* Tumpahan minuman kopi manis yang biasa dikonsumsi orang stres/kurang tidur.

#### C. Alur & Mekanisme Permainan
1. Main Display menayangkan dossier berkas kasus lengkap dan galeri foto bukti TKP.
2. Tim berdiskusi mengkorelasikan profil saksi dengan bukti-bukti forensik AI.
3. Tim mengisi formulir investigasi di tablet XPAD:
   * **Langkah 1:** Memilih nama tersangka utama (Radio selector: Dika / Sita / Boni).
   * **Langkah 2:** Mengetik paragraf argumentasi logis pendukung (*justifikasi forensik*) pada kolom textarea.
4. Tim menekan tombol **KIRIM JAWABAN KASUS**.
5. **Penilaian Gamemaster:**
   * Submission dari Tim X dan Tim Y masuk secara real-time ke panel GM.
   * Gamemaster memeriksa ketepatan tersangka (*Expected: Boni*) dan bobot analisis (korelasi sepatu sneaker berlumpur dengan hujan + kopi manis dengan stres remedial).
   * GM memberikan poin (+1 poin stasiun) langsung melalui panel kontrol.

---

### 4.4 Stasiun X4: Flash Memory Recall

#### A. Konsep & Peserta
* **Format:** 2 vs 2 Working Visual Memory Challenge.
* **Peserta:** 2 perwakilan kelas per tim.
* **Durasi Stasiun:** 5 Menit (300 detik).

#### B. Alur Permainan 2-Fase Sinkron
1. **Fase 1 — Penayangan Media (Flashing Phase):**
   * GM menekan tombol **START FLASH MEDIA**.
   * Tablet tim terkunci dan menampilkan instruksi: *"PERHATIKAN LAYAR UTAMA!"*.
   * Main Display panggung menayangkan 4 media secara berurutan tanpa jeda:
     * *Media 1 (Gambar - 6 Detik):* Apel merah di atas meja kayu.
     * *Media 2 (Video - 8 Detik):* Bola basket oranye memantul 3 kali di lantai.
     * *Media 3 (Gambar - 5 Detik):* Mobil sedan biru terparkir di depan gedung.
     * *Media 4 (Video - 10 Detik):* Kucing hitam berjalan melewati pagar putih.
   * Peserta tidak boleh membawa alat tulis atau mencatat di tablet.
2. **Fase 2 — Pengisian Jawaban Ingatan (Recall Phase):**
   * Begitu media ke-4 selesai ditayangkan, sistem otomatis bertransisi ke Fase Recall.
   * Tablet tim membuka kuesioner ingatan bertahap (*Single Question Step-by-Step*).
   * Terdapat 9 butir soal pilihan ganda menguji detail:
     * Soal 1 & 2: Buah apa di Media 1 dan warnanya apa?
     * Soal 3 & 4: Warna bola di Media 2 dan berapa kali memantul?
     * Soal 5 & 6: Warna mobil di Media 3 dan jenis kendaraannya apa?
     * Soal 7 & 8: Warna kucing di Media 4 dan objek apa yang dilewati?
     * Soal 9: Sebutkan urutan kemunculan objek utama media 1 s/d 4.
   * Tim menggunakan navigasi `PREV` / `NEXT` dan menekan tombol hijau **SUBMIT TEST**.

#### C. Penilaian Otomatis (Auto-Grading) & Penentuan Pemenang
* Server secara otomatis mencocokkan array jawaban tim dengan kunci jawaban di backend dan menghitung skor (0–9) secara instan.
* Hasil penilaian otomatis beserta *timestamp submit* langsung muncul di panel GM.
* Tim dengan jumlah jawaban benar terbanyak menang stasiun X4. Jika skor sama, tim dengan waktu submit tercepat menjadi pemenang.

---

## 5. Sistem Manajemen Data & Format Bank Soal CSV

Sistem mendukung fleksibilitas pembaruan bank soal secara *live* melalui file CSV flat tanpa perlu melakukan kompilasi ulang kode atau me-restart server.

### 5.1 Format CSV Soal Stasiun X1 (Math Speedrun)
```csv
id,question,choices,answer,points
1,"47 + 58 = ?",,"105",1
2,"6 * 9 = ?",,"54",1
3,"123 + 87 = ?",,"210",1
4,"(15 * 8) + 40 = ?",,"160",1
```

### 5.2 Format CSV Soal Stasiun X2 (Cerdas Cermat)
```csv
id,question,choices,correct,points
1,"Proklamasi kemerdekaan Indonesia dibacakan tanggal?","A. 16 Agustus | B. 17 Agustus | C. 18 Agustus | D. 19 Agustus",B,1
2,"Presiden pertama Indonesia adalah?","A. Soeharto | B. Soekarno | C. Habibie | D. Megawati",B,1
3,"Satuan SI untuk gaya adalah?","A. Joule | B. Newton | C. Watt | D. Pascal",B,1
```

### 5.3 Format CSV Soal Stasiun X3 (AI Unsolved Case)
```csv
id,title,location,time,incident,expected_suspect,expected_reason
1,"Misteri Piala yang Hilang","Lab Kimia SMA 303","Selasa 16:30","Piala bergilir hilang dari lemari kaca tidak terkunci","boni","Boni keluar saat hujan dengan sepatu basah berlumpur"
```

### 5.4 Format CSV Soal Stasiun X4 (Flash Memory Recall)
```csv
id,question,choices,correct
1,"Buah apa yang muncul di Media 1?","A. Apel | B. Jeruk | C. Pisang | D. Mangga",A
2,"Berapa kali bola memantul pada Media 2?","A. 2 kali | B. 3 kali | C. 4 kali | D. 5 kali",B
```

---

## 6. Desain Sistem, UI/UX & Aset Visual

### 6.1 Filosofi Visual: Infinix Adapto Dark Theme
Desain mengadopsi estetika *futuristic retail-tech esports*. Didominasi latar belakang hitam pekat (*Matte Obsidian*) dengan aksen neon tajam berdaya kontras tinggi untuk memastikan keterbacaan sempurna di bawah pencahayaan panggung arena yang dinamis.

* **Primary Accent (Neon Cyber Green):** `#39FF14` (Warna signature aksi utama & tombol pahlawan)
* **Secondary Accent (Cyber Cyan):** `#00E5FF` (Warna aksen Tim Y & navigasi)
* **Warning / Lockout (Crimson Red):** `#FF5449` (Warna aksen Tim X & status lockout)
* **Notice Accent (Electric Amber):** `#FFC107` (Tombol Skip Soal & highlight waktu)
* **Gamemaster Accent (Deep Purple):** `#9333EA` (Warna khusus konsol operator)
* **Surface Background:** `#080808` s/d `#0D0D0D` (Kanvas gelap)

### 6.2 Standar Tipografi & Komponen
* **Font Display:** `InfinixDisplay`, `Aktiv Grotesk Ex`, `Orbitron` (digunakan pada angka timer raksasa, skor, dan judul stasiun).
* **Font Interface & Body:** `Helvetica Neue`, `Arial`, sans-serif (digunakan pada teks soal, pilihan ganda, dan label kontrol).
* **State Interactive Elements:** Seluruh tombol dan kontrol interaktif wajib memiliki 2 set status visual:
  * `Neutral / Default`: Tampilan solid dengan border hairline.
  * `Clicked / Active / Hover`: Tampilan inverted dengan aksen *neon glow* terang.
* **Resolusi Aset:** Diekspor dalam format PNG 24-bit dengan alpha transparency dalam skala **Retina 2x (@2x)** untuk ketajaman optimal pada layar resolusi tinggi tablet Infinix XPAD.

### 6.3 Mesin Efek Suara Web Audio (Audio Synthesizer FX)
Aplikasi mengintegrasikan sintesis audio berbasis browser (*Web Audio API*) tanpa memerlukan file audio eksternal besar:
* `buzzer_open`: Sapuan frekuensi naik (*Sine wave 440 Hz -> 880 Hz*) menandai dibukanya jendela buzzer.
* `buzzer_press`: Nada ganda (*600 Hz*) menandai ada tim yang berhasil menekan buzzer tercepat.
* `correct`: Arpeggio nada gembira (*523.25 Hz [C5] -> 659.25 Hz [E5] -> 783.99 Hz [G5]*) untuk jawaban benar.
* `wrong`: Nada desenden rendah (*220 Hz -> 110 Hz*) menandai jawaban salah.
* `flash_start`: Pulsa nada futuristik (*1200 Hz*) menandai dimulainya penayangan media kilat.

---

## 7. Kebutuhan Non-Fungsional (Non-Functional Requirements)

| Kategori | Parameter | Spesifikasi & Target Kinerja |
| :--- | :--- | :--- |
| **Kinerja & Latensi** | Event Latency | Sinkronisasi event Socket.io (Buzzer, State Update, Timer) **< 100 milidetik** di jaringan lokal panggung. |
| **Keandalan Jaringan** | Offline Operation | 100% beroperasi di jaringan lokal (LAN) tanpa memerlukan gateway internet eksternal. |
| **Kompatibilitas** | Browser Engine | Kompatibel penuh pada Chromium / WebKit (Google Chrome, Edge, Safari di tablet Infinix XPAD). |
| **PWA & Caching** | Service Worker | Dilengkapi `sw.js` dan `manifest.json` agar aset UI dan stylesheet ter-cache lokal secara penuh. |
| **Keamanan Sistem** | Access Control | GM Control Panel dan Main Display diproteksi oleh modal kata sandi (*passcode protection*). |
| **Integritas Data** | Fail-Safe Override | Gamemaster memiliki hak akses mutlak untuk memodifikasi skor, mereset buzzer, dan mengubah timer tanpa memuat ulang aplikasi. |

---

## 8. Matriks Alur Operasional Pertandingan (Match Flow SOP)

1. **Pra-Match (Persiapan):**
   * Operator menjalankan server: `npm start`.
   * GM membuka `/gm.html`, memasukkan passcode, dan mengatur nama tim.
   * Tablet Tim X & Y terhubung ke interface tablet, dan layar panggung terhubung ke `/display.html`.
   * GM memverifikasi bank soal CSV untuk X1 s/d X4, lalu mengatur sistem ke mode `STANDBY`.
2. **In-Match (Pelaksanaan):**
   * GM memulai Match Timer 55 menit.
   * GM mengaktifkan stasiun X1 (Math Speedrun) -> Peserta 1v1 adu hitung cepat (Target: 30 benar).
   * Selesai X1, GM mengaktifkan stasiun X2 (Cerdas Cermat) -> 2v2 rebutan buzzer & pilihan ganda.
   * Selesai X2, GM mengaktifkan stasiun X3 (AI Case) -> 2v2 investigasi kasus forensik AI.
   * Selesai X3, GM mengaktifkan stasiun X4 (Flash Memory) -> Penayangan media panggung + tes recall.
   * Poin terakumulasi di Dynamic Match Tracker (11 Poin).
3. **Pasca-Match (Selebrasi & Reset):**
   * Tim pertama mencapai 11 Poin total dinobatkan sebagai pemenang (*"CLASS OF UNXPADTED"*).
   * Main Display menampilkan layar selebrasi kemenangan.
   * GM menekan `RESET MATCH` untuk babak berikutnya.

---

## 9. Kesimpulan
Sistem **Clash of Unxpadted Interactive Game System** telah dirancang secara komprehensif, modular, dan tangguh untuk mendukung ekosistem turnamen esports-akademik berskala nasional. Integrasi antara interface tablet Infinix XPAD 30 Pro, panel kendali Gamemaster, dan visual panggung interaktif memberikan pengalaman kompetisi yang mutakhir, presisi, dan menghibur bagi peserta maupun penonton panggung.
