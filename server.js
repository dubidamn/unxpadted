const express = require('express');
const http = require('http');
const path = require('path');
const os = require('os');
const { Server } = require('socket.io');
const fs = require('fs');

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

// Static file routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'Skinned-Asset')));
app.use('/assets/brand', express.static(path.join(__dirname, 'Asset-XPAD30Pro', 'brand')));
app.use('/assets/devices', express.static(path.join(__dirname, 'Asset-XPAD30Pro', 'devices')));
app.use('/skinned-assets', express.static(path.join(__dirname, 'Skinned-Asset')));
app.use('/png-assets', express.static(path.join(__dirname, 'PNG ASSET')));
app.use('/match-sets', express.static(path.join(__dirname, 'match_sets')));

// Friendly routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'broadcast.html'));
});

app.get('/broadcast', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'broadcast.html'));
});

app.get('/display', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'broadcast.html'));
});

app.get('/player', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'player.html'));
});

app.get('/team', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'player.html'));
});

app.get('/gm', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gm.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gm.html'));
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'favicon.ico'));
});

// Default Match Questions Repository
const defaultQuestions = {
  // X1: Math Speedrun
  X1: [
    { id: 1, q: "47 + 58 = ?", a: 105 },
    { id: 2, q: "6 × 9 = ?", a: 54 },
    { id: 3, q: "12 × 8 = ?", a: 96 },
    { id: 4, q: "34 × 12 = ?", a: 408 },
    { id: 5, q: "256 + 489 = ?", a: 745 },
    { id: 6, q: "45 × 23 = ?", a: 1035 },
    { id: 7, q: "(15 × 8) + 40 = ?", a: 160 },
    { id: 8, q: "234 × 12 = ?", a: 2808 },
    { id: 9, q: "(250 + 150) × 2 = ?", a: 800 },
    { id: 10, q: "123 + 87 = ?", a: 210 },
    { id: 11, q: "35 + 49 = ?", a: 84 },
    { id: 12, q: "15 × 7 = ?", a: 105 },
    { id: 13, q: "189 + 64 = ?", a: 253 },
    { id: 14, q: "14 × 6 = ?", a: 84 },
    { id: 15, q: "312 + 198 = ?", a: 510 },
    { id: 16, q: "678 + 345 = ?", a: 1023 },
    { id: 17, q: "27 × 34 = ?", a: 918 },
    { id: 18, q: "56 × 15 = ?", a: 840 },
    { id: 19, q: "892 + 567 = ?", a: 1459 },
    { id: 20, q: "42 × 18 = ?", a: 756 },
    { id: 21, q: "743 + 289 = ?", a: 1032 },
    { id: 22, q: "38 × 25 = ?", a: 950 },
    { id: 23, q: "456 + 789 + 123 = ?", a: 1368 },
    { id: 24, q: "67 × 45 = ?", a: 3015 },
    { id: 25, q: "(18 × 15) - 70 = ?", a: 200 },
    { id: 26, q: "345 × 16 = ?", a: 5520 },
    { id: 27, q: "888 + 999 + 111 = ?", a: 1998 },
    { id: 28, q: "72 × 35 = ?", a: 2520 },
    { id: 29, q: "(400 - 175) × 4 = ?", a: 900 },
    { id: 30, q: "125 × 8 = ?", a: 1000 }
  ],

  // X2: Cerdas Cermat
  X2: [
    {
      id: 1,
      question: "Proklamasi kemerdekaan Indonesia dibacakan pada tanggal?",
      choices: ["A. 16 Agustus 1945", "B. 17 Agustus 1945", "C. 18 Agustus 1945", "D. 19 Agustus 1945"],
      correct: 1,
      points: 2
    },
    {
      id: 2,
      question: "Presiden pertama Republik Indonesia adalah?",
      choices: ["A. Ir. Soekarno", "B. Moh. Hatta", "C. B.J. Habibie", "D. Soeharto"],
      correct: 0,
      points: 2
    },
    {
      id: 3,
      question: "Satuan Standar Internasional (SI) untuk besaran gaya adalah?",
      choices: ["A. Joule", "B. Watt", "C. Newton", "D. Pascal"],
      correct: 2,
      points: 2
    },
    {
      id: 4,
      question: "Organ tubuh manusia yang berfungsi utama memompa darah ke seluruh tubuh adalah?",
      choices: ["A. Paru-paru", "B. Jantung", "C. Hati", "D. Ginjal"],
      correct: 1,
      points: 2
    },
    {
      id: 5,
      question: "Proses tumbuhan mengubah energi cahaya matahari menjadi makanan disebut?",
      choices: ["A. Respirasi", "B. Transpirasi", "C. Fotosintesis", "D. Fermentasi"],
      correct: 2,
      points: 2
    },
    {
      id: 6,
      question: "Organisasi pergerakan nasional pertama di Indonesia yang didirikan tahun 1908 adalah?",
      choices: ["A. Budi Utomo", "B. Sarekat Islam", "C. Indische Partij", "D. PNI"],
      correct: 0,
      points: 2
    },
    {
      id: 7,
      question: "Planet terdekat dari Matahari dalam tata surya adalah?",
      choices: ["A. Venus", "B. Merkurius", "C. Mars", "D. Bumi"],
      correct: 1,
      points: 2
    },
    {
      id: 8,
      question: "Gas yang dihirup manusia saat bernapas untuk metabolisme tubuh adalah?",
      choices: ["A. Karbondioksida", "B. Nitrogen", "C. Oksigen", "D. Hidrogen"],
      correct: 2,
      points: 2
    }
  ],

  // X3: Flash Memory
  X3: {
    questions: [
      {
        id: 1,
        question: "Buah apa yang muncul di Media 1 dan warnanya apa?",
        choices: ["A. Apel Merah", "B. Jeruk Oranye", "C. Pisang Kuning", "D. Mangga Hijau"],
        correct: 0
      },
      {
        id: 2,
        question: "Berapa jumlah koin emas yang tampak di pojok kanan atas layar?",
        choices: ["A. 3 Koin", "B. 5 Koin", "C. 7 Koin", "D. 9 Koin"],
        correct: 1
      },
      {
        id: 3,
        question: "Bentuk geometri apa yang berputar di latar belakang Media 3?",
        choices: ["A. Heksagon Ungu", "B. Segitiga Biru", "C. Oktagon Merah", "D. Bintang Emas"],
        correct: 0
      },
      {
        id: 4,
        question: "Karakter robot mana yang membawa bendera Infinix?",
        choices: ["A. Robot Alpha", "B. Robot Beta", "C. Robot Gamma", "D. Robot Delta"],
        correct: 2
      },
      {
        id: 5,
        question: "Angka digital berapa yang berkedip pada timer lab?",
        choices: ["A. 00:45", "B. 01:30", "C. 02:15", "D. 03:00"],
        correct: 1
      }
    ]
  },

  // X4: AI Unsolved Case
  X4: {
    terminalLogs: [
      "[SYS_INIT] PROTOKOL: CLASH OF UNXPADTED DIJALANKAN",
      "[WARN] AKSES XPAD TERKUNCI.",
      "[INFO] BATAS WAKTU DEKRIPSI: 10 MENIT.",
      "[HINT] GUNAKAN FOLAX AI UNTUK BANTUAN ANALISIS.",
      "",
      "[LOG_01] SINKRONISASI DATA >> MENCARI DIGIT PERTAMA",
      "[TRACE] Mengunduh 5 paket data ke dalam sistem secara berurutan.",
      "[TRACE] Data 3 masuk sebelum Data 2, tetapi setelah Data 1.",
      "[TRACE] Data 4 masuk tepat sebelum Data 3.",
      "[TRACE] Pengecualian: Data 5 masuk paling awal, mendahului Data 1.",
      "[EXEC] Tetapkan nomor data yang berada tepat di urutan ketiga sebagai DIGIT PERTAMA.",
      "",
      "[LOG_02] IDENTIFIKASI ANOMALI >> MENCARI DIGIT KEDUA",
      "[WARN] Folax AI mendeteksi 1 penyusup dari 3 program (AI_1, AI_2, AI_3).",
      "[RULE] Filter validasi: HANYA SATU AI yang berbohong, sisanya berkata jujur.",
      "[INPUT] AI_1: \"AI_2 berkata jujur.\"",
      "[INPUT] AI_2: \"AI_3 adalah satu-satunya yang berbohong.\"",
      "[INPUT] AI_3: \"AI_1 sedang berbohong.\"",
      "[EXEC] Identifikasi nomor AI yang berbohong tersebut sebagai DIGIT KEDUA.",
      "",
      "[LOG_03] PARAMETER AKHIR >> MENCARI DIGIT KETIGA",
      "[INFO] Memindai angka tunggal (1-9) berdasarkan algoritma berikut.",
      "[TRACE] Parameter 1: Merupakan angka genap dan bernilai lebih besar dari 4.",
      "[TRACE] Parameter 2: Jika dibagi dengan angka 3, akan selalu menyisakan angka 2.",
      "[EXEC] Deduksikan angka tersebut sebagai DIGIT KETIGA.",
      "",
      "[SYS_REQ] Rangkai 3 digit angka untuk memulihkan akses."
    ],
    solutionCode: [4, 3, 8]
  }
};

