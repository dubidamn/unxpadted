// Gamemaster Control Panel Client Script

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

if (sessionStorage.getItem('gm_authed') === 'true') {
  if (passcodeModal) passcodeModal.style.display = 'none';
} else if (passcodeModal) {
  passcodeModal.style.display = 'flex';
}

if (passcodeForm) {
  passcodeForm.onsubmit = (e) => {
    e.preventDefault();
    if (passcodeInput.value === PASSCODE) {
      sessionStorage.setItem('gm_authed', 'true');
      passcodeModal.style.display = 'none';
    } else {
      passcodeError.style.display = 'block';
    }
  };
}

let currentState = null;

// DOM Elements
const displayNameX = document.getElementById('display-name-x');
const displayNameY = document.getElementById('display-name-y');
const inputNameX = document.getElementById('input-name-x');
const inputNameY = document.getElementById('input-name-y');
const btnSaveTeams = document.getElementById('btn-save-teams');

const scoreLabelX = document.getElementById('score-label-x');
const scoreLabelY = document.getElementById('score-label-y');

const scoreX = document.getElementById('score-x');
const scoreY = document.getElementById('score-y');

const gmMatchTimer = document.getElementById('gm-match-timer');
const gmStationTimer = document.getElementById('gm-station-timer');

const colorPickerX = document.getElementById('color-picker-x');
const colorPickerY = document.getElementById('color-picker-y');

if (colorPickerX && colorPickerY) {
  colorPickerX.onchange = () => {
    socket.emit('admin:set_tracker_colors', { colorX: colorPickerX.value, colorY: colorPickerY.value });
  };
  colorPickerY.onchange = () => {
    socket.emit('admin:set_tracker_colors', { colorX: colorPickerX.value, colorY: colorPickerY.value });
  };
}

// Header STANDBY Button
const btnHeaderStandby = document.getElementById('btn-header-standby');
if (btnHeaderStandby) {
  btnHeaderStandby.onclick = () => socket.emit('admin:set_station', 'STANDBY');
}

// Match Timer Buttons
document.getElementById('btn-match-timer-start').onclick = () => socket.emit('admin:control_timer', { timerType: 'match', action: 'start' });
document.getElementById('btn-match-timer-pause').onclick = () => socket.emit('admin:control_timer', { timerType: 'match', action: 'pause' });
document.getElementById('btn-match-timer-reset').onclick = () => socket.emit('admin:control_timer', { timerType: 'match', action: 'reset' });

// Station Timer Buttons & +/- 30s Adjusters
document.getElementById('btn-station-timer-start').onclick = () => socket.emit('admin:control_timer', { timerType: 'station', action: 'start' });
document.getElementById('btn-station-timer-pause').onclick = () => socket.emit('admin:control_timer', { timerType: 'station', action: 'pause' });
document.getElementById('btn-station-timer-reset').onclick = () => socket.emit('admin:control_timer', { timerType: 'station', action: 'reset' });

const btnSub30 = document.getElementById('btn-station-timer-sub30');
const btnAdd30 = document.getElementById('btn-station-timer-add30');

if (btnSub30) btnSub30.onclick = () => socket.emit('admin:adjust_station_timer', -30);
if (btnAdd30) btnAdd30.onclick = () => socket.emit('admin:adjust_station_timer', 30);

// Reset All Button
document.getElementById('btn-reset-all').onclick = () => {
  if (confirm("Apakah kamu yakin ingin mereset seluruh skor, timer, dan status match?")) {
    socket.emit('admin:reset_all');
  }
};

// Reset X1 Progress Button
const btnResetX1 = document.getElementById('btn-reset-x1');
if (btnResetX1) {
  btnResetX1.onclick = () => {
    if (confirm("Reset progress Math Speedrun untuk kedua tim?")) {
      socket.emit('admin:reset_x1');
    }
  };
}

// Team Name Saver
btnSaveTeams.onclick = () => {
  const nameX = inputNameX.value.trim();
  const nameY = inputNameY.value.trim();
  socket.emit('admin:set_teams', { nameX, nameY });
};

// Visibility Toggle Buttons
const btnToggleX1Vis = document.getElementById('btn-toggle-x1-vis');
const btnToggleX2Vis = document.getElementById('btn-toggle-x2-vis');
const btnToggleX3Vis = document.getElementById('btn-toggle-x3-vis');
const btnToggleX4Vis = document.getElementById('btn-toggle-x4-vis');

function bindVisToggle(btn, stationId) {
  if (btn) {
    btn.onclick = () => {
      const currentVis = currentState && currentState.stationVisibility ? currentState.stationVisibility[stationId] : false;
      socket.emit('admin:toggle_station_visibility', { stationId, visible: !currentVis });
    };
  }
}

