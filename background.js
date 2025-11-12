// background.js
chrome.runtime.onInstalled.addListener(function() {
  // Set default options
  chrome.storage.sync.set({
    enableDOMPurify: true,
    rules: [
      { urlPattern: 'http(s)?://.*', selector: 'body' }
    ],
    customCSS: ''
  }, function() {
    console.log('Default options set');
  });
});

// Listen for extension icon click to open popup
chrome.action.onClicked.addListener(function(tab) {
  // The popup is specified in manifest.json, so this is just to log
  console.log('Extension icon clicked for tab:', tab.url);
});

// Add context menu item for convenience
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: 'convert-html-to-markdown',
    title: 'Convert HTML to Markdown',
    contexts: ['page', 'selection']
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === 'convert-html-to-markdown') {
    // Open the popup by focusing the tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.action.openPopup();
    });
  }
});