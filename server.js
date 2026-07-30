const express = require('express');
const http = require('http');
const path = require('path');
const os = require('os');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3000;

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIpAddress = getLocalIp();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'Asset-XPAD30Pro')));

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'favicon.ico'));
});

const defaultQuestions = {
  X1: [
    { id: 1, question: "47 + 58 = ?", answer: "105" },
    { id: 2, question: "6 × 9 = ?", answer: "54" },
    { id: 3, question: "123 + 87 = ?", answer: "210" },
    { id: 4, question: "12 × 8 = ?", answer: "96" },
    { id: 5, question: "245 + 179 = ?", answer: "424" },
    { id: 6, question: "35 + 49 = ?", answer: "84" },
    { id: 7, question: "15 × 7 = ?", answer: "105" },
    { id: 8, question: "189 + 64 = ?", answer: "253" },
    { id: 9, question: "14 × 6 = ?", answer: "84" },
    { id: 10, question: "312 + 198 = ?", answer: "510" },

    { id: 11, question: "34 × 12 = ?", answer: "408" },
    { id: 12, question: "256 + 489 = ?", answer: "745" },
    { id: 13, question: "45 × 23 = ?", answer: "1035" },
    { id: 14, question: "678 + 345 = ?", answer: "1023" },
    { id: 15, question: "27 × 34 = ?", answer: "918" },
    { id: 16, question: "56 × 15 = ?", answer: "840" },
    { id: 17, question: "892 + 567 = ?", answer: "1459" },
    { id: 18, question: "42 × 18 = ?", answer: "756" },
    { id: 19, question: "743 + 289 = ?", answer: "1032" },
    { id: 20, question: "38 × 25 = ?", answer: "950" },

    { id: 21, question: "(15 × 8) + 40 = ?", answer: "160" },
    { id: 22, question: "234 × 12 = ?", answer: "2808" },
    { id: 23, question: "456 + 789 + 123 = ?", answer: "1368" },
    { id: 24, question: "67 × 45 = ?", answer: "3015" },
    { id: 25, question: "(250 + 150) × 2 = ?", answer: "800" },
    { id: 26, question: "(18 × 15) - 70 = ?", answer: "200" },
    { id: 27, question: "345 × 16 = ?", answer: "5520" },
    { id: 28, question: "888 + 999 + 111 = ?", answer: "1998" },
    { id: 29, question: "72 × 35 = ?", answer: "2520" },
    { id: 30, question: "(400 - 175) × 4 = ?", answer: "900" }
  ],

  X2: [
    { id: 1, question: "Proklamasi kemerdekaan Indonesia dibacakan tanggal?", choices: ["A. 16 Agustus", "B. 17 Agustus", "C. 18 Agustus", "D. 19 Agustus"], correct: "B", points: 1 },
    { id: 2, question: "Presiden pertama Indonesia adalah?", choices: ["A. Soeharto", "B. Soekarno", "C. Habibie", "D. Megawati"], correct: "B", points: 1 },
    { id: 3, question: "Perang Diponegoro terjadi di pulau?", choices: ["A. Sumatra", "B. Kalimantan", "C. Jawa", "D. Sulawesi"], correct: "C", points: 1 },
    { id: 4, question: "Organisasi pergerakan nasional pertama di Indonesia?", choices: ["A. Budi Utomo", "B. Sarekat Islam", "C. Indische Partij", "D. PNI"], correct: "A", points: 1 },
    { id: 5, question: "Konferensi Meja Bundar diadakan di kota?", choices: ["A. Jakarta", "B. Den Haag", "C. Yogyakarta", "D. Bandung"], correct: "B", points: 1 },
    { id: 6, question: "Kongres Pemuda II (Sumpah Pemuda) diadakan tahun?", choices: ["A. 1926", "B. 1927", "C. 1928", "D. 1929"], correct: "C", points: 1 },
    { id: 7, question: "Tokoh proklamator kedua Indonesia?", choices: ["A. Ahmad Soebardjo", "B. Mohammad Hatta", "C. Sutan Sjahrir", "D. Sukarni"], correct: "B", points: 1 },
    { id: 8, question: "Negara yang menyerah mengakhiri PD II di Asia Pasifik?", choices: ["A. Jerman", "B. Italia", "C. Jepang", "D. Inggris"], correct: "C", points: 1 },
    { id: 9, question: "Satuan SI untuk gaya adalah?", choices: ["A. Joule", "B. Newton", "C. Watt", "D. Pascal"], correct: "B", points: 1 },
    { id: 10, question: "Organ yang berfungsi memompa darah?", choices: ["A. Paru-paru", "B. Hati", "C. Jantung", "D. Ginjal"], correct: "C", points: 1 },
    { id: 11, question: "Proses tumbuhan membuat makanan dari cahaya matahari?", choices: ["A. Respirasi", "B. Fotosintesis", "C. Transpirasi", "D. Fermentasi"], correct: "B", points: 1 },
    { id: 12, question: "Planet terdekat dengan matahari?", choices: ["A. Venus", "B. Bumi", "C. Merkurius", "D. Mars"], correct: "C", points: 1 },
    { id: 13, question: "Lambang unsur kimia Oksigen adalah?", choices: ["A. O", "B. Os", "C. Ox", "D. On"], correct: "A", points: 1 },
    { id: 14, question: "Gas yang dibutuhkan manusia untuk bernapas?", choices: ["A. Karbon dioksida", "B. Oksigen", "C. Nitrogen", "D. Hidrogen"], correct: "B", points: 1 },
    { id: 15, question: "Alat untuk mengukur suhu disebut?", choices: ["A. Barometer", "B. Termometer", "C. Higrometer", "D. Manometer"], correct: "B", points: 1 }
  ],

  X3: [
    {
      id: 1,
      title: "Misteri Piala yang Hilang",
      location: "Ruang Laboratorium Kimia SMA 303 Jakarta",
      time: "Selasa Sore, pukul 16:30 (Setelah hujan deras)",
      incident: "Piala Bergilir yang sedianya akan dipajang besok pagi ditemukan hilang dari lemari kaca yang tidak terkunci.",
      suspects: [
        { id: "dika", name: "Dika (Kapten Basket)", note: "Terlihat di koridor dekat Lab setelah latihan basket. Memakai jersey biru tim sekolah." },
        { id: "sita", name: "Sita (Ketua Klub Kimia)", note: "Berada di Lab hingga sore membereskan alat praktikum. Sangat terobsesi dengan piala." },
        { id: "boni", name: "Boni (Siswa Remedial)", note: "Terlihat terburu-buru keluar gedung sekolah saat hujan mulai reda. Memakai hoodie biru." }
      ],
      evidence: [
        "Bukti #1: Piala dari lemari pajangan hilang, terdapat goresan pada lemari yang menunjukkan pintu dibuka terburu-buru.",
        "Bukti #2: Terdapat jejak kaki berlumpur di lantai lab. Solnya pola sneaker casual, lumpur masih basah.",
        "Bukti #3: Tumpahan cairan kopi sangat manis, diduga dikonsumsi orang yang kurang tidur/kelelahan."
      ],
      expectedSuspect: "boni",
      expectedReason: "Boni keluar saat hujan (sepatu berlumpur basah). Kopi manis dikonsumsi orang kelelahan/stres remedial."
    }
  ],

  X4: {
    mediaList: [
      { id: 1, type: "image", label: "Media 1: Gambar", title: "Apel merah di atas meja kayu", durationSec: 6 },
      { id: 2, type: "video", label: "Media 2: Video", title: "Bola basket oranye memantul 3 kali di lantai", durationSec: 8 },
      { id: 3, type: "image", label: "Media 3: Gambar", title: "Mobil sedan biru terparkir depan gedung", durationSec: 5 },
      { id: 4, type: "video", label: "Media 4: Video", title: "Kucing hitam berjalan melewati pagar putih", durationSec: 10 }
    ],
    questions: [
      { id: 1, question: "Buah apa yang muncul di Media 1?", choices: ["A. Apel", "B. Jeruk", "C. Pisang", "D. Mangga"], correct: "A" },
      { id: 2, question: "Apa warna buah pada Media 1?", choices: ["A. Hijau", "B. Merah", "C. Kuning", "D. Oranye"], correct: "B" },
      { id: 3, question: "Apa warna bola pada Media 2?", choices: ["A. Hitam", "B. Biru", "C. Oranye", "D. Merah"], correct: "C" },
      { id: 4, question: "Berapa kali bola memantul pada Media 2?", choices: ["A. 2 kali", "B. 3 kali", "C. 4 kali", "D. 5 kali"], correct: "B" },
      { id: 5, question: "Apa warna mobil pada Media 3?", choices: ["A. Merah", "B. Biru", "C. Hitam", "D. Putih"], correct: "B" },
      { id: 6, question: "Jenis kendaraan apa yang tampil pada Media 3?", choices: ["A. Mobil Sedan", "B. Truk", "C. Sepeda Motor", "D. Bus"], correct: "A" },
      { id: 7, question: "Apa warna kucing pada Media 4?", choices: ["A. Putih", "B. Abu-abu", "C. Hitam", "D. Oranye"], correct: "C" },
      { id: 8, question: "Objek apa yang dilewati kucing pada Media 4?", choices: ["A. Pagar Hitam", "B. Pagar Putih", "C. Pohon", "D. Bangku Taman"], correct: "B" },
      { id: 9, question: "Urutan Objek Utama Media 1 - 4?", choices: ["A. Apel - Bola - Mobil - Kucing", "B. Jeruk - Bola - Bus - Kucing", "C. Apel - Kucing - Mobil - Bola", "D. Pisang - Bola - Mobil - Anjing"], correct: "A" }
    ]
  }
};

