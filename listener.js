/**
 * Determine url is target page.
 * @param {string} url pageUrl
 * @returns {boolean}
 */
const isTargetPage = (url) => {
  const matched = new URL(url).pathname.match(/\/pull\/\d+/);
  return matched !== null && matched.length > 0;
};

const inject = (tabId) => {
  chrome.scripting
    .executeScript({
      target: { tabId },
      files: ["inject.js"],
    })
    .then(() => {
      console.log("Injected");
    });
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    const url = tab.url;
    if (typeof url === "string" && isTargetPage(url)) {
      inject(tab.id);
    }
  }
});
