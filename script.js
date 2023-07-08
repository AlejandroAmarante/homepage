window.addEventListener("DOMContentLoaded", () => {
  console.log("Page is fully loaded");
});

const searchInput = document.getElementById("searchInput");
const logo = document.getElementById("logo");
let currentSearchEngine = "google"; // Track the current search engine

function setSearchEngineLogo(searchEngine) {
  if (searchEngine !== currentSearchEngine) {
    let logoSrc = "";
    switch (searchEngine) {
      case "duckduckgo":
        logoSrc = "./imgs/duckduckgo-icon.svg";
        break;
      case "bing":
        logoSrc = "./imgs/bing-icon.svg";
        break;
      case "google":
      default:
        logoSrc = "./imgs/google-icon.svg";
        break;
    }

    // Scale down the logo before changing the source
    logo.style.transform = "scale(0)";

    // Wait for the scaling animation to complete before changing the source
    setTimeout(() => {
      logo.src = logoSrc;
      logo.classList.add("show");

      // Scale up the logo after changing the source
      setTimeout(() => {
        logo.style.transform = "scale(1)";
      }, 0);

      currentSearchEngine = searchEngine; // Update the current search engine
    }, 300);
  }
}

function resetLogoAnimation() {
  logo.classList.remove("show");
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

    // Check if the search string is not empty and not just a search engine modifier
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
      } else {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
          searchString
        )}`;
      }
      // Add more search engine modifiers and corresponding URLs as needed
    }
  }
});
