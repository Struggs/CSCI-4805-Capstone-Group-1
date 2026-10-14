import { supabase } from './supabaseClient.js';

let myPosts = [];
let currentUserId = null;

export async function initializeMyPosts (){
    await loadMyPosts();
}
async function loadMyPosts(){

    const myPostContainer = document.getElementById('my-posts');
    if (!myPostContainer) {
        console.error('my post container was not found.');
        return;
    }

    const { data: authData } = await supabase.auth.getUser();
    currentUserId = authData.user?.id ?? null;

    if (!currentUserId) {
    myPostContainer.textContent = 'Please sign in to view your posts.';
    return;
}

    myPostContainer.textContent = 'Loading your posts...';

        const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('id, user_id, title, post_text, image_path, audience, audience_type, audience_value, created_at')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false });

    if (postsError) {
        console.error('Error loading posts:', postsError);
        myPostContainer.textContent = 'Unable to load your posts.';
        return;
    }

    myPosts = posts ?? [];
    showMyPosts(myPosts, myPostContainer);
}

//finds template in html
function showMyPosts(posts, container) {

    const template = document.getElementById('post-template');

    if (!container || !template) {
        console.error('Feed container or post template is missing.');
        return;
    }

    if (posts.length === 0) {
        container.textContent = 'No posts to display yet.';
        return;
    }
        posts.forEach(post => {
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


 