// Load Match Set 1 on startup if available
try {
  const set1Path = path.join(__dirname, 'match_sets', 'match_set_1.json');
  if (fs.existsSync(set1Path)) {
    const raw = JSON.parse(fs.readFileSync(set1Path, 'utf8'));
    if (raw.X1) defaultQuestions.X1 = raw.X1;
    if (raw.X2) defaultQuestions.X2 = raw.X2;
    if (raw.X3) defaultQuestions.X3 = raw.X3;
    if (raw.X4) defaultQuestions.X4 = raw.X4;
  }
} catch (e) {
  console.warn('Fallback default questions loaded');
}

let activeQuestions = JSON.parse(JSON.stringify(defaultQuestions));

let matchState = {
  localIp: localIpAddress,
  port: PORT,
  activeMatchSet: {
    id: "default",
    filename: "[default]",
    title: "DEFAULT MATCH SET",
    description: "Default Match Set (100 Soal Math Speedrun, 15 Trivia Cerdas Cermat, 10 Flash Memory, Kasus AI)",
    totalX1: activeQuestions.X1.length,
    totalX2: activeQuestions.X2.length,
    totalX3: (activeQuestions.X3 && activeQuestions.X3.questions) ? activeQuestions.X3.questions.length : 0
  },
  teams: {
    X: { name: "TEAM X", score: 0, legScores: { X1: 0, X2: 0, X3: 0, X4: 0 }, color: "#ff4757" },
    Y: { name: "TEAM Y", score: 0, legScores: { X1: 0, X2: 0, X3: 0, X4: 0 }, color: "#00d2d3" }
  },
  totalMatchDots: 11,
  matchWinsX: 0,
  matchWinsY: 0,
  currentStation: "STANDBY", // 'STANDBY', 'X1', 'X2', 'X3', 'X4'

  matchTimer: { elapsedSec: 0, maxSec: 1200, running: false },
  stationTimer: { remainingSec: 300, initialSec: 300, running: false },

  // X1: Math Speedrun
  x1: {
    targetScore: 30,
    progress: {
      X: { currentIdx: 0, score: 0, formula: activeQuestions.X1[0].q, totalAnswered: 0, correctCount: 0, wrongCount: 0, finished: false },
      Y: { currentIdx: 0, score: 0, formula: activeQuestions.X1[0].q, totalAnswered: 0, correctCount: 0, wrongCount: 0, finished: false }
    },
    latestCorrectTeam: null,
    winner: null
  },

  // X2: Cerdas Cermat
  x2: {
    currentQIdx: 0,
    currentQuestion: activeQuestions.X2[0],
    totalQuestions: activeQuestions.X2.length,
    buzzer: {
      open: false,
      buzzedTeam: null, // 'X' or 'Y'
      buzzedAt: null,
      lockout: { X: false, Y: false },
      answerRemainingSec: 10
    },
    currentResult: null // { team, isCorrect, choice, points, passToOpponent, bothFailed }
  },

  // X3: Flash Memory
  x3: {
    phase: "IDLE", // 'IDLE', 'RECALL', 'RESULT'
    startedAt: null,
    questions: activeQuestions.X3.questions || activeQuestions.X3,
    totalQuestions: (activeQuestions.X3 && activeQuestions.X3.questions) ? activeQuestions.X3.questions.length : (Array.isArray(activeQuestions.X3) ? activeQuestions.X3.length : 0),
    progress: {
      X: { answers: [null, null, null, null, null], answerTimes: [null, null, null, null, null], currentIdx: 0, allLocked: false, lockedAt: null, correctCount: 0 },
      Y: { answers: [null, null, null, null, null], answerTimes: [null, null, null, null, null], currentIdx: 0, allLocked: false, lockedAt: null, correctCount: 0 }
    },
    winner: null
  },

  // X4: AI Unsolved Case
  x4: {
    caseData: activeQuestions.X4.caseData || activeQuestions.X4,
    startedAt: null,
    teams: {
      X: {
        digits: [0, 0, 0],
        locks: [false, false, false],
        lockTimes: [null, null, null], // elapsed ms
        submitted: false,
        submittedAt: null,
        totalCorrect: 0
      },
      Y: {
        digits: [0, 0, 0],
        locks: [false, false, false],
        lockTimes: [null, null, null],
        submitted: false,
        submittedAt: null,
        totalCorrect: 0
      }
    },
    winnerResult: null
  },

  overallWinner: null
};

