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

    container.replaceChildren();

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

        
        // Connect the Edit Post button to this specific post.
        const editButton = clone.querySelector(
            '.edit-post-interface-button'
        );

        if (editButton) {
            editButton.addEventListener('click', () => {
                editPostInterface(post);
            });
        }

        // Add the completed post card to the page.
        container.appendChild(clone);
})}

function updateEditAudienceVisibility() {
    const audience = document.getElementById('audienceFilter')?.value;

    document.getElementById('majorSelectContainer').style.display =
        audience === 'Major' ? 'block' : 'none';

    document.getElementById('courseSubjectContainer').style.display =
        audience === 'Course Subject' ? 'block' : 'none';

    document.getElementById('yearSelectContainer').style.display =
        audience === 'Year' ? 'block' : 'none';
}

window.handleEditAudienceChange = updateEditAudienceVisibility;

let editingPost = null;

export function editPostInterface(post) {
    editingPost = post;

    const element = document.getElementById('editPostInterface');

    if (!element) {
        console.error('Edit post interface was not found.');
        return;
    }

    document.getElementById('postTitle').value =
        post.title ?? '';

    document.getElementById('postDescription').value =
        post.post_text ?? '';

    const imageContainer =
        document.getElementById('currentPostImageContainer');
    const currentImage =
        document.getElementById('currentPostImage');
    const imageInput =
        document.getElementById('postImage');

    if (imageInput) {
        imageInput.value = '';
    }

    if (imageContainer && currentImage) {
        if (post.image_path) {
            currentImage.src = post.image_path;
            imageContainer.style.display = 'block';
        } else {
            currentImage.removeAttribute('src');
            imageContainer.style.display = 'none';
        }
    }

    const audienceFilter =
        document.getElementById('audienceFilter');

    const audienceTypeToOption = {
        all_students: 'All Students',
        major: 'Major',
        course_subject: 'Course Subject',
        class_year: 'Year',
        transfer_status: 'Transfer Students Only'
    };

    const selectedAudience =
        audienceTypeToOption[post.audience_type] ?? 'All Students';

    audienceFilter.value = selectedAudience;
    updateEditAudienceVisibility();

    const audienceValue = post.audience_value ?? '';

    if (selectedAudience === 'Major') {
        document.getElementById('majorSelect').value = audienceValue;
    } else if (selectedAudience === 'Course Subject') {
        document.getElementById('courseSubjectSelect').value =
            audienceValue;
    } else if (selectedAudience === 'Year') {
        document.getElementById('yearSelect').value = audienceValue;
    }

    element.style.display = 'block';
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}
export async function editPostSubmission() {
    if (!editingPost) {
        alert('Please select a post to edit.');
        return;
    }

    const titleInput = document.getElementById('postTitle');
    const descriptionInput = document.getElementById('postDescription');
    const audienceInput = document.getElementById('audienceFilter');

    if (!titleInput || !descriptionInput || !audienceInput) {
        alert('The post form could not be loaded. Please refresh the page.');
        return;
    }

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!description || description.length > 500) {
        alert('Please enter a description of 1–500 characters.');
        return;
    }

    const selectedAudience = audienceInput.value;
    let audienceType;
    let audienceValue = null;

    switch (selectedAudience) {
        case 'All Students':
            audienceType = 'all_students';
            break;

        case 'Major':
            audienceType = 'major';
            audienceValue =
                document.getElementById('majorSelect')?.value;
            break;

        case 'Course Subject':
            audienceType = 'course_subject';
            audienceValue =
                document.getElementById('courseSubjectSelect')?.value;
            break;

        case 'Year':
            audienceType = 'class_year';
            audienceValue =
                document.getElementById('yearSelect')?.value;
            break;

        case 'Transfer Students Only':
            audienceType = 'transfer_status';
            break;

        default:
            alert('Please select a valid audience.');
            return;
    }

    if (
        ['major', 'course_subject', 'class_year'].includes(audienceType) &&
        !audienceValue
    ) {
        alert('Please select an option for your chosen audience.');
        return;
    }

    const { data: authData, error: authError } =
        await supabase.auth.getUser();

    if (authError || !authData.user) {
        alert('Please sign in before editing a post.');
        return;
    }

    const { data: updatedPosts, error } = await supabase
        .from('posts')
        .update({
            title: title || null,
            post_text: description,
            audience: 'All Students',
            audience_type: audienceType,
            audience_value: audienceValue
        })
        .eq('id', editingPost.id)
        .eq('user_id', authData.user.id)
        .select('id');

    if (error) {
        console.error('Error updating post:', error);
        alert(`Your post could not be updated: ${error.message}`);
        return;
    }

    if (!updatedPosts || updatedPosts.length === 0) {
        alert('The post was not updated. Check your permissions and try again.');
        return;
    }

    closeEditPostInterface();
    await loadMyPosts();

    alert('Post updated successfully.');
}

export function closeEditPostInterface() {
    const element = document.getElementById('editPostInterface');
    if (element) element.style.display = 'none';

    editingPost = null;
}

window.editSubmission = editPostSubmission;
window.closeEditPostInterface = closeEditPostInterface;
window.deletePost = deletePost;


