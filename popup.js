const toggle = document.getElementById('alertToggle');
const copyBtn = document.getElementById('copyBtn');

// Load setting
chrome.storage.sync.get(['showAlert'], (result) => {
  toggle.checked = result.showAlert !== false; // default to true
});

// Save setting
toggle.addEventListener('change', () => {
  chrome.storage.sync.set({ showAlert: toggle.checked });
});

// Shorten and copy on button click
copyBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.url) return;

    const apiURL = 'https://tinyurl.com/api-create.php?url=' + encodeURIComponent(tab.url);

    fetch(apiURL)
      .then(response => response.text())
      .then(shortUrl => {
        navigator.clipboard.writeText(shortUrl)
          .then(() => {
            chrome.storage.sync.get(['showAlert'], (result) => {
              if (result.showAlert !== false) {
                alert(`✅ Short URL copied:\n${shortUrl}`);
              }
            });
          })
          .catch(() => {
            alert('❌ Failed to copy URL.');
          });
      })
      .catch(() => {
        alert('❌ Failed to shorten the URL.');
      });
  });
});
