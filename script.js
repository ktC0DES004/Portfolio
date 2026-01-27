// Wait for the page to fully load before running
document.addEventListener('DOMContentLoaded', function() {
    loadInternships();
});

// Function to load and display internships
function loadInternships() {
    // Fetch the JSON file
    fetch('internships.json')
        .then(response => {
            // Check if the fetch was successful
            if (!response.ok) {
                throw new Error('Could not load internships');
            }
            return response.json();
        })
        .then(data => {
            // Display the internships
            displayInternships(data.internships);
        })
        .catch(error => {
            // If there's an error, show a message
            console.error('Error:', error);
            document.getElementById('internship-list').innerHTML = 
                '<p>Unable to load internships. Please try again later.</p>';
        });
}

// Function to display internships on the page
function displayInternships(internships) {
    const container = document.getElementById('internship-list');
    
    // Clear the "Loading..." message
    container.innerHTML = '';
    
    // Check if there are any internships
    if (internships.length === 0) {
        container.innerHTML = '<p>No internships added yet.</p>';
        return;
    }
    
    // Loop through each internship and create a card
    internships.forEach(internship => {
        const card = document.createElement('div');
        card.className = 'internship-card';
        
        card.innerHTML = `
            <h3>${internship.position}</h3>
            <p class="company">${internship.company}</p>
            <p class="location">${internship.location}</p>
            <p>${internship.description}</p>
            ${internship.link ? `<p><a href="${internship.link}" target="_blank">View Posting</a></p>` : ''}
            <p><small>Added: ${internship.dateAdded}</small></p>
        `;
        
        container.appendChild(card);
    });
}
