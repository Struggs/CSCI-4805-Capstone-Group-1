document.querySelectorAll('.nav-button').forEach(function(button) {
    button.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Update active state styling
        document.querySelectorAll('.nav-button').forEach(function(btn) {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // Fetch and load target page content
        var page = button.getAttribute('data-page');
        try {
            var response = await fetch(page);
            var html = await response.text();
            
            // Parse the fetched HTML and extract only the main content area
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html');
            var content = doc.querySelector('.main-content') || doc.body;
            
            // Inject into current dashboard layout
            document.querySelector('.main-content').innerHTML = content.innerHTML;
        } catch (error) {
            console.error('Error loading page content:', error);
        }
    });
});