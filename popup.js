function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

function updateBrowserTime(sessionDuration) {
  const browserTimeElement = document.getElementById("browser-time");
  if (browserTimeElement) {
    browserTimeElement.textContent = formatTime(sessionDuration);
  } else {
    console.error("Browser time element not found.");
  }
}

function updateTabTimers(tabDurations, currentTabId, currentTabTitle) {
  const tabNameElement = document.getElementById("tab-name");
  const tabTimeSpan = document.getElementById("tab-time");

  if (tabNameElement && tabTimeSpan) {
    if (tabDurations[currentTabId] !== undefined) {
      tabNameElement.textContent = currentTabTitle;
      tabTimeSpan.textContent = formatTime(tabDurations[currentTabId]);
    } else {
      tabNameElement.textContent = 'No timer available';
      tabTimeSpan.textContent = '0:00';
    }
  } else {
    console.error("Tab timer elements not found.");
  }
}

function updateTimers() {
  chrome.runtime.sendMessage({ type: "GET_TIMERS" }, (response) => {
    if (response) {
      updateBrowserTime(response.sessionDuration);

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const currentTab = tabs[0];
          updateTabTimers(response.tabDurations, currentTab.id, currentTab.title);
        }
      });
    } else {
      console.error("Failed to get timers from background script.");
    }
  });
}

setInterval(updateTimers, 1000);
