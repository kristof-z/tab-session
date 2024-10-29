const sessionStartTime = Date.now();
const tabTimers = {};

chrome.tabs.onCreated.addListener((tab) => {
  tabTimers[tab.id] = Date.now();
});

chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabTimers[tabId];
});

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === "GET_TIMERS") {
    const now = Date.now();
    const sessionDuration = Math.floor((now - sessionStartTime) / 1000);
    const tabDurations = {};

    for (const [tabId, startTime] of Object.entries(tabTimers)) {
      tabDurations[tabId] = Math.floor((now - startTime) / 1000);
    }

    sendResponse({ sessionDuration, tabDurations });
  }
});
