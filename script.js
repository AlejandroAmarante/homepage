window.addEventListener("DOMContentLoaded", () => {
  console.log("Page is fully loaded");
  const defaultSearchEngine = "google";
  setSearchEngineLogo(defaultSearchEngine);

  const currentDateElement = document.getElementById("date");
  const today = new Date();
  currentDateElement.textContent = formatDate(today);

  // Optional: Update the time every second
  setInterval(function () {
    const timeElement = document.getElementById("time");
    const now = new Date();
    timeElement.textContent = formatTime(now);
  }, 1000);

  getLocationAndWeather();
});

// JavaScript to set the date
function formatDate(date) {
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

function formatTime(date) {
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  return date.toLocaleTimeString("en-US", timeOptions);
}

// Function to get location and weather
function getLocationAndWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Geolocation success"); // Confirm the geolocation is working
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Call OpenWeather API to get weather data
        const apiKey = localStorage.getItem("apiKey"); // Replace with your OpenWeather API key
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            // Display location and weather information
            const locationElement = document.getElementById("location");
            const weatherElement = document.getElementById("weather");

            const city = data.name;
            const temp = data.main.temp;
            const description = data.weather[0].description;

            locationElement.textContent = `${city}`;
            weatherElement.textContent = `${temp}°C, ${description}`;
          })
          .catch((error) =>
            console.error("Error fetching weather data:", error)
          );
      },
      (error) => {
        // Log error messages for geolocation issues
        console.error("Geolocation error:", error.message);
        document.getElementById("location").textContent =
          "Location not available";
        document.getElementById("weather").textContent =
          "Weather not available";
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

const searchInput = document.getElementById("searchInput");
const logo = document.getElementById("logo");
let currentSearchEngine = "google"; // Track the current search engine

function setSearchEngineLogo(searchEngine) {
  if (searchEngine !== currentSearchEngine && logo.src != null) {
    const logoSrc = getLogoSrc(searchEngine);

    // Reduce the opacity of the logo to 0
    logo.style.opacity = "0";

    // When the transition ends, change the source and increase the opacity
    logo.addEventListener("transitionend", function handleTransitionEnd() {
      logo.removeEventListener("transitionend", handleTransitionEnd);

      // Change the source of the logo image
      logo.src = logoSrc;

      // When the image has loaded, increase the opacity
      logo.onload = () => {
        logo.style.opacity = "1";
        logo.classList.add("show");
        logo.style.transition = "";
      };

      currentSearchEngine = searchEngine; // Update the current search engine
    });
  } else {
    const logoSrc = getLogoSrc(searchEngine);
    logo.src = logoSrc;
  }
}

function getLogoSrc(searchEngine) {
  switch (searchEngine) {
    case "duckduckgo":
      return "./imgs/duckduckgo-icon.svg";
    case "bing":
      return "./imgs/bing-icon.svg";
    case "google":
    default:
      return "./imgs/google-icon.svg";
  }
}

searchInput.addEventListener("input", function () {
  const searchString = searchInput.value.trim();
  let searchEngine = "google"; // Default search engine

  if (searchString.startsWith(":ddg")) {
    searchEngine = "duckduckgo";
  } else if (searchString.startsWith(":b")) {
    searchEngine = "bing";
  } else if (searchString.startsWith(":g")) {
    searchEngine = "google";
  }

  setSearchEngineLogo(searchEngine);
});

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const searchString = searchInput.value.trim();
    const searchEngineModifiers = [":ddg", ":b", ":g"];

    if (
      searchString.length > 0 &&
      !searchEngineModifiers.includes(searchString)
    ) {
      let query = searchString;

      if (searchString.startsWith(":ddg")) {
        query = searchString.split(" ").slice(1).join(" ");
        window.location.href = `https://duckduckgo.com/?q=${encodeURIComponent(
          query
        )}`;
      } else if (searchString.startsWith(":b")) {
        query = searchString.split(" ").slice(1).join(" ");
        window.location.href = `https://www.bing.com/search?q=${encodeURIComponent(
          query
        )}`;
      } else if (searchString.startsWith(":g")) {
        query = searchString.split(" ").slice(1).join(" ");
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
          query
        )}`;
      } else if (searchString.startsWith(":sp")) {
        window.location.href = `https://www.startpage.com/do/search?query=${encodeURIComponent(
          searchString
        )}`;
      } else {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
          searchString
        )}`;
      }
    }
  }
});

let locationWeatherElement = document.getElementById("location-weather");
let modal = document.getElementById("modal");
let modalContent = document.getElementById("modal-content");
locationWeatherElement.addEventListener("click", function () {
  // Show the modal
  modal.style.display = "flex";

  // Optionally populate modal content
  modalTitle.textContent = "Location and Weather Details";
  modalText.textContent =
    "Here's more detailed information about your location and weather.";
});

let apiKeyInput = document.getElementById("api-key");
apiKeyInput.addEventListener("input", function () {
  // Save the API key to local storage
  localStorage.setItem("apiKey", apiKeyInput.value);
});

// Get the API key from local storage
let apiKey = localStorage.getItem("apiKey");
if (apiKey) {
  apiKeyInput.value = apiKey;
}

// Add event to close the modal when clicking outside the modal content
window.addEventListener("click", function (event) {
  if (event.target == modal) {
    modal.style.display = "none"; // Close the modal
  }
});