function applyMatchSet(matchSetData) {
  if (!matchSetData) return false;

  if (Array.isArray(matchSetData.X1) && matchSetData.X1.length > 0) {
    activeQuestions.X1 = matchSetData.X1;
  }
  if (Array.isArray(matchSetData.X2) && matchSetData.X2.length > 0) {
    activeQuestions.X2 = matchSetData.X2;
  }
  if (matchSetData.X3) {
    if (Array.isArray(matchSetData.X3)) {
      activeQuestions.X3 = { questions: matchSetData.X3 };
    } else if (Array.isArray(matchSetData.X3.questions)) {
      activeQuestions.X3 = { questions: matchSetData.X3.questions };
    }
  }
  if (matchSetData.X4) {
    const logs = matchSetData.X4.terminalLogs || (matchSetData.X4.caseData && matchSetData.X4.caseData.terminalLogs) || [];
    const sol = matchSetData.X4.solutionCode || (matchSetData.X4.caseData && matchSetData.X4.caseData.solutionCode) || [4, 3, 8];
    activeQuestions.X4 = { terminalLogs: logs, solutionCode: sol };
  }

  matchState.activeMatchSet = {
    id: matchSetData.matchSetId || 'CUSTOM',
    filename: matchSetData._filename || matchSetData.filename || (matchState.activeMatchSet ? matchState.activeMatchSet.filename : '[default]'),
    title: matchSetData.title || 'Custom Question Set',
    description: matchSetData.description || 'Custom Imported Match Set',
    totalX1: activeQuestions.X1.length,
    totalX2: activeQuestions.X2.length,
    totalX3: (activeQuestions.X3 && activeQuestions.X3.questions) ? activeQuestions.X3.questions.length : 0
  };

  // Reset station trackers
  if (activeQuestions.X1 && activeQuestions.X1.length > 0) {
    matchState.x1.progress.X.formula = activeQuestions.X1[0].q;
    matchState.x1.progress.Y.formula = activeQuestions.X1[0].q;
    matchState.x1.progress.X.currentIdx = 0;
    matchState.x1.progress.Y.currentIdx = 0;
    matchState.x1.progress.X.score = 0;
    matchState.x1.progress.Y.score = 0;
    matchState.x1.winner = null;
  }

  if (activeQuestions.X2 && activeQuestions.X2.length > 0) {
    matchState.x2.currentQIdx = 0;
    matchState.x2.currentQuestion = activeQuestions.X2[0];
    matchState.x2.totalQuestions = activeQuestions.X2.length;
    matchState.x2.buzzer = { open: false, buzzedTeam: null, buzzedAt: null, lockout: { X: false, Y: false }, answerRemainingSec: 10 };
    matchState.x2.currentResult = null;
  }

  if (activeQuestions.X3 && activeQuestions.X3.questions) {
    matchState.x3.questions = activeQuestions.X3.questions;
    matchState.x3.totalQuestions = activeQuestions.X3.questions.length;
    matchState.x3.progress = {
      X: { answers: [null, null, null, null, null], answerTimes: [null, null, null, null, null], currentIdx: 0, allLocked: false, lockedAt: null, correctCount: 0 },
      Y: { answers: [null, null, null, null, null], answerTimes: [null, null, null, null, null], currentIdx: 0, allLocked: false, lockedAt: null, correctCount: 0 }
    };
    matchState.x3.winner = null;
  }

  if (activeQuestions.X4) {
    matchState.x4.caseData = activeQuestions.X4;
    matchState.x4.startedAt = null;
    matchState.x4.teams = {
      X: { digits: [0, 0, 0], locks: [false, false, false], lockTimes: [null, null, null], submitted: false, submittedAt: null, totalCorrect: 0 },
      Y: { digits: [0, 0, 0], locks: [false, false, false], lockTimes: [null, null, null], submitted: false, submittedAt: null, totalCorrect: 0 }
    };
    matchState.x4.winnerResult = null;
  }

  updateState();
  io.emit('toast_event', {
    title: 'SET SOAL AKTIF!',
    message: `${matchState.activeMatchSet.title}`
  });
  return true;
}