let activeQuestions = JSON.parse(JSON.stringify(defaultQuestions));

let matchState = {
  localIp: localIpAddress,
  port: PORT,
  teams: {
    X: { name: "TEAM X", score: 0, legScores: { X1: 0, X2: 0, X3: 0, X4: 0 } },
    Y: { name: "TEAM Y", score: 0, legScores: { X1: 0, X2: 0, X3: 0, X4: 0 } }
  },
  targetScore: 11,
  matchpoint: 6,
  currentStation: "STANDBY",
  trackerColors: { X: "#FF5449", Y: "#00E5FF" },
  stationVisibility: { X1: false, X2: false, X3: false, X4: false },

  matchTimer: { elapsedSec: 0, maxSec: 3300, running: false },
  stationTimer: { remainingSec: 0, initialSec: 0, running: false },

  buzzer: { open: false, buzzedTeam: null, order: [], lockout: { X: false, Y: false } },

  activeQuestionsX1: activeQuestions.X1,
  currentQuestion: {
    X1: activeQuestions.X1,
    X2: activeQuestions.X2[0],
    X2Idx: 0,
    X2Answered: false,
    X2LastResult: null,
    X3: activeQuestions.X3[0],
    X4: activeQuestions.X4
  },

  x1Progress: {
    X: { currentIdx: 0, correctCount: 0, wrongCount: 0, skippedCount: 0, totalAnswered: 0, finished: false },
    Y: { currentIdx: 0, correctCount: 0, wrongCount: 0, skippedCount: 0, totalAnswered: 0, finished: false },
    targetCorrect: 30
  },

  x3Submissions: { X: null, Y: null },
  x4State: { phase: "IDLE", currentMediaIdx: 0, mediaRemainingSec: 0, submissions: { X: null, Y: null } },
  winner: null
};

