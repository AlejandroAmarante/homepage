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
            const {
              name: city,
              main: { temp },
              weather,
            } = data;
            document.getElementById("location").textContent = city;
            document.getElementById(
              "weather"
            ).textContent = `${temp}°C, ${weather[0].description}`;
          })
          .catch((error) =>
            console.error("Error fetching weather data:", error)
          );
      },
      (error) => {
        console.error("Geolocation error:", error.message);
        document.getElementById("location").textContent = "OpenWeather API";
        document.getElementById("weather").textContent = "Error";
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

function initializeWeather() {
  const apiKeyInput = document.getElementById("api-key");
  if (localStorage.getItem("apiKey")) {
    apiKeyInput.value = localStorage.getItem("apiKey");
  }
  apiKeyInput.addEventListener("input", () => {
    localStorage.setItem("apiKey", apiKeyInput.value);
    if (apiKeyInput.value) {
      getLocationAndWeather();
    }
  });
  getLocationAndWeather();
}
