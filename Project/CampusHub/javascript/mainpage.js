<<<<<<< HEAD
document.querySelectorAll('.nav-button').forEach(function (button) {
    button.addEventListener('click', async function (e) {
        e.preventDefault();

        // Update active state styling
        document.querySelectorAll('.nav-button').forEach(function (btn) {
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
            if (page === 'feed.html') {
                const feedContainer = document.getElementById('feed-container');
                if (feedContainer) {
                    showActivityFeed(feedPosts, feedContainer, 'All');
                }
            }
        } catch (error) {
            console.error('Error loading page content:', error);
        }
=======
import { initializeActivityFeed } from './activityfeed.js';
import { initializeMyPosts } from './myPosts.js';

//finds nav bar and main content based on css

const navbar = document.querySelector('.navbar');
const mainContent = document.querySelector('.main-content');

//runs when user clicks, event tells what was clicked

navbar.addEventListener('click', async (event) => {

    //where click happened, searches up through parents to nearest nav-button element
    const button = event.target.closest('.nav-button');

    if (!button) return;

    event.preventDefault();
// pinpoints destination.
    const pageUrl = new URL(button.getAttribute('href'), window.location.href);
// removes css from each button to update css
    document.querySelectorAll('.nav-button').forEach((link) => {
        link.classList.remove('active');
>>>>>>> origin/main
    });

    button.classList.add('active');
//fetch the url and await response if not ok throw error
    try {
        console.log('Loading feature:', pageUrl.href);

        const response = await fetch(pageUrl);

        if (!response.ok) {
            throw new Error(`Failed to load ${pageUrl.href}: ${response.status}`);
        }
//turn response to string, DOMParser converts string 
// to document javascript can search. 
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
//search for containers.
        const content =
            doc.querySelector('.activity-feed-page') ||
            doc.querySelector('.my-posts-page') ||
            doc.querySelector('.marketplace-page') ||
            doc.querySelector('.comments-page') ||
            doc.querySelector('.messages-page');

        if (!content) {
            throw new Error(`No supported content wrapper found in ${pageUrl.href}`);
        }
//remove existing content in main child and replace with copy 
// of element and its decendents. 
        mainContent.replaceChildren(
            document.importNode(content, true)
        );

        if (content.classList.contains('activity-feed-page')) {
        await initializeActivityFeed();
        } else if (content.classList.contains('my-posts-page')) {
        await initializeMyPosts();
}

console.log('Feature loaded successfully.');

    } catch (error) {
        console.error('Feature loading error:', error);
        mainContent.textContent =
            'Unable to load this feature. Check the browser console.';
    }
});