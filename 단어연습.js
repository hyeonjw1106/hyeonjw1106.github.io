const words = [
  "자동차", "영어", "학교", "사파이어", "코딩", "가지", "다리미", "바다", "사랑", "웃음",
  "굶주림", "키득키득", "눈싸움", "축구", "블루투스", "노력", "원소", "반복", "공책", "노래",
  "군청색", "삶은계란", "군대", "아이콘", "대머리", "도덕", "프로젝트", "키다리", "숲속", "동화책",
  "치타", "반응속도", "오셀롯", "어린이", "광복절", "지갑", "객관식", "집중", "바이러스", "깃털",
  "영화관", "자물쇠", "백열등", "대포", "짙은파랑", "관용구", "행성", "외계인", "테크닉", "국가대표",
  "놀이터", "재롱잔치"
];

const MAX_COUNT = 50;
let currentLetter = '';
let nextLetter = '';
let processing = false;
let startTime = null;
let typedCount = 0;
let intervalTimer = null;
let totalKeystrokes = 0;
let accuracyPercent = 100;

// --- DOM 요소 가져오기 ---
const prevDiv = document.getElementById('prev');
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
  return words[Math.floor(Math.random() * words.length)];
}

function initialize() {
  currentLetter = getRandomLetter();
  do {
    nextLetter = getRandomLetter();
  } while (nextLetter === currentLetter);

  typedCount = 0;
  totalKeystrokes = 0;
  accuracyPercent = 100;
  startTime = null;

  prevDiv.textContent = ''; // 초기 prev 비우기
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

      prevDiv.textContent = currentLetter; // 마지막 입력 문자 prev에 표시

      if (typedCount >= MAX_COUNT) {
        // 남은 문장 0개일 때 prev, next 모두 비우기
        prevDiv.textContent = '';
        nextDiv.textContent = '';
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
