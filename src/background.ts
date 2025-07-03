// src/background.ts
chrome.runtime.onMessage.addListener(
  (
    request: { action: string; url?: string; active?: boolean },
    sender,
    sendResponse
  ) => {
    if (request.action === "openNewTab" && request.url) {
      chrome.tabs.create({ url: request.url, active: request.active });
    }
  }
);
