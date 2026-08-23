/**
 * Gamemaster Control Panel Realtime Controller (Clash of Unxpadted)
 * Full Realtime Socket.io Control Room Interface
 */

class GMControlApp {
  constructor() {
    this.socket = null;
    this.state = null;

    this.init();
  }

  init() {
    this.connectSocket();
    this.setupListeners();
  }

  connectSocket() {
    this.socket = io();

    this.socket.on('connect', () => {
      console.log('GM Control Suite connected to server');
      this.updateConnectionDot(true);
    });

    this.socket.on('disconnect', () => {
      console.warn('GM Control Suite disconnected');
      this.updateConnectionDot(false);
    });

    this.socket.on('state_update', (newState) => {
      this.state = newState;
      this.render();
    });
  }

  updateConnectionDot(online) {
    const dot = document.getElementById('connection-dot');
    if (dot) {
      dot.classList.toggle('offline', !online);
    }
  }

  render() {
    if (!this.state) return;

    this.renderHeaderAndTabs();
    this.renderScoreboard();
    this.renderMatchDots();
    this.renderTimers();
    this.renderMatchSets();
    this.renderStationPanels();
  }

  // --- 1. Top HUD & Station Tabs ---
  renderHeaderAndTabs() {
    const s = this.state;
    const curSt = s.currentStation || 'STANDBY';

    document.querySelectorAll('.gm-tab-btn').forEach(btn => {
      const st = btn.dataset.station;
      btn.classList.toggle('active', st === curSt);
    });

    // Toggle Station Panels
    ['standby', 'x1', 'x2', 'x3', 'x4'].forEach(name => {
      const panel = document.getElementById(`gm-panel-${name}`);
      if (panel) {
        panel.classList.toggle('active', name.toUpperCase() === curSt);
      }
    });
  }

  // --- 2. Scoreboard ---
  renderScoreboard() {
    const s = this.state;

    // Team X
    const scoreX = document.getElementById('gm-score-x');
    if (scoreX) scoreX.textContent = s.teams.X.score;

    // Team Y
    const scoreY = document.getElementById('gm-score-y');
    if (scoreY) scoreY.textContent = s.teams.Y.score;
  }

  // --- 3. Match Tracker Dots ---
  renderMatchDots() {
    const s = this.state;
    const totalDots = s.totalMatchDots || 11;
    const centerIdx = Math.ceil(totalDots / 2);

    const badge = document.getElementById('gm-dots-total-badge');
    if (badge) badge.textContent = `${totalDots}`;

    const container = document.getElementById('gm-dots-preview-container');
    if (container) {
      container.innerHTML = '';
      for (let i = 1; i <= totalDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'gm-dot-node';
        if (i === centerIdx) dot.classList.add('match-point');

        if (i <= s.matchWinsX) {
          dot.classList.add('win-x');
        } else if (i > totalDots - s.matchWinsY) {
          dot.classList.add('win-y');
        }
        container.appendChild(dot);
      }
    }
  }

  // --- 4. Timers ---
  renderTimers() {
    const s = this.state;

    // Match Clock (Counts UP from 00:00)
    const matchTimerVal = document.getElementById('gm-match-timer-val');
    const matchStatus = document.getElementById('gm-match-timer-status');
    const btnToggleMatch = document.getElementById('btn-toggle-match-timer');

    if (s.matchTimer) {
      const elapsed = Math.max(0, s.matchTimer.elapsedSec || 0);
      const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
      const sec = (elapsed % 60).toString().padStart(2, '0');
      if (matchTimerVal) matchTimerVal.textContent = `${m}:${sec}`;

      if (matchStatus) {
        matchStatus.textContent = s.matchTimer.running ? 'RUNNING' : 'PAUSED';
        matchStatus.className = `badge-status ${s.matchTimer.running ? 'ready' : 'wrong'}`;
      }

      if (btnToggleMatch) {
        btnToggleMatch.textContent = s.matchTimer.running ? 'PAUSE' : 'START';
        btnToggleMatch.className = `gm-btn ${s.matchTimer.running ? 'gm-btn-warning' : 'gm-btn-primary'}`;
      }
    }

    // Station Clock
    const stationTimerVal = document.getElementById('gm-station-timer-val');
    const stationStatus = document.getElementById('gm-station-timer-status');
    const btnToggleStation = document.getElementById('btn-toggle-station-timer');

    if (s.stationTimer) {
      const rem = Math.max(0, s.stationTimer.remainingSec);
      const m = Math.floor(rem / 60).toString().padStart(2, '0');
      const sec = (rem % 60).toString().padStart(2, '0');
      if (stationTimerVal) stationTimerVal.textContent = `${m}:${sec}`;

      if (stationStatus) {
        stationStatus.textContent = s.stationTimer.running ? 'RUNNING' : 'PAUSED';
        stationStatus.className = `badge-status ${s.stationTimer.running ? 'ready' : 'wrong'}`;
      }

      if (btnToggleStation) {
        btnToggleStation.textContent = s.stationTimer.running ? 'PAUSE' : 'START';
        btnToggleStation.className = `gm-btn ${s.stationTimer.running ? 'gm-btn-warning' : 'gm-btn-primary'}`;
      }
    }
  }