// 1-Second Timer Engine Loop
setInterval(() => {
  let changed = false;

  // Match Timer
  if (matchState.matchTimer.running) {
    if (matchState.matchTimer.elapsedSec < matchState.matchTimer.maxSec) {
      matchState.matchTimer.elapsedSec++;
      changed = true;
    } else {
      matchState.matchTimer.running = false;
      changed = true;
    }
  }

  // Station Timer
  if (matchState.stationTimer.running) {
    if (matchState.stationTimer.remainingSec > 0) {
      matchState.stationTimer.remainingSec--;
      changed = true;
    } else {
      matchState.stationTimer.running = false;
      changed = true;
    }
  }

  // X2 Buzzer Answering Countdown
  if (matchState.currentStation === 'X2' && matchState.x2.buzzer.buzzedTeam && !matchState.x2.buzzer.open) {
    if (matchState.x2.buzzer.answerRemainingSec > 0) {
      matchState.x2.buzzer.answerRemainingSec--;
      changed = true;
    } else {
      // Timeout on answering: mark wrong and pass to other team
      const team = matchState.x2.buzzer.buzzedTeam;
      const opposing = team === 'X' ? 'Y' : 'X';
      matchState.x2.buzzer.lockout[team] = true;
      matchState.x2.buzzer.buzzedTeam = null;

      if (!matchState.x2.buzzer.lockout[opposing]) {
        matchState.x2.buzzer.open = true;
        matchState.x2.currentResult = { team, isCorrect: false, points: 0, timeout: true, passToOpponent: true };
        io.emit('audio_trigger', { type: 'buzzer_open' });
      } else {
        matchState.x2.buzzer.open = false;
        matchState.x2.currentResult = { team, isCorrect: false, points: 0, timeout: true, bothFailed: true };
        io.emit('audio_trigger', { type: 'wrong' });
      }
      changed = true;
    }
  }



  if (changed) {
    updateState();
  }
}, 1000);

function updateState() {
  io.emit('state_update', matchState);
}

