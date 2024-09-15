function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function updateClock() {
  const timeElement = document.getElementById("time");
  let lastTimeUpdate = 0;
  function update() {
    const now = new Date();
    const currentTime = now.getSeconds();
    if (currentTime !== lastTimeUpdate) {
      lastTimeUpdate = currentTime;
      timeElement.textContent = formatTime(now);
    }
    requestAnimationFrame(update);
  }
  update();
}
