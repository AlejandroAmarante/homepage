function openModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";

  document.getElementById("openweather-modal-content").style.display = "none";
  document.getElementById("settings-modal-content").style.display = "none";
}

function initializeWeatherModalHandler() {
  document.getElementById("location-weather").addEventListener("click", () => {
    openModal();
    document.getElementById("openweather-modal-content").style.display = "flex";
  });
}

function initializeSettingsModalHandler() {
  document.getElementById("settings").addEventListener("click", () => {
    openModal();
    document.getElementById("settings-modal-content").style.display = "block";
  });

  window.addEventListener("click", (event) => {
    const modal = document.getElementById("modal");
    if (event.target == modal) {
      closeModal();
    }
  });
}
