import { getPostImageUrl } from './activityfeed.js';
import { supabase } from './supabaseClient.js';
import {
    getCurrentUserProfile,
    getProfileImageUrl,
} from './profileutils.js';


let myPosts = [];
let currentUserId = null;
let editingPost = null;

export async function initializeMyPosts (){
    await loadMyPosts();
}
async function loadMyPosts(){

    const myPostContainer = document.getElementById('my-posts');
    if (!myPostContainer) {
        console.error('my post container was not found.');
        return;
    }

    myPostContainer.textContent = 'Loading your posts...';

    try {
        const { data: authData, error: authError } =
            await supabase.auth.getUser();

        if (authError || !authData.user) {
            currentUserId = null;
            myPostContainer.textContent =
                'Please sign in to view your posts.';
            return;
        }

    currentUserId = authData.user.id;

    const { data: posts, error: postsError } = await supabase
            .from('posts')
            .select(`
                id,
                user_id,
                title,
                post_text,
                image_path,
                audience,
                audience_type,
                audience_value,
                created_at
            `)
            .eq('user_id', currentUserId)
            .order('created_at', { ascending: false });

        if (postsError) {
            throw postsError;
        }

                const profile = await getCurrentUserProfile();

        myPosts = (posts ?? []).map(post => ({
            ...post,
            profile
        }));

        await showMyPosts(myPosts, myPostContainer);

    } catch (error) {
        console.error('Error loading your posts:', error);
        myPostContainer.textContent = 'Unable to load your posts.';
    }
}
export async function showMyPosts(posts, container) {
    const template = document.getElementById('my-posts-template');

    console.log('My Posts container:', container);
    console.log('My Posts template:', template);

    if (!container) {
        console.error('My Posts container is missing.');
        return;
    }

    if (!template) {
        console.error('my-posts-template was not found in the page.');
        return;
    }

    container.replaceChildren();

    if (!posts || posts.length === 0) {
        container.textContent = 'No posts to display yet.';
        return;
    }
    for (const post of posts) {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.post-card');
        const profile = post.profile;

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

        const audienceLabels = {
            all_students: 'All Students',
            major: `Major: ${post.audience_value || ''}`,
            course_subject: `Course: ${post.audience_value || ''}`,
            class_year: `Class: ${post.audience_value || ''}`,
            transfer_status: 'Transfer Students Only'
        };

            clone.querySelector('.post-audience').textContent =
            audienceLabels[post.audience_type] || 'All Students';

        //display profile image.
        const profileImage = clone.querySelector('.post-profile-picture');

        if (profileImage) {
            if (profile?.image_path) {
                profileImage.src = getProfileImageUrl(profile.image_path);
                profileImage.alt = profile.name || 'Student profile';
                profileImage.hidden = false;
            } else if (profileImage) {
                profileImage.hidden = true;
            }
        }

        const image = clone.querySelector('.post-image')

        if (post.image_path) {
            
            try {
                const imageUrl = await getPostImageUrl(post.image_path);

                if (imageUrl) {
                    image.src = imageUrl;
                    image.alt = 'Post attachment';
                    image.hidden = false;
                } else {
                    image.hidden = true;
                }
            } catch (error) {
                console.error('Unable to load post image:', error);
                image.hidden = true;
            }
        } else {
            image.hidden = true;
        }


        
        // Connect the Edit Post button to this specific post.
        const editButton = card.querySelector(
            '.edit-post-interface-button'
        );

        editButton.addEventListener('click', () => {
            editPostInterface(post);
        });

        const deleteButton =
            card.querySelector('.delete-post-button');

        deleteButton.addEventListener('click', () => {
            deletePost(post);
        });

        container.appendChild(clone);
    }
}

function updateEditAudienceVisibility() {
    const audience = document.getElementById('audienceFilter')?.value;

    const majorContainer =
        document.getElementById('majorSelectContainer');

    const courseContainer =
        document.getElementById('courseSubjectContainer');

    const yearContainer =
        document.getElementById('yearSelectContainer');

    if (majorContainer) {
        majorContainer.style.display =
            audience === 'Major' ? 'block' : 'none';
    }

    if (courseContainer) {
        courseContainer.style.display =
            audience === 'Course Subject' ? 'block' : 'none';
    }

    if (yearContainer) {
        yearContainer.style.display =
            audience === 'Year' ? 'block' : 'none';
    }
}

