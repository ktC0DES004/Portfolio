document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initMobileNav();
    loadInternships();
});

/* --- Theme Management --- */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Determine initial theme
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        return systemPrefersDark.matches ? 'dark' : 'light';
    };

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateToggleLabel(theme);
    };

    const updateToggleLabel = (theme) => {
        const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
        themeToggle.setAttribute('aria-label', label);
    };

    // Initial setup
    setTheme(getInitialTheme());
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Listen for system changes (if user hasn't overridden)
    systemPrefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

/* --- Mobile Navigation --- */
function initMobileNav() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
        
        // Close menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-links li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
            });
        });
    }
}

/* --- Internship Tracker --- */
function loadInternships() {
    const container = document.getElementById('internship-list');
    
    fetch('internships.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            displayInternships(data.internships);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            container.innerHTML = `
                <div class="error-state">
                    <p>Unable to load internships. [ERROR_CODE: FETCH_FAIL]</p>
                </div>
            `;
        });
}

function displayInternships(internships) {
    const container = document.getElementById('internship-list');
    container.innerHTML = '';

    if (!internships || internships.length === 0) {
        container.innerHTML = '<p class="mono">NO_DATA_FOUND</p>';
        return;
    }

    internships.forEach(item => {
        const card = document.createElement('div');
        card.className = 'internship-card';
        
        // Use textContent for safety against XSS
        const title = document.createElement('h3');
        title.textContent = item.position;
        
        const company = document.createElement('p');
        company.className = 'company accent mono';
        company.textContent = item.company;
        
        const location = document.createElement('p');
        location.className = 'location';
        location.textContent = item.location;
        
        const date = document.createElement('p');
        date.className = 'date-added mono';
        date.style.fontSize = '0.8rem';
        date.style.marginTop = '1rem';
        date.textContent = `DATE_ADDED: ${item.dateAdded}`;

        card.appendChild(title);
        card.appendChild(company);
        card.appendChild(location);
        
        if (item.link) {
            const link = document.createElement('a');
            link.href = item.link;
            link.target = '_blank';
            link.className = 'btn secondary';
            link.style.display = 'inline-block';
            link.style.marginTop = '1rem';
            link.style.padding = '0.4rem 1rem';
            link.textContent = 'View Posting';
            card.appendChild(link);
        }
        
        card.appendChild(date);
        container.appendChild(card);
    });
}
