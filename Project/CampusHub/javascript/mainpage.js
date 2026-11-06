import { initializeActivityFeed } from './activityfeed.js';
import { initializeMyPosts } from './myPosts.js';
import { initializeMarketplace } from './marketplace.js';
import { initializeMessages } from './messages.js';
import { initializeProfile } from './profile.js';
import { getCurrentUserProfile, getProfileImageUrl } from './profileutils.js';
import { supabase } from './supabaseClient.js';

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


    const profile = await getCurrentUserProfile()

    if (!profile) {
        return
    }

    // Get the header profile elements
    const headerProfilePicture = document.getElementById('header-profile-picture');
    const headerProfileName = document.getElementById('header-profile-name');

    // Display the user's first name
    // Takes "Dallas Chillinsky" and extracts "Dallas"
    //The || 'Student' provides a fallback if the user doesn't have a name saved
    const firstName = profile.name?.trim().split(/\s+/)[0] || 'Student';
    headerProfileName.textContent = firstName;

    // Display the user's profile picture
    headerProfilePicture.src = getProfileImageUrl(profile.image_path);

    sidebarProfileName.textContent =
        profile.name || 'Student'

    // Display the student's major in the sidebar
    const sidebarProfileMajor =
        document.getElementById('sidebar-profile-major');

    sidebarProfileMajor.textContent =
        profile.major || 'APSU Student';

    sidebarProfilePicture.src =
        getProfileImageUrl(
            profile.image_path
        )
}


// run when CampusHub first loads
loadSidebarUser();

// automatically open the activity feed
window.addEventListener('DOMContentLoaded', () => {
    const activityFeedButton = document.querySelector(
        '.nav-button[data-page="feed.html"]'
    );

    if (activityFeedButton) {
        activityFeedButton.click();
    }
});

//runs when user clicks, event tells what was clicked
navbar.addEventListener('click', async (event) => {

    //where click happened, searches up through parents to nearest nav-button element
    const button = event.target.closest('.nav-button');

    if (!button) return;

    event.preventDefault();

    // identify the student profile we want to view
    const viewedUserId = button.dataset.viewUserId || null;
    delete button.dataset.viewUserId;

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
        } else if (content.classList.contains('messages-page')) {
            initializeMessages();
        } else if (content.classList.contains('profile-page')) {
            await initializeProfile(viewedUserId); //passed in viewedUserId to initializeProfile
        }

        console.log('Feature loaded successfully.');

    } catch (error) {
        console.error('Feature loading error:', error);
        mainContent.textContent =
            'Unable to load this feature. Check the browser console.';
    }
 }); //event listener for nav bar click ends here

// Open a student's profile when selected from the activity feed
window.addEventListener('campushub:view-profile', (event) => {

    const studentId = event.detail.userId;

    const profileButton = document.querySelector(
        '.nav-button[data-page="profile.html"]'
    );

    if (!profileButton || !studentId) return;

    // Pass the selected student ID to the profile page
    profileButton.dataset.viewUserId = studentId;

    // Open the selected student's profile
    profileButton.click();
});


// Get the profile menu elements
const profileMenuButton = document.getElementById('profile-menu-button');
const profileDropdown = document.getElementById('profile-dropdown');


// Open or close the dropdown when clicked
profileMenuButton.addEventListener('click', () => {

    // Check if the dropdown is hidden
    const isHidden = profileDropdown.hidden;

    // Toggle dropdown visibility
    profileDropdown.hidden = !isHidden;

    // Update the dropdown button state
    profileMenuButton.setAttribute('aria-expanded', String(isHidden));
});


// Close the dropdown when clicking outside
document.addEventListener('click', (event) => {

    // Check if the click was outside the profile section
    if (!event.target.closest('.header-profile')) {

        // Hide the dropdown
        profileDropdown.hidden = true;

        // Update the button state
        profileMenuButton.setAttribute('aria-expanded', 'false');
    }
});



// Get the logout button
const logoutButton = document.getElementById('logout-button');

// Sign out when the button is clicked
logoutButton.addEventListener('click', async () => {

    // Sign the user out of Supabase
    const { error } = await supabase.auth.signOut();

    // Check if signing out failed
    if (error) {
        console.error('Logout error:', error);
        alert('Unable to sign out. Please try again.');
        return;
    }

    // Return to the login page
    window.location.href = '/Project/CampusHub/html/index.html';
});
