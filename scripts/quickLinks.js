const defaultQuickLinks = [
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
        text: "claude",
        url: "https://claude.ai",
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

function initializeQuickLinks() {
  const savedQuickLinks = localStorage.getItem("quickLinks");
  const quickLinksTextarea = document.getElementById("quick-links-textarea");

  if (savedQuickLinks) {
    quickLinksTextarea.value = savedQuickLinks;
  } else {
    quickLinksTextarea.value = JSON.stringify(defaultQuickLinks, null, 2);
  }

  let quickLinksData;
  try {
    quickLinksData = defaultQuickLinks;
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
  resetQuickLinks.addEventListener("click", () => {
    quickLinksTextarea.value = JSON.stringify(defaultQuickLinks, null, 2);
    localStorage.removeItem("quickLinks");
  });
}
