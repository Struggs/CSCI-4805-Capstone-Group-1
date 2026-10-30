import { supabase } from './supabaseClient.js';
import { getUserProfile, getProfileImageUrl } from './profileutils.js';
import { getLikeCount, hasUserLiked, addLike, removeLike } from './likeutils.js';

// Original standalone comments functionality.
// Being adapted for individual Activity Feed posts.

function getCommentElements(postCard) {
    return {
        commentsButton: postCard.querySelector('.comments-button'),
        commentsSection: postCard.querySelector('.comments-section'),
        commentsList: postCard.querySelector('.comments-list'),
        commentForm: postCard.querySelector('.comment-form'),
        commentInput: postCard.querySelector('.comment'),
        charCount: postCard.querySelector('.char-count'),
        postButton: postCard.querySelector('.post'),
        viewMoreCommentsButton: postCard.querySelector('.view-more-comments-button')
    };
}

const shortenedCommentLength = 200; // Length at which comments will be shortened

function formatCommentDate(createdAt) {
    const commentDate = new Date(createdAt);
    const now = new Date();
    const minutesSincePosted = Math.floor((now - commentDate) / (1000 * 60));
    const hoursSincePosted = Math.floor(minutesSincePosted / 60);
    const daysSincePosted = Math.floor(hoursSincePosted / 24);
    const weeksSincePosted = Math.floor(daysSincePosted / 7);
    const yearsSincePosted = Math.floor(daysSincePosted / 365);
    if (minutesSincePosted < 1) {
        return 'Just now';
    }
    if (minutesSincePosted < 60) {
        return `${minutesSincePosted}m`;
    }

    if (hoursSincePosted < 24) {
        return `${hoursSincePosted}h`;
    }

    if (daysSincePosted < 7) {
        return `${daysSincePosted}d`;
    }

    if (weeksSincePosted < 13) {
        return `${weeksSincePosted}w`;
    }
    return commentDate.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        ...(yearsSincePosted >= 1 ? { year: 'numeric' } : {})
    });
}

export function initializeComments(postCard, postId) {
    const elements = getCommentElements(postCard);
    let commentsOffset = 0; // Track the number of comments currently displayed
    const { commentInput, charCount, postButton, commentForm } = elements;

    if (!commentInput || !charCount || !postButton) {
        console.error('Comment controls not found for post: ', postId);
        return;
    }

    commentInput.addEventListener('input', () => {
        charCount.textContent = `${commentInput.value.length}/1000`;
        postButton.disabled = commentInput.value.trim() === '';
    });

    commentForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const commentText = commentInput.value.trim();

        if (!commentText) {
            return;
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('Unable to identify the signed-in user:', authError);
            return;
        }

        const { error } = await supabase
            .from('comments')
            .insert([{
                user_id: user.id,
                post_id: postId,
                comment_text: commentText
            }]);

        if (error) {
            console.error('Error posting comment:', error);
            alert('Your comment could not be posted. Please try again.');
            return;
        }

        commentInput.value = '';
        charCount.textContent = '0/1000';
        postButton.disabled = true;


        // Refresh comments after posting a new one
        commentsOffset = 0; // Reset offset to load the latest comments
        await loadComments(postId, elements);
    });

    elements.viewMoreCommentsButton.addEventListener('click', async () => {
        commentsOffset += 25; // Increase the offset to load the next set of comments
        await loadComments(postId, elements, commentsOffset);
    })
    loadComments(postId, elements, commentsOffset);

}

async function loadComments(postId, elements, offset = 0) {
    const { count, error: countError } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)
        .is('parent_comment_id', null);

    const { data, error } = await supabase
        .from('comments')
        .select('id, user_id, comment_text, created_at')
        .eq('post_id', postId)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: true })
        .range(offset, offset + 25); // Limit to the first 25 comments

    if (error) {
        console.error('Error loading comments:', error);
        return;
    }

    const { commentsList, viewMoreCommentsButton } = elements;

    if (!countError) {
        elements.commentsButton.textContent = `💬 Comments (${count})`;
    }

    if (offset === 0) {
        commentsList.innerHTML = ''; // Clear existing comments only on the initial load
    }
    displayComments(
        data.slice(0, 25),
        commentsList,
        viewMoreCommentsButton,
        postId
    );

    viewMoreCommentsButton.hidden = data.length <= 25;

}