  // --- 5. Station Panels ---
  renderStationPanels() {
    const s = this.state;

    // Station X1
    if (s.x1) {
      const targetDisplay = document.getElementById('gm-x1-target-display');
      if (targetDisplay) targetDisplay.textContent = `TARGET: ${s.x1.targetScore} PTS`;

      const targetVal = s.x1.targetScore || 30;
      [15, 30, 50].forEach(t => {
        const btn = document.getElementById(`btn-x1-target-${t}`);
        if (btn) {
          btn.className = (t === targetVal) ? 'gm-btn gm-btn-primary' : 'gm-btn';
        }
      });

      const scoreX = document.getElementById('gm-x1-score-x');
      const scoreY = document.getElementById('gm-x1-score-y');
      const formulaX = document.getElementById('gm-x1-formula-x');
      const formulaY = document.getElementById('gm-x1-formula-y');

      if (scoreX) scoreX.textContent = `${s.x1.progress.X.score} / ${s.x1.targetScore}`;
      if (scoreY) scoreY.textContent = `${s.x1.progress.Y.score} / ${s.x1.targetScore}`;
      if (formulaX) formulaX.textContent = `Soal: ${s.x1.progress.X.formula || '-'}`;
      if (formulaY) formulaY.textContent = `Soal: ${s.x1.progress.Y.formula || '-'}`;
    }

    // Station X2
    if (s.x2 && s.x2.currentQuestion) {
      const buzzStatus = document.getElementById('gm-x2-buzz-status');
      const toggleBuzzerBtn = document.getElementById('btn-gm-toggle-buzzer');

      if (buzzStatus) {
        if (s.x2.buzzer.buzzedTeam) {
          buzzStatus.textContent = `BUZZED: TEAM ${s.x2.buzzer.buzzedTeam}`;
          buzzStatus.className = 'badge-status ready';
        } else if (s.x2.buzzer.open) {
          buzzStatus.textContent = 'BUZZER TERBUKA';
          buzzStatus.className = 'badge-status buzz';
        } else {
          buzzStatus.textContent = 'BUZZER TERTUTUP';
          buzzStatus.className = 'badge-status wrong';
        }
      }

      if (toggleBuzzerBtn) {
        if (s.x2.buzzer.open) {
          toggleBuzzerBtn.textContent = 'TUTUP BUZZER';
          toggleBuzzerBtn.className = 'gm-btn gm-btn-danger';
        } else {
          toggleBuzzerBtn.textContent = 'BUKA BUZZER';
          toggleBuzzerBtn.className = 'gm-btn gm-btn-warning';
        }
      }

      const qNum = document.getElementById('gm-x2-q-num');
      const qTitle = document.getElementById('gm-x2-q-title');
      const choicesContainer = document.getElementById('gm-x2-choices');

      if (qNum) qNum.textContent = `SOAL ${s.x2.currentQIdx + 1} / ${s.x2.totalQuestions}`;
      if (qTitle) qTitle.textContent = s.x2.currentQuestion.question;

      if (choicesContainer) {
        choicesContainer.innerHTML = '';
        s.x2.currentQuestion.choices.forEach((c, idx) => {
          const div = document.createElement('div');
          div.className = 'font-ui';
          div.style.fontSize = '12px';
          div.style.padding = '4px 8px';
          div.style.borderRadius = '4px';
          div.style.background = (idx === s.x2.currentQuestion.correct) ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.05)';
          div.style.color = (idx === s.x2.currentQuestion.correct) ? '#34d399' : '#e2e8f0';
          div.textContent = c;
          choicesContainer.appendChild(div);
        });
      }
    }

