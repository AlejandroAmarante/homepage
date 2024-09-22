const defaultSearchEngines = [
  {
    searchEngine: "startpage",
    alias: ":sp",
    searchLink: "https://startpage.com/do/search?query=",
    searchIcon: "./imgs/startpage-icon.svg",
    isDefault: true,
  },
  {
    searchEngine: "duckduckgo",
    alias: ":ddg",
    searchLink: "https://duckduckgo.com/?q=",
    searchIcon: "./imgs/duckduckgo-icon.svg",
    isDefault: false,
  },
  {
    searchEngine: "bing",
    alias: ":b",
    searchLink: "https://bing.com/search?q=",
    searchIcon: "./imgs/bing-icon.svg",
    isDefault: false,
  },
  {
    searchEngine: "google",
    alias: ":g",
    searchLink: "https://www.google.com/search?q=",
    searchIcon: "./imgs/google-icon.svg",
    isDefault: false,
  },
];

let currentSearchEngine;

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

  // Fetch saved search engines or use the default
  let savedSearchEngines = localStorage.getItem("savedSearchEngines");
  if (savedSearchEngines) {
    searchEnginesTextarea.value = savedSearchEngines;
  } else {
    searchEnginesTextarea.value = JSON.stringify(defaultSearchEngines, null, 2);
    localStorage.setItem(
      "savedSearchEngines",
      JSON.stringify(defaultSearchEngines, null, 2)
    );
  }

  // // Set the current default search engine
  currentSearchEngine = JSON.parse(
    localStorage.getItem("savedSearchEngines")
  ).filter((engine) => engine.isDefault)[0].searchEngine;

  // Update localStorage when textarea is edited
  searchEnginesTextarea.addEventListener("input", () => {
    setTimeout(() => {
      try {
        const updatedEngines = JSON.parse(searchEnginesTextarea.value);
        localStorage.setItem(
          "savedSearchEngines",
          JSON.stringify(updatedEngines, null, 2)
        );
      } catch (error) {
        console.error("Invalid JSON in textarea:", error);
      }

      currentSearchEngine = JSON.parse(
        localStorage.getItem("savedSearchEngines")
      ).filter((engine) => engine.isDefault)[0].searchEngine;
      setSearchEngineLogo(currentSearchEngine);
    }, 1000);
  });

  console.log("Saved Search Engines", savedSearchEngines);
  console.log("Current Search Engine", currentSearchEngine);

  setSearchEngineLogo(currentSearchEngine);

  let resetSearchEngines = document.getElementById("reset-search-engines");
  resetSearchEngines.addEventListener("click", () => {
    searchEnginesTextarea.value = JSON.stringify(defaultSearchEngines, null, 2);
    localStorage.removeItem("savedSearchEngines");
    currentSearchEngine = defaultSearchEngines.filter(
      (engine) => engine.isDefault
    )[0].searchEngine;
    setSearchEngineLogo(currentSearchEngine);
  });

  // searchInput.addEventListener("input", () => {
  //   const searchString = searchInput.value.trim();
  //   const searchEngine = searchString.startsWith(":ddg")
  //     ? "duckduckgo"
  //     : searchString.startsWith(":b")
  //     ? "bing"
  //     : searchString.startsWith(":g")
  //     ? "google"
  //     : "startpage";
  //   setSearchEngineLogo(searchEngine);
  // });

  // searchInput.addEventListener("keydown", (event) => {
  //   if (event.key === "Enter") {
  //     const searchString = searchInput.value.trim();
  //     if (searchString.length > 0) {
  //       let query = searchString;
  //       if (
  //         searchString.startsWith(":ddg") ||
  //         searchString.startsWith(":b") ||
  //         searchString.startsWith(":g")
  //       ) {
  //         query = searchString.split(" ").slice(1).join(" ");
  //       }
  //       const searchUrl = searchString.startsWith(":ddg")
  //         ? `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
  //         : searchString.startsWith(":b")
  //         ? `https://www.bing.com/search?q=${encodeURIComponent(query)}`
  //         : searchString.startsWith(":g")
  //         ? `https://www.google.com/search?q=${encodeURIComponent(query)}`
  //         : `https://www.startpage.com/do/search?query=${encodeURIComponent(
  //             searchString
  //           )}`;
  //       window.location.href = searchUrl;
  //     }
  //   }
  // });
}
