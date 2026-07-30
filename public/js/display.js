// Main Screen Display Client Script

const socket = io();

// Toast Popup Trigger
function showToast(title, message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const card = document.createElement('div');
  card.className = 'toast-card';
  const msgHtml = message ? `<div style="font-size: 12px; font-weight: 400; color: var(--secondary); margin-top: 4px;">${message}</div>` : '';
  card.innerHTML = `
    <div style="font-size: 14px; font-weight: 800; color: var(--primary);">${title}</div>
    ${msgHtml}
  `;
  container.appendChild(card);

  setTimeout(() => {
    card.style.opacity = '0';
    card.style.transition = 'opacity 0.3s ease';
    setTimeout(() => card.remove(), 300);
  }, 3500);
}

socket.on('toast_event', (data) => {
  showToast(data.title, data.message);
});

// Passcode Protection (strictly xpad30pro lowercase)
const PASSCODE = 'xpad30pro';
const passcodeModal = document.getElementById('passcode-modal');
const passcodeForm = document.getElementById('passcode-form');
const passcodeInput = document.getElementById('passcode-input');
const passcodeError = document.getElementById('passcode-error');

if (sessionStorage.getItem('display_authed') === 'true') {
  if (passcodeModal) passcodeModal.style.display = 'none';
} else if (passcodeModal) {
  passcodeModal.style.display = 'flex';
}

if (passcodeForm) {
  passcodeForm.onsubmit = (e) => {
    e.preventDefault();
    if (passcodeInput.value === PASSCODE) {
      sessionStorage.setItem('display_authed', 'true');
      passcodeModal.style.display = 'none';
    } else {
      passcodeError.style.display = 'block';
    }
  };
}

let currentState = null;

// DOM Elements
const dispMatchTimer = document.getElementById('disp-match-timer');
const dispLegName = document.getElementById('disp-leg-name');
const dispNameX = document.getElementById('disp-name-x');
const dispNameY = document.getElementById('disp-name-y');
const dispScoreX = document.getElementById('disp-score-x');
const dispScoreY = document.getElementById('disp-score-y');
const pointTrackerDots = document.getElementById('point-tracker-dots');

// Views
const dispViewIdle = document.getElementById('disp-view-idle');
const dispViewX1 = document.getElementById('disp-view-x1');
const dispViewX2 = document.getElementById('disp-view-x2');
const dispViewX3 = document.getElementById('disp-view-x3');
const dispViewX4 = document.getElementById('disp-view-x4');

// Winner Overlay
const winnerOverlay = document.getElementById('winner-overlay');
const winnerTeamName = document.getElementById('winner-team-name');

// Audio Receiver
socket.on('audio_trigger', (data) => {
  if (data.type === 'buzzer_press' && window.soundManager) {
    window.soundManager.playBuzzerPress();
  } else if (data.type === 'buzzer_open' && window.soundManager) {
    window.soundManager.playBuzzerOpen();
  } else if (data.type === 'correct' && window.soundManager) {
    window.soundManager.playCorrect();
  } else if (data.type === 'wrong' && window.soundManager) {
    window.soundManager.playWrong();
  }
});

// Render dynamic Match Tracker dots based on exact team points & custom GM colors
function renderTrackerDots(scoreX = 0, scoreY = 0, colors = { X: '#FF5449', Y: '#00E5FF' }, totalDots = 11) {
  if (!pointTrackerDots) return;
  pointTrackerDots.innerHTML = '';

  for (let i = 1; i <= totalDots; i++) {
    const dot = document.createElement('div');
    dot.className = 'tracker-dot';
    
    if (i <= scoreX) {
      dot.style.backgroundColor = colors.X;
      dot.style.borderColor = colors.X;
      dot.style.boxShadow = `0 0 10px ${colors.X}80`;
      dot.title = `Team X Point ${i}`;
    } else if (i > totalDots - scoreY) {
      dot.style.backgroundColor = colors.Y;
      dot.style.borderColor = colors.Y;
      dot.style.boxShadow = `0 0 10px ${colors.Y}80`;
      dot.title = `Team Y Point ${totalDots - i + 1}`;
    } else {
      dot.style.backgroundColor = 'var(--muted)';
      dot.style.borderColor = 'var(--border)';
    }

    if (i === 6) {
      dot.style.borderWidth = '2px';
      dot.style.borderColor = 'var(--primary)';
    }

    pointTrackerDots.appendChild(dot);
  }
}

