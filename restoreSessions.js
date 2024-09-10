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
            sessionDiv.style.position = 'relative'; // To allow the overlay to be positioned inside the div
            sessionDiv.style.cursor = 'pointer'; // Make it clear the whole div is clickable

            const sessionTitle = document.createElement('p');
            sessionTitle.classList.add('session-title');
            sessionTitle.textContent = `${session.name} Saved on - ${session.date}`;
            sessionDiv.appendChild(sessionTitle);

            // Add hover overlay text
            const hoverOverlay = document.createElement('div');
            hoverOverlay.classList.add('hover-overlay');
            hoverOverlay.textContent = "Click to open all the tabs";
            hoverOverlay.style.position = 'absolute';
            hoverOverlay.style.top = '0';
            hoverOverlay.style.left = '0';
            hoverOverlay.style.right = '0';
            hoverOverlay.style.bottom = '0';
            hoverOverlay.style.display = 'flex';
            hoverOverlay.style.justifyContent = 'center';
            hoverOverlay.style.alignItems = 'center';
            hoverOverlay.style.backgroundColor = 'rgba(0, 0, 0,1)';
            hoverOverlay.style.color = '#fff';
            hoverOverlay.style.fontSize = '16px';
            hoverOverlay.style.opacity = '0';
            hoverOverlay.style.transition = 'opacity 0.3s ease-in-out';

            // Show the overlay when hovering
            sessionDiv.addEventListener('mouseenter', () => {
                hoverOverlay.style.opacity = '1';
            });
            sessionDiv.addEventListener('mouseleave', () => {
                hoverOverlay.style.opacity = '0';
            });

            sessionDiv.appendChild(hoverOverlay);

            // Make the entire sessionDiv clickable to open all tabs
            sessionDiv.addEventListener('click', () => {
                session.tabs.forEach(tabUrl => {
                    chrome.tabs.create({ url: tabUrl });
                });
            });

            // Create the Delete icon
            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fas', 'fa-trash-alt'); // Font Awesome trash icon
            deleteIcon.style.cursor = 'pointer';
            deleteIcon.style.color = '#ff4d4d'; // Red color for delete
            deleteIcon.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent opening tabs when clicking delete
                deleteSession(index);
            });

            // Append delete icon to the sessionDiv
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
