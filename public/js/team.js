// Team XPAD Tablet Client Script

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

// Parse Team parameter (?team=X or ?team=Y)
const urlParams = new URLSearchParams(window.location.search);
const teamKey = (urlParams.get('team') || 'X').toUpperCase();

let currentState = null;
let selectedX2Choice = null;

// X4 Step-by-step question state
let currentX4QIdx = 0;
let x4UserAnswers = {};

// DOM Elements
const teamBadge = document.getElementById('team-badge');
const matchTimer = document.getElementById('match-timer');
const teamScore = document.getElementById('team-score');
const activeLegName = document.getElementById('active-leg-name');
const stationTimer = document.getElementById('station-timer');

// Views
const viewIdle = document.getElementById('view-idle');
const viewX1 = document.getElementById('view-x1');
const viewX2 = document.getElementById('view-x2');
const viewX3 = document.getElementById('view-x3');
const viewX4 = document.getElementById('view-x4');

// X1 Elements
const x1Count = document.getElementById('x1-count');
const x1Question = document.getElementById('x1-question');
const x1Form = document.getElementById('x1-form');
const x1Input = document.getElementById('x1-input');
const btnX1Enter = document.getElementById('btn-x1-enter');
const btnX1Skip = document.getElementById('btn-x1-skip');
const x1ProgressBar = document.getElementById('x1-progress-bar');

// X2 Elements
const x2Question = document.getElementById('x2-question');
const btnBuzz = document.getElementById('btn-buzz');
const buzzerStatusText = document.getElementById('buzzer-status-text');
const buzzResultBanner = document.getElementById('buzz-result-banner');
const x2ChoicesArea = document.getElementById('x2-choices-area');
const x2ChoicesGrid = document.getElementById('x2-choices-grid');
const x2BuzzerCard = document.getElementById('x2-buzzer-card');

// X3 Elements
const x3Form = document.getElementById('x3-form');
const x3Justification = document.getElementById('x3-justification');
const x3SubmittedMsg = document.getElementById('x3-submitted-msg');

// X4 Elements
const x4PhaseFlash = document.getElementById('x4-phase-flash');
const x4PhaseRecall = document.getElementById('x4-phase-recall');
const x4Form = document.getElementById('x4-form');
const x4QStepTitle = document.getElementById('x4-q-step-title');
const x4SingleQuestionContainer = document.getElementById('x4-single-question-container');
const btnX4Prev = document.getElementById('btn-x4-prev');
const btnX4Next = document.getElementById('btn-x4-next');
const btnX4Submit = document.getElementById('btn-x4-submit');
const x4SubmittedMsg = document.getElementById('x4-submitted-msg');

// Function to handle X1 Answer Submission
function submitX1Answer() {
  if (!x1Input) return;
  const val = x1Input.value.trim();
  if (val !== '') {
    socket.emit('team:submit_x1', { team: teamKey, answer: val });
    x1Input.value = '';
  }
}

// X1 Form Submit Handler
if (x1Form) {
  x1Form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitX1Answer();
  });
}

// Numpad Key Press Handler
function handleNumpadKey(key) {
  if (!key || !x1Input) return;

  if (key === 'clear') {
    x1Input.value = '';
  } else if (key === 'back') {
    x1Input.value = x1Input.value.slice(0, -1);
  } else if (key === 'ENTER') {
    submitX1Answer();
  } else {
    x1Input.value += key;
  }
}

// Attach Touch & Click listeners for X1 Numpad buttons for 100% responsiveness on tablets
document.querySelectorAll('.numpad-btn').forEach(btn => {
  const key = btn.getAttribute('data-key');
  const isSkip = btn.id === 'btn-x1-skip' || btn.classList.contains('numpad-btn-skip');

  let handledTouch = false;

  const triggerAction = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSkip) {
      socket.emit('team:skip_x1', teamKey);
    } else if (key === 'ENTER' || btn.id === 'btn-x1-enter') {
      submitX1Answer();
    } else if (key) {
      handleNumpadKey(key);
    }
  };

  btn.addEventListener('touchstart', (e) => {
    handledTouch = true;
    triggerAction(e);
  }, { passive: false });

  btn.addEventListener('click', (e) => {
    if (handledTouch) {
      handledTouch = false;
      e.preventDefault();
      return;
    }
    triggerAction(e);
  });
});