    // Station X3
    if (s.x3) {
      const phaseBadge = document.getElementById('gm-x3-phase-badge');
      if (phaseBadge) {
        phaseBadge.textContent = `PHASE: ${s.x3.phase}`;
        phaseBadge.className = `badge-status ${s.x3.phase === 'RESULT' ? 'ready' : 'buzz'}`;
      }

      // Populate Q1..Q5 correct answers list
      const qListContainer = document.getElementById('gm-x3-q-list');
      if (qListContainer && s.x3.questions) {
        qListContainer.innerHTML = '';
        s.x3.questions.forEach((q, idx) => {
          const row = document.createElement('div');
          row.className = 'font-ui';
          row.style.fontSize = '12px';
          row.style.display = 'flex';
          row.style.justifyContent = 'space-between';
          row.style.background = 'rgba(255, 255, 255, 0.03)';
          row.style.padding = '4px 8px';
          row.style.borderRadius = '4px';

          const correctChoice = q.choices[q.correct];
          row.innerHTML = `<span style="color: #cbd5e1;">Q${idx + 1}: ${q.question}</span><strong style="color: #34d399; margin-left: 12px;">${correctChoice}</strong>`;
          qListContainer.appendChild(row);
        });
      }

      const totalQ = (s.x3.questions && s.x3.questions.length) || 10;

      // Telemetry Table & Live Cards for Team X & Team Y
      ['X', 'Y'].forEach(team => {
        const p = s.x3.progress[team];
        const answersEl = document.getElementById(`gm-x3-answers-${team.toLowerCase()}`);
        const correctEl = document.getElementById(`gm-x3-correct-${team.toLowerCase()}`);
        const timeEl = document.getElementById(`gm-x3-time-${team.toLowerCase()}`);

        const cardCorrectEl = document.getElementById(`gm-x3-card-correct-${team.toLowerCase()}`);
        const cardStatusEl = document.getElementById(`gm-x3-card-status-${team.toLowerCase()}`);
        const cardBreakdownEl = document.getElementById(`gm-x3-card-breakdown-${team.toLowerCase()}`);

        let items = [];
        if (s.x3.questions && p && p.answers) {
          items = p.answers.map((ans, qIdx) => {
            if (ans === null) return '-';
            const isCorrect = (ans === s.x3.questions[qIdx].correct);
            const letter = String.fromCharCode(65 + ans);
            return isCorrect ? `[Q${qIdx + 1}:${letter}✓]` : `[Q${qIdx + 1}:${letter}✗]`;
          });
        }

        const breakdownText = items.length ? items.join(' ') : '-';
        if (answersEl) answersEl.textContent = breakdownText;
        if (correctEl) correctEl.textContent = `${p ? p.correctCount : 0} / ${totalQ}`;
        if (timeEl) {
          timeEl.textContent = (p && p.lockedAt) ? `${(p.lockedAt / 1000).toFixed(2)}s` : (p && p.answers.filter(a => a !== null).length ? 'Menjawab...' : '--');
        }

        if (cardCorrectEl) cardCorrectEl.textContent = `${p ? p.correctCount : 0} / ${totalQ}`;
        if (cardBreakdownEl) cardBreakdownEl.textContent = breakdownText;
        if (cardStatusEl) {
          if (p && p.allLocked) {
            cardStatusEl.textContent = `TERKUNCI (${p.lockedAt ? (p.lockedAt / 1000).toFixed(2) + 's' : '--'})`;
            cardStatusEl.className = 'badge-status ready';
          } else {
            const answered = p ? p.answers.filter(a => a !== null).length : 0;
            cardStatusEl.textContent = `${answered}/${totalQ} DIJAWAB`;
            cardStatusEl.className = 'badge-status';
          }
        }
      });
    }

