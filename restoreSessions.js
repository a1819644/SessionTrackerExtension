document.addEventListener('DOMContentLoaded', () => {
    const sessionsList = document.getElementById('sessionsList');

    // Load all saved sessions from Chrome storage
    chrome.storage.local.get('savedSessions', (result) => {
        if (chrome.runtime.lastError) {
            console.error('Error retrieving saved sessions:', chrome.runtime.lastError);
            return;
        }

        const savedSessions = result.savedSessions || [];

        if (savedSessions.length === 0) {
            sessionsList.innerHTML = '<p>No sessions saved yet.</p>';
            return;
        }

        savedSessions.forEach((session, index) => {
            const sessionDiv = document.createElement('div');
            sessionDiv.classList.add('session');
            sessionDiv.style.position = 'relative'; // Position for hover overlay
            sessionDiv.style.cursor = 'pointer'; // Show it's clickable

            const sessionTitle = document.createElement('p');
            sessionTitle.classList.add('session-title');
            sessionTitle.textContent = `${session.name} Saved on - ${session.date}`;
            sessionDiv.appendChild(sessionTitle);

            // Create hover overlay text
            const hoverOverlay = document.createElement('div');
            hoverOverlay.classList.add('hover-overlay');
            hoverOverlay.textContent = "click to open all tabs";
            sessionDiv.appendChild(hoverOverlay);

            // Add event listener to open all tabs when session is clicked
            sessionDiv.addEventListener('click', () => {
                session.tabs.forEach(tabUrl => {
                    chrome.tabs.create({ url: tabUrl });
                });
            });

            // Create delete icon
            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fas', 'fa-trash-alt'); // Font Awesome trash icon
            deleteIcon.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent triggering open tabs
                deleteSession(index);
            });

            // Append delete icon to session div
            sessionDiv.appendChild(deleteIcon);
            sessionsList.appendChild(sessionDiv);
        });
    });

    // Function to delete a session
    function deleteSession(index) {
        chrome.storage.local.get('savedSessions', (result) => {
            const savedSessions = result.savedSessions || [];
            savedSessions.splice(index, 1); // Remove session at index
            chrome.storage.local.set({ savedSessions: savedSessions }, () => {
                alert('Session deleted!');
                // Reload the sessions list
                location.reload();
            });
        });
    }
});
