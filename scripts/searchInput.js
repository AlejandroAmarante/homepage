let currentSearchEngine = "startpage";

const searchEngines = [
  {
    alias: ":sp",
    searchLink: "https://startpage.com/do/search?query=",
    searchIcon: "./imgs/startpage-icon.svg",
    isDefualt: true,
  },
  {
    alias: ":ddg",
    searchLink: "https://duckduckgo.com/?q=",
    searchIcon: "./imgs/duckduckgo-icon.svg",
  },
  {
    alias: ":b",
    searchLink: "https://bing.com/search?q=",
    searchIcon: "./imgs/bing-icon.svg",
  },
  {
    alias: ":g",
    searchLink: "https://www.google.com/search?q=",
    searchIcon: "./imgs/google-icon.svg",
  },
];

function setSearchEngineLogo(searchEngine) {
  const logo = document.getElementById("logo");
  if (searchEngine !== currentSearchEngine && logo.src != null) {
    const logoSrc = `./imgs/${searchEngine}-icon.svg`;
    logo.style.opacity = "0";
    logo.addEventListener("transitionend", function handleTransitionEnd() {
      logo.removeEventListener("transitionend", handleTransitionEnd);
      logo.src = logoSrc;
      logo.onload = () => {
        logo.style.opacity = "1";
      };
    });
    currentSearchEngine = searchEngine;
  } else {
    logo.src = `./imgs/${searchEngine}-icon.svg`;
  }
}

function initializeSearchEngineHandler() {
  const searchInput = document.getElementById("searchInput");
  const searchEnginesTextarea = document.getElementById(
    "search-engines-textarea"
  );

  if (localStorage.getItem("searchEngines")) {
    searchEnginesTextarea.value = localStorage.getItem("searchEngines");
  } else {
    searchEnginesTextarea.value = JSON.stringify(searchEngines, null, 2);
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
}