    // Station X4
    if (s.x4) {
      const secretEl = document.getElementById('gm-x4-secret-code');
      if (secretEl && s.x4.caseData && s.x4.caseData.solutionCode) {
        secretEl.textContent = `KODE RAHASIA: ${s.x4.caseData.solutionCode.join(' - ')}`;
      }

      const tX = s.x4.teams.X;
      const tY = s.x4.teams.Y;

      const digX = document.getElementById('gm-x4-digits-x');
      const digY = document.getElementById('gm-x4-digits-y');
      const timeX = document.getElementById('gm-x4-time-x');
      const timeY = document.getElementById('gm-x4-time-y');

      const lockSymbolsX = tX.locks.map(l => l ? '🔒' : '🔓').join(' ');
      const lockSymbolsY = tY.locks.map(l => l ? '🔒' : '🔓').join(' ');

      if (digX) digX.textContent = `[${tX.digits.join(' - ')}] ${lockSymbolsX} ${tX.submitted ? '(TERKIRIM)' : ''}`;
      if (digY) digY.textContent = `[${tY.digits.join(' - ')}] ${lockSymbolsY} ${tY.submitted ? '(TERKIRIM)' : ''}`;

      if (timeX) timeX.textContent = tX.submittedAt ? `${(tX.submittedAt / 1000).toFixed(2)}s` : '--';
      if (timeY) timeY.textContent = tY.submittedAt ? `${(tY.submittedAt / 1000).toFixed(2)}s` : '--';
    }
  }

  // --- GM Actions ---
  setStation(st) {
    if (this.socket) {
      this.socket.emit('admin:set_station', st);
    }
  }

  saveTeams() {
    const nameX = document.getElementById('gm-name-x').value;
    const nameY = document.getElementById('gm-name-y').value;
    if (this.socket) {
      this.socket.emit('admin:update_teams', { nameX, nameY });
    }
  }

  adjustScore(team, delta, station) {
    if (this.socket) {
      this.socket.emit('admin:adjust_score', { team, delta, station });
    }
  }

  adjustTotalDots(delta) {
    const current = (this.state && this.state.totalMatchDots) || 11;
    let next = current + delta;
    if (next < 3) next = 3;
    if (next > 21) next = 21;
    if (this.socket) {
      this.socket.emit('admin:set_total_dots', next);
    }
  }

  toggleMatchTimer() {
    if (!this.state || !this.state.matchTimer) return;
    const isRunning = this.state.matchTimer.running;
    this.controlTimer('match', isRunning ? 'pause' : 'start');
  }

  toggleStationTimer() {
    if (!this.state || !this.state.stationTimer) return;
    const isRunning = this.state.stationTimer.running;
    this.controlTimer('station', isRunning ? 'pause' : 'start');
  }

  controlTimer(timerType, action, value) {
    if (this.socket) {
      this.socket.emit('admin:control_timer', { timerType, action, value });
    }
  }

  resetAll() {
    if (confirm('Apakah Anda yakin ingin me-reset seluruh pertandingan?')) {
      if (this.socket) {
        this.socket.emit('admin:reset_all');
      }
    }
  }

  // X1 Actions
  setX1Target(target) {
    if (this.socket) this.socket.emit('admin:set_x1_target', target);
  }
  resetX1() {
    if (this.socket) this.socket.emit('admin:reset_x1');
  }

  // X2 Actions
  x2ToggleBuzzer() {
    if (!this.state || !this.state.x2) return;
    if (this.state.x2.buzzer && this.state.x2.buzzer.open) {
      this.x2CloseBuzzer();
    } else {
      this.x2OpenBuzzer();
    }
  }
  x2OpenBuzzer() {
    if (this.socket) this.socket.emit('admin:x2_open_buzzer');
  }
  x2CloseBuzzer() {
    if (this.socket) this.socket.emit('admin:x2_close_buzzer');
  }
  x2NextQ() {
    if (this.socket) this.socket.emit('admin:x2_next_q');
  }
  x2PrevQ() {
    if (this.socket) this.socket.emit('admin:x2_prev_q');
  }

  // X3 Actions
  x3StartRecall() {
    if (this.socket) this.socket.emit('admin:x3_start_recall');
  }
  x3RevealResults() {
    if (this.socket) this.socket.emit('admin:x3_reveal_results');
  }

  // X4 Actions
  x4StartCase() {
    if (this.socket) this.socket.emit('admin:x4_start_case');
  }
  // --- Match Sets & Importer Telemetry ---
  renderMatchSets() {
    const s = this.state;
    if (!s) return;

    const countX1 = document.getElementById('gm-set-count-x1');
    const countX2 = document.getElementById('gm-set-count-x2');
    const countX3 = document.getElementById('gm-set-count-x3');
    const countX4 = document.getElementById('gm-set-count-x4');
    const bottomFilename = document.getElementById('gm-bottom-filename');

    if (countX1) countX1.textContent = `${(s.activeMatchSet && s.activeMatchSet.totalX1) || 100}`;
    if (countX2) countX2.textContent = `${(s.activeMatchSet && s.activeMatchSet.totalX2) || (s.x2 && s.x2.totalQuestions) || 15}`;
    if (countX3) countX3.textContent = `${(s.activeMatchSet && s.activeMatchSet.totalX3) || (s.x3 && s.x3.totalQuestions) || 10}`;
    if (countX4) {
      if (s.x4 && s.x4.caseData && s.x4.caseData.solutionCode) {
        countX4.textContent = s.x4.caseData.solutionCode.join('');
      } else {
        countX4.textContent = '438';
      }
    }

    if (bottomFilename) {
      const fname = (s.activeMatchSet && s.activeMatchSet.filename) ? s.activeMatchSet.filename : '[default]';
      bottomFilename.textContent = fname;
    }
  }

  loadMatchSet(setId) {
    if (this.socket) {
      this.socket.emit('admin:load_match_set', setId);
    }
  }

  handleFileImport(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const filename = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (!json.X1 && !json.X2 && !json.X3 && !json.X4) {
          alert('Format file JSON tidak valid! Pastikan mengandung set X1, X2, X3, atau X4.');
          return;
        }

        if (this.socket) {
          this.socket.emit('admin:import_match_set', { matchSetData: json, filename });
          alert(`Sukses mengimpor paket soal: "${filename}"!`);
        }
      } catch (err) {
        alert('Gagal membaca file JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  setupListeners() {}
}

document.addEventListener('DOMContentLoaded', () => {
  window.gmApp = new GMControlApp();
});
