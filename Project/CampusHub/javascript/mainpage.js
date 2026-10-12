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

            // Parse fetched HTML
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html');

            // Use .main-content if the loaded page has one,
            // otherwise use the whole body
            var content = doc.querySelector('.main-content') || doc.body;

            // Insert the page into CampusHub.html
            document.querySelector('.main-content').innerHTML =
                content.innerHTML;

            // Run profile JavaScript after profile.html is loaded
            if (page === 'profile.html') {
                const profileModule =
                    await import('../javascript/profile.js');

                await profileModule.loadProfile();
            }

        } catch (error) {
            console.error('Error loading page content:', error);
        }
    });
});