// Streamlined 1-second interval loop
setInterval(() => {
  let changed = false;

  if (matchState.matchTimer.running) {
    if (matchState.matchTimer.elapsedSec < matchState.matchTimer.maxSec) {
      matchState.matchTimer.elapsedSec++;
      changed = true;
    } else {
      matchState.matchTimer.running = false;
      changed = true;
    }
  }

  if (matchState.stationTimer.running) {
    if (matchState.stationTimer.remainingSec > 0) {
      matchState.stationTimer.remainingSec--;
      changed = true;
    } else {
      matchState.stationTimer.running = false;
      changed = true;
    }
  }

  if (matchState.currentStation === 'X4' && matchState.x4State.phase === 'FLASHING') {
    if (matchState.x4State.mediaRemainingSec > 0) {
      matchState.x4State.mediaRemainingSec--;
      changed = true;
    } else {
      if (matchState.x4State.currentMediaIdx < activeQuestions.X4.mediaList.length - 1) {
        matchState.x4State.currentMediaIdx++;
        matchState.x4State.mediaRemainingSec = activeQuestions.X4.mediaList[matchState.x4State.currentMediaIdx].durationSec;
      } else {
        matchState.x4State.phase = 'RECALL';
      }
      changed = true;
    }
  }

  if (changed) io.emit('state_update', matchState);
}, 1000);

