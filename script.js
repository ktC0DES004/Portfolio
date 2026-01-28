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
    
    // Create a container for the cards
    const cardsContainer = document.createElement('div');
    cardsContainer.id = 'cards-container';
    
    // Initially show only first 3
    const initialCount = 3;
    let showingAll = false;
    
    function renderCards(count) {
        cardsContainer.innerHTML = '';
        const displayCount = count === 'all' ? internships.length : Math.min(count, internships.length);
        
        for (let i = 0; i < displayCount; i++) {
            const internship = internships[i];
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
            
            cardsContainer.appendChild(card);
        }
    }
    
    // Render initial cards
    renderCards(initialCount);
    container.appendChild(cardsContainer);
    
    // Add "Show More" button if there are more than 3 internships
    if (internships.length > initialCount) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.textAlign = 'center';
        buttonContainer.style.marginTop = '1.5rem';
        
        const showMoreBtn = document.createElement('button');
        showMoreBtn.textContent = 'Show More';
        showMoreBtn.className = 'show-more-btn';
        
        showMoreBtn.addEventListener('click', function() {
            if (!showingAll) {
                renderCards('all');
                showMoreBtn.textContent = 'Show Less';
                showingAll = true;
            } else {
                renderCards(initialCount);
                showMoreBtn.textContent = 'Show More';
                showingAll = false;
                // Scroll back to internships section
                document.getElementById('internships').scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        buttonContainer.appendChild(showMoreBtn);
        container.appendChild(buttonContainer);
    }
}
