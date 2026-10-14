import { supabase } from '../javascript/supabaseClient.js';

let feedPosts = [];
let currentAudience = 'All';

//starting point, waits for loadPosts to finish.
export async function initializeActivityFeed() {
    await loadPosts();
}
// searches for container in html, if no container, throw error and return
// else fetch posts table from supabase and specific columns.
//handles if supabase throws error
async function loadPosts() {
    const feedContainer = document.getElementById('feed');

    if (!feedContainer) {
        console.error('Activity feed container was not found.');
        return;
    }

    feedContainer.textContent = 'Loading posts...';

    const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('id, user_id, title, post_text, image_path, audience, created_at')
        .order('created_at', { ascending: false });

    if (postsError) {
        console.error('Error loading posts:', postsError);
        feedContainer.textContent = 'Unable to load posts.';
        return;
    }
//creates empty array if posts is null, takes each post and extracts authors if, remove false values, removes dupe ids, 
//converts the set back into an array
    const userIds = [...new Set(
        (posts ?? []).map(post => post.user_id).filter(Boolean)
    )];

//empty object that will map ids to profiles
    let profilesById = {};
//if id found, selects profiles from database with selected columns, then return profiles with ids in user id array
    if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, name, image_path, major, school_year, transfer_student')
            .in('id', userIds);
// handles errors from profile table retrieval else maps to profiles by id
        if (profilesError) {
            console.error('Error loading profiles:', profilesError);
        } else {
            profilesById = Object.fromEntries(
                (profiles ?? []).map(profile => [profile.id, profile])
            );
        }
    }
// attaches profiles to their posts. copies properties of post then 
// looks up authors profile using id. adds profile to new "prof property"
// for post.
    feedPosts = (posts ?? []).map(post => ({
        ...post,
        profile: profilesById[post.user_id] ?? null
    }));

    showActivityFeed(feedPosts, feedContainer, currentAudience);
}

//finds template in html
function showActivityFeed(posts, container, audience = 'All') {
    const template = document.getElementById('post-template');

    if (!container || !template) {
        console.error('Feed container or post template is missing.');
        return;
    }
//select filtered audience property from database and replace
//  container with relevent posts
    const filteredPosts = audience === 'All'
        ? posts
        : posts.filter(post => post.audience === audience);

    container.replaceChildren();

//if no posts in selected audiance show message
    if (filteredPosts.length === 0) {
        container.textContent = 'No posts to display yet.';
        return;
    }
//runs once for each post to give it its structer. 
//clone template for each post and tie profile
    filteredPosts.forEach(post => {
        const clone = template.content.cloneNode(true);
        const profile = post.profile;
//finds element in cloned template using css labels with consideration for empty values
        clone.querySelector('.post-title').textContent =
            post.title || '';

        clone.querySelector('.post-author').textContent =
            profile?.name || 'CampusHub Student';

        clone.querySelector('.post-desc').textContent =
            post.post_text || '';
//displays creation time
        clone.querySelector('.post-stats').textContent =
            post.created_at
                ? new Date(post.created_at).toLocaleString()
                : '';

//display profile image.
        const card = clone.querySelector('.post-card');

        const profileImage = clone.querySelector('.post-profile-picture');

        if (profileImage) {
            if (profile?.image_path) {
                profileImage.src = profile.image_path;
                profileImage.alt = profile.name || 'Student profile';
                profileImage.hidden = false;
            } else {
                profileImage.hidden = true;
            }
        }

// Add the post image if one is stored.
        if (post.image_path) {
            const image = document.createElement('img'); //creates element
            image.src = post.image_path; //points to image
            image.alt = 'Post attachment'; //gives text
            image.className = 'post-image'; //css class
            image.style.maxWidth = '100%'; //formatting
            image.style.height = 'auto';
            card.appendChild(image); // adds image to card
        }
// adds card to feed
        container.appendChild(clone);
    });
}

export async function createPost() {

// finds elements in html
    const titleInput = document.getElementById('postTitle');
    const descriptionInput = document.getElementById('postDescription');
    const audienceInput = document.getElementById('audienceFilter');
//extract values entered, no whitespace >:(
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!description || description.length > 500) {
        alert('Please enter a description of 1–500 characters.');
        return;
    }
//sets audiance 
    let audience = audienceInput.value;
//for retrieving specific audience 
    if (audience === 'Major') {
        audience = document.getElementById('majorSelect').value;
    } else if (audience === 'Year') {
        audience = document.getElementById('yearSelect').value;
    }
//pulls from database to see if user is signed in.
    const { data: authData, error: authError } =
        await supabase.auth.getUser();

    if (authError || !authData.user) {
        alert('Please sign in before creating a post.');
        return;
    }
// select post table, insert new row 
    const { error } = await supabase
        .from('posts')
        .ins