// Audio Trigger Receiver
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

// State Update Handler
socket.on('state_update', (state) => {
  currentState = state;
  renderState(state);
});

function renderState(state) {
  const teamData = state.teams[teamKey];
  if (teamData) {
    teamBadge.textContent = teamData.name;
    teamScore.textContent = `${teamData.score} PTS`;
  }

  // Render Timers
  const elapsed = state.matchTimer.elapsedSec;
  const mMinutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const mSeconds = (elapsed % 60).toString().padStart(2, '0');
  matchTimer.textContent = `${mMinutes}:${mSeconds}`;

  const remaining = state.stationTimer.remainingSec;
  const sMinutes = Math.floor(remaining / 60).toString().padStart(2, '0');
  const sSeconds = (remaining % 60).toString().padStart(2, '0');
  if (stationTimer) stationTimer.textContent = `${sMinutes}:${sSeconds}`;

  // Active Station & Visibility Check
  const station = state.currentStation;
  const isVisible = state.stationVisibility ? state.stationVisibility[station] !== false : true;

  if (viewIdle) viewIdle.style.display = 'none';
  viewX1.style.display = 'none';
  viewX2.style.display = 'none';
  viewX3.style.display = 'none';
  viewX4.style.display = 'none';

  if (station === 'STANDBY' || !isVisible) {
    activeLegName.textContent = 'STANDBY';
    if (viewIdle) viewIdle.style.display = 'flex';
  } else if (station === 'X1') {
    activeLegName.textContent = 'STATION X1 • MATH SPEEDRUN';
    viewX1.style.display = 'block';
    renderX1(state);
  } else if (station === 'X2') {
    activeLegName.textContent = 'STATION X2 • CERDAS CERMAT';
    viewX2.style.display = 'block';
    renderX2(state);
  } else if (station === 'X3') {
    activeLegName.textContent = 'STATION X3 • AI UNSOLVED CASE';
    viewX3.style.display = 'block';
    renderX3(state);
  } else if (station === 'X4') {
    activeLegName.textContent = 'STATION X4 • FLASH MEMORY';
    viewX4.style.display = 'block';
    renderX4(state);
  }
}

// Render X1 - Math Speedrun (Hides Benar/Salah and Target text from Player Tablet)
function renderX1(state) {
  const p = state.x1Progress[teamKey];
  const questionList = state.activeQuestionsX1 || (Array.isArray(state.currentQuestion.X1) ? state.currentQuestion.X1 : [state.currentQuestion.X1]);
  
  if (p && questionList && questionList.length > 0) {
    const qIdx = p.currentIdx;
    const currentQ = questionList[qIdx];

    if (currentQ && !p.finished) {
      x1Count.textContent = `SOAL ${qIdx + 1} / ${questionList.length}`;
      x1Question.textContent = currentQ.question;
      if (x1Input) x1Input.disabled = false;
    } else {
      x1Count.textContent = `SELESAI`;
      x1Question.textContent = "FINISH";
      if (x1Input) x1Input.disabled = true;
    }

    const total = questionList.length;
    const pct = Math.min(100, Math.round(((p.totalAnswered || p.currentIdx) / total) * 100));
    if (x1ProgressBar) x1ProgressBar.style.width = `${pct}%`;
  }
}