io.on('connection', (socket) => {
  // Send state immediately on client connect
  socket.emit('state_update', matchState);

  // ==========================================
  // 1. GENERAL / GAMEMASTER CONTROLS
  // ==========================================
  socket.on('admin:set_station', (stationId) => {
    matchState.currentStation = stationId;

    // Reset station-specific states when switching
    if (stationId === 'X1') {
      matchState.stationTimer = { remainingSec: 300, initialSec: 300, running: false };
    } else if (stationId === 'X2') {
      matchState.stationTimer = { remainingSec: 300, initialSec: 300, running: false };
      matchState.x2.buzzer = { open: false, buzzedTeam: null, buzzedAt: null, lockout: { X: false, Y: false }, answerRemainingSec: 10 };
      matchState.x2.currentResult = null;
    } else if (stationId === 'X3') {
      matchState.stationTimer = { remainingSec: 300, initialSec: 300, running: false };
      matchState.x3.phase = 'RECALL';
      matchState.x3.currentMediaIdx = 0;
      matchState.x3.mediaRemainingSec = 0;
    } else if (stationId === 'X4') {
      matchState.stationTimer = { remainingSec: 300, initialSec: 300, running: false };
      if (!matchState.x4.startedAt) {
        matchState.x4.startedAt = Date.now();
      }
    }

    updateState();
    io.emit('toast_event', { title: 'STATION AKTIF', message: stationId });
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
      if (action === 'set' && value) { matchState.stationTimer.initialSec = parseInt(value, 10); matchState.stationTimer.remainingSec = parseInt(value, 10); }
      if (action === 'adjust' && value) {
        matchState.stationTimer.remainingSec = Math.max(0, matchState.stationTimer.remainingSec + parseInt(value, 10));
      }
    }
    updateState();
  });

  socket.on('admin:adjust_score', ({ team, delta, station }) => {
    if (matchState.teams[team]) {
      const d = parseInt(delta, 10) || 0;
      matchState.teams[team].score = Math.max(0, matchState.teams[team].score + d);
      matchState.matchWinsX = Math.max(0, Math.min(matchState.totalMatchDots, matchState.teams.X.score));
      matchState.matchWinsY = Math.max(0, Math.min(matchState.totalMatchDots, matchState.teams.Y.score));
      const leg = station || matchState.currentStation;
      if (leg && leg !== 'STANDBY' && matchState.teams[team].legScores[leg] !== undefined) {
        matchState.teams[team].legScores[leg] = Math.max(0, matchState.teams[team].legScores[leg] + d);
      }
    }
    updateState();
  });

  socket.on('admin:update_score', ({ team, amount, leg }) => {
    if (matchState.teams[team]) {
      const a = parseInt(amount, 10) || 0;
      matchState.teams[team].score = Math.max(0, matchState.teams[team].score + a);
      matchState.matchWinsX = Math.max(0, Math.min(matchState.totalMatchDots, matchState.teams.X.score));
      matchState.matchWinsY = Math.max(0, Math.min(matchState.totalMatchDots, matchState.teams.Y.score));
      if (leg && leg !== 'STANDBY' && matchState.teams[team].legScores[leg] !== undefined) {
        matchState.teams[team].legScores[leg] = Math.max(0, matchState.teams[team].legScores[leg] + a);
      }
    }
    updateState();
  });

  socket.on('admin:update_teams', ({ nameX, nameY }) => {
    if (nameX) matchState.teams.X.name = nameX;
    if (nameY) matchState.teams.Y.name = nameY;
    updateState();
  });

  socket.on('admin:set_teams', ({ nameX, nameY }) => {
    if (nameX) matchState.teams.X.name = nameX;
    if (nameY) matchState.teams.Y.name = nameY;
    updateState();
  });

  socket.on('admin:set_match_wins', ({ team, amount }) => {
    if (team === 'X') {
      matchState.matchWinsX = Math.max(0, Math.min(matchState.totalMatchDots, matchState.matchWinsX + amount));
    } else if (team === 'Y') {
      matchState.matchWinsY = Math.max(0, Math.min(matchState.totalMatchDots, matchState.matchWinsY + amount));
    }
    updateState();
  });

  socket.on('admin:set_total_dots', (count) => {
    matchState.totalMatchDots = Math.max(3, parseInt(count, 10) || 11);
    updateState();
  });

  socket.on('admin:reset_all', () => {
    matchState.teams = {
      X: { name: "TEAM X", score: 0, legScores: { X1: 0, X2: 0, X3: 0, X4: 0 }, color: "#ff4757" },
      Y: { name: "TEAM Y", score: 0, legScores: { X1: 0, X2: 0, X3: 0, X4: 0 }, color: "#00d2d3" }
    };
    matchState.matchWinsX = 0;
    matchState.matchWinsY = 0;
    matchState.currentStation = "STANDBY";
    matchState.matchTimer = { elapsedSec: 0, maxSec: 1200, running: false };
    matchState.stationTimer = { remainingSec: 300, initialSec: 300, running: false };

    // Reset X1
    matchState.x1.progress = {
      X: { currentIdx: 0, score: 0, formula: activeQuestions.X1[0].q, totalAnswered: 0, correctCount: 0, wrongCount: 0, finished: false },
      Y: { currentIdx: 0, score: 0, formula: activeQuestions.X1[0].q, totalAnswered: 0, correctCount: 0, wrongCount: 0, finished: false }
    };
    matchState.x1.latestCorrectTeam = null;
    matchState.x1.winner = null;

    // Reset X2
    matchState.x2.currentQIdx = 0;
    matchState.x2.currentQuestion = activeQuestions.X2[0];
    matchState.x2.buzzer = { open: false, buzzedTeam: null, buzzedAt: null, lockout: { X: false, Y: false }, answerRemainingSec: 10 };
    matchState.x2.currentResult = null;

    // Reset X3
    matchState.x3.phase = 'IDLE';
    matchState.x3.currentMediaIdx = 0;
    matchState.x3.mediaRemainingSec = 0;
    matchState.x3.progress = {
      X: { answers: [null, null, null, null, null], currentIdx: 0, allLocked: false, lockedAt: null, correctCount: 0 },
      Y: { answers: [null, null, null, null, null], currentIdx: 0, allLocked: false, lockedAt: null, correctCount: 0 }
    };
    matchState.x3.winner = null;

    // Reset X4
    matchState.x4.startedAt = null;
    matchState.x4.teams = {
      X: { digits: [0, 0, 0], locks: [false, false, false], lockTimes: [null, null, null], submitted: false, submittedAt: null, totalCorrect: 0 },
      Y: { digits: [0, 0, 0], locks: [false, false, false], lockTimes: [null, null, null], submitted: false, submittedAt: null, totalCorrect: 0 }
    };
    matchState.x4.winnerResult = null;
    matchState.overallWinner = null;

    updateState();
    io.emit('audio_trigger', { type: 'reset' });
    io.emit('toast_event', { title: 'MATCH RESET', message: 'Semua skor & stasiun telah direset' });
  });

  socket.on('admin:trigger_audio', ({ type }) => {
    io.emit('audio_trigger', { type });
  });

  socket.on('admin:load_match_set', (setId) => {
    let filename = 'match_set_1.json';
    if (setId === 'MATCH-SET-2' || setId === 'set2' || setId === '2') {
      filename = 'match_set_2.json';
    } else if (setId === 'MATCH-SET-1' || setId === 'set1' || setId === '1') {
      filename = 'match_set_1.json';
    } else if (setId) {
      filename = setId.endsWith('.json') ? setId : `${setId}.json`;
    }

    try {
      const p = path.join(__dirname, 'match_sets', filename);
      if (fs.existsSync(p)) {
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        applyMatchSet(data);
      }
    } catch (e) {
      console.error('Failed to load match set:', e);
    }
  });

  socket.on('admin:import_match_set', (payload) => {
    try {
      const matchSetData = payload.matchSetData || payload;
      const fname = payload.filename || matchSetData._filename || matchSetData.filename || 'uploaded_set.json';
      if (applyMatchSet(matchSetData)) {
        matchState.activeMatchSet.filename = fname;
        updateState();
      }
    } catch (e) {
      console.error('Failed to import match set:', e);
    }
  });

  // ==========================================
  // 2. STATION X1: MATH SPEEDRUN
  // ==========================================
  socket.on('admin:set_x1_target', (target) => {
    matchState.x1.targetScore = parseInt(target, 10) || 30;
    updateState();
  });

  socket.on('admin:reset_x1', () => {
    matchState.x1.progress = {
      X: { currentIdx: 0, score: 0, formula: activeQuestions.X1[0].q, totalAnswered: 0, correctCount: 0, wrongCount: 0, finished: false },
      Y: { currentIdx: 0, score: 0, formula: activeQuestions.X1[0].q, totalAnswered: 0, correctCount: 0, wrongCount: 0, finished: false }
    };
    matchState.x1.latestCorrectTeam = null;
    matchState.x1.winner = null;
    updateState();
  });

  socket.on('team:submit_x1', ({ team, answer }) => {
    const p = matchState.x1.progress[team];
    if (!p || p.finished) return;

    const list = activeQuestions.X1;
    const currentQ = list[p.currentIdx % list.length];
    const isCorrect = (parseInt(answer, 10) === currentQ.a);

    p.totalAnswered++;

    if (isCorrect) {
      p.score++;
      p.correctCount++;
      matchState.teams[team].score++;
      matchState.teams[team].legScores.X1++;
      matchState.matchWinsX = Math.max(0, Math.min(matchState.totalMatchDots, matchState.teams.X.score));
      matchState.matchWinsY = Math.max(0, Math.min(matchState.totalMatchDots, matchState.teams.Y.score));
      matchState.x1.latestCorrectTeam = team;

      // Check for station win
      if (p.score >= matchState.x1.targetScore && !matchState.x1.winner) {
        matchState.x1.winner = team;
        io.emit('audio_trigger', { type: 'victory' });
      } else {
        io.emit('audio_trigger', { type: 'correct' });
      }

      socket.emit('team:answer_result', { isCorrect: true });
    } else {
      p.wrongCount++;
      io.emit('audio_trigger', { type: 'wrong' });
      socket.emit('team:answer_result', { isCorrect: false });
    }

    // Advance to next formula
    p.currentIdx++;
    const nextQ = list[p.currentIdx % list.length];
    p.formula = nextQ.q;

    updateState();
  });

  socket.on('team:skip_x1', (team) => {
    const p = matchState.x1.progress[team];
    if (!p || p.finished) return;

    const list = activeQuestions.X1;
    p.currentIdx++;
    const nextQ = list[p.currentIdx % list.length];
    p.formula = nextQ.q;

    updateState();
  });

  // ==========================================
  // 3. STATION X2: CERDAS CERMAT (BUZZER & REBOUND)
  // ==========================================
  socket.on('admin:x2_open_buzzer', () => {
    matchState.x2.buzzer.open = true;
    matchState.x2.buzzer.buzzedTeam = null;
    matchState.x2.buzzer.lockout = { X: false, Y: false };
    matchState.x2.buzzer.answerRemainingSec = 10;
    matchState.x2.currentResult = null;
    updateState();
    io.emit('audio_trigger', { type: 'buzzer_open' });
  });

  socket.on('admin:x2_close_buzzer', () => {
    matchState.x2.buzzer.open = false;
    updateState();
  });

  socket.on('admin:x2_next_q', () => {
    if (matchState.x2.currentQIdx < activeQuestions.X2.length - 1) {
      matchState.x2.currentQIdx++;
      matchState.x2.currentQuestion = activeQuestions.X2[matchState.x2.currentQIdx];
      matchState.x2.buzzer = { open: false, buzzedTeam: null, buzzedAt: null, lockout: { X: false, Y: false }, answerRemainingSec: 10 };
      matchState.x2.currentResult = null;
      updateState();
    }
  });

  socket.on('admin:x2_prev_q', () => {
    if (matchState.x2.currentQIdx > 0) {
      matchState.x2.currentQIdx--;
      matchState.x2.currentQuestion = activeQuestions.X2[matchState.x2.currentQIdx];
      matchState.x2.buzzer = { open: false, buzzedTeam: null, buzzedAt: null, lockout: { X: false, Y: false }, answerRemainingSec: 10 };
      matchState.x2.currentResult = null;
      updateState();
    }
  });

  socket.on('admin:x2_set_q', (idx) => {
    const i = parseInt(idx, 10);
    if (i >= 0 && i < activeQuestions.X2.length) {
      matchState.x2.currentQIdx = i;
      matchState.x2.currentQuestion = activeQuestions.X2[i];
      matchState.x2.buzzer = { open: false, buzzedTeam: null, buzzedAt: null, lockout: { X: false, Y: false }, answerRemainingSec: 10 };
      matchState.x2.currentResult = null;
      updateState();
    }
  });

  socket.on('team:buzz', (team) => {
    if (matchState.currentStation !== 'X2') return;

    if (matchState.x2.buzzer.open && !matchState.x2.buzzer.lockout[team]) {
      matchState.x2.buzzer.buzzedTeam = team;
      matchState.x2.buzzer.open = false;
      matchState.x2.buzzer.buzzedAt = Date.now();
      matchState.x2.buzzer.answerRemainingSec = 10;
      matchState.x2.currentResult = null;

      io.emit('audio_trigger', { type: 'buzzer_press', team });
      updateState();
    }
  });

  socket.on('team:submit_x2', ({ team, choiceIdx }) => {
    if (matchState.currentStation !== 'X2') return;

    if (matchState.x2.buzzer.buzzedTeam === team) {
      const q = matchState.x2.currentQuestion;
      const isCorrect = (parseInt(choiceIdx, 10) === q.correct);
      const points = q.points || 2;

      if (isCorrect) {
        matchState.teams[team].score += points;
        matchState.teams[team].legScores.X2 += points;
        matchState.matchWinsX = Math.max(0, Math.min(matchState.totalMatchDots, matchState.teams.X.score));
        matchState.matchWinsY = Math.max(0, Math.min(matchState.totalMatchDots, matchState.teams.Y.score));
        matchState.x2.buzzer.open = false;
        matchState.x2.buzzer.buzzedTeam = null;
        matchState.x2.currentResult = { team, isCorrect: true, choice: choiceIdx, points, correctChoice: q.correct };

        io.emit('audio_trigger', { type: 'correct' });
        socket.emit('team:answer_result', { isCorrect: true });
      } else {
        // WRONG: Lock out this team, immediately reopen buzzer for opponent!
        matchState.x2.buzzer.lockout[team] = true;
        matchState.x2.buzzer.buzzedTeam = null;
        const opposing = team === 'X' ? 'Y' : 'X';

        if (!matchState.x2.buzzer.lockout[opposing]) {
          matchState.x2.buzzer.open = true;
          matchState.x2.buzzer.answerRemainingSec = 10;
          matchState.x2.currentResult = { team, isCorrect: false, choice: choiceIdx, points: 0, passToOpponent: true };

          io.emit('audio_trigger', { type: 'buzzer_open' });
        } else {
          // Both teams failed
          matchState.x2.buzzer.open = false;
          matchState.x2.currentResult = { team, isCorrect: false, choice: choiceIdx, points: 0, bothFailed: true, correctChoice: q.correct };
          io.emit('audio_trigger', { type: 'wrong' });
        }

        socket.emit('team:answer_result', { isCorrect: false });
      }

      updateState();
    }
  });

  // ==========================================
  // 4. STATION X3: FLASH MEMORY (OBSERVATION & RECALL)
  // ==========================================
  const startX3Recall = () => {
    matchState.x3.phase = 'RECALL';
    matchState.x3.startedAt = Date.now();
    matchState.x3.progress = {
      X: { answers: [null, null, null, null, null], answerTimes: [null, null, null, null, null], currentIdx: 0, allLocked: false, lockedAt: null, correctCount: 0 },
      Y: { answers: [null, null, null, null, null], answerTimes: [null, null, null, null, null], currentIdx: 0, allLocked: false, lockedAt: null, correctCount: 0 }
    };
    matchState.x3.winner = null;
    updateState();
    io.emit('audio_trigger', { type: 'buzzer_open' });
    io.emit('toast_event', { title: 'RECALL PHASE', message: 'Jawab soal di tablet peserta' });
  };

  socket.on('admin:x3_start_flash', startX3Recall);
  socket.on('admin:x3_start_recall', startX3Recall);

  socket.on('admin:x3_reveal_results', () => {
    matchState.x3.phase = 'RESULT';

    const countX = matchState.x3.progress.X.correctCount;
    const countY = matchState.x3.progress.Y.correctCount;
    const timeX = matchState.x3.progress.X.lockedAt || Infinity;
    const timeY = matchState.x3.progress.Y.lockedAt || Infinity;

    let winner = null;
    if (countX > countY) {
      winner = 'X';
    } else if (countY > countX) {
      winner = 'Y';
    } else {
      winner = timeX <= timeY ? 'X' : 'Y';
    }

    matchState.x3.winner = winner;
    if (winner) {
      matchState.teams[winner].score += 3;
      matchState.teams[winner].legScores.X3 += 3;
      matchState.matchWinsX = Math.max(0, Math.min(matchState.totalMatchDots, matchState.teams.X.score));
      matchState.matchWinsY = Math.max(0, Math.min(matchState.totalMatchDots, matchState.teams.Y.score));
    }

    updateState();
    io.emit('audio_trigger', { type: 'victory' });
  });

  socket.on('team:x3_answer', ({ team, qIdx, choiceIdx }) => {
    if (matchState.currentStation !== 'X3' || matchState.x3.phase !== 'RECALL') return;

    const p = matchState.x3.progress[team];
    if (!p || p.allLocked) return;

    const start = matchState.x3.startedAt || Date.now();
    const elapsed = Date.now() - start;

    const q = activeQuestions.X3.questions[qIdx];
    const isCorrect = (parseInt(choiceIdx, 10) === q.correct);

    p.answers[qIdx] = parseInt(choiceIdx, 10);
    if (!p.answerTimes) p.answerTimes = [null, null, null, null, null];
    p.answerTimes[qIdx] = elapsed;

    if (isCorrect) {
      p.correctCount++;
    }

    p.currentIdx = qIdx + 1;
    if (p.currentIdx >= activeQuestions.X3.questions.length) {
      p.allLocked = true;
      p.lockedAt = elapsed;
      io.emit('toast_event', { title: `JAWABAN ${matchState.teams[team].name} TERKUNCI!`, message: `Waktu: ${(elapsed / 1000).toFixed(2)}s` });
    }

    socket.emit('team:answer_result', { isCorrect });
    updateState();
  });

  // ==========================================
  // 5. STATION X4: AI UNSOLVED CASE (3 DIGITS & LOCK TIME)
  // ==========================================
  socket.on('admin:x4_start_case', () => {
    matchState.x4.startedAt = Date.now();
    matchState.x4.teams = {
      X: { digits: [0, 0, 0], locks: [false, false, false], lockTimes: [null, null, null], submitted: false, submittedAt: null, totalCorrect: 0 },
      Y: { digits: [0, 0, 0], locks: [false, false, false], lockTimes: [null, null, null], submitted: false, submittedAt: null, totalCorrect: 0 }
    };
    matchState.x4.winnerResult = null;

    updateState();
    io.emit('audio_trigger', { type: 'flash_start' });
    io.emit('toast_event', { title: 'KASUS AI DIMULAI', message: 'Analisis petunjuk dan kunci 3 digit' });
  });

  socket.on('team:x4_change_digit', ({ team, digitIdx, value }) => {
    const t = matchState.x4.teams[team];
    if (!t || t.submitted || t.locks[digitIdx]) return;

    t.digits[digitIdx] = parseInt(value, 10) % 10;
    updateState();
  });

  socket.on('team:x4_lock_digit', ({ team, digitIdx }) => {
    const t = matchState.x4.teams[team];
    if (!t || t.submitted || t.locks[digitIdx]) return;

    const start = matchState.x4.startedAt || Date.now();
    const elapsed = Date.now() - start;

    t.locks[digitIdx] = true;
    t.lockTimes[digitIdx] = elapsed;

    // Check correctness of this digit
    const sol = activeQuestions.X4.solutionCode || (activeQuestions.X4.caseData && activeQuestions.X4.caseData.solutionCode) || [4, 3, 8];
    if (t.digits[digitIdx] === sol[digitIdx]) {
      t.totalCorrect = t.locks.filter((l, i) => l && t.digits[i] === sol[i]).length;
    }

    // If all 3 locked, mark submitted
    if (t.locks.every(Boolean)) {
      t.submitted = true;
      t.submittedAt = elapsed;
      io.emit('toast_event', { title: `${matchState.teams[team].name} MENGUNCI 3 DIGIT!`, message: `Waktu: ${(elapsed / 1000).toFixed(2)}s` });
    }

    updateState();
    io.emit('audio_trigger', { type: 'key_click' });
  });

  socket.on('team:x4_submit_all', ({ team }) => {
    const t = matchState.x4.teams[team];
    if (!t || t.submitted) return;

    const start = matchState.x4.startedAt || Date.now();
    const elapsed = Date.now() - start;

    t.locks = [true, true, true];
    t.lockTimes = t.lockTimes.map(tVal => tVal !== null ? tVal : elapsed);
    t.submitted = true;
    t.submittedAt = elapsed;

    const sol = activeQuestions.X4.solutionCode || (activeQuestions.X4.caseData && activeQuestions.X4.caseData.solutionCode) || [4, 3, 8];
    t.totalCorrect = t.digits.filter((d, i) => d === sol[i]).length;

    updateState();
    io.emit('toast_event', { title: `${matchState.teams[team].name} JAWABAN TERKIRIM!`, message: `Waktu: ${(elapsed / 1000).toFixed(2)}s` });
  });

  const evaluateX4Winner = () => {
    const sol = activeQuestions.X4.solutionCode || (activeQuestions.X4.caseData && activeQuestions.X4.caseData.solutionCode) || [4, 3, 8];
    const tX = matchState.x4.teams.X;
    const tY = matchState.x4.teams.Y;

    // Calculate correct digits
    tX.totalCorrect = tX.digits.filter((d, i) => tX.locks[i] && d === sol[i]).length;
    tY.totalCorrect = tY.digits.filter((d, i) => tY.locks[i] && d === sol[i]).length;

    const timeX = tX.submittedAt || (tX.lockTimes.filter(Boolean).length ? Math.max(...tX.lockTimes.filter(Boolean)) : Infinity);
    const timeY = tY.submittedAt || (tY.lockTimes.filter(Boolean).length ? Math.max(...tY.lockTimes.filter(Boolean)) : Infinity);

    let winnerTeam = null;
    let reason = '';

    if (tX.totalCorrect > tY.totalCorrect) {
      winnerTeam = 'X';
      reason = `${matchState.teams.X.name} memiliki lebih banyak digit tepat (${tX.totalCorrect}/3 vs ${tY.totalCorrect}/3)`;
    } else if (tY.totalCorrect > tX.totalCorrect) {
      winnerTeam = 'Y';
      reason = `${matchState.teams.Y.name} memiliki lebih banyak digit tepat (${tY.totalCorrect}/3 vs ${tX.totalCorrect}/3)`;
    } else {
      // Tie on correct digits -> fastest lock time wins
      if (timeX <= timeY) {
        winnerTeam = 'X';
        reason = `Digit sama (${tX.totalCorrect}/3). ${matchState.teams.X.name} lebih cepat (${(timeX/1000).toFixed(2)}s vs ${(timeY/1000).toFixed(2)}s)`;
      } else {
        winnerTeam = 'Y';
        reason = `Digit sama (${tY.totalCorrect}/3). ${matchState.teams.Y.name} lebih cepat (${(timeY/1000).toFixed(2)}s vs ${(timeX/1000).toFixed(2)}s)`;
      }
    }

    matchState.x4.winnerResult = {
      winnerTeam,
      reason,
      correctX: tX.totalCorrect,
      correctY: tY.totalCorrect,
      timeX: timeX !== Infinity ? (timeX / 1000).toFixed(2) : '--',
      timeY: timeY !== Infinity ? (timeY / 1000).toFixed(2) : '--',
      solution: sol
    };

    if (winnerTeam) {
      matchState.teams[winnerTeam].score += 3;
      matchState.teams[winnerTeam].legScores.X4 += 3;
      matchState.matchWinsX = Math.max(0, Math.min(matchState.totalMatchDots, matchState.teams.X.score));
      matchState.matchWinsY = Math.max(0, Math.min(matchState.totalMatchDots, matchState.teams.Y.score));
    }

    updateState();
    io.emit('audio_trigger', { type: 'victory' });
  };

  socket.on('admin:x4_evaluate', evaluateX4Winner);
  socket.on('admin:x4_evaluate_winner', evaluateX4Winner);

});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  🔮 CLASH OF UNXPADTED — REALTIME GAME SYSTEM 🔮`);
  console.log(`  Local Server:  http://localhost:${PORT}`);
  console.log(`  Broadcast 16:9: http://localhost:${PORT}/broadcast`);
  console.log(`  Player Tablet: http://localhost:${PORT}/player?team=X`);
  console.log(`  Gamemaster:    http://localhost:${PORT}/gm`);
  console.log(`  LAN Access IP: http://${localIpAddress}:${PORT}`);
  console.log(`=======================================================`);
});
