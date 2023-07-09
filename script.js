window.addEventListener("DOMContentLoaded", () => {
  console.log("Page is fully loaded");
  const defaultSearchEngine = "google";
  setSearchEngineLogo(defaultSearchEngine);
});

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
  }
  else {
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
      } else {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
          searchString
        )}`;
      }
    }
  }
});
