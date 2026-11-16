
const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const millisecondsDisplay = document.getElementById("milliseconds");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");
const lapList = document.getElementById("lapList");

let startTime = 0;
let elapsedTime = 0;
let animationId = null;
let running = false;
let lapCount = 0;

function formatTime(time) {
  const totalMs = Math.floor(time);
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const milliseconds = Math.floor((totalMs % 1000) / 10);

  return {
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
    milliseconds: String(milliseconds).padStart(2, "0")
  };
}

function updateDisplay() {
  const currentTime = running
    ? elapsedTime + performance.now() - startTime
    : elapsedTime;

  const time = formatTime(currentTime);

  minutesDisplay.textContent = time.minutes;
  secondsDisplay.textContent = time.seconds;
  millisecondsDisplay.textContent = time.milliseconds;

  if (running) {
    animationId = requestAnimationFrame(updateDisplay);
  }
}

function startStopwatch() {
  if (running) return;

  running = true;
  startTime = performance.now();

  startBtn.disabled = true;
  pauseBtn.disabled = false;
  lapBtn.disabled = false;

  updateDisplay();
}

function pauseStopwatch() {
  if (!running) return;

  elapsedTime += performance.now() - startTime;
  running = false;

  cancelAnimationFrame(animationId);

  startBtn.disabled = false;
  pauseBtn.disabled = true;
  lapBtn.disabled = true;

  updateDisplay();
}

function resetStopwatch() {
  running = false;
  cancelAnimationFrame(animationId);

  elapsedTime = 0;
  lapCount = 0;

  startBtn.disabled = false;
  pauseBtn.disabled = true;
  lapBtn.disabled = true;

  lapList.innerHTML =
    '<li class="empty">Your laps will appear here.</li>';

  updateDisplay();
}

function recordLap() {
  if (!running) return;

  const currentTime = elapsedTime + performance.now() - startTime;
  const time = formatTime(currentTime);

  lapCount++;

  const lap = document.createElement("li");

  const label = document.createElement("span");
  label.textContent = `Lap ${lapCount}`;

  const value = document.createElement("strong");
  value.textContent =
    `${time.minutes}:${time.seconds}.${time.milliseconds}`;

  lap.append(label, value);

  if (lapCount === 1) lapList.innerHTML = "";

  lapList.prepend(lap);
}

startBtn.addEventListener("click", startStopwatch);
pauseBtn.addEventListener("click", pauseStopwatch);
resetBtn.addEventListener("click", resetStopwatch);
lapBtn.addEventListener("click", recordLap);

updateDisplay();