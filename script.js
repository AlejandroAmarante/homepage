window.addEventListener("DOMContentLoaded", () => {
  console.log("Page is fully loaded");

  const defualtQuickLinks = [
    {
      title: "entertainment",
      links: [
        {
          text: "youtube",
          url: "https://www.youtube.com",
        },
        {
          text: "reddit",
          url: "https://www.reddit.com",
        },
      ],
    },
    {
      title: "utilities",
      links: [
        {
          text: "snapdrop",
          url: "https://snapdrop.net",
        },
        {
          text: "librespeed",
          url: "https://librespeed.org",
        },
        {
          text: "mega",
          url: "https://mega.io",
        },
      ],
    },
    {
      title: "productivity",
      links: [
        {
          text: "gmail",
          url: "https://www.gmail.com",
        },
        {
          text: "google drive",
          url: "https://drive.google.com/drive/u/0/home",
        },
        {
          text: "chatgpt",
          url: "https://chatgpt.com",
        },
        {
          text: "linkedin",
          url: "https://www.linkedin.com",
        },
        {
          text: "github",
          url: "https://www.github.com",
        },
      ],
    },
    {
      title: "game dev",
      links: [
        {
          text: "sketchfab",
          url: "https://sketchfab.com",
        },
        {
          text: "ambientCG",
          url: "https://ambientCG.com",
        },
      ],
    },
    {
      title: "web dev",
      links: [
        {
          text: "heropatterns",
          url: "https://heropatterns.com/",
        },
        {
          text: "remixicon",
          url: "https://remixicon.com",
        },
      ],
    },
  ];

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

  const savedQuickLinks = localStorage.getItem("quickLinks");
  const quickLinksTextarea = document.getElementById("quick-links-textarea");
  if (savedQuickLinks) {
    quickLinksTextarea.value = savedQuickLinks;
  } else if (savedQuickLinks === null) {
    quickLinksTextarea.value = JSON.stringify(defualtQuickLinks, null, 2);
  }

  document.querySelectorAll(".modal-textarea").forEach((textarea) => {
    textarea.value = prettyPrint(textarea.value);
  });

  // Function to create quick links from JSON data
  function createQuickLinks(quickLinksData) {
    const quickLinksContainer = document.getElementById("quick-links");
    quickLinksContainer.innerHTML = ""; // Clear current quick links

    quickLinksData.forEach((category) => {
      // Create a div for the category
      const containerDiv = document.createElement("div");
      containerDiv.classList.add("quick-link-container");

      const id = category.title.replace(/\s+/g, "-").toLowerCase();
      containerDiv.id = id;

      // Create a title for the category
      const titleElement = document.createElement("h2");
      titleElement.classList.add("quick-link-title");
      titleElement.textContent = category.title;

      // Append title to the category div
      containerDiv.appendChild(titleElement);

      // Loop through each link in the category and create an anchor element
      category.links.forEach((link) => {
        const linkElement = document.createElement("a");
        linkElement.href = link.url;
        linkElement.classList.add("quick-link");
        linkElement.textContent = link.text;

        // Append each link to the container div
        containerDiv.appendChild(linkElement);
      });

      // Append the entire category div to the quick links container
      quickLinksContainer.appendChild(containerDiv);
    });
  }

  // Load the quick links from the textarea on page load
  let quickLinksData;
  try {
    quickLinksData = JSON.parse(quickLinksTextarea.value);
    createQuickLinks(quickLinksData);
  } catch (error) {
    console.error("Error parsing quick links JSON:", error);
  }

  // Update quick links when textarea content changes
  quickLinksTextarea.addEventListener("input", () => {
    try {
      quickLinksData = JSON.parse(quickLinksTextarea.value);
      createQuickLinks(quickLinksData);
    } catch (error) {
      console.error("Error parsing quick links JSON:", error);
    }
  });
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
        document.getElementById("weather").textContent = "Error";
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
      let query = searchString;
      if (
        searchString.startsWith(":ddg") ||
        searchString.startsWith(":b") ||
        searchString.startsWith(":g")
      ) {
        query = searchString.split(" ").slice(1).join(" ");
      }

      const searchUrl = searchString.startsWith(":ddg")
        ? `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
        : searchString.startsWith(":b")
        ? `https://www.bing.com/search?q=${encodeURIComponent(query)}`
        : searchString.startsWith(":g")
        ? `https://www.google.com/search?q=${encodeURIComponent(query)}`
        : `https://www.startpage.com/do/search?query=${encodeURIComponent(
            searchString
          )}`;

      window.location.href = searchUrl;
    }
  }
});

document.getElementById("location-weather").addEventListener("click", () => {
  openModal();

  const openweatherModalContent = document.getElementById(
    "openweather-modal-content"
  );
  openweatherModalContent.style.display = "block";
});

const apiKeyInput = document.getElementById("api-key");
apiKeyInput.addEventListener("input", () => {
  localStorage.setItem("apiKey", apiKeyInput.value);
  if (apiKeyInput.value) {
    getLocationAndWeather();
  }
});

document.getElementById("settings").addEventListener("click", () => {
  openModal();
  const settingsModalContent = document.getElementById(
    "settings-modal-content"
  );
  settingsModalContent.style.display = "block";
});

document.querySelectorAll(".modal-textarea").forEach((textarea) => {
  textarea.addEventListener("input", () => {
    textarea.value = prettyPrint(textarea.value);
  });
});

const quickLinksTextarea = document.getElementById("quick-links-textarea");
quickLinksTextarea.addEventListener("input", () => {
  localStorage.setItem("quickLinks", quickLinksTextarea.value);
});

window.addEventListener("click", (event) => {
  if (event.target == modal) {
    closeModal();
  }
});

function openModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";

  const openweatherModalContent = document.getElementById(
    "openweather-modal-content"
  );
  openweatherModalContent.style.display = "none";
  const settingsModalContent = document.getElementById(
    "settings-modal-content"
  );
  settingsModalContent.style.display = "none";
}

function prettyPrint(input) {
  var obj = JSON.parse(input);
  var pretty = JSON.stringify(obj, undefined, 4);
  return pretty;
}
