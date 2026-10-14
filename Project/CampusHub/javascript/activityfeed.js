
import { supabase } from './supabaseClient.js';

let feedPosts = [];
let currentAudience = 'All';

//starting point, waits for loadPosts to finish.
export async function initializeActivityFeed() {
    await loadPosts();
}

// searches for container in html, if no container,
//  throw error and return
// else fetch posts table from supabase and specific columns.
//handles if supabase throws error
async function loadPosts() {
    const { data: authData } = await supabase.auth.getUser();
    const feedContainer = document.getElementById('feed');

    if (!feedContainer) {
        console.error('Activity feed container was not found.');
        return;
    }

    feedContainer.textContent = 'Loading posts...';

    const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('id, user_id, title, post_text, image_path, audience, audience_type, audience_value, created_at')
        .order('created_at', { ascending: false });

    if (postsError) {
        console.error('Error loading posts:', postsError);
        feedContainer.textContent = 'Unable to load posts.';
        return;
    }

    //creates empty array if posts is null, 
    // takes each post and extracts authors id, 
    // removes false values, removes duplicate ids,
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
    // looks up authors profile using id. adds profile to new "profile" property
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
    //container with relevant posts
    //New audience types use audience_type and audience_value.
    const filteredPosts = audience === 'All'
        ? posts
        : posts.filter(post =>
            post.audience === audience ||
            post.audience_type === audience
        );

    container.replaceChildren();

    //if no posts in selected audience show message
    if (filteredPosts.length === 0) {
        container.textContent = 'No posts to display yet.';
        return;
    }

    //runs once for each post to give it its structure.
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

    // Stop if required HTML elements are missing.
    if (!titleInput || !descriptionInput || !audienceInput) {
        console.error('One or more post form elements could not be found.');
        alert('The post form could not be loaded. Please refresh the page.');
        return;
    }

    //extract values entered, no whitespace >:(
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!description || description.length > 500) {
        alert('Please enter a description of 1–500 characters.');
        return;
    }

    //sets audience type and its specific value
    const selectedAudience = audienceInput.value;
    let audienceType;
    let audienceValue = null;

    //for retrieving specific audience
    //Keep the audience category separate from the selected major, course subject, or year.
    switch (selectedAudience) {
        case 'All Students':
            audienceType = 'all_students';
            break;

        case 'Major':
            audienceType = 'major';
            audienceValue = document.getElementById('majorSelect')?.value;
            break;

        case 'Course Subject':
            audienceType = 'course_subject';
            audienceValue = document.getElementById('courseSubjectSelect')?.value;
            break;

        case 'Year':
            audienceType = 'class_year';
            audienceValue = document.getElementById('yearSelect')?.value;
            break;

        case 'Transfer Students Only':
            audienceType = 'transfer_status';
            break;

        default:
            alert('Please select a valid audience.');
            return;
    }

    //Make sure an audience with a specific selection has a value.
    if (
        ['major', 'course_subject', 'class_year'].includes(audienceType) &&
        !audienceValue
    ) {
        alert('Please select an option for your chosen audience.');
        return;
    }

    //pulls from database to see if user is signed in.
    const { data: authData, error: authError } =
        await supabase.auth.getUser();

    if (authError || !authData.user) {
        alert('Please sign in before creating a post.');
        return;
    }

    //select post table, insert new row
    //Keep the legacy audience value as All Students so the existing
    //valid_audience database constraint does not reject the new post.
    console.log('Audience being submitted:', {
        audienceType,
        audienceValue
    });

    const { error } = await supabase
        .from('posts')
        .insert({
            user_id: authData.user.id,
            title: title || null,
            post_text: description,
            image_path: null,
            audience: 'All Students',
            audience_type: audienceType,
            audience_value: audienceValue
        });

    if (error) {
        console.error('Error creating post:', error);
        alert(`Your post could not be saved: ${error.message}`);
        return;
    }

    //clear value input containers
    titleInput.value = '';
    descriptionInput.value = '';

    const imageInput = document.getElementById('postImage');
    if (imageInput) imageInput.value = '';

    //Reset audience selections after a successful post.
    audienceInput.value = 'All Students';
    handleAudienceChange();

    closeCreatePostInterface();

    //load posts from supabase
    await loadPosts();

    alert('Post created successfully.');
}

export function createPostInterface() {
    const element = document.getElementById('createPostInterface');
    if (element) element.style.display = 'block';
}

export function closeCreatePostInterface() {
    const element = document.getElementById('createPostInterface');
    if (element) element.style.display = 'none';
}

export function handleAudienceChange() {
    const audienceInput = document.getElementById('audienceFilter');

    if (!audienceInput) {
        console.error('Audience dropdown was not found.');
        return;
    }

    const audience = audienceInput.value;

    const majorContainer = document.getElementById('majorSelectContainer');
    const courseSubjectContainer = document.getElementById('courseSubjectContainer');
    const yearContainer = document.getElementById('yearSelectContainer');

    if (majorContainer) {
        majorContainer.style.display =
            audience === 'Major' ? 'block' : 'none';
    }

    if (courseSubjectContainer) {
        courseSubjectContainer.style.display =
            audience === 'Course Subject' ? 'block' : 'none';
    }

    if (yearContainer) {
        yearContainer.style.display =
            audience === 'Year' ? 'block' : 'none';
    }
}

window.createPostInterface = createPostInterface;
window.closeCreatePostInterface = closeCreatePostInterface;
window.handleAudienceChange = handleAudienceChange;
window.PostSubmission = createPost;
