// --- 문장 목록 및 초기 변수 설정 ---
const sentences = [
  "나를 죽이지 못하는 것은 나를 더욱 강하게 만든다.",
  "악은 쾌락 속에서도 고통을 주지만 덕은 고통 속에서도 위안을 준다.",
  "고래 싸움에 새우 등 터진다.",
  "오늘 가장 잘 웃는 자가 최후에도 웃을 것이다.",
  "너 자신을 알라",
  "음악은 법이 허락한 유일한 마약이다.",
  "없어보지 않고서야 소중한 줄 모른다.",
  "인간은 차별당하기 위해 존재한다. 그렇기에 싸우며 경쟁하고 진보한다.",
  "날개가 없기에 인간은 날아오를 방법을 찾는다.",
  "아무것도 가지지 않고 태어났기에 무엇이든 될 수 있다.",
  "꿈은 도망가지 않는다. 도망가는 것은 언제나 자신이다.",
  "생각하는 대로 살지 않으면 사는 대로 생각하게 될 것이다.",
  "인내는 쓰다. 그러나 그 열매는 달다.",
  "총을 쏴도 되는 건 총에 맞을 각오를 한 자 뿐이다.",
  "가장 뛰어난 예언자는 과거이다.",
  "역사는 현재의 거울이요 미래의 길잡이로다.",
  "꿈꾸라. 꿈만 꾸지 말고 실천하라.",
  "사람들에게 잊혀짐에도 사명을 다하는 사람이 진정한 영웅이다.",
  "철도 강해지기 위해선 고열과 망치질을 견뎌내야 한다.",
  "너가 바뀌지 않으면 주변도 바뀌지 않는다.",
  "악은 두려움에 기생한다. 하지만 용기는 악을 먹어치운다.",
  "모든 사람을 기쁘게 하려고 애쓰다 보면 결국 누구도 기쁘게 할 수 없다.",
  "그림자는 당신이 빛을 향하고 있다는 증거다."
];

const MAX_COUNT = 10;
let currentLetter = '';
let nextLetter = '';
let processing = false;
let startTime = null;
let typedCount = 0;
let intervalTimer = null;
let totalKeystrokes = 0;
let accuracyPercent = 100;

// --- DOM 요소 가져오기 ---
const currentDiv = document.getElementById('current');
const nextDiv = document.getElementById('next');
const inputField = document.getElementById('input');
const backBtn = document.getElementById('backBtn');
const timeDisplay = document.getElementById('timeDisplay');
const typingSpeedDisplay = document.getElementById('typingSpeed');
const remainingCountDiv = document.getElementById('remainingCount');
const modal = document.getElementById('resultModal');
const modalBackBtn = document.getElementById('modalBackBtn');
const modalRetryBtn = document.getElementById('modalRetryBtn');
const resultTime = document.getElementById('resultTime');
const resultSpeed = document.getElementById('resultSpeed');
const resultAccuracy = document.getElementById('resultAccuracy');
const countdownDiv = document.getElementById('countdown');
const typingArea = document.getElementById('typingArea');
const inputArea = document.getElementById('inputArea');
const keyboardDiv = document.getElementById('keyboard');
const accuracyDisplay = document.getElementById('accuracyDisplay');
const accuracyBar = document.getElementById('accuracyBar');
const speedBar = document.getElementById('speedBar');

// --- 자판 배열 ---
const keyboardRows = [
  ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
  ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
  ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ']
];

// --- 유틸 함수 ---
function getRandomLetter() {
  return sentences[Math.floor(Math.random() * sentences.length)];
}

function initialize() {
  currentLetter = getRandomLetter();
  do {
    nextLetter = getRandomLetter();
  } while (nextLetter === currentLetter);

  typedCount = 0;
  totalKeystrokes = 0;
  accuracyPercent = 100;
  startTime = null; // 첫 입력 시 초기화

  updateDisplay();
  updateTime(0);
  updateTypingSpeed(0);
  updateRemainingCount();
  updateAccuracy();

  if (intervalTimer) clearInterval(intervalTimer);
  intervalTimer = setInterval(() => {
    if (!startTime) return;
    const now = new Date();
    const diffMs = now - startTime;
    updateTime(diffMs);
    updateTypingSpeed(diffMs);
  }, 1000);

  inputField.disabled = false;
  modal.classList.add('hidden');
}

function resetGame() {
  initialize();
  inputField.value = '';
  inputField.focus();
}

function updateDisplay() {
  currentDiv.textContent = currentLetter;
  nextDiv.textContent = `${nextLetter || ''}`;
  inputField.value = '';
  inputField.focus();
}

