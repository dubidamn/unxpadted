/**
 * XPAD Player Tablet Realtime Controller (Clash of Unxpadted)
 * Full Realtime Socket.io Client for Team X & Team Y Participants
 * Supports X1 Math Speedrun, X2 Cerdas Cermat, X3 Flash Memory, X4 AI Unsolved Case
 */

class PlayerTabletApp {
  constructor() {
    this.socket = null;
    this.state = null;
    this.currentStation = 'x1'; // 'x1', 'x2', 'x3', 'x4', 'standby'
    this.currentTeam = 'X';
    this.currentInputX1 = '';
    this.maxInputDigits = 8;
    this.x4ActiveTab = 'info'; // 'info' (SOAL) or 'submit' (JAWAB)

    // Local fallback questions for instant preview
    this.questionsX1 = [
      { q: '47 + 58 = ?', a: 105 },
      { q: '6 × 9 = ?', a: 54 },
      { q: '12 × 8 = ?', a: 96 },
      { q: '34 × 12 = ?', a: 408 },
      { q: '256 + 489 = ?', a: 745 }
    ];

    this.questionsX3 = [
      { q: 'Buah apa yang muncul di Media 1 dan warnanya apa?', opts: ['Apel Merah', 'Jeruk Oranye', 'Pisang Kuning', 'Mangga Hijau'], correct: 0 },
      { q: 'Berapa jumlah koin emas yang tampak di pojok kanan atas layar?', opts: ['3 Koin', '5 Koin', '7 Koin', '9 Koin'], correct: 1 },
      { q: 'Bentuk geometri apa yang berputar di latar belakang Media 3?', opts: ['Heksagon Ungu', 'Segitiga Biru', 'Oktagon Merah', 'Bintang Emas'], correct: 0 },
      { q: 'Karakter robot mana yang membawa bendera Infinix?', opts: ['Robot Alpha', 'Robot Beta', 'Robot Gamma', 'Robot Delta'], correct: 2 },
      { q: 'Angka digital berapa yang berkedip pada timer lab?', opts: ['00:45', '01:30', '02:15', '03:00'], correct: 1 }
    ];

    this.localX3Idx = 0;
    this.localX4Digits = [0, 0, 0];
    this.localX4Locks = [false, false, false];
    this.localX4Submitted = false;
    this.hasAnimatedTerminal = false;
    this.lastLoadedCaseTitle = '';
    this.typewriterInterval = null;
    this.terminalFullLogs = null;

    this.init();
  }

  init() {
    // Read team from URL parameter ?team=X or ?team=Y, fallback to localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const teamParam = urlParams.get('team');
    if (teamParam && (teamParam.toUpperCase() === 'X' || teamParam.toUpperCase() === 'Y')) {
      this.currentTeam = teamParam.toUpperCase();
      localStorage.setItem('unxpadted_team', this.currentTeam);
    } else {
      const saved = localStorage.getItem('unxpadted_team');
      if (saved && (saved === 'X' || saved === 'Y')) {
        this.currentTeam = saved;
      }
    }

    this.renderHeader();
    this.switchStation('x1');
    this.connectSocket();
    this.setupListeners();
  }

  connectSocket() {
    this.socket = io();

    this.socket.on('connect', () => {
      console.log(`Connected as Player Tablet (Team ${this.currentTeam})`);
      this.updateConnectionDot(true);
    });

    this.socket.on('disconnect', () => {
      console.warn('Tablet disconnected from server');
      this.updateConnectionDot(false);
    });

    this.socket.on('state_update', (newState) => {
      this.state = newState;
      if (newState.currentStation) {
        this.currentStation = newState.currentStation.toLowerCase();
      }
      this.render();
    });

    this.socket.on('team:answer_result', ({ isCorrect }) => {
      this.showReaction(isCorrect);
    });

    this.socket.on('audio_trigger', ({ type, team }) => {
      if (!window.cyberSound) return;
      if (type === 'buzzer_press' && team === this.currentTeam) {
        window.cyberSound.playBuzzerPress();
      } else if (type === 'buzzer_open') {
        window.cyberSound.playBuzzerOpen();
      } else if (type === 'correct') {
        window.cyberSound.playCorrect();
      } else if (type === 'wrong') {
        window.cyberSound.playWrong();
      }
    });
  }

  updateConnectionDot(online) {
    const dot = document.getElementById('connection-dot');
    if (dot) {
      dot.classList.toggle('offline', !online);
    }
  }