// Render X2 - Cerdas Cermat: Hide BUZZ button when team buzzes first & show options
function renderX2(state) {
  const q = state.currentQuestion.X2;
  const buzzer = state.buzzer;

  if (q) {
    x2Question.textContent = q.question;

    x2ChoicesGrid.innerHTML = '';
    q.choices.forEach((choiceStr) => {
      const choiceChar = choiceStr.charAt(0);
      const btn = document.createElement('button');
      
      if (selectedX2Choice === choiceChar) {
        btn.className = 'btn btn-primary btn-large';
        btn.style.boxShadow = '0 0 15px var(--primary)';
      } else {
        btn.className = 'btn btn-secondary btn-large';
      }

      btn.style.width = '100%';
      btn.style.fontSize = '16px';
      btn.textContent = choiceStr;
      
      btn.onclick = () => {
        selectedX2Choice = choiceChar;
        Array.from(x2ChoicesGrid.children).forEach(child => {
          child.className = 'btn btn-secondary btn-large';
          child.style.boxShadow = 'none';
        });
        btn.className = 'btn btn-primary btn-large';
        btn.style.boxShadow = '0 0 15px var(--primary)';

        socket.emit('team:submit_x2', { team: teamKey, choice: choiceChar });
      };
      x2ChoicesGrid.appendChild(btn);
    });
  }

  // Hide BUZZ button when team is first to buzz, show choices directly!
  if (buzzer.buzzedTeam === teamKey) {
    if (x2BuzzerCard) x2BuzzerCard.style.display = 'none';
    x2ChoicesArea.style.display = 'block';
  } else {
    if (x2BuzzerCard) x2BuzzerCard.style.display = 'block';
    
    if (buzzer.open && !buzzer.lockout[teamKey] && !state.currentQuestion.X2Answered) {
      btnBuzz.disabled = false;
      buzzerStatusText.textContent = "SILAHKAN PENCET BUZZER REBUTAN";
      buzzerStatusText.style.color = "var(--primary)";
      buzzResultBanner.style.display = 'none';
      x2ChoicesArea.style.display = 'none';
      selectedX2Choice = null;
    } else if (buzzer.buzzedTeam && buzzer.buzzedTeam !== teamKey) {
      btnBuzz.disabled = true;
      buzzerStatusText.textContent = "TERLAMBAT. TIM LAWAN LEBIH DULU BUZZ.";
      buzzerStatusText.style.color = "var(--secondary)";
      buzzResultBanner.style.display = 'block';
      buzzResultBanner.className = 'badge badge-secondary';
      buzzResultBanner.textContent = `${state.teams[buzzer.buzzedTeam].name} SEDANG MENJAWAB`;
      x2ChoicesArea.style.display = 'none';
    } else if (buzzer.lockout[teamKey]) {
      btnBuzz.disabled = true;
      buzzerStatusText.textContent = "TIM KAMU TERKUNCI (LOCKOUT) DARI SOAL INI";
      buzzerStatusText.style.color = "var(--error)";
      buzzResultBanner.style.display = 'none';
      x2ChoicesArea.style.display = 'none';
    } else {
      btnBuzz.disabled = true;
      buzzerStatusText.textContent = "TUNGGU GAMEMASTER MEMBUKA BUZZER";
      buzzerStatusText.style.color = "var(--secondary)";
      buzzResultBanner.style.display = 'none';
      x2ChoicesArea.style.display = 'none';
    }
  }
}

btnBuzz.addEventListener('click', () => {
  socket.emit('team:buzz', teamKey);
});

btnBuzz.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (!btnBuzz.disabled) {
    socket.emit('team:buzz', teamKey);
  }
});

// Render X3 - AI Unsolved Case
function renderX3(state) {
  const sub = state.x3Submissions[teamKey];
  if (sub) {
    x3Form.style.display = 'none';
    x3SubmittedMsg.style.display = 'block';
  } else {
    x3Form.style.display = 'block';
    x3SubmittedMsg.style.display = 'none';
  }
}

x3Form.addEventListener('submit', (e) => {
  e.preventDefault();
  const selectedSuspect = document.querySelector('input[name="suspect"]:checked');
  const justificationVal = x3Justification.value.trim();

  if (selectedSuspect && justificationVal) {
    socket.emit('team:submit_x3', {
      team: teamKey,
      suspect: selectedSuspect.value,
      justification: justificationVal
    });
  }
});

