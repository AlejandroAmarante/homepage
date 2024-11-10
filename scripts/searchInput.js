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

// Cache DOM elements and frequently used values
const elements = {
  logo: null,
  searchInput: null,
  searchEnginesTextarea: null,
  quickLinksTextarea: null,
};

let currentSearchEngine = null;
let searchEngineMap = new Map();

// Initialize the search engine map for O(1) lookup
function initializeSearchEngineMap(engines) {
  searchEngineMap.clear();
  engines.forEach((engine) => {
    searchEngineMap.set(engine.alias, engine);
    if (engine.isDefault) {
      currentSearchEngine = engine.searchEngine;
      console.log("Current Search Engine:", currentSearchEngine);
    }
  });
}

function setSearchEngineLogo(searchEngine) {
  if (!elements.logo) return;

  if (searchEngine !== currentSearchEngine) {
    const logoSrc = `./imgs/${searchEngine}-icon.svg`;
    elements.logo.style.opacity = "0";

    const handleTransitionEnd = () => {
      elements.logo.src = logoSrc;
      elements.logo.onload = () => (elements.logo.style.opacity = "1");
    };

    elements.logo.addEventListener("transitionend", handleTransitionEnd, {
      once: true,
    });
    currentSearchEngine = searchEngine;
  } else {
    elements.logo.src = `./imgs/${currentSearchEngine}-icon.svg`;
  }
}

function filterQuickLinks(searchString) {
  const quickLinks = JSON.parse(localStorage.getItem("quickLinks")) || [];
  if (!searchString) {
    document.querySelectorAll(".quick-link").forEach((element) => {
      element.style.opacity = "1";
    });
    return quickLinks;
  }

  const normalizedSearch = searchString.toLowerCase();
  const quickLinkElements = document.querySelectorAll(".quick-link");

  quickLinkElements.forEach((element) => {
    element.style.opacity = element.textContent
      .toLowerCase()
      .includes(normalizedSearch)
      ? "1"
      : "0.3";
  });

  return Array.from(quickLinkElements)
    .filter((element) =>
      element.textContent.toLowerCase().includes(normalizedSearch)
    )
    .map((element) => element.href);
}

function handleSearch(searchString, isAltKey = false) {
  if (!searchString) return;

  if (isAltKey) {
    const matchingLinks = filterQuickLinks(searchString);
    if (matchingLinks.length > 0) {
      window.location.href = matchingLinks[0];
      return;
    }
  }

  const firstWord = searchString.split(" ")[0];
  const searchEngine = searchEngineMap.get(firstWord);

  if (searchEngine) {
    const query = searchString.substring(firstWord.length).trim();
    window.location.href = `${searchEngine.searchLink}${encodeURIComponent(
      query
    )}`;
  } else {
    const defaultEngine = Array.from(searchEngineMap.values()).find(
      (engine) => engine.isDefault
    );
    window.location.href = `${defaultEngine.searchLink}${encodeURIComponent(
      searchString
    )}`;
  }
}

function saveSearchEngines(engineText) {
  try {
    const updatedEngines = JSON.parse(engineText);
    localStorage.setItem(
      "savedSearchEngines",
      JSON.stringify(updatedEngines, null, 2)
    );
    initializeSearchEngineMap(updatedEngines);
    elements.searchEnginesTextarea.style.backgroundColor = "#353535";
    setSearchEngineLogo(currentSearchEngine);
    return true;
  } catch (error) {
    console.error("Invalid JSON in textarea:", error);
    elements.searchEnginesTextarea.style.backgroundColor = "#4f0000";
    return false;
  }
}

function initializeSearchEngineHandler() {
  // Cache DOM elements
  elements.logo = document.getElementById("logo");
  elements.searchInput = document.getElementById("searchInput");
  elements.searchEnginesTextarea = document.getElementById(
    "search-engines-textarea"
  );

  // Initialize search engines
  const savedEngines = localStorage.getItem("savedSearchEngines");
  const initialEngines = savedEngines
    ? JSON.parse(savedEngines)
    : defaultSearchEngines;

  if (!savedEngines) {
    localStorage.setItem(
      "savedSearchEngines",
      JSON.stringify(defaultSearchEngines, null, 2)
    );
  }

  elements.searchEnginesTextarea.value = JSON.stringify(
    initialEngines,
    null,
    2
  );
  initializeSearchEngineMap(initialEngines);
  setSearchEngineLogo(currentSearchEngine);

  // Event Listeners
  const debouncedSave = debounce((text) => saveSearchEngines(text), 1000);

  elements.searchEnginesTextarea.addEventListener("input", (e) => {
    debouncedSave(e.target.value);
  });

  elements.searchInput.addEventListener("input", (e) => {
    const defaultEngine = Array.from(searchEngineMap.values()).find(
      (engine) => engine.isDefault
    );
    const searchString = e.target.value.trim();
    const firstWord = searchString.split(" ")[0];
    const searchEngine =
      searchEngineMap.get(firstWord)?.searchEngine ||
      defaultEngine.searchEngine;
    setSearchEngineLogo(searchEngine);
    filterQuickLinks(searchString);
  });

  elements.searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const searchString = e.target.value.trim().toLowerCase();
      handleSearch(searchString, e.altKey);
    }
  });

  document
    .getElementById("reset-search-engines")
    .addEventListener("click", () => {
      elements.searchEnginesTextarea.value = JSON.stringify(
        defaultSearchEngines,
        null,
        2
      );
      localStorage.removeItem("savedSearchEngines");
      initializeSearchEngineMap(defaultSearchEngines);
      setSearchEngineLogo(currentSearchEngine);
    });
}

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
