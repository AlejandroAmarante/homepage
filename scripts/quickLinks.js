async function loadDefaultQuickLinks() {
  try {
    const response = await fetch("./data/defualtQuickLinks.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.quickLinks;
  } catch (error) {
    console.error("Error loading default quick links:", error);
    return [];
  }
}

function createQuickLinks(quickLinksData) {
  const quickLinksContainer = document.getElementById("quick-links");
  quickLinksContainer.innerHTML = ""; // Clear current quick links
  quickLinksData.forEach((category) => {
    const containerDiv = document.createElement("div");
    containerDiv.classList.add("quick-link-container");
    containerDiv.id = category.title.replace(/\s+/g, "-").toLowerCase();

    const titleElement = document.createElement("h2");
    titleElement.classList.add("quick-link-title");
    titleElement.textContent = category.title;
    containerDiv.appendChild(titleElement);

    category.links.forEach((link) => {
      const linkElement = document.createElement("a");
      linkElement.href = link.url;
      linkElement.classList.add("quick-link");
      linkElement.textContent = link.text;
      containerDiv.appendChild(linkElement);
    });

    quickLinksContainer.appendChild(containerDiv);
  });
}

async function initializeQuickLinks() {
  const quickLinksTextarea = document.getElementById("quick-links-textarea");
  const savedQuickLinks = localStorage.getItem("quickLinks");

  // Load default quick links from JSON file
  const defaultQuickLinks = await loadDefaultQuickLinks();

  if (savedQuickLinks) {
    quickLinksTextarea.value = savedQuickLinks;
  } else {
    quickLinksTextarea.value = JSON.stringify(defaultQuickLinks, null, 2);
  }

  let quickLinksData;
  try {
    quickLinksData = savedQuickLinks
      ? JSON.parse(savedQuickLinks)
      : defaultQuickLinks;
    createQuickLinks(quickLinksData);
  } catch (error) {
    console.error("Error parsing quick links JSON:", error);
  }

  quickLinksTextarea.addEventListener("input", () => {
    try {
      quickLinksData = JSON.parse(quickLinksTextarea.value);
      createQuickLinks(quickLinksData);
      localStorage.setItem("quickLinks", quickLinksTextarea.value);
    } catch (error) {
      console.error("Error parsing quick links JSON:", error);
    }
  });

  let resetQuickLinks = document.getElementById("reset-quick-links");
  resetQuickLinks.addEventListener("click", async () => {
    const defaultLinks = await loadDefaultQuickLinks();
    quickLinksTextarea.value = JSON.stringify(defaultLinks, null, 2);
    createQuickLinks(defaultLinks);
    localStorage.removeItem("quickLinks");
  });
}

// Initialize when the DOM is loaded
document.addEventListener("DOMContentLoaded", initializeQuickLinks);