// Render X4 - Flash Memory Step-by-Step Single Question
function renderX4(state) {
  const phase = state.x4State.phase;
  const sub = state.x4State.submissions[teamKey];

  if (phase === 'RECALL') {
    x4PhaseFlash.style.display = 'none';
    x4PhaseRecall.style.display = 'block';

    if (sub) {
      x4Form.style.display = 'none';
      x4SubmittedMsg.style.display = 'block';
    } else {
      x4Form.style.display = 'block';
      x4SubmittedMsg.style.display = 'none';
      renderX4SingleQuestion();
    }
  } else {
    x4PhaseFlash.style.display = 'block';
    x4PhaseRecall.style.display = 'none';
  }
}

// Render Single Question for X4 Recall with PREV / NEXT / SUBMIT controls
function renderX4SingleQuestion() {
  if (!currentState || !currentState.currentQuestion || !currentState.currentQuestion.X4) return;
  const questions = currentState.currentQuestion.X4.questions || [];
  if (questions.length === 0) return;

  if (currentX4QIdx < 0) currentX4QIdx = 0;
  if (currentX4QIdx >= questions.length) currentX4QIdx = questions.length - 1;

  const currentQ = questions[currentX4QIdx];
  x4QStepTitle.textContent = `SOAL ${currentX4QIdx + 1} DARI ${questions.length}`;

  x4SingleQuestionContainer.innerHTML = '';

  const qCard = document.createElement('div');
  qCard.style.padding = '12px 0';

  const choicesHtml = currentQ.choices.map((cStr) => {
    const char = cStr.charAt(0);
    const isChecked = x4UserAnswers[currentX4QIdx] === char;
    return `
      <label class="radio-option-card" style="${isChecked ? 'border-color: var(--primary); background: var(--muted); box-shadow: 0 0 12px var(--primary-glow);' : ''}">
        <input type="radio" name="x4_active_choice" value="${char}" ${isChecked ? 'checked' : ''}>
        <span style="font-size: 16px;">${cStr}</span>
      </label>
    `;
  }).join('');

  qCard.innerHTML = `
    <div style="font-weight: 800; font-size: 20px; margin-bottom: 20px; color: #fff; line-height: 1.4;">
      ${currentQ.question}
    </div>
    <div class="grid-2" style="gap: 14px;">
      ${choicesHtml}
    </div>
  `;

  x4SingleQuestionContainer.appendChild(qCard);

  // Bind radio button click handler to save selection
  const radios = x4SingleQuestionContainer.querySelectorAll('input[name="x4_active_choice"]');
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      x4UserAnswers[currentX4QIdx] = radio.value;
      renderX4SingleQuestion();
    });
  });

  // Control Buttons Visibility State
  btnX4Prev.disabled = (currentX4QIdx === 0);

  if (currentX4QIdx === questions.length - 1) {
    btnX4Next.style.display = 'none';
    btnX4Submit.style.display = 'inline-flex';
  } else {
    btnX4Next.style.display = 'inline-flex';
    btnX4Submit.style.display = 'none';
  }
}

// Bind Navigation Buttons
if (btnX4Prev) {
  btnX4Prev.onclick = () => {
    if (currentX4QIdx > 0) {
      currentX4QIdx--;
      renderX4SingleQuestion();
    }
  };
}

if (btnX4Next) {
  btnX4Next.onclick = () => {
    const questions = (currentState && currentState.currentQuestion && currentState.currentQuestion.X4) ? currentState.currentQuestion.X4.questions : [];
    if (currentX4QIdx < questions.length - 1) {
      currentX4QIdx++;
      renderX4SingleQuestion();
    }
  };
}

if (btnX4Submit) {
  btnX4Submit.onclick = () => {
    const questions = (currentState && currentState.currentQuestion && currentState.currentQuestion.X4) ? currentState.currentQuestion.X4.questions : [];
    const answersArray = [];

    questions.forEach((_, idx) => {
      answersArray.push(x4UserAnswers[idx] || '');
    });

    socket.emit('team:submit_x4', {
      team: teamKey,
      answers: answersArray
    });
  };
}