  setTeam(teamKey) {
    this.currentTeam = teamKey.toUpperCase();
    localStorage.setItem('unxpadted_team', this.currentTeam);
    const url = new URL(window.location);
    url.searchParams.set('team', this.currentTeam);
    window.history.replaceState({}, '', url);

    if (window.cyberSound) window.cyberSound.playKeyClick();
    this.render();
  }

  switchStation(stationId) {
    this.currentStation = stationId.toLowerCase();

    const isStandby = (this.currentStation === 'standby');
    document.body.classList.toggle('standby-active', isStandby);
    const ws = document.querySelector('.player-workspace');
    if (ws) ws.classList.toggle('standby-active', isStandby);

    // Toggle Station Views
    ['standby', 'x1', 'x2', 'x3', 'x4'].forEach(name => {
      const el = document.getElementById(`station-view-${name}`);
      if (el) {
        el.style.display = (this.currentStation === name) ? 'flex' : 'none';
      }
    });

    // Update Drawer Active Buttons
    document.querySelectorAll('.sidebar-btn-grid .sidebar-action-btn[data-station]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.station.toLowerCase() === this.currentStation);
    });

    this.render();
  }

  render() {
    this.renderHeader();
    this.renderStationView();
  }

  // --- 1. Header Overlay (Team Pill, Title, Timer, Score) ---
  renderHeader() {
    const s = this.state;
    const teamKey = this.currentTeam;
    const teamName = (s && s.teams && s.teams[teamKey]) ? s.teams[teamKey].name : `TEAM ${teamKey}`;
    const scoreVal = (s && s.teams && s.teams[teamKey]) ? s.teams[teamKey].score : 0;

    // Team Pill
    const pill = document.getElementById('player-team-pill');
    if (pill) {
      pill.textContent = teamName;
      pill.className = `player-team-pill team-${teamKey.toLowerCase()}`;
    }

    // Team Score Pill
    const scoreBadge = document.getElementById('team-score-pts');
    if (scoreBadge) {
      scoreBadge.textContent = `${scoreVal} PTS`;
    }

    // Station Timer
    let totalSec = (s && s.stationTimer) ? s.stationTimer.remainingSec : 300;
    if (totalSec < 0) totalSec = 0;
    const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const sec = (totalSec % 60).toString().padStart(2, '0');

    const minEl = document.getElementById('player-timer-min');
    const secEl = document.getElementById('player-timer-sec');
    if (minEl) minEl.textContent = m;
    if (secEl) secEl.textContent = sec;

    // Sub-title
    const subTitle = document.getElementById('player-sub-title');
    if (subTitle) {
      switch (this.currentStation) {
        case 'standby': subTitle.textContent = 'STANDBY'; break;
        case 'x1': subTitle.textContent = 'STATION X1 • MATH SPEEDRUN'; break;
        case 'x2': subTitle.textContent = 'STATION X2 • CERDAS CERMAT'; break;
        case 'x3': subTitle.textContent = 'STATION X3 • FLASH MEMORY'; break;
        case 'x4': subTitle.textContent = 'STATION X4 • AI UNSOLVED CASE'; break;
      }
    }
  }

  // --- 2. Station Viewport Switcher ---
  renderStationView() {
    ['standby', 'x1', 'x2', 'x3', 'x4'].forEach(name => {
      const el = document.getElementById(`station-view-${name}`);
      if (el) {
        el.style.display = (this.currentStation === name) ? 'flex' : 'none';
      }
    });

    switch (this.currentStation) {
      case 'x1': this.renderX1(); break;
      case 'x2': this.renderX2(); break;
      case 'x3': this.renderX3(); break;
      case 'x4': this.renderX4(); break;
    }
  }

  // ==========================================
  // STATION X1: MATH SPEEDRUN (NUMPAD & DISPLAY)
  // ==========================================
  renderX1() {
    const s = this.state;
    const p = (s && s.x1 && s.x1.progress) ? s.x1.progress[this.currentTeam] : null;

    const formulaEl = document.getElementById('question-formula');
    const badgeEl = document.getElementById('soal-badge');

    if (p) {
      if (formulaEl) formulaEl.textContent = p.formula || "47 + 58 = ?";
      if (badgeEl) badgeEl.textContent = `SOAL ${p.currentIdx + 1}`;
    } else {
      if (formulaEl) formulaEl.textContent = "47 + 58 = ?";
      if (badgeEl) badgeEl.textContent = "SOAL 1";
    }

    this.updateWideDisplayX1();
  }

  updateWideDisplayX1() {
    const displayEl = document.getElementById('x1-display-value');
    const container = document.getElementById('x1-wide-box');
    if (!displayEl) return;

    if (this.currentInputX1 === '') {
      displayEl.textContent = '';
      if (container) container.classList.remove('has-value');
    } else {
      displayEl.textContent = this.currentInputX1;
      if (container) container.classList.add('has-value');
    }
  }

  inputKey(key) {
    if (window.cyberSound) window.cyberSound.playKeyClick();

    if (key === 'clear') {
      this.currentInputX1 = '';
    } else if (key === 'back' || key === 'delete') {
      this.currentInputX1 = this.currentInputX1.slice(0, -1);
    } else if (key === 'skip') {
      if (this.socket && this.socket.connected) {
        this.socket.emit('team:skip_x1', this.currentTeam);
      }
      this.currentInputX1 = '';
      return;
    } else if (key === 'ENTER' || key === 'submit') {
      if (!this.currentInputX1) return;
      if (this.socket && this.socket.connected) {
        this.socket.emit('team:submit_x1', { team: this.currentTeam, answer: this.currentInputX1 });
      } else {
        // Local fallback
        const isCorrect = (parseInt(this.currentInputX1, 10) === 105);
        this.showReaction(isCorrect);
      }
      this.currentInputX1 = '';
      return;
    } else if (!isNaN(key)) {
      if (this.currentInputX1.length < this.maxInputDigits) {
        this.currentInputX1 += key.toString();
      }
    }

    this.updateWideDisplayX1();
  }

  // ==========================================
  // STATION X2: CERDAS CERMAT (BUZZER & TRIVIA)
  // ==========================================
  renderX2() {
    const s = this.state;
    const x2 = (s && s.x2) ? s.x2 : null;

    const buzzView = document.getElementById('x2-buzz-view');
    const triviaArea = document.getElementById('x2-trivia-area');
    const buzzBtn = document.getElementById('btn-player-buzz');
    const soalBadgeX2 = document.getElementById('soal-badge-x2');

    if (!x2) {
      if (soalBadgeX2) soalBadgeX2.textContent = 'SOAL 1';
      if (buzzView) buzzView.style.display = 'flex';
      if (triviaArea) triviaArea.style.display = 'none';
      if (buzzBtn) buzzBtn.disabled = false;
      return;
    }

    if (soalBadgeX2) {
      soalBadgeX2.textContent = `SOAL ${(x2.currentQIdx || 0) + 1}`;
    }

    const myTeam = this.currentTeam;
    const opponentTeam = myTeam === 'X' ? 'Y' : 'X';
    const isBuzzedByMe = (x2.buzzer.buzzedTeam === myTeam);
    const isBuzzedByOpponent = (x2.buzzer.buzzedTeam === opponentTeam);
    const isLockedOut = x2.buzzer.lockout[myTeam];

    if (isBuzzedByMe) {
      // Show Answering Area on my tablet!
      if (buzzView) buzzView.style.display = 'none';
      if (triviaArea) triviaArea.style.display = 'block';

      // Render Multiple Choice Options
      const q = x2.currentQuestion;
      const qText = document.getElementById('trivia-q-text');
      if (qText && q) qText.textContent = q.question;

      if (q && q.choices) {
        q.choices.forEach((optText, idx) => {
          const optEl = document.getElementById(`x2-opt-${idx}`);
          if (optEl) optEl.textContent = optText.replace(/^[A-D]\.\s*/, '');
        });
      }

    } else {
      // Show Buzzer on my tablet
      if (buzzView) buzzView.style.display = 'flex';
      if (triviaArea) triviaArea.style.display = 'none';

      if (buzzBtn) {
        if (isLockedOut || isBuzzedByOpponent || !x2.buzzer.open) {
          buzzBtn.disabled = true;
        } else {
          buzzBtn.disabled = false;
        }
      }
    }
  }

  pressBuzzer() {
    if (window.cyberSound) window.cyberSound.playBuzzerPress();

    if (this.socket && this.socket.connected) {
      this.socket.emit('team:buzz', this.currentTeam);
    } else {
      // Local preview fallback
      const buzzView = document.getElementById('x2-buzz-view');
      const triviaArea = document.getElementById('x2-trivia-area');
      if (buzzView) buzzView.style.display = 'none';
      if (triviaArea) triviaArea.style.display = 'block';
    }
  }

  selectX2Option(choiceIdx) {
    if (window.cyberSound) window.cyberSound.playKeyClick();

    if (this.socket && this.socket.connected) {
      this.socket.emit('team:submit_x2', { team: this.currentTeam, choiceIdx });
    } else {
      const isCorrect = (choiceIdx === 1);
      this.showReaction(isCorrect);
      setTimeout(() => {
        const buzzView = document.getElementById('x2-buzz-view');
        const triviaArea = document.getElementById('x2-trivia-area');
        if (buzzView) buzzView.style.display = 'flex';
        if (triviaArea) triviaArea.style.display = 'none';
      }, 1200);
    }
  }

  // ==========================================
  // STATION X3: FLASH MEMORY (SEQUENTIAL RECALL)
  // ==========================================
  renderX3() {
    const s = this.state;
    const x3 = (s && s.x3) ? s.x3 : null;

    const recallWrapper = document.getElementById('x3-recall-wrapper');
    const lockedWrapper = document.getElementById('x3-locked-wrapper');
    const badge = document.getElementById('x3-soal-badge');

    const p = (x3 && x3.progress) ? x3.progress[this.currentTeam] : null;

    if (p && p.allLocked) {
      if (recallWrapper) recallWrapper.style.display = 'none';
      if (lockedWrapper) lockedWrapper.style.display = 'flex';
      return;
    }

    if (lockedWrapper) lockedWrapper.style.display = 'none';
    if (recallWrapper) recallWrapper.style.display = 'flex';

    const curIdx = p ? p.currentIdx : this.localX3Idx;
    const curQ = this.questionsX3[curIdx % this.questionsX3.length];

    if (badge) badge.textContent = `SOAL ${curIdx + 1}`;
    const qText = document.getElementById('x3-q-text');
    if (qText) qText.textContent = curQ.q;

    for (let i = 0; i < 4; i++) {
      const optEl = document.getElementById(`x3-opt-${i}`);
      if (optEl) optEl.textContent = curQ.opts[i];
    }
  }

  selectX3Option(choiceIdx) {
    if (window.cyberSound) window.cyberSound.playKeyClick();

    const p = (this.state && this.state.x3 && this.state.x3.progress) ? this.state.x3.progress[this.currentTeam] : null;

    if (this.socket && this.socket.connected && p) {
      this.socket.emit('team:x3_answer', {
        team: this.currentTeam,
        qIdx: p.currentIdx,
        choiceIdx
      });
    } else {
      const curQ = this.questionsX3[this.localX3Idx % this.questionsX3.length];
      const isCorrect = (choiceIdx === curQ.correct);
      this.showReaction(isCorrect);
      this.localX3Idx = (this.localX3Idx + 1) % this.questionsX3.length;
      this.renderX3();
    }
  }

  // ==========================================
  // STATION X4: AI UNSOLVED CASE (2 TABS: SOAL & JAWAB)
  // ==========================================
  switchX4SubTab(tabName) {
    this.x4ActiveTab = tabName;
    const btnInfo = document.getElementById('tab-btn-x4-info');
    const btnSubmit = document.getElementById('tab-btn-x4-submit');
    const panelInfo = document.getElementById('x4-panel-info');
    const panelSubmit = document.getElementById('x4-panel-submit');

    if (btnInfo) btnInfo.classList.toggle('active', tabName === 'info');
    if (btnSubmit) btnSubmit.classList.toggle('active', tabName === 'submit');

    if (panelInfo) panelInfo.style.display = (tabName === 'info') ? 'block' : 'none';
    if (panelSubmit) panelSubmit.style.display = (tabName === 'flex') ? 'flex' : (tabName === 'submit' ? 'flex' : 'none');

    if (window.cyberSound) window.cyberSound.playKeyClick();
  }

  renderX4() {
    const s = this.state;
    const t = (s && s.x4 && s.x4.teams) ? s.x4.teams[this.currentTeam] : null;

    const digits = t ? t.digits : this.localX4Digits;
    const locks = t ? t.locks : this.localX4Locks;
    const isSubmitted = t ? t.submitted : this.localX4Submitted;

    const lockSvg = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    `;

    // Render 3 Interactive Digit Units
    for (let i = 1; i <= 3; i++) {
      const idx = i - 1;
      const box = document.getElementById(`x4-box-${i}`);
      const unit = document.getElementById(`x4-unit-${i}`);
      const lockBtn = document.getElementById(`x4-lock-btn-${i}`);

      if (box) box.textContent = digits[idx];
      if (unit) unit.classList.toggle('locked', locks[idx]);
      if (lockBtn) {
        lockBtn.innerHTML = lockSvg;
        lockBtn.disabled = locks[idx] || isSubmitted;
      }
    }

    // Render Terminal Logs in SOAL Sub-Tab with Typewriter Animation
    const logsContainer = document.getElementById('x4-terminal-logs');
    if (logsContainer) {
      const caseData = (s && s.x4 && s.x4.caseData) ? s.x4.caseData : null;
      let logs = caseData ? caseData.terminalLogs : null;

      if (!logs || !logs.length) {
        logs = [
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
        ];
      }

      const caseKey = logs.join('|').slice(0, 80);
      const isNewCase = (this.lastLoadedCaseTitle !== caseKey);

      if (isNewCase || !this.hasAnimatedTerminal) {
        this.lastLoadedCaseTitle = caseKey;
        this.hasAnimatedTerminal = true;
        this.startTerminalTypewriter(logs);
      }
    }

    // Submit All Button (Disabled upon submission)
    const submitBtn = document.getElementById('x4-submit-btn');
    if (submitBtn) {
      if (isSubmitted) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('disabled', 'true');
        submitBtn.textContent = 'JAWABAN TERKIRIM';
      } else {
        submitBtn.disabled = false;
        submitBtn.removeAttribute('disabled');
        submitBtn.textContent = 'KIRIM JAWABAN';
      }
    }
  }

  incrementX4Digit(digitIdx) {
    if (window.cyberSound) window.cyberSound.playKeyClick();

    const t = (this.state && this.state.x4 && this.state.x4.teams) ? this.state.x4.teams[this.currentTeam] : null;

    if (this.socket && this.socket.connected && t) {
      if (t.locks[digitIdx] || t.submitted) return;
      const nextVal = (t.digits[digitIdx] + 1) % 10;
      this.socket.emit('team:x4_change_digit', { team: this.currentTeam, digitIdx, value: nextVal });
    } else {
      if (this.localX4Locks[digitIdx] || this.localX4Submitted) return;
      this.localX4Digits[digitIdx] = (this.localX4Digits[digitIdx] + 1) % 10;
      this.renderX4();
    }
  }

  lockX4Digit(digitIdx) {
    if (window.cyberSound) window.cyberSound.playKeyClick();

    const t = (this.state && this.state.x4 && this.state.x4.teams) ? this.state.x4.teams[this.currentTeam] : null;

    if (this.socket && this.socket.connected && t) {
      if (t.locks[digitIdx] || t.submitted) return;
      this.socket.emit('team:x4_lock_digit', { team: this.currentTeam, digitIdx });
    } else {
      if (this.localX4Locks[digitIdx] || this.localX4Submitted) return;
      this.localX4Locks[digitIdx] = true;
      this.renderX4();
    }
  }

  sendX4Answers() {
    const t = (this.state && this.state.x4 && this.state.x4.teams) ? this.state.x4.teams[this.currentTeam] : null;
    if (t && t.submitted) return;
    if (this.localX4Submitted) return;

    if (window.cyberSound) window.cyberSound.playKeyClick();

    const submitBtn = document.getElementById('x4-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('disabled', 'true');
      submitBtn.textContent = 'JAWABAN TERKIRIM';
    }

    if (this.socket && this.socket.connected && t) {
      this.socket.emit('team:x4_submit_all', { team: this.currentTeam });
    } else {
      this.localX4Locks = [true, true, true];
      this.localX4Submitted = true;
      this.renderX4();
    }
  }

  startTerminalTypewriter(logs) {
    const container = document.getElementById('x4-terminal-logs');
    if (!container) return;

    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
      this.typewriterInterval = null;
    }

    container.innerHTML = '';
    this.isTypingTerminal = true;
    this.terminalFullLogs = logs;

    let lineIdx = 0;
    let charIdx = 0;
    let currentLineEl = null;

    const formatLineSyntax = (text) => {
      return text.replace(/(\[[A-Za-z0-9_ -]+\])/g, '<span class="terminal-tag rule">$1</span>');
    };

    const typeNext = () => {
      if (lineIdx >= logs.length) {
        clearInterval(this.typewriterInterval);
        this.typewriterInterval = null;
        this.isTypingTerminal = false;
        
        const activeCursor = document.getElementById('active-typing-cursor');
        if (activeCursor) activeCursor.remove();

        const finalLine = document.createElement('div');
        finalLine.className = 'terminal-line';
        finalLine.innerHTML = '<span class="terminal-tag rule">[READY]</span>_ <span class="terminal-cursor">█</span>';
        container.appendChild(finalLine);
        container.scrollTop = container.scrollHeight;
        return;
      }

      const rawLine = logs[lineIdx];

      if (charIdx === 0) {
        if (!rawLine) {
          const spacer = document.createElement('div');
          spacer.className = 'terminal-line';
          spacer.style.height = '8px';
          container.appendChild(spacer);
          lineIdx++;
          return;
        }

        currentLineEl = document.createElement('div');
        currentLineEl.className = 'terminal-line';
        container.appendChild(currentLineEl);
      }

      charIdx += 3;
      if (charIdx > rawLine.length) charIdx = rawLine.length;

      const subStr = rawLine.slice(0, charIdx);
      if (currentLineEl) {
        currentLineEl.innerHTML = formatLineSyntax(subStr) + '<span id="active-typing-cursor" class="terminal-cursor">█</span>';
      }

      container.scrollTop = container.scrollHeight;

      if (charIdx >= rawLine.length) {
        const activeCursor = document.getElementById('active-typing-cursor');
        if (activeCursor) activeCursor.remove();
        lineIdx++;
        charIdx = 0;
      }
    };

    this.typewriterInterval = setInterval(typeNext, 16);
  }

  finishTerminalTypewriterNow() {
    if (!this.terminalFullLogs) return;
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
      this.typewriterInterval = null;
    }
    this.isTypingTerminal = false;

    const container = document.getElementById('x4-terminal-logs');
    if (!container) return;

    const formatLineSyntax = (text) => {
      return text.replace(/(\[[A-Za-z0-9_ -]+\])/g, '<span class="terminal-tag rule">$1</span>');
    };

    const formattedHtml = this.terminalFullLogs.map(line => {
      if (!line) return '<div class="terminal-line" style="height: 8px;"></div>';
      return `<div class="terminal-line">${formatLineSyntax(line)}</div>`;
    }).join('');

    container.innerHTML = formattedHtml + '<div class="terminal-line"><span class="terminal-tag rule">[READY]</span>_ <span class="terminal-cursor">█</span></div>';
    container.scrollTop = container.scrollHeight;
  }

  // ==========================================
  // FEEDBACK MODAL: ONLY "BENAR" OR "SALAH" (NO POINT TEXT)
  // ==========================================
  showReaction(isCorrect) {
    const modal = document.getElementById('player-reaction-modal');
    const title = document.getElementById('reaction-modal-title');
    const card = document.getElementById('reaction-modal-card');

    if (!modal) return;

    if (isCorrect) {
      card.className = 'bevel-card bevel-card-success-purple cyber-reaction-card text-center';
      card.style.background = '';
      card.style.borderColor = '';
      card.style.boxShadow = '';
      if (title) {
        title.textContent = 'BENAR';
        title.style.color = '#ffffff';
      }
    } else {
      card.className = 'bevel-card cyber-reaction-card text-center';
      card.style.background = 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)';
      card.style.borderColor = '#ef4444';
      card.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.8)';
      if (title) {
        title.textContent = 'SALAH';
        title.style.color = '#fca5a5';
      }
    }

    modal.classList.add('show');
    setTimeout(() => {
      modal.classList.remove('show');
    }, 1100);
  }

  setupListeners() {
    // Terminal click to finish typing instantly
    const terminalWindow = document.querySelector('.command-prompt-window');
    if (terminalWindow) {
      terminalWindow.addEventListener('click', () => {
        if (this.isTypingTerminal) {
          this.finishTerminalTypewriterNow();
        }
      });
    }
    // Numpad key click listeners
    document.querySelectorAll('.tablet-numpad-grid .numpad-key-rounded').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        this.inputKey(key);

        btn.classList.add('active-pressed');
        setTimeout(() => btn.classList.remove('active-pressed'), 120);
      });
    });

    // Keyboard Hotkeys
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === '1') this.switchStation('x1');
      if (e.key === '2') this.switchStation('x2');
      if (e.key === '3') this.switchStation('x3');
      if (e.key === '4') this.switchStation('x4');

      if (e.key === 'Escape') {
        this.closeDrawer();
        return;
      }

      if (this.currentStation === 'x1') {
        if (e.key >= '0' && e.key <= '9') {
          this.inputKey(e.key);
        } else if (e.key === 'Backspace') {
          this.inputKey('back');
        } else if (e.key === 'Enter') {
          this.inputKey('ENTER');
        } else if (e.key === 'c' || e.key === 'C') {
          this.inputKey('clear');
        }
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.playerApp = new PlayerTabletApp();
});