bindVisToggle(btnToggleX1Vis, 'X1');
bindVisToggle(btnToggleX2Vis, 'X2');
bindVisToggle(btnToggleX3Vis, 'X3');
bindVisToggle(btnToggleX4Vis, 'X4');

// CSV Import Handlers for X1, X2, X3, and X4
function bindCsvImport(elementId, stationId) {
  const fileInput = document.getElementById(elementId);
  if (fileInput) {
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          socket.emit('admin:import_csv', { stationId, csvText: evt.target.result });
          fileInput.value = '';
        };
        reader.readAsText(file);
      }
    };
  }
}

bindCsvImport('csv-file-x1', 'X1');
bindCsvImport('csv-file-x2', 'X2');
bindCsvImport('csv-file-x3', 'X3');
bindCsvImport('csv-file-x4', 'X4');

socket.on('admin:import_success', ({ stationId, count }) => {
  showToast('CSV IMPORT SUCCESS', `Berhasil mengimpor ${count} soal untuk ${stationId}! Status otomatis ON.`);
});

// Station Selector Tabs
const stationTabs = document.querySelectorAll('.station-tab');
stationTabs.forEach(tab => {
  tab.onclick = () => {
    const stationId = tab.getAttribute('data-station');
    socket.emit('admin:set_station', stationId);
  };
});

// Manual Score Adjuster
window.changeScore = function(team, amount) {
  const currentStation = currentState ? currentState.currentStation : 'STANDBY';
  socket.emit('admin:update_score', { team, amount, leg: currentStation });
};

window.gradeX1 = function(team, points) {
  socket.emit('admin:grade_x1', { team, points });
};

// State Receiver
socket.on('state_update', (state) => {
  currentState = state;
  renderState(state);
});

function renderState(state) {
  // Teams & Scores
  if (displayNameX) displayNameX.textContent = state.teams.X.name;
  if (displayNameY) displayNameY.textContent = state.teams.Y.name;
  if (scoreLabelX) scoreLabelX.textContent = state.teams.X.name;
  if (scoreLabelY) scoreLabelY.textContent = state.teams.Y.name;

  if (inputNameX && !inputNameX.value) inputNameX.value = state.teams.X.name;
  if (inputNameY && !inputNameY.value) inputNameY.value = state.teams.Y.name;

  scoreX.textContent = state.teams.X.score;
  scoreY.textContent = state.teams.Y.score;

  if (colorPickerX && state.trackerColors) colorPickerX.value = state.trackerColors.X;
  if (colorPickerY && state.trackerColors) colorPickerY.value = state.trackerColors.Y;

  // Match Timer
  const elapsed = state.matchTimer.elapsedSec;
  const mMinutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const mSeconds = (elapsed % 60).toString().padStart(2, '0');
  gmMatchTimer.textContent = `${mMinutes}:${mSeconds}`;

  // Station Timer
  const remaining = state.stationTimer.remainingSec;
  const sMinutes = Math.floor(remaining / 60).toString().padStart(2, '0');
  const sSeconds = (remaining % 60).toString().padStart(2, '0');
  gmStationTimer.textContent = `${sMinutes}:${sSeconds}`;

  // Header Standby Button Highlight
  if (btnHeaderStandby) {
    if (state.currentStation === 'STANDBY') {
      btnHeaderStandby.className = 'btn btn-primary';
    } else {
      btnHeaderStandby.className = 'btn btn-secondary';
    }
  }

  // Station Tab Highlight
  stationTabs.forEach(tab => {
    if (tab.getAttribute('data-station') === state.currentStation) {
      tab.className = 'btn btn-primary btn-large station-tab';
    } else {
      tab.className = 'btn btn-secondary btn-large station-tab';
    }
  });

  // Visibility Buttons State Rendering strictly as ON / OFF
  const visMap = state.stationVisibility || {};
  
  function updateVisBtn(btn, isVisible) {
    if (btn) {
      if (isVisible) {
        btn.textContent = 'ON';
        btn.className = 'btn-vis-toggle active';
      } else {
        btn.textContent = 'OFF';
        btn.className = 'btn-vis-toggle inactive';
      }
    }
  }

  updateVisBtn(btnToggleX1Vis, visMap.X1);
  updateVisBtn(btnToggleX2Vis, visMap.X2);
  updateVisBtn(btnToggleX3Vis, visMap.X3);
  updateVisBtn(btnToggleX4Vis, visMap.X4);

  // Render Station Panels
  document.getElementById('gm-panel-idle').style.display = 'none';
  document.getElementById('gm-panel-x1').style.display = 'none';
  document.getElementById('gm-panel-x2').style.display = 'none';
  document.getElementById('gm-panel-x3').style.display = 'none';
  document.getElementById('gm-panel-x4').style.display = 'none';

  if (state.currentStation === 'STANDBY') {
    document.getElementById('gm-panel-idle').style.display = 'block';
  } else if (state.currentStation === 'X1') {
    document.getElementById('gm-panel-x1').style.display = 'block';
    renderX1GM(state);
  } else if (state.currentStation === 'X2') {
    document.getElementById('gm-panel-x2').style.display = 'block';
    renderX2GM(state);
  } else if (state.currentStation === 'X3') {
    document.getElementById('gm-panel-x3').style.display = 'block';
    renderX3GM(state);
  } else if (state.currentStation === 'X4') {
    document.getElementById('gm-panel-x4').style.display = 'block';
    renderX4GM(state);
  }
}

