import { supabase } from '../javascript/supabaseClient.js';

let feedPosts = [];
let currentAudience = 'All';

export async function initializeActivityFeed() {
    await loadPosts();
}

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

    const userIds = [...new Set(
        (posts ?? []).map(post => post.user_id).filter(Boolean)
    )];

    let profilesById = {};

    if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, name, image_path, major, school_year, transfer_student')
            .in('id', userIds);

        if (profilesError) {
            console.error('Error loading profiles:', profilesError);
        } else {
            profilesById = Object.fromEntries(
                (profiles ?? []).map(profile => [profile.id, profile])
            );
        }
    }

    feedPosts = (posts ?? []).map(post => ({
        ...post,
        profile: profilesById[post.user_id] ?? null
    }));

    showActivityFeed(feedPosts, feedContainer, currentAudience);
}

function showActivityFeed(posts, container, audience = 'All') {
    const template = document.getElementById('post-template');

    if (!container || !template) {
        console.error('Feed container or post template is missing.');
        return;
    }

    const filteredPosts = audience === 'All'
        ? posts
        : posts.filter(post => post.audience === audience);

    container.replaceChildren();

    if (filteredPosts.length === 0) {
        container.textContent = 'No posts to display yet.';
        return;
    }

    filteredPosts.forEach(post => {
        const clone = template.content.cloneNode(true);
        const profile = post.profile;

        clone.querySelector('.post-title').textContent =
            post.title || '';

        clone.querySelector('.post-author').textContent =
            profile?.name || 'CampusHub Student';

        clone.querySelector('.post-desc').textContent =
            post.post_text || '';

        clone.querySelector('.post-stats').textContent =
            post.created_at
                ? new Date(post.created_at).toLocaleString()
                : '';

        const card = clone.querySelector('.post-card');

        // Add an author profile image if the template supports it.
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
            const image = document.createElement('img');
            image.src = post.image_path;
            image.alt = 'Post attachment';
            image.className = 'post-image';
            image.style.maxWidth = '100%';
            image.style.height = 'auto';
            card.appendChild(image);
        }

        container.appendChild(clone);
    });
}

export async function createPost() {
    const titleInput = document.getElementById('postTitle');
    const descriptionInput = document.getElementById('postDescription');
    const audienceInput = document.getElementById('audienceFilter');

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!description || description.length > 500) {
        alert('Please enter a description of 1–500 characters.');
        return;
    }

    let audience = audienceInput.value;

    if (audience === 'Major') {
        audience = document.getElementById('majorSelect').value;
    } else if (audience === 'Year') {
        audience = document.getElementById('yearSelect').value;
    }

    const { data: authData, error: authError } =
        await supabase.auth.getUser();

    if (authError || !authData.user) {
        alert('Please sign in before creating a post.');
        return;
    }

    const { error } = await supabase
        .from('posts')
        .insert({
            user_id: authData.user.id,
            title: title || null,
            post_text: description,
            image_path: null,
            audience: audience || 'All'
        });

    if (error) {
        console.error('Error creating post:', error);
        alert('Your post could not be saved.');
        return;
    }

    titleInput.value = '';
    descriptionInput.value = '';

    const imageInput = document.getElementById('postImage');
    if (imageInput) imageInput.value = '';

    closeCreatePostInterface();
    await loadPosts();
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
    const audience = document.getElementById('audienceFilter').value;

    document.getElementById('majorSelect').style.display =
        audience === 'Major' ? 'block' : 'none';

    document.getElementById('yearSelect').style.display =
        audience === 'Year' ? 'block' : 'none';
}

window.createPostInterface = createPostInterface;
window.closeCreatePostInterface = closeCreatePostInterface;
window.handleAudienceChange = handleAudienceChange;
window.PostSubmission = createPost;