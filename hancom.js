// 버튼 클릭 시 페이지 이동
document.getElementById('jari').addEventListener('click', () => {
  window.location.href = "자리연습.html";
});

document.getElementById('natmal').addEventListener('click', () => {
  window.location.href = "단어연습.html";
});

document.getElementById('danmun').addEventListener('click', () => {
  window.location.href = "단문연습.html";
});

document.getElementById('jangmun').addEventListener('click', () => {
  window.location.href = "장문연습.html";
});

// 로고 이미지 0.5초마다 번갈아 표시
let current = 1;
setInterval(() => {
  const logo = document.getElementById('logo');
  current = current === 1 ? 2 : 1;
  logo.src = `logo${current}.png`;
}, 500);
