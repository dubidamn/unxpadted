/**
 * Broadcast Overlay Screen Realtime Controller (Clash of Unxpadted)
 * Full Realtime Socket.io Client for 16:9 Stage / Spectator Display
 * Supports Standby, X1 Math Speedrun, X2 Cerdas Cermat, X3 Flash Memory, X4 AI Unsolved Case
 */

class BroadcastDisplayApp {
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
      console.log('Connected to server as Broadcast Display');
      this.updateConnectionDot(true);
    });

    this.socket.on('disconnect', () => {
      console.warn('Disconnected from server');
      this.updateConnectionDot(false);
    });

    this.socket.on('state_update', (newState) => {
      this.state = newState;
      this.render();
    });

    this.socket.on('audio_trigger', ({ type }) => {
      if (!window.cyberSound) return;
      switch (type) {
        case 'correct': window.cyberSound.playCorrect(); break;
        case 'wrong': window.cyberSound.playWrong(); break;
        case 'buzzer_open': window.cyberSound.playBuzzerOpen(); break;
        case 'buzzer_press': window.cyberSound.playBuzzerPress(); break;
        case 'victory': window.cyberSound.playVictory(); break;
        case 'key_click': window.cyberSound.playKeyClick(); break;
        case 'flash_start': window.cyberSound.playBuzzerOpen(); break;
      }
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

    this.renderHeader();
    this.renderSubBar();
    this.renderStationView();
  }

  // --- 1. Header Overlay (Scores, Names, Dots Tracker) ---
  renderHeader() {
    const s = this.state;

    // Team X
    const nameX = document.getElementById('disp-name-x');
    const scoreX = document.getElementById('disp-score-x');
    if (nameX) nameX.textContent = s.teams.X.name;
    if (scoreX) scoreX.textContent = s.teams.X.score;

    // Team Y
    const nameY = document.getElementById('disp-name-y');
    const scoreY = document.getElementById('disp-score-y');
    if (nameY) nameY.textContent = s.teams.Y.name;
    if (scoreY) scoreY.textContent = s.teams.Y.score;

    // Match Tracker Dots
    const dotsContainer = document.getElementById('match-tracker-dots');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      const totalDots = s.totalMatchDots || 11;
      const centerIdx = Math.ceil(totalDots / 2);

      for (let i = 1; i <= totalDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'tracker-dot';
        if (i === centerIdx) dot.classList.add('match-point');

        if (i <= s.matchWinsX) {
          dot.classList.add('win-x');
        } else if (i > totalDots - s.matchWinsY) {
          dot.classList.add('win-y');
        }
        dotsContainer.appendChild(dot);
      }
    }
  }

  // --- 2. Sub-Header Bar (Status Badge & Segmented Orbitron Timer) ---
  renderSubBar() {
    const s = this.state;
    const badge = document.getElementById('disp-header-status');
    const minEl = document.getElementById('disp-clock-min');
    const secEl = document.getElementById('disp-clock-sec');

    // Badge Title: Strictly STANDBY when in standby
    if (badge) {
      switch (s.currentStation) {
        case 'STANDBY':
          badge.innerHTML = `<span class="station-main-title" style="color: #ffffff;">STANDBY</span>`;
          break;
        case 'X1':
          badge.innerHTML = `<span class="station-sub-label">STATION X1</span><span class="station-dot-sep">•</span><span class="station-main-title" style="color: #ffffff;">MATH SPEEDRUN</span>`;
          break;
        case 'X2':
          badge.innerHTML = `<span class="station-sub-label">STATION X2</span><span class="station-dot-sep">•</span><span class="station-main-title" style="color: #ffffff;">CERDAS CERMAT</span>`;
          break;
        case 'X3':
          badge.innerHTML = `<span class="station-sub-label">STATION X3</span><span class="station-dot-sep">•</span><span class="station-main-title" style="color: #ffffff;">FLASH MEMORY</span>`;
          break;
        case 'X4':
          badge.innerHTML = `<span class="station-sub-label">STATION X4</span><span class="station-dot-sep">•</span><span class="station-main-title" style="color: #ffffff;">AI UNSOLVED CASE</span>`;
          break;
      }
    }

    // Segmented Orbitron Timer (Standby counts UP from 00:00, Station counts down remainingSec)
    let totalSec = 0;
    if (s.currentStation !== 'STANDBY' && s.stationTimer) {
      totalSec = Math.max(0, s.stationTimer.remainingSec);
    } else {
      totalSec = Math.max(0, s.matchTimer ? s.matchTimer.elapsedSec : 0);
    }

    const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const sec = (totalSec % 60).toString().padStart(2, '0');

    if (minEl) minEl.textContent = m;
    if (secEl) secEl.textContent = sec;
  }

  // --- 3. Dynamic Station Viewport Switcher ---
  renderStationView() {
    const s = this.state;
    const st = s.currentStation || 'STANDBY';

    // Disable scanline & grid overlays when in Standby
    document.body.classList.toggle('standby-active', st === 'STANDBY');

    ['standby', 'x1', 'x2', 'x3', 'x4'].forEach(name => {
      const el = document.getElementById(`broadcast-state-${name}`);
      if (el) {
        el.classList.toggle('active', st.toLowerCase() === name);
      }
    });

    switch (st) {
      case 'STANDBY':
        break;
      case 'X1':
        this.renderX1View();
        break;
      case 'X2':
        this.renderX2View();
        break;
      case 'X3':
        this.renderX3View();
        break;
      case 'X4':
        this.renderX4View();
        break;
    }
  }

  // --- VIEW X1: MATH SPEEDRUN (PROMINENT TARGET HEADLINE) ---
  renderX1View() {
    const s = this.state;
    const x1 = s.x1;
    if (!x1) return;

    const target = x1.targetScore || 30;
    const headline = document.getElementById('x1-target-headline');
    if (headline) {
      headline.textContent = `FIRST TO ${target}!`;
    }

    // Progress bar fills
    const scoreX = x1.progress.X.score;
    const scoreY = x1.progress.Y.score;

    const percentX = Math.min(50, (scoreX / target) * 50);
    const percentY = Math.min(50, (scoreY / target) * 50);

    const barX = document.getElementById('duel-bar-fill-x');
    const barY = document.getElementById('duel-bar-fill-y');
    const textX = document.getElementById('duel-val-x');
    const textY = document.getElementById('duel-val-y');

    if (barX) barX.style.width = `${percentX}%`;
    if (barY) barY.style.width = `${percentY}%`;
    if (textX) textX.textContent = `${s.teams.X.name}: ${scoreX} / ${target}`;
    if (textY) textY.textContent = `${s.teams.Y.name}: ${scoreY} / ${target}`;

    // Victory Banner
    const victoryCard = document.getElementById('x1-victory-banner');
    if (victoryCard) {
      if (x1.winner) {
        victoryCard.style.display = 'block';
        const winText = document.getElementById('x1-winner-name');
        if (winText) {
          winText.textContent = `${s.teams[x1.winner].name} MEMENANGKAN STATION X1!`;
          winText.style.color = s.teams[x1.winner].color;
        }
      } else {
        victoryCard.style.display = 'none';
      }
    }
  }

  // --- VIEW X2: CERDAS CERMAT (CLEAN INSTRUCTION & CORRECT ANSWER ONLY) ---
  renderX2View() {
    const s = this.state;
    const x2 = s.x2;
    if (!x2 || !x2.currentQuestion) return;

    const q = x2.currentQuestion;

    // Question Title & Counter
    const qNum = document.getElementById('x2-q-num');
    const qTitle = document.getElementById('x2-q-title');
    if (qNum) qNum.textContent = `SOAL ${x2.currentQIdx + 1}`;
    if (qTitle) qTitle.textContent = q.question;

    // Reveal Logic: Only show/highlight correct answer when submitted correctly or both failed
    const shouldReveal = x2.currentResult && (x2.currentResult.isCorrect || x2.currentResult.bothFailed);

    q.choices.forEach((optText, idx) => {
      const optEl = document.getElementById(`x2-choice-${idx}`);
      if (optEl) {
        optEl.textContent = optText;
        optEl.classList.remove('selected', 'correct', 'wrong');

        if (shouldReveal && idx === q.correct) {
          optEl.classList.add('correct');
        }
      }
    });

    // Buzzer Status Instruction Banner (Only show when buzzer is open or buzzed)
    const banner = document.getElementById('x2-buzzer-banner');
    const bannerText = document.getElementById('x2-banner-text');

    if (banner && bannerText) {
      if (x2.buzzer.buzzedTeam) {
        banner.style.display = 'flex';
        const teamKey = x2.buzzer.buzzedTeam;
        const teamName = s.teams[teamKey].name;
        banner.className = `x2-buzzer-banner buzzed team-${teamKey.toLowerCase()}`;
        bannerText.innerHTML = `<strong>${teamName}</strong> MENGUNCI BUZZER (${x2.buzzer.answerRemainingSec}s)`;
      } else if (x2.buzzer.open) {
        banner.style.display = 'flex';
        banner.className = 'x2-buzzer-banner open';
        bannerText.textContent = 'TEKAN TOMBOL SEKARANG UNTUK MENJAWAB';
      } else {
        banner.style.display = 'none';
      }
    }
  }

  // --- VIEW X3: FLASH MEMORY (CLEAN Q1-Q5 NODES) ---
  renderX3View() {
    const s = this.state;
    const x3 = s.x3;
    if (!x3) return;

    ['X', 'Y'].forEach(team => {
      const p = x3.progress[team];
      const dotsRow = document.getElementById(`x3-tracker-row-${team.toLowerCase()}`);

      if (dotsRow) {
        dotsRow.innerHTML = '';
        for (let i = 0; i < 5; i++) {
          const node = document.createElement('div');
          node.className = 'x3-q-node';
          if (p.answers[i] !== null) {
            node.classList.add('locked');
          }
          node.textContent = `Q${i + 1}`;
          dotsRow.appendChild(node);
        }
      }
    });

    // Result Phase
    const resultCard = document.getElementById('x3-phase-result');
    if (resultCard) {
      if (x3.phase === 'RESULT' && x3.winner) {
        resultCard.style.display = 'block';
        const winEl = document.getElementById('x3-winner-name');
        if (winEl) {
          winEl.textContent = `${s.teams[x3.winner].name} MEMENANGKAN FLASH MEMORY!`;
          winEl.style.color = s.teams[x3.winner].color;
        }
      } else {
        resultCard.style.display = 'none';
      }
    }
  }

  // --- VIEW X4: AI UNSOLVED CASE (ROUNDED CONSOLES & CENTERED TIME) ---
  renderX4View() {
    const s = this.state;
    const x4 = s.x4;
    if (!x4) return;

    ['X', 'Y'].forEach(team => {
      const t = x4.teams[team];
      const unsubmittedBox = document.getElementById(`x4-unsubmitted-${team.toLowerCase()}`);
      const heroCard = document.getElementById(`x4-submitted-hero-${team.toLowerCase()}`);
      const heroTime = document.getElementById(`x4-submitted-time-${team.toLowerCase()}`);

      if (t.submitted) {
        // Show Large Hero Card without revealing digit answers
        if (unsubmittedBox) unsubmittedBox.style.display = 'none';
        if (heroCard) heroCard.style.display = 'flex';
        if (heroTime) heroTime.textContent = t.submittedAt ? `${(t.submittedAt / 1000).toFixed(2)}s` : '--';
      } else {
        if (unsubmittedBox) unsubmittedBox.style.display = 'flex';
        if (heroCard) heroCard.style.display = 'none';

        for (let i = 0; i < 3; i++) {
          const unit = document.getElementById(`x4-unit-${team.toLowerCase()}-${i + 1}`);
          const box = document.getElementById(`x4-disp-box-${team.toLowerCase()}-${i + 1}`);
          const timeBadge = document.getElementById(`x4-disp-time-${team.toLowerCase()}-${i + 1}`);

          const isLocked = Boolean(t.locks[i]);
          if (unit) unit.classList.toggle('locked', isLocked);
          if (box) {
            box.textContent = isLocked ? 'X' : '?';
            box.classList.toggle('locked', isLocked);
          }
          if (timeBadge) {
            timeBadge.textContent = isLocked && t.lockTimes[i] ? `${(t.lockTimes[i] / 1000).toFixed(1)}s` : '--';
            timeBadge.classList.toggle('locked', isLocked);
          }
        }
      }
    });

    // Result Card
    const resultCard = document.getElementById('x4-winner-banner');
    if (resultCard) {
      if (x4.winnerResult) {
        resultCard.style.display = 'block';
        const winTitle = document.getElementById('x4-winner-title');
        const winReason = document.getElementById('x4-winner-reason');
        const solText = document.getElementById('x4-solution-text');

        if (winTitle) {
          winTitle.textContent = `PEMENANG: ${s.teams[x4.winnerResult.winnerTeam].name}`;
          winTitle.style.color = s.teams[x4.winnerResult.winnerTeam].color;
        }
        if (winReason) winReason.textContent = x4.winnerResult.reason;
        if (solText) solText.textContent = `KODE RAHASIA: ${x4.winnerResult.solution.join(' - ')}`;
      } else {
        resultCard.style.display = 'none';
      }
    }
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.broadcastApp = new BroadcastDisplayApp();
});
