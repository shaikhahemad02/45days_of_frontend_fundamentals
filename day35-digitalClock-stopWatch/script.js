// toggle between clock and stopwatch
const clock = document.querySelector(".clock");
const stopwatch = document.querySelector(".stopwatch");
const btnClock = document.querySelector(".btn-clock");
const btnStopwatch = document.querySelector(".btn-stopwatch");
btnClock.addEventListener("click", (e) => {
    clock.classList.add("active");
    stopwatch.classList.remove("active");
    e.target.classList.add("active");
    btnStopwatch.classList.remove("active");
});
btnStopwatch.addEventListener("click", (e) => {
    stopwatch.classList.add("active");
    clock.classList.remove("active");
    e.target.classList.add("active");
    btnClock.classList.remove("active");
});

// clock functionality
let is24hr = true;
const clockText = document.querySelector(".clockText");
function updateClock() {
    const now = new Date();
    if (is24hr) {
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    clockText.textContent = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    //clockText.textContent = now.toLocaleTimeString("en-US", { hour12: false });
} else {
   clockText.textContent = now.toLocaleTimeString("en-US", { hour12: true });
}
}
updateClock();
setInterval(updateClock, 1000);
// change clock format
const btn24hr = document.querySelector(".btn-24hr");
const btn12hr = document.querySelector(".btn-12hr");
btn24hr.addEventListener("click", () => {
    is24hr = true;
    btn24hr.classList.add("active");
    btn12hr.classList.remove("active");
});
btn12hr.addEventListener("click", () => {
    is24hr = false;
    btn12hr.classList.add("active");
    btn24hr.classList.remove("active");
});

// stopwatch functionality
const stopWatchText = document.querySelector(".stopWatchText");
const btnStart = document.querySelector(".btn-start");
const btnStop = document.querySelector(".btn-stop");
const btnReset = document.querySelector(".btn-reset");
const btnLap = document.querySelector(".btn-lap");
let stopwatchInterval;
let elapsedTime = 0;
function updateStopwatch() {
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;
    stopWatchText.textContent = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
function startStopwatch() {
    btnStart.disabled = true;
    btnStop.disabled = false;
    btnLap.disabled = false;
    btnReset.disabled = false;
    btnStart.classList.add("active");
    btnStop.classList.remove("active");
    stopwatchInterval = setInterval(() => {
        elapsedTime++;
        updateStopwatch();
    }, 1000);
}
function stopStopwatch() {
    clearInterval(stopwatchInterval);
    btnStart.disabled = false;
    btnStop.disabled = true;
    btnLap.disabled = true;
    btnReset.disabled = false;
    btnStart.classList.remove("active");
    btnStop.classList.remove("active");
}
btnStart.addEventListener("click", startStopwatch);
btnStop.addEventListener("click", stopStopwatch);
btnReset.addEventListener("click", () => {
    clearInterval(stopwatchInterval);
    elapsedTime = 0;
    updateStopwatch();
    btnStart.disabled = false;
    btnStop.disabled = true;
    btnLap.disabled = true;
    btnReset.disabled = true;
    btnStart.classList.remove("active");
    btnStop.classList.remove("active");
    const lapsCard = document.querySelector(".lapsCard");
    lapsCard.innerHTML = "";
});
btnLap.addEventListener("click", () => {
    const lapsCard = document.querySelector(".lapsCard");
    const lapTime = document.createElement("span");
    lapTime.className = "lap-time";
    lapTime.textContent = stopWatchText.textContent;
    lapsCard.appendChild(lapTime);
    saveLapsToLocalStorage(stopWatchText.textContent);
});
function saveLapsToLocalStorage(lapTime) {
    let laps = JSON.parse(localStorage.getItem("laps")) || [];
    laps.push({id: laps.length + 1, time: lapTime, date: new Date().toLocaleString()});
    localStorage.setItem("laps", JSON.stringify(laps));
}