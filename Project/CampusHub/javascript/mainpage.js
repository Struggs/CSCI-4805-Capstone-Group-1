import { initializeActivityFeed } from './activityfeed.js';

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
            doc.querySelector('.marketplace-page') ||
            doc.querySelector('.comments-page') ||
            doc.querySelector('.messages-page');

        if (!content) {
            throw new Error(`No supported content wrapper found in ${pageUrl.href}`);
        }
//remove existing content in ma