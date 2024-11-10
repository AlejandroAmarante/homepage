function openModal(desiredWidth) {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  modal.style.display = "flex";
  modalContent.style.width = desiredWidth;
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";

  document.getElementById("openweather-modal-content").style.display = "none";
  document.getElementById("settings-modal-content").style.display = "none";
}

function initializeWeatherModalHandler() {
  document.getElementById("location-weather").addEventListener("click", () => {
    openModal("25%");
    document.getElementById("openweather-modal-content").style.display = "flex";
  });
}

function initializeSettingsModalHandler() {
  document.getElementById("settings").addEventListener("click", () => {
    openModal("60%");
    document.getElementById("settings-modal-content").style.display = "flex";
  });
}

window.addEventListener("click", (event) => {
  const modal = document.getElementById("modal");
  if (event.target == modal) {
    closeModal();
  }
});