async function displayComments(comments, commentsList, viewMoreCommentsButton, postId) {   // Display comments in the comments section, shortening them if they exceed the specified length and adding a "View More" button for longer comments
    supabase.auth.getUser();
    for (const comment of comments) {
        const commentText = comment.comment_text;
        const commentTimestamp = document.createElement('small');
        commentTimestamp.classList.add('comment-timestamp');
        commentTimestamp.textContent = formatCommentDate(comment.created_at);
        const userProfile = await getUserProfile(comment.user_id);
        const profileImageUrl = getProfileImageUrl(userProfile?.image_path);

        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');

        const commentContent = document.createElement('div');
        commentContent.classList.add('comment-content');

        const commentWrapper = document.createElement('div');
        commentWrapper.classList.add('comment-wrapper');

        const commentTextDiv = document.createElement('div');
        commentTextDiv.classList.add('comment-text');
        commentContent.appendChild(commentTextDiv);

        const profileImage = document.createElement('img');
        profileImage.src = profileImageUrl;
        profileImage.alt = 'Profile picture';
        profileImage.classList.add('comment-profile-image');

        const commentUsername = document.createElement('strong');
        commentUsername.textContent = userProfile?.name || 'Unknown user';
        commentUsername.classList.add('comment-username');
        commentContent.prepend(commentUsername);

        if (commentText.length > shortenedCommentLength) { // Check if the comment exceeds the shortened length
            commentTextDiv.textContent = commentText.substring(0, shortenedCommentLength) + '...';
            const viewMoreButton = document.createElement('button');
            viewMoreButton.textContent = 'View More';
            commentTextDiv.appendChild(viewMoreButton);
            let isExpanded = false;
            viewMoreButton.addEventListener('click', () => {
                if (isExpanded) { // If the comment is expanded, shorten it again and change the button text
                    commentTextDiv.textContent = commentText.substring(0, shortenedCommentLength) + '...';
                    viewMoreButton.textContent = 'View More';
                } else {    // If the comment is shortened, expand it to show the full comment and change the button text
                    commentTextDiv.textContent = commentText;
                    viewMoreButton.textContent = 'View Less';
                }
                commentTextDiv.appendChild(viewMoreButton);
                isExpanded = !isExpanded;
            });
        } else {
            commentTextDiv.textContent = commentText;  // Display the full comment if it's within the shortened length
        }
        commentDiv.prepend(profileImage);
        commentWrapper.appendChild(commentContent);

        const commentActions = document.createElement('div');
        commentActions.classList.add('comment-actions');

        const likeButton = document.createElement('button');
        likeButton.classList.add('like-button');
        likeButton.textContent = '\u2661';

        commentActions.appendChild(commentTimestamp);
        commentActions.appendChild(likeButton);


        const replyButton = document.createElement('button');
        replyButton.textContent = 'Reply';
        replyButton.classList.add('reply-button');
        commentActions.appendChild(replyButton);
        commentWrapper.appendChild(commentActions);

        const replyInput = document.createElement('textarea');
        replyInput.classList.add('reply-input');
        replyInput.placeholder = 'Write a reply...';
        replyInput.maxLength = 1000;
        replyInput.hidden = true;

        commentWrapper.appendChild(replyInput);

        replyButton.addEventListener('click', () => {
            replyInput.hidden = !replyInput.hidden;
            submitReplyButton.hidden = replyInput.hidden;
        });
        const submitReplyButton = document.createElement('button');
        submitReplyButton.textContent = 'Post Reply';
        submitReplyButton.classList.add('submit-reply-button');
        submitReplyButton.hidden = true;
        commentWrapper.appendChild(submitReplyButton);
        submitReplyButton.addEventListener('click', async () => {
            const replyText = replyInput.value.trim();
            if (!replyText) {
                return;
            }

            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                console.error('Unable to identify the signed in user:', authError);
                return;
            }

            const { error } = await supabase
                .from('comments')
                .insert([{
                    user_id: user.id,
                    post_id: postId,
                    comment_text: replyText,
                    parent_comment_id: comment.id
                }]);

            if (error) {
                console.error('Error posting reply:', error);
                return;
            }

            replyInput.value = '';
            replyInput.hidden = true;
            submitReplyButton.hidden = true;

            await loadReplies(comment.id, repliesContainer);
        });

        const repliesContainer = document.createElement('div');
        repliesContainer.classList.add('replies-container');
        commentWrapper.appendChild(repliesContainer);
        await loadReplies(comment.id, repliesContainer);

        commentDiv.appendChild(commentWrapper);
        commentsList.appendChild(commentDiv);   // Append the comment to the comments list

        const likeCount = await getLikeCount(comment.id, 'comment');
        const likeCountSpan = document.createElement('span');
        likeCountSpan.classList.add('like-count');
        likeCountSpan.textContent = likeCount;
        commentActions.appendChild(likeCountSpan);
    }

}

async function loadReplies(parentCommentId, repliesContainer) {
    const { data, error } = await supabase
        .from('comments')
        .select('id, user_id, comment_text, created_at')
        .eq('parent_comment_id', parentCommentId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error loading replies:', error);
        return;
    }

    repliesContainer.innerHTML = '';

    for (const reply of data) {
        const replyDiv = document.createElement('div');
        replyDiv.classList.add('reply');

        const replyWrapper = document.createElement('div');
        replyWrapper.classList.add('comment-wrapper');
        const replyContent = document.createElement('div');
        replyContent.classList.add('comment-content');

        const userProfile = await getUserProfile(reply.user_id);
        const replyProfileImage = document.createElement('img');
        replyProfileImage.classList.add('comment-profile-image');
        replyProfileImage.src = getProfileImageUrl(userProfile?.image_path);
        replyProfileImage.alt = 'Profile picture';

        const replyUsername = document.createElement('strong');
        replyUsername.textContent = userProfile?.name || 'Unknown user';
        replyUsername.classList.add('comment-username');
        replyContent.appendChild(replyUsername);

        const replyTextDiv = document.createElement('div');
        replyTextDiv.textContent = reply.comment_text;
        replyContent.appendChild(replyTextDiv);

        const replyTimestamp = document.createElement('small');
        replyTimestamp.classList.add('comment-timestamp');
        replyTimestamp.textContent = formatCommentDate(reply.created_at);
        replyDiv.appendChild(replyProfileImage);
        replyWrapper.appendChild(replyContent);
        replyWrapper.appendChild(replyTimestamp);
        replyDiv.appendChild(replyWrapper);
        repliesContainer.appendChild(replyDiv);
    }
}

