import { initializeActivityFeed } from './activityfeed.js';

const navbar = document.querySelector('.navbar');
const mainContent = document.querySelector('.main-content');

navbar.addEventListener('click', async (event) => {
    const button = event.target.closest('.nav-button');

    if (!button) return;

    event.preventDefault();

    const pageUrl = new URL(button.getAttribute('href'), window.location.href);

    document.querySelectorAll('.nav-button').forEach((link) => {
        link.classList.remove('active');
    });

    button.classList.add('active');

    try {
        console.log('Loading feature:', pageUrl.href);

        const response = await fetch(pageUrl);

        if (!response.ok) {
            throw new Error(`Failed to load ${pageUrl.href}: ${response.status}`);
        }

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const content =
            doc.querySelector('.activity-feed-page') ||
            doc.querySelector('.marketplace-page') ||
            doc.querySelector('.comments-page') ||
            doc.querySelector('.messages-page');

        if (!content) {
            throw new Error(`No supported content wrapper found in ${pageUrl.href}`);
        }

        mainContent.replaceChildren(
            document.importNode(content, true)
        );

        if (content.classList.contains('activity-feed-page')) {
            await initializeActivityFeed();
        }

        console.log('Feature loaded successfully.');

    } catch (error) {
        console.error('Feature loading error:', error);
        mainContent.textContent =
            'Unable to load this feature. Check the browser console.';
    }
});