// Render X1 GM
function renderX1GM(state) {
  document.getElementById('x1-label-x').textContent = state.teams.X.name.toUpperCase();
  document.getElementById('x1-label-y').textContent = state.teams.Y.name.toUpperCase();

  const px = state.x1Progress.X;
  const py = state.x1Progress.Y;

  document.getElementById('gm-x1-score-x').textContent = `BENAR: ${px.correctCount || 0} | SALAH: ${px.wrongCount || 0}`;
  document.getElementById('gm-x1-status-x').textContent = `SKIPPED: ${px.skippedCount || 0} | TOTAL DIJAWAB: ${px.totalAnswered || px.currentIdx} / 30 ${px.finished ? '(Selesai)' : ''}`;

  document.getElementById('gm-x1-score-y').textContent = `BENAR: ${py.correctCount || 0} | SALAH: ${py.wrongCount || 0}`;
  document.getElementById('gm-x1-status-y').textContent = `SKIPPED: ${py.skippedCount || 0} | TOTAL DIJAWAB: ${py.totalAnswered || py.currentIdx} / 30 ${py.finished ? '(Selesai)' : ''}`;
}

// Render X2 GM
function renderX2GM(state) {
  const q = state.currentQuestion.X2;
  const qIdx = state.currentQuestion.X2Idx;

  document.getElementById('x2-leg-score-x-label').textContent = `${state.teams.X.name.toUpperCase()} (X2 LEG SCORE)`;
  document.getElementById('x2-leg-score-x-val').textContent = `${state.teams.X.legScores.X2} PTS`;

  document.getElementById('x2-leg-score-y-label').textContent = `${state.teams.Y.name.toUpperCase()} (X2 LEG SCORE)`;
  document.getElementById('x2-leg-score-y-val').textContent = `${state.teams.Y.legScores.X2} PTS`;

  document.getElementById('x2-q-index').textContent = `SOAL ${qIdx + 1}`;
  if (q) {
    document.getElementById('gm-x2-question').textContent = q.question;

    const choicesContainer = document.getElementById('gm-x2-choices');
    choicesContainer.innerHTML = q.choices.map(c => `<div>${c}</div>`).join('');
    document.getElementById('gm-x2-key').textContent = `KEY: ${q.correct}`;
  }

  // Buzz Feed & Answer Result State
  const feed = document.getElementById('gm-buzz-feed');
  const buzzer = state.buzzer;
  const lastResult = state.currentQuestion.X2LastResult;

  if (state.currentQuestion.X2Answered && lastResult) {
    const tName = state.teams[lastResult.team].name.toUpperCase();
    if (lastResult.isCorrect) {
      feed.textContent = `${tName} BENAR! (+${lastResult.pointsAwarded} LEG PT). Tekan Next.`;
      feed.style.color = "var(--primary)";
    } else {
      feed.textContent = `${tName} SALAH! (0 PT). Lockout dari soal ini.`;
      feed.style.color = "var(--error)";
    }
  } else if (buzzer.open) {
    feed.textContent = "BUZZER OPEN (REBUTAN SEKARANG)";
    feed.style.color = "var(--primary)";
  } else if (buzzer.buzzedTeam) {
    const tName = state.teams[buzzer.buzzedTeam].name;
    feed.textContent = `${tName.toUpperCase()} BUZZ PERTAMA! MENJAWAB...`;
    feed.style.color = "var(--primary)";
  } else {
    feed.textContent = "Buzzer Closed.";
    feed.style.color = "var(--secondary)";
  }
}