window.handleEditAudienceChange = updateEditAudienceVisibility;

export async function editPostInterface(post) {
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

    if (post.image_path && imageContainer && currentImage) {
        const imageUrl = await getPostImageUrl(post.image_path);

        if (imageUrl) {
            currentImage.src = imageUrl;
            imageContainer.style.display = 'block';
        } else {
            imageContainer.style.display = 'none';
        }
    } else if (imageContainer && currentImage) {
        currentImage.removeAttribute('src');
        imageContainer.style.display = 'none';
    }

    const audienceTypeToOption = {
        all_students: 'All Students',
        major: 'Major',
        course_subject: 'Course Subject',
        class_year: 'Year',
        transfer_status: 'Transfer Students Only'
    };

    const selectedAudience =
        audienceTypeToOption[post.audience_type] ?? 'All Students';

    document.getElementById('audienceFilter').value = selectedAudience;
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

    element.style.display = 'flex';
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

    let imagePath = editingPost.image_path;

    const imageInput = document.getElementById('postImage');
    const selectedImage = imageInput?.files[0];

try {
    if (selectedImage) {
        if (!selectedImage.type.startsWith('image/')) {
            alert('Please select a valid image.');
            return;
        }

        if (selectedImage.size > 5 * 1024 * 1024) {
            alert('Image size must be 5 MB or smaller.');
            return;
        }

        const extension = selectedImage.name.split('.').pop();
        const fileName =
            `${authData.user.id}/${crypto.randomUUID()}.${extension}`;

        const { data: uploadedImage, error: uploadError } =
            await supabase.storage
                .from('post_Images')
                .upload(fileName, selectedImage, {
                    cacheControl: '3600',
                    upsert: false
                });

        if (uploadError) {
            throw uploadError;
        }

        imagePath = uploadedImage.path;
    }

    const { data: updatedPosts, error } = await supabase
        .from('posts')
        .update({
            title: title || null,
            post_text: description,
            image_path: imagePath,
            audience: 'All Students',
            audience_type: audienceType,
            audience_value: audienceValue
        })
        .eq('id', editingPost.id)
        .eq('user_id', authData.user.id)
        .select('id');

        if (error) {
            throw error;
        }

    if (!updatedPosts || updatedPosts.length === 0) {
        alert('The post was not updated. Check your permissions and try again.');
        return;
    }

    closeEditPostInterface();
    await loadMyPosts();

    alert('Post updated successfully.');
    } catch (error) {
    console.error('Error updating post:', error);
    alert(`Your post could not be updated: ${error.message}`);
    }
}

function closeEditPostInterface() {
    const element = document.getElementById('editPostInterface');
    if (element) element.style.display = 'none';

    editingPost = null;
}

export async function deletePost(post){
    if (!post || !post.id) {
        alert('Unable to identify this post.');
        return;
    }

    const confirmed = confirm(
        'Are you sure you want to delete this post? This cannot be undone.'
    );

    if (!confirmed) {
        return;
    }

    try {
        const { data: authData, error: authError } =
            await supabase.auth.getUser();

        if (authError || !authData.user) {
            alert('Please sign in before deleting a post.');
            return;
        }

        const { data: deletedPosts, error } = await supabase
            .from('posts')
            .delete()
            .eq('id', post.id)
            .eq('user_id', authData.user.id)
            .select('id');

        if (error) {
            throw error;
        }

        if (!deletedPosts || deletedPosts.length === 0) {
            alert('Post could not be deleted. Check your permissions.');
            return;
        }

        await loadMyPosts();

        alert('Post deleted successfully.');

    } catch (error) {
        console.error('Error deleting post:', error);
        alert(`Your post could not be deleted: ${error.message}`);
    }
}


window.editSubmission = editPostSubmission;
window.closeEditPostInterface = closeEditPostInterface;
window.deletePost = deletePost;


