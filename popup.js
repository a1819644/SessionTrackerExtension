document.addEventListener('DOMContentLoaded', () => {
  const tabsList = document.getElementById('tabsList');
  const saveButton = document.getElementById('saveTabs');
  // const openButton = document.getElementById('openTabs');
  const selectAllCheckbox = document.getElementById('selectAll');
  const sessionNameInput = document.getElementById('sessionName'); // Get session name from the form

  // Get today's date
  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth() + 1; // Months are zero-based
  const year = today.getFullYear();

  // Format the date (DD/MM/YYYY)
  const formattedDate = `${date}/${month}/${year}`;
  document.getElementById('sessionDate').textContent = formattedDate;

  // Retrieve active tabs from storage and display them
  chrome.storage.local.get('activeTabs', (result) => {
    if (chrome.runtime.lastError) {
      console.error('Error getting active tabs:', chrome.runtime.lastError);
      return;
    }

    if (result.activeTabs) {
      result.activeTabs.forEach(tab => {
        const listItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = tab.url;

        listItem.appendChild(checkbox);
        listItem.appendChild(document.createTextNode(`${tab.title} - ${tab.text}`));
        tabsList.appendChild(listItem);
      });
    } else {
      tabsList.innerHTML = '<li>No active tabs saved.</li>';
    }
  });

  // Select or deselect all tabs
  selectAllCheckbox.addEventListener('change', (event) => {
    const checkboxes = tabsList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = event.target.checked;
    });
  });

  // Save the selected tabs along with the session name
  saveButton.addEventListener('click', () => {
    const selectedTabs = [];
    const checkboxes = tabsList.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        selectedTabs.push(checkbox.value);
      }
    });

    const sessionName = sessionNameInput.value.trim(); // Get the session name
    if (!sessionName) {
      alert('Please enter a session name.');
      return;
    }

    const sessionData = {
      name: sessionName,
      date: formattedDate,
      tabs: selectedTabs
    };

    // Save session with the session name as a key
    chrome.storage.local.get('savedSessions', (result) => {
      const savedSessions = result.savedSessions || [];
      savedSessions.push(sessionData);

      chrome.storage.local.set({ savedSessions: savedSessions }, () => {
        alert('Session saved!');
      });
    });
  });

  // // Open saved sessions
  // openButton.addEventListener('click', () => {
  //   chrome.storage.local.get('savedSessions', (result) => {
  //     if (chrome.runtime.lastError) {
  //       console.error('Error getting saved sessions:', chrome.runtime.lastError);
  //       return;
  //     }

  //     if (result.savedSessions) {
  //       const savedSessions = result.savedSessions;
  //       savedSessions.forEach(session => {
  //         // For simplicity, just open all tabs from the last saved session
  //         session.tabs.forEach(url => {
  //           chrome.tabs.create({ url: url });
  //         });
  //       });
  //     } else {
  //       alert('No saved sessions to open.');
  //     }
  //   });
  // });
});
