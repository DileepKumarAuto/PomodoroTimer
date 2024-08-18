let workTime = 25 * 60; // 25 minutes default
let breakTime = 5 * 60; // 5 minutes default
let timeLeft = workTime;
let timerInterval;
let isRunning = false;
let isWorkSession = true;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            notifyUser();
            switchSession();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = isWorkSession ? workTime : breakTime;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function switchSession() {
    isWorkSession = !isWorkSession;
    timeLeft = isWorkSession ? workTime : breakTime;
    startTimer();
}

function notifyUser() {
    if (Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
            body: isWorkSession ? 'Break time! 🎉' : 'Back to work! 💼',
        });
    } else {
        alert(isWorkSession ? 'Break time! 🎉' : 'Back to work! 💼');
    }
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

workTimeInput.addEventListener('input', () => {
    workTime = workTimeInput.value * 60;
    if (isWorkSession) {
        timeLeft = workTime;
        updateTimerDisplay();
    }
});

breakTimeInput.addEventListener('input', () => {
    breakTime = breakTimeInput.value * 60;
    if (!isWorkSession) {
        timeLeft = breakTime;
        updateTimerDisplay();
    }
});

// Request notification permission on page load
if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}