// State Receiver
socket.on('state_update', (state) => {
  currentState = state;
  renderState(state);
});

function renderState(state) {
  dispNameX.textContent = state.teams.X.name.toUpperCase();
  dispNameY.textContent = state.teams.Y.name.toUpperCase();
  dispScoreX.textContent = state.teams.X.score;
  dispScoreY.textContent = state.teams.Y.score;

  // Render Dynamic Match Tracker dots based on team points & GM colors
  const trackerColors = state.trackerColors || { X: '#FF5449', Y: '#00E5FF' };
  renderTrackerDots(state.teams.X.score, state.teams.Y.score, trackerColors, 11);

  // Match Timer
  const elapsed = state.matchTimer.elapsedSec;
  const mMinutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const mSeconds = (elapsed % 60).toString().padStart(2, '0');
  dispMatchTimer.textContent = `${mMinutes}:${mSeconds}`;

  // Check station visibility (SHOW / UNSHOW)
  const station = state.currentStation;
  const isVisible = state.stationVisibility ? state.stationVisibility[station] !== false : true;

  if (dispViewIdle) dispViewIdle.style.display = 'none';
  dispViewX1.style.display = 'none';
  dispViewX2.style.display = 'none';
  dispViewX3.style.display = 'none';
  dispViewX4.style.display = 'none';

  if (station === 'STANDBY' || !isVisible) {
    dispLegName.textContent = 'STANDBY';
    if (dispViewIdle) dispViewIdle.style.display = 'flex';
  } else if (station === 'X1') {
    dispLegName.textContent = 'STATION X1 • MATH SPEEDRUN';
    dispViewX1.style.display = 'block';
    renderX1Display(state);
  } else if (station === 'X2') {
    dispLegName.textContent = 'STATION X2 • CERDAS CERMAT';
    dispViewX2.style.display = 'block';
    renderX2Display(state);
  } else if (station === 'X3') {
    dispLegName.textContent = 'STATION X3 • AI UNSOLVED CASE';
    dispViewX3.style.display = 'block';
    renderX3Display(state);
  } else if (station === 'X4') {
    dispLegName.textContent = 'STATION X4 • FLASH MEMORY';
    dispViewX4.style.display = 'block';
    renderX4Display(state);
  }

  // Winner Celebration
  if (state.winner) {
    winnerTeamName.textContent = state.winner.toUpperCase();
    winnerOverlay.style.display = 'flex';
  } else {
    winnerOverlay.style.display = 'none';
  }
}

// Render X1 Display with Single Unified Duel Progress Bar
function renderX1Display(state) {
  document.getElementById('disp-x1-name-x').textContent = state.teams.X.name.toUpperCase();
  document.getElementById('disp-x1-name-y').textContent = state.teams.Y.name.toUpperCase();

  const px = state.x1Progress.X;
  const py = state.x1Progress.Y;
  const target = state.x1Progress.targetCorrect || 30;

  document.getElementById('disp-x1-val-x').textContent = `${px.correctCount} / ${target}`;
  document.getElementById('disp-x1-val-y').textContent = `${py.correctCount} / ${target}`;

  const pctX = Math.min(50, Math.round((px.correctCount / target) * 50));
  const pctY = Math.min(50, Math.round((py.correctCount / target) * 50));

  const barX = document.getElementById('disp-x1-duel-bar-x');
  const barY = document.getElementById('disp-x1-duel-bar-y');

  if (barX) barX.style.width = `${pctX}%`;
  if (barY) barY.style.width = `${pctY}%`;
}

