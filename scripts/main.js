// main.js
function importScript(path) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = path;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${path}`));
    document.body.appendChild(script);
  });
}

// Wait for DOM to be ready first
document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("Loading scripts...");

    // Import all scripts
    await importScript("./scripts/dateTime.js");
    await importScript("./scripts/locationWeather.js");
    await importScript("./scripts/quickLinks.js");
    await importScript("./scripts/modal.js");
    await importScript("./scripts/searchInput.js");

    // Once all scripts are loaded, initialize everything
    console.log("All scripts loaded, initializing...");

    const today = new Date();
    document.getElementById("date").textContent = formatDate(today);
    updateClock();
    initializeWeather();
    initializeQuickLinks();
    initializeSearchEngineHandler();
    initializeWeatherModalHandler();
    initializeSettingsModalHandler();

    console.log("Initialization complete");
  } catch (error) {
    console.error("Error loading scripts:", error);
  }
});
