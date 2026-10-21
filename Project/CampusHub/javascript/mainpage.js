import { initializeActivityFeed } from './activityfeed.js';
import { initializeMyPosts } from './myPosts.js';
import { initializeMarketplace } from './marketplace.js';
import { initializeProfile } from './profile.js';
import { getCurrentUserProfile, getProfileImageUrl } from './profileutils.js';

//finds nav bar and main content based on css
const navbar = document.querySelector('.navbar');
const mainContent = document.querySelector('.main-content');

// load current user info into sidebar
async function loadSidebarUser() {

    const sidebarProfilePicture =
        document.getElementById(
            'sidebar-profile-picture'
        )

    const sidebarProfileName =
        document.getElementById(
            'sidebar-profile-name'
        )


    const profile =
        await getCurrentUserProfile()


    if (!profile) {
        return
    }


    sidebarProfileName.textContent =
        profile.name || 'Student'


    sidebarProfilePicture.src =
        getProfileImageUrl(
            profile.image_path
        )
}

// run when CampusHub first loads
loadSidebarUser();

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
            doc.querySelector('.my-posts-page') ||
            doc.querySelector('.marketplace-page') ||
            doc.querySelector('.comments-page') ||
            doc.querySelector('.messages-page') ||
            doc.querySelector('.profile-page');

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
} else if (content.classList.contains('marketplace-page')) {
    initializeMarketplace();
} else if (content.classList.contains('profile-page')) {
    await initializeProfile();
}

        console.log('Feature loaded successfully.');

    } catch (error) {
        console.error('Feature loading error:', error);
        mainContent.textContent =
            'Unable to load this feature. Check the browser console.';
    }
});