// X2 GM Controls
document.getElementById('btn-x2-prev').onclick = () => socket.emit('admin:prev_x2_question');
document.getElementById('btn-x2-next').onclick = () => socket.emit('admin:next_x2_question');
document.getElementById('btn-gm-open-buzz').onclick = () => socket.emit('admin:open_buzzer');
document.getElementById('btn-gm-close-buzz').onclick = () => socket.emit('admin:close_buzzer');
document.getElementById('btn-gm-reset-buzz').onclick = () => socket.emit('admin:reset_buzzer');

// Render X3 GM
function renderX3GM(state) {
  document.getElementById('gm-x3-title-x').textContent = `${state.teams.X.name.toUpperCase()} SUBMISSION`;
  document.getElementById('gm-x3-title-y').textContent = `${state.teams.Y.name.toUpperCase()} SUBMISSION`;

  const subX = state.x3Submissions.X;
  const subY = state.x3Submissions.Y;

  const bodyX = document.getElementById('gm-x3-body-x');
  if (subX) {
    bodyX.innerHTML = `
      <div style="margin-bottom: 8px;"><strong>Tersangka:</strong> <span class="badge badge-primary">${subX.suspect.toUpperCase()}</span> (${subX.timestamp})</div>
      <div><strong>Justifikasi:</strong></div>
      <div style="background-color: var(--muted); padding: 10px; border-radius: 4px; margin-top: 4px; font-size: 13px;">${subX.justification}</div>
    `;
  } else {
    bodyX.innerHTML = `<p class="text-secondary" style="font-size: 13px;">Belum ada jawaban dikirim.</p>`;
  }

  const bodyY = document.getElementById('gm-x3-body-y');
  if (subY) {
    bodyY.innerHTML = `
      <div style="margin-bottom: 8px;"><strong>Tersangka:</strong> <span class="badge badge-primary">${subY.suspect.toUpperCase()}</span> (${subY.timestamp})</div>
      <div><strong>Justifikasi:</strong></div>
      <div style="background-color: var(--muted); padding: 10px; border-radius: 4px; margin-top: 4px; font-size: 13px;">${subY.justification}</div>
    `;
  } else {
    bodyY.innerHTML = `<p class="text-secondary" style="font-size: 13px;">Belum ada jawaban dikirim.</p>`;
  }
}

window.gradeX3 = function(team, correct) {
  socket.emit('admin:grade_x3', { team, correct, points: 1 });
};

// Render X4 GM
function renderX4GM(state) {
  document.getElementById('gm-x4-title-x').textContent = `${state.teams.X.name.toUpperCase()} RECALL`;
  document.getElementById('gm-x4-title-y').textContent = `${state.teams.Y.name.toUpperCase()} RECALL`;

  const btnStartFlash = document.getElementById('btn-x4-start-flash');
  const btnStartRecall = document.getElementById('btn-x4-start-recall');

  if (state.x4State.phase === 'FLASHING') {
    btnStartFlash.className = 'btn btn-primary btn-large';
    btnStartRecall.className = 'btn btn-secondary btn-large';
  } else if (state.x4State.phase === 'RECALL') {
    btnStartFlash.className = 'btn btn-secondary btn-large';
    btnStartRecall.className = 'btn btn-primary btn-large';
  } else {
    btnStartFlash.className = 'btn btn-secondary btn-large';
    btnStartRecall.className = 'btn btn-secondary btn-large';
  }

  const subX = state.x4State.submissions.X;
  const subY = state.x4State.submissions.Y;

  const bodyX = document.getElementById('gm-x4-body-x');
  if (subX) {
    bodyX.innerHTML = `
      <div style="margin-bottom: 8px;"><strong>Auto Score:</strong> ${subX.autoScore} / 9 (${subX.timestamp})</div>
      <div style="font-size: 13px;">${subX.answers.map((a, i) => `<div>#${i+1}: ${a}</div>`).join('')}</div>
    `;
  } else {
    bodyX.innerHTML = `Belum ada jawaban dikirim.`;
  }

  const bodyY = document.getElementById('gm-x4-body-y');
  if (subY) {
    bodyY.innerHTML = `
      <div style="margin-bottom: 8px;"><strong>Auto Score:</strong> ${subY.autoScore} / 9 (${subY.timestamp})</div>
      <div style="font-size: 13px;">${subY.answers.map((a, i) => `<div>#${i+1}: ${a}</div>`).join('')}</div>
    `;
  } else {
    bodyY.innerHTML = `Belum ada jawaban dikirim.`;
  }
}

// X4 GM Triggers
document.getElementById('btn-x4-start-flash').onclick = () => socket.emit('admin:start_x4_flash');
document.getElementById('btn-x4-start-recall').onclick = () => socket.emit('admin:start_x4_recall');

window.gradeX4 = function(team, points) {
  socket.emit('admin:grade_x4', { team, points });
};
