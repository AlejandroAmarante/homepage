window.addEventListener("DOMContentLoaded", () => {
  console.log("Page is fully loaded");

  const defaultSearchEngine = "startpage";
  setSearchEngineLogo(defaultSearchEngine);

  const currentDateElement = document.getElementById("date");
  const timeElement = document.getElementById("time");
  const today = new Date();
  currentDateElement.textContent = formatDate(today);

  // Optional: Update the time every second
  let lastTimeUpdate = 0;
  function updateClock() {
    const now = new Date();
    const currentTime = now.getSeconds();
    if (currentTime !== lastTimeUpdate) {
      lastTimeUpdate = currentTime;
      timeElement.textContent = formatTime(now);
    }
    requestAnimationFrame(updateClock);
  }
  updateClock();

  const apiKey = localStorage.getItem("apiKey");
  if (apiKey) {
    const apiKeyInput = document.getElementById("api-key");
    apiKeyInput.value = apiKey;
  }

  getLocationAndWeather();
});

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

// Function to get location and weather
function getLocationAndWeather() {
  if (navigator.geolocation) {
    if (localStorage.getItem("apiKey")) {
      document.getElementById("weather").textContent = "Loading...";
    } else {
      document.getElementById("weather").textContent = "Inactive";
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const lat = coords.latitude;
        const lon = coords.longitude;

        const apiKey = localStorage.getItem("apiKey");
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            const locationElement = document.getElementById("location");
            const weatherElement = document.getElementById("weather");
            const {
              name: city,
              main: { temp },
              weather,
            } = data;

            locationElement.textContent = city;
            weatherElement.textContent = `${temp}°C, ${weather[0].description}`;
          })
          .catch((error) =>
            console.error("Error fetching weather data:", error)
          );
      },
      (error) => {
        console.error("Geolocation error:", error.message);
        document.getElementById("location").textContent = "OpenWeather API";
        document.getElementById("weather").textContent =
          "Error";
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

const searchInput = document.getElementById("searchInput");
const logo = document.getElementById("logo");
let currentSearchEngine = "startpage";

function setSearchEngineLogo(searchEngine) {
  if (searchEngine !== currentSearchEngine && logo.src != null) {
    const logoSrc = `./imgs/${searchEngine}-icon.svg`;

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
    const logoSrc = `./imgs/${searchEngine}-icon.svg`;
    logo.src = logoSrc;
  }
}

searchInput.addEventListener("input", () => {
  const searchString = searchInput.value.trim();
  const searchEngine = searchString.startsWith(":ddg")
    ? "duckduckgo"
    : searchString.startsWith(":b")
    ? "bing"
    : searchString.startsWith(":g")
    ? "google"
    : "startpage";

  setSearchEngineLogo(searchEngine);
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const searchString = searchInput.value.trim();
    if (searchString.length > 0) {
      let query = searchString.split(" ").slice(1).join(" ");
      const searchUrl = searchString.startsWith(":ddg")
        ? `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
        : searchString.startsWith(":b")
        ? `https://www.bing.com/search?q=${encodeURIComponent(query)}`
        : searchString.startsWith(":g")
        ? `https://www.google.com/search?q=${encodeURIComponent(query)}`
        : `https://www.startpage.com/do/search?query=${encodeURIComponent(
            query
          )}`;
      window.location.href = searchUrl;
    }
  }
});

document.getElementById("location-weather").addEventListener("click", () => {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalText = document.getElementById("modal-text");

  modal.style.display = "flex";
  modalTitle.textContent = "Location and Weather Details";
  modalText.textContent =
    "Here's more detailed information about your location and weather.";
});

const apiKeyInput = document.getElementById("api-key");
apiKeyInput.addEventListener("input", () => {
  localStorage.setItem("apiKey", apiKeyInput.value);
  if (apiKeyInput.value) {
    setTimeout(() => window.location.reload(), 1000);
  }
});

window.addEventListener("click", (event) => {
  const modal = document.getElementById("modal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
});
