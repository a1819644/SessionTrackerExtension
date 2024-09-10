// When the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed");
  });
  
  // Function to store active tabs
  function storeActiveTabs() {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {  // Query all tabs in the current window
      if (chrome.runtime.lastError) {
        console.error('Error querying tabs:', chrome.runtime.lastError);
        return;
      }
  
      const activeTabs = tabs.map(tab => ({
        title: tab.title,
        url: tab.url
      }));
      
      chrome.storage.local.set({ activeTabs: activeTabs }, () => {
        console.log('Active tabs saved:', activeTabs);
      });
    });
  }
  
  // Listen for clicks on the extension icon
  chrome.action.onClicked.addListener(() => {
    console.log("Icon clicked!"); // Check if this logs when clicking the icon
    storeActiveTabs();
  });
  storeActiveTabs();