// Render X2 Display
function renderX2Display(state) {
  const q = state.currentQuestion.X2;
  const buzzer = state.buzzer;
  const lastResult = state.currentQuestion.X2LastResult;

  if (q) {
    document.getElementById('disp-x2-question').textContent = q.question;

    const choicesGrid = document.getElementById('disp-x2-choices-grid');
    choicesGrid.innerHTML = '';
    q.choices.forEach(c => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.fontSize = '20px';
      card.style.fontWeight = '600';
      card.style.padding = '16px';
      card.style.textAlign = 'left';
      card.textContent = c;
      choicesGrid.appendChild(card);
    });
  }

  const title = document.getElementById('disp-buzz-title');
  const banner = document.getElementById('disp-buzz-banner');

  if (state.currentQuestion.X2Answered && lastResult) {
    const tName = state.teams[lastResult.team].name.toUpperCase();
    if (lastResult.isCorrect) {
      title.textContent = `${tName} BENAR! (+${lastResult.pointsAwarded} LEG POINT)`;
      title.style.color = "var(--primary)";
      banner.className = "card text-center card-glowing";
    } else {
      title.textContent = `${tName} SALAH! (JAWABAN KURANG TEPAT)`;
      title.style.color = "var(--error)";
      banner.className = "card text-center";
    }
  } else if (buzzer.open) {
    title.textContent = "BUZZER DIBUKA. REBUTAN SEKARANG.";
    title.style.color = "var(--primary)";
    banner.className = "card text-center card-glowing";
  } else if (buzzer.buzzedTeam) {
    const tName = state.teams[buzzer.buzzedTeam].name;
    title.textContent = `${tName.toUpperCase()} BUZZ PERTAMA. MENJAWAB...`;
    title.style.color = "var(--primary)";
    banner.className = "card text-center card-glowing";
  } else {
    title.textContent = "MENUNGGU GAMEMASTER MEMBUKA BUZZER...";
    title.style.color = "var(--secondary)";
    banner.className = "card text-center";
  }
}

// Render X3 Display with Card Highlight on Answer Submission
function renderX3Display(state) {
  document.getElementById('disp-x3-name-x').textContent = state.teams.X.name.toUpperCase();
  document.getElementById('disp-x3-name-y').textContent = state.teams.Y.name.toUpperCase();

  const subX = state.x3Submissions.X;
  const subY = state.x3Submissions.Y;

  const cardX = document.getElementById('disp-x3-card-x');
  const statusX = document.getElementById('disp-x3-status-x');
  if (subX) {
    statusX.textContent = "JAWABAN TERKIRIM";
    statusX.className = "badge badge-primary";
    cardX.className = "card text-center card-glowing";
    cardX.style.borderColor = "var(--primary)";
    cardX.style.boxShadow = "0 0 20px var(--primary-glow)";
  } else {
    statusX.textContent = "BELUM SUBMIT";
    statusX.className = "badge badge-secondary";
    cardX.className = "card text-center";
    cardX.style.borderColor = "var(--border)";
    cardX.style.boxShadow = "none";
  }

  const cardY = document.getElementById('disp-x3-card-y');
  const statusY = document.getElementById('disp-x3-status-y');
  if (subY) {
    statusY.textContent = "JAWABAN TERKIRIM";
    statusY.className = "badge badge-primary";
    cardY.className = "card text-center card-glowing";
    cardY.style.borderColor = "var(--primary)";
    cardY.style.boxShadow = "0 0 20px var(--primary-glow)";
  } else {
    statusY.textContent = "BELUM SUBMIT";
    statusY.className = "badge badge-secondary";
    cardY.className = "card text-center";
    cardY.style.borderColor = "var(--border)";
    cardY.style.boxShadow = "none";
  }
}

// Render X4 Display
function renderX4Display(state) {
  const x4 = state.x4State;
  const flashContainer = document.getElementById('disp-x4-flash-container');
  const recallContainer = document.getElementById('disp-x4-recall-container');

  if (x4.phase === 'FLASHING') {
    flashContainer.style.display = 'block';
    recallContainer.style.display = 'none';

    const mediaList = state.currentQuestion.X4.mediaList;
    const currentMedia = mediaList[x4.currentMediaIdx];

    if (currentMedia) {
      document.getElementById('disp-x4-media-title').textContent = currentMedia.title;
      document.getElementById('disp-x4-countdown').textContent = `Tersisa: ${x4.mediaRemainingSec} detik`;
    }
  } else if (x4.phase === 'RECALL') {
    flashContainer.style.display = 'none';
    recallContainer.style.display = 'block';
  } else {
    flashContainer.style.display = 'none';
    recallContainer.style.display = 'none';
  }
}