function updateTime(diffMs) {
  if (diffMs === 0) {
    timeDisplay.textContent = '시간: 00:00';
    return;
  }
  const totalSeconds = Math.floor(diffMs / 1000);
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  timeDisplay.textContent = `시간: ${m}:${s}`;
}

function updateTypingSpeed(diffMs) {
  if (diffMs === 0 || totalKeystrokes === 0) {
    typingSpeedDisplay.textContent = '타수: 0';
    speedBar.style.width = '0%';
    return;
  }
  const minutes = diffMs / 60000;
  const speed = Math.floor(totalKeystrokes / minutes);
  typingSpeedDisplay.textContent = `타수: ${speed}`;

  const percent = Math.min((speed / 500) * 100, 100);
  speedBar.style.width = `${percent}%`;
}

function updateRemainingCount() {
  const remaining = MAX_COUNT - typedCount;
  remainingCountDiv.textContent = `남은 문장: ${remaining >= 0 ? remaining : 0}`;
}

function updateAccuracy() {
  accuracyDisplay.textContent = `정확도: ${accuracyPercent}%`;
  accuracyBar.style.width = `${accuracyPercent}%`;
}

function showModal() {
  modal.classList.remove('hidden');
  const now = new Date();
  const diffMs = now - startTime;
  const totalSeconds = Math.floor(diffMs / 1000);
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  resultTime.textContent = `걸린 시간: ${m}:${s}`;
  const speed = diffMs > 0 ? Math.floor(totalKeystrokes / (diffMs / 60000)) : 0;
  resultSpeed.textContent = `평균 타수: ${speed}`;
  resultAccuracy.textContent = `정확도: ${accuracyPercent}%`;
  inputField.disabled = true;
}

function hideModal() {
  modal.classList.add('hidden');
}

// --- 가상 키보드 ---
function createKeyboard() {
  keyboardDiv.innerHTML = '';
  keyboardRows.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    row.forEach(letter => {
      const keyDiv = document.createElement('div');
      keyDiv.className = 'key';
      keyDiv.textContent = letter;
      keyDiv.dataset.letter = letter;
      rowDiv.appendChild(keyDiv);
    });
    keyboardDiv.appendChild(rowDiv);
  });
}

function blinkKeysByChar(char) {
  if (!char) return;
  const key = keyboardDiv.querySelector(`.key[data-letter="${char}"]`);
  if (key) {
    key.classList.add('active');
    setTimeout(() => {
      key.classList.remove('active');
    }, 50);
  }
}

// --- 이벤트 리스너 ---
inputField.addEventListener('keydown', (e) => {
  if (!startTime) {
    startTime = new Date();
  }
  if (e.key.length === 1) {
    totalKeystrokes++;
    blinkKeysByChar(e.key);
  }
});

inputField.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' && !processing) {
    processing = true;
    const input = inputField.value.trim();

    if (input === '') {
      processing = false;
      return;
    }

    currentDiv.classList.remove('shake');

    if (input === currentLetter) {
      typedCount++;
      updateRemainingCount();

      if (typedCount >= MAX_COUNT) {
        nextLetter = '';
        updateDisplay();
        showModal();
        clearInterval(intervalTimer);
        processing = false;
        return;
      }

      currentLetter = nextLetter;
      do {
        nextLetter = getRandomLetter();
      } while (nextLetter === currentLetter);

      updateDisplay();
      inputField.value = '';
      inputField.focus();
      processing = false;
    } else {
      accuracyPercent = Math.max(accuracyPercent - 2, 0);
      updateAccuracy();

      setTimeout(() => {
        currentDiv.classList.add('shake');
      }, 20);
      currentDiv.addEventListener('animationend', () => {
        currentDiv.classList.remove('shake');
        processing = false;
      }, { once: true });
    }
  }
});

// --- 버튼 및 카운트다운 ---
backBtn.onclick = modalBackBtn.onclick = () => window.location.href = 'index.html';
modalRetryBtn.onclick = () => {
  hideModal();
  startCountdown();
};

function startCountdown() {
  let count = 3;
  countdownDiv.textContent = count;
  countdownDiv.style.display = 'block';
  typingArea.style.display = 'none';
  inputArea.style.display = 'none';
  inputField.disabled = true;

  const countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownDiv.textContent = count;
    } else {
      clearInterval(countdownInterval);
      countdownDiv.style.display = 'none';
      typingArea.style.display = 'flex';
      inputArea.style.display = 'block';
      inputField.disabled = false;
      resetGame();
    }
  }, 1000);
}

createKeyboard();
window.onload = startCountdown;