function updateState() {
  io.emit('state_update', matchState);
}

io.on('connection', (socket) => {
  socket.emit('state_update', matchState);

  socket.on('admin:set_teams', (data) => {
    if (data.nameX) matchState.teams.X.name = data.nameX;
    if (data.nameY) matchState.teams.Y.name = data.nameY;
    updateState();
  });

  socket.on('admin:set_tracker_colors', ({ colorX, colorY }) => {
    if (colorX) matchState.trackerColors.X = colorX;
    if (colorY) matchState.trackerColors.Y = colorY;
    updateState();
  });

  socket.on('admin:set_station', (stationId) => {
    matchState.currentStation = stationId;
    matchState.buzzer = { open: false, buzzedTeam: null, order: [], lockout: { X: false, Y: false } };
    
    const timers = { X1: 300, X2: 600, X3: 600, X4: 300, STANDBY: 0 };
    const sec = timers[stationId] || 0;
    matchState.stationTimer = { remainingSec: sec, initialSec: sec, running: false };

    updateState();
  });

  socket.on('admin:reset_x1', () => {
    const listLen = (matchState.activeQuestionsX1 || activeQuestions.X1).length;
    matchState.x1Progress = {
      X: { currentIdx: 0, correctCount: 0, wrongCount: 0, skippedCount: 0, totalAnswered: 0, finished: false },
      Y: { currentIdx: 0, correctCount: 0, wrongCount: 0, skippedCount: 0, totalAnswered: 0, finished: false },
      targetCorrect: listLen
    };
    updateState();
    io.emit('toast_event', { title: 'X1 PROGRESS RESET', message: '' });
  });

  socket.on('admin:toggle_station_visibility', ({ stationId, visible }) => {
    if (matchState.stationVisibility.hasOwnProperty(stationId)) {
      matchState.stationVisibility[stationId] = visible;
      updateState();
    }
  });

  socket.on('admin:adjust_station_timer', (amountSec) => {
    matchState.stationTimer.remainingSec = Math.max(0, matchState.stationTimer.remainingSec + amountSec);
    matchState.stationTimer.initialSec = Math.max(0, matchState.stationTimer.initialSec + amountSec);
    updateState();
  });

  socket.on('admin:control_timer', ({ timerType, action, value }) => {
    if (timerType === 'match') {
      if (action === 'start') matchState.matchTimer.running = true;
      if (action === 'pause') matchState.matchTimer.running = false;
      if (action === 'reset') { matchState.matchTimer.running = false; matchState.matchTimer.elapsedSec = 0; }
    } else if (timerType === 'station') {
      if (action === 'start') { matchState.stationTimer.running = true; matchState.matchTimer.running = true; }
      if (action === 'pause') { matchState.stationTimer.running = false; matchState.matchTimer.running = false; }
      if (action === 'reset') { matchState.stationTimer.running = false; matchState.stationTimer.remainingSec = matchState.stationTimer.initialSec; }
      if (action === 'set' && value) { matchState.stationTimer.initialSec = parseInt(value); matchState.stationTimer.remainingSec = parseInt(value); }
    }
    updateState();
  });

  socket.on('admin:update_score', ({ team, amount, leg }) => {
    if (matchState.teams[team]) {
      matchState.teams[team].score = Math.max(0, matchState.teams[team].score + amount);
      if (leg && leg !== 'STANDBY') matchState.teams[team].legScores[leg] = Math.max(0, matchState.teams[team].legScores[leg] + amount);
      if (matchState.teams[team].score >= matchState.targetScore) matchState.winner = matchState.teams[team].name;
    }
    updateState();
  });

  socket.on('admin:grade_x1', ({ team, points }) => {
    if (matchState.teams[team]) {
      matchState.teams[team].score += points;
      matchState.teams[team].legScores.X1 += points;
      if (matchState.teams[team].score >= matchState.targetScore) matchState.winner = matchState.teams[team].name;
    }
    updateState();
    io.emit('audio_trigger', { type: points > 0 ? 'correct' : 'wrong' });
  });

  socket.on('admin:open_buzzer', () => {
    if (matchState.currentQuestion.X2Answered) return;
    matchState.stationVisibility.X2 = true;
    matchState.buzzer = { open: true, buzzedTeam: null, order: [], lockout: { X: false, Y: false } };
    updateState();
    io.emit('audio_trigger', { type: 'buzzer_open' });
  });

  socket.on('admin:close_buzzer', () => {
    matchState.buzzer.open = false;
    updateState();
  });

  socket.on('admin:reset_buzzer', () => {
    matchState.buzzer = { open: false, buzzedTeam: null, order: [], lockout: { X: false, Y: false } };
    updateState();
  });

  socket.on('admin:next_x2_question', () => {
    if (matchState.currentQuestion.X2Idx < activeQuestions.X2.length - 1) {
      matchState.currentQuestion.X2Idx++;
      matchState.currentQuestion.X2 = activeQuestions.X2[matchState.currentQuestion.X2Idx];
      matchState.currentQuestion.X2Answered = false;
      matchState.currentQuestion.X2LastResult = null;
      matchState.buzzer = { open: false, buzzedTeam: null, order: [], lockout: { X: false, Y: false } };
      updateState();
    }
  });

  socket.on('admin:prev_x2_question', () => {
    if (matchState.currentQuestion.X2Idx > 0) {
      matchState.currentQuestion.X2Idx--;
      matchState.currentQuestion.X2 = activeQuestions.X2[matchState.currentQuestion.X2Idx];
      matchState.currentQuestion.X2Answered = false;
      matchState.currentQuestion.X2LastResult = null;
      matchState.buzzer = { open: false, buzzedTeam: null, order: [], lockout: { X: false, Y: false } };
      updateState();
    }
  });

function parseCsvLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

function cleanCsvCell(cell) {
  let val = (cell || '').trim();
  if (val.startsWith('"') && val.endsWith('"') && val.length >= 2) {
    val = val.substring(1, val.length - 1).replace(/""/g, '"').trim();
  }
  return val;
}

  socket.on('admin:import_csv', ({ stationId, csvText }) => {
    try {
      const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length <= 1) return;
      const rows = lines.slice(1);

      if (stationId === 'X1') {
        const imported = rows.map((r, i) => {
          const cols = parseCsvLine(r).map(cleanCsvCell);
          return {
            id: i + 1,
            question: cols[1] ? cols[1] : (cols[0] ? cols[0] : ""),
            answer: cols[3] ? cols[3] : (cols[2] ? cols[2] : "")
          };
        }).filter(q => q.question);

        if (imported.length) {
          activeQuestions.X1 = imported;
          matchState.activeQuestionsX1 = imported;
          matchState.currentQuestion.X1 = imported;
          matchState.x1Progress = {
            X: { currentIdx: 0, correctCount: 0, wrongCount: 0, skippedCount: 0, totalAnswered: 0, finished: false },
            Y: { currentIdx: 0, correctCount: 0, wrongCount: 0, skippedCount: 0, totalAnswered: 0, finished: false },
            targetCorrect: imported.length
          };
          matchState.currentStation = 'X1';
          matchState.stationVisibility.X1 = true;
          socket.emit('admin:import_success', { stationId, count: imported.length });
          updateState();
        }
      } else if (stationId === 'X2') {
        const imported = rows.map((r, i) => {
          const cols = parseCsvLine(r).map(cleanCsvCell);
          return {
            id: i + 1,
            question: cols[1] ? cols[1] : "",
            choices: cols[2] ? cols[2].split('|').map(c => c.trim()) : ["A", "B", "C", "D"],
            correct: cols[3] ? cols[3].toUpperCase() : "A",
            points: parseInt(cols[4]) || 1
          };
        }).filter(q => q.question);

        if (imported.length) {
          activeQuestions.X2 = imported;
          matchState.currentQuestion.X2Idx = 0;
          matchState.currentQuestion.X2 = imported[0];
          matchState.currentQuestion.X2Answered = false;
          matchState.currentQuestion.X2LastResult = null;
          matchState.buzzer = { open: false, buzzedTeam: null, order: [], lockout: { X: false, Y: false } };
          matchState.currentStation = 'X2';
          matchState.stationVisibility.X2 = true;
          socket.emit('admin:import_success', { stationId, count: imported.length });
          updateState();
        }
      } else if (stationId === 'X3') {
        const imported = rows.map((r, i) => {
          const cols = parseCsvLine(r).map(cleanCsvCell);
          return {
            id: i + 1,
            title: cols[1] ? cols[1] : "Kasus AI",
            location: cols[2] ? cols[2] : "Ruang Laboratorium",
            time: cols[3] ? cols[3] : "Waktu Kejadian",
            incident: cols[4] ? cols[4] : "",
            suspects: [
              { id: "dika", name: "Dika (Kapten Basket)", note: "Terlihat di koridor dekat lokasi." },
              { id: "sita", name: "Sita (Ketua Kimia)", note: "Membereskan alat praktikum di lokasi." },
              { id: "boni", name: "Boni (Siswa Remedial)", note: "Terburu-buru keluar gedung sekolah." }
            ],
            evidence: [
              "Bukti #1: Barang di lokasi hilang dan pintu terbuka terburu-buru.",
              "Bukti #2: Terdapat jejak kaki berlumpur basah.",
              "Bukti #3: Tumpahan minuman manis dikonsumsi orang kelelahan."
            ],
            expectedSuspect: cols[5] ? cols[5].toLowerCase() : "boni",
            expectedReason: cols[6] ? cols[6] : ""
          };
        }).filter(q => q.title || q.incident);

        if (imported.length) {
          activeQuestions.X3 = imported;
          matchState.currentQuestion.X3 = imported[0];
          matchState.x3Submissions = { X: null, Y: null };
          matchState.currentStation = 'X3';
          matchState.stationVisibility.X3 = true;
          socket.emit('admin:import_success', { stationId, count: imported.length });
          updateState();
        }
      } else if (stationId === 'X4') {
        const imported = rows.map((r, i) => {
          const cols = parseCsvLine(r).map(cleanCsvCell);
          return {
            id: i + 1,
            question: cols[1] ? cols[1] : "",
            choices: cols[2] ? cols[2].split('|').map(c => c.trim()) : ["A", "B", "C", "D"],
            correct: cols[3] ? cols[3].toUpperCase() : "A"
          };
        }).filter(q => q.question);

        if (imported.length) {
          activeQuestions.X4.questions = imported;
          matchState.currentQuestion.X4 = activeQuestions.X4;
          matchState.x4State = { phase: "IDLE", currentMediaIdx: 0, mediaRemainingSec: 0, submissions: { X: null, Y: null } };
          matchState.currentStation = 'X4';
          matchState.stationVisibility.X4 = true;
          socket.emit('admin:import_success', { stationId, count: imported.length });
          updateState();
        }
      }
    } catch (e) {
      console.error('CSV import error:', e);
    }
  });

  socket.on('admin:start_x4_flash', () => {
    matchState.stationVisibility.X4 = true;
    matchState.x4State.phase = 'FLASHING';
    matchState.x4State.currentMediaIdx = 0;
    matchState.x4State.mediaRemainingSec = activeQuestions.X4.mediaList[0].durationSec;
    updateState();
    io.emit('audio_trigger', { type: 'flash_start' });
  });

  socket.on('admin:start_x4_recall', () => {
    matchState.stationVisibility.X4 = true;
    matchState.x4State.phase = 'RECALL';
    matchState.x4State.mediaRemainingSec = 0;
    updateState();
  });

  socket.on('admin:grade_x3', ({ team, correct, points }) => {
    if (correct) {
      matchState.teams[team].score += (points || 1);
      matchState.teams[team].legScores.X3 += (points || 1);
      if (matchState.teams[team].score >= matchState.targetScore) matchState.winner = matchState.teams[team].name;
    }
    updateState();
    io.emit('audio_trigger', { type: correct ? 'correct' : 'wrong' });
  });

  socket.on('admin:grade_x4', ({ team, points }) => {
    matchState.teams[team].score += points;
    matchState.teams[team].legScores.X4 += points;
    if (matchState.teams[team].score >= matchState.targetScore) matchState.winner = matchState.teams[team].name;
    updateState();
    io.emit('audio_trigger', { type: points > 0 ? 'correct' : 'wrong' });
  });

  socket.on('admin:reset_all', () => {
    activeQuestions = JSON.parse(JSON.stringify(defaultQuestions));
    matchState.teams = { X: { name: "TEAM X", score: 0, legScores: { X1: 0, X2: 0, X3: 0, X4: 0 } }, Y: { name: "TEAM Y", score: 0, legScores: { X1: 0, X2: 0, X3: 0, X4: 0 } } };
    matchState.trackerColors = { X: "#FF5449", Y: "#00E5FF" };
    matchState.currentStation = "STANDBY";
    matchState.stationVisibility = { X1: false, X2: false, X3: false, X4: false };
    matchState.matchTimer = { elapsedSec: 0, maxSec: 3300, running: false };
    matchState.stationTimer = { remainingSec: 0, initialSec: 0, running: false };
    matchState.buzzer = { open: false, buzzedTeam: null, order: [], lockout: { X: false, Y: false } };
    matchState.currentQuestion.X2Idx = 0;
    matchState.currentQuestion.X2 = activeQuestions.X2[0];
    matchState.currentQuestion.X2Answered = false;
    matchState.currentQuestion.X2LastResult = null;
    matchState.activeQuestionsX1 = activeQuestions.X1;
    matchState.x1Progress = { X: { currentIdx: 0, correctCount: 0, wrongCount: 0, skippedCount: 0, totalAnswered: 0, finished: false }, Y: { currentIdx: 0, correctCount: 0, wrongCount: 0, skippedCount: 0, totalAnswered: 0, finished: false }, targetCorrect: 30 };
    matchState.x3Submissions = { X: null, Y: null };
    matchState.x4State = { phase: "IDLE", currentMediaIdx: 0, mediaRemainingSec: 0, submissions: { X: null, Y: null } };
    matchState.winner = null;

    updateState();
    io.emit('toast_event', { title: 'MATCH RESET', message: '' });
  });

  // --- TEAM COMMANDS ---

  socket.on('team:skip_x1', (team) => {
    const p = matchState.x1Progress[team];
    if (!p) return;
    const list = matchState.activeQuestionsX1 || activeQuestions.X1;
    if (p.finished || p.currentIdx >= list.length) { p.finished = true; updateState(); return; }

    p.skippedCount = (p.skippedCount || 0) + 1;
    p.totalAnswered = (p.totalAnswered || 0) + 1;
    p.currentIdx++;
    if (p.currentIdx >= list.length) p.finished = true;
    updateState();
  });

  socket.on('team:buzz', (team) => {
    if (matchState.buzzer.open && !matchState.buzzer.lockout[team] && !matchState.currentQuestion.X2Answered) {
      const isFirst = matchState.buzzer.order.length === 0;
      matchState.buzzer.order.push({ team, timestamp: Date.now() });
      if (isFirst) {
        matchState.buzzer.buzzedTeam = team;
        matchState.buzzer.open = false;
        io.emit('audio_trigger', { type: 'buzzer_press', team });
      } else {
        matchState.buzzer.lockout[team] = true;
      }
      updateState();
    }
  });

  socket.on('team:submit_x2', ({ team, choice }) => {
    if (matchState.buzzer.buzzedTeam === team && !matchState.currentQuestion.X2Answered) {
      const q = matchState.currentQuestion.X2;
      const pointsToAward = q.points || 1;
      const isCorrect = (choice === q.correct);
      
      matchState.currentQuestion.X2Answered = true;
      matchState.currentQuestion.X2LastResult = { team, isCorrect, pointsAwarded: isCorrect ? pointsToAward : 0 };

      if (isCorrect) {
        matchState.teams[team].legScores.X2 += pointsToAward;
        io.emit('audio_trigger', { type: 'correct' });
      } else {
        matchState.buzzer.lockout[team] = true;
        io.emit('audio_trigger', { type: 'wrong' });
      }

      matchState.buzzer.open = false;
      updateState();
    }
  });

  socket.on('team:submit_x1', ({ team, answer }) => {
    const p = matchState.x1Progress[team];
    if (!p) return;
    const list = matchState.activeQuestionsX1 || activeQuestions.X1;
    if (p.finished || p.currentIdx >= list.length) { p.finished = true; updateState(); return; }

    const currentQ = list[p.currentIdx];
    if (currentQ) {
      const cleanInput = String(answer).trim().toLowerCase().replace(/\s+/g, '');
      const cleanCorrect = String(currentQ.answer).trim().toLowerCase().replace(/\s+/g, '');
      p.totalAnswered = (p.totalAnswered || 0) + 1;

      if (cleanInput === cleanCorrect) {
        p.correctCount = (p.correctCount || 0) + 1;
        io.emit('audio_trigger', { type: 'correct' });
      } else {
        p.wrongCount = (p.wrongCount || 0) + 1;
        io.emit('audio_trigger', { type: 'wrong' });
      }

      p.currentIdx++;
      if (p.currentIdx >= list.length) p.finished = true;
      updateState();
    }
  });

  socket.on('team:submit_x3', ({ team, suspect, justification }) => {
    matchState.x3Submissions[team] = { suspect, justification, timestamp: new Date().toLocaleTimeString() };
    updateState();
    io.emit('audio_trigger', { type: 'submit' });
  });

  socket.on('team:submit_x4', ({ team, answers }) => {
    let score = 0;
    const questions = activeQuestions.X4.questions;

    questions.forEach((q, idx) => {
      const userChoice = (answers[idx] || '').trim().toUpperCase();
      const targetChoice = q.correct.trim().toUpperCase();
      if (userChoice && (userChoice === targetChoice || userChoice.startsWith(targetChoice))) {
        score++;
      }
    });

    matchState.x4State.submissions[team] = { answers, autoScore: score, timestamp: new Date().toLocaleTimeString() };
    updateState();
    io.emit('audio_trigger', { type: 'submit' });
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Clash of Unxpadted Local Server active!`);
  console.log(`  Local Access:   http://localhost:${PORT}`);
  console.log(`  LAN Access IP:  http://${localIpAddress}:${PORT}`);
  console.log(`=======================================================`);
});
