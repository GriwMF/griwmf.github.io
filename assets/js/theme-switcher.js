// Theme Switcher
(function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    const body = document.body;
    
    // Exit early if required elements don't exist
    if (!themeToggle || !themeIcon || !themeText) {
        return;
    }
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme on page load
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light';
    }
    
    // Theme toggle handler
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            // Switch to light theme
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Dark';
        } else {
            // Switch to dark theme
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Light';
        }
    });
})();
