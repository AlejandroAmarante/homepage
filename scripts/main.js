window.addEventListener("DOMContentLoaded", () => {
  console.log("Page is fully loaded");

  const today = new Date();
  document.getElementById("date").textContent = formatDate(today);

  updateClock();
  initializeWeather();
  initializeQuickLinks();

  // Additional Event Listeners
  initializeSearchEngineHandler();
  initializeWeatherModalHandler();
  initializeSettingsModalHandler();
});
