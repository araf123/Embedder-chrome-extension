document.getElementById("injectScript").addEventListener("click", () => {
  chrome.storage.local.set({ embedderEnabled: true }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      const tabId = tabs[0].id;

      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["content.js"]
      }).then(() => {
        console.log("✅ Embedder enabled on current site.");
      }).catch((error) => {
        console.error("❌ Failed to inject script:", error);
      });
    });
  });
});

document.getElementById("removeScript").addEventListener("click", () => {
  chrome.storage.local.set({ embedderEnabled: false }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      const tabId = tabs[0].id;

      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: () => {
          console.log("❌ Removing all embed-related elements...");

          // Remove custom embed-related elements
          const selectors = [
            'iframe[style*="z-index: 9999"]',
            '.brightness-slider',
            'button[style*="background: red"]',
            'div[style*="rgba(0, 0, 0"]'
          ];

          selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
          });

          // Restore button container to ensure re-enable works without refresh
          let buttonContainer = document.getElementById("embedButtons");
          if (!buttonContainer) {
            buttonContainer = document.createElement("div");
            buttonContainer.id = "embedButtons";
            document.body.appendChild(buttonContainer);
          }

          console.log("✅ Embedder fully disabled.");
        }
      }).catch((error) => {
        console.error("❌ Failed to disable embedder:", error);
      });
    });
  });
});
