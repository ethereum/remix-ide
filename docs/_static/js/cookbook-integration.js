function initAskCookbook() {
  // Cookbook Onboard (AI Assistant). API key is public so it's fine to just hardcode it here.
  const PUBLIC_API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmE4MzQyZTg2NDM1ZGEyMGE1NDc5ODciLCJpYXQiOjE3MjIyOTk0MzgsImV4cCI6MjAzNzg3NTQzOH0.v-569WVNKHsQX2uDPyHJCOjXz811_iSlyitaKgqmg2U";
  let cookbookContainer = document.getElementById("__cookbook");
  if (!cookbookContainer) {
    cookbookContainer = document.createElement("div");
    cookbookContainer.id = "__cookbook";
    cookbookContainer.dataset.apiKey = PUBLIC_API_KEY;
    document.body.appendChild(cookbookContainer);
  }
  let cookbookScript = document.getElementById("__cookbook-script");
  if (!cookbookScript) {
    cookbookScript = document.createElement("script");
    cookbookScript.id = "__cookbook-script";
    cookbookScript.src =
      "https://cdn.jsdelivr.net/npm/@cookbookdev/docsbot/dist/standalone/index.cjs.js";
    cookbookScript.async = true;
    document.head.appendChild(cookbookScript);
  }
  const keyPressPropagationBlocker = function (e) {
    e.stopPropagation();
  };
  document.addEventListener("cookbook:modal:state:change", function (e) {
    const isOpen = e.detail.isOpen;
    if (isOpen) {
      document.body.addEventListener("keydown", keyPressPropagationBlocker, {
        capture: true,
      });
    } else {
      document.body.removeEventListener("keydown", keyPressPropagationBlocker, {
        capture: true,
      });
    }
  });
}

// Check if the document is already loaded and if so, initialize the script, otherwise wait for the load event
if (document.readyState === "complete") {
  initAskCookbook();
} else {
  window.addEventListener("load", initAskCookbook);
}
