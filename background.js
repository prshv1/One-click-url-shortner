chrome.action.onClicked.addListener((tab) => {
  if (!tab.url) return;

  const apiURL = 'https://tinyurl.com/api-create.php?url=' + encodeURIComponent(tab.url);

  fetch(apiURL)
    .then(response => response.text())
    .then(shortUrl => {
      chrome.storage.sync.get(['showAlert'], (result) => {
        const showAlert = result.showAlert !== false; // default true

        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (url, shouldAlert) => {
            navigator.clipboard.writeText(url)
              .then(() => {
                if (shouldAlert) alert(`✅ Short URL copied to clipboard:\n${url}`);
              })
              .catch(() => {
                if (shouldAlert) alert('❌ Failed to copy to clipboard.');
              });
          },
          args: [shortUrl, showAlert]
        });
      });
    })
    .catch(() => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => alert('❌ Failed to shorten the URL.')
      });
    });
});
