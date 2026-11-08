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
function renderCommentText(textElement, text) {
    if (text.length > shortenedCommentLength) {
        textElement.textContent = text.substring(0, shortenedCommentLength) + '...';
        const viewMoreButton = document.createElement('button');
        viewMoreButton.textContent = 'View More';
        textElement.appendChild(viewMoreButton);
        let isExpanded = false;
        viewMoreButton.addEventListener('click', () => {
            if (isExpanded) {
                textElement.textContent = text.substring(0, shortenedCommentLength) + '...';
                viewMoreButton.textContent = 'View More';
            } else {
                textElement.textContent = text;
                viewMoreButton.textContent = 'View Less';
            }
            textElement.appendChild(viewMoreButton);
            isExpanded = !isExpanded;
        });

    }
    else {
        textElement.textContent = text;
    }

}

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

export function initializeComments(postCard, postId, postCreatorId) {
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
        await loadComments(postId, elements, commentsOffset, postCreatorId);
    });

    elements.viewMoreCommentsButton.addEventListener('click', async () => {
        commentsOffset += 25; // Increase the offset to load the next set of comments
        await loadComments(postId, elements, commentsOffset, postCreatorId);
    })
    loadComments(postId, elements, commentsOffset, postCreatorId);

}

async function updateCommentCount(postId, commentsButton) {
    const { count, error: countError } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)
        .is('parent_comment_id', null);

    if (countError) {
        console.error('Error updating comment count:', countError);
        return;
    }

    commentsButton.textContent = `💬 Comments (${count})`;
}

async function loadComments(postId, elements, offset = 0, postCreatorId) {

    const { data, error } = await supabase
        .from('comments')
        .select('id, user_id, comment_text, created_at, updated_at')
        .eq('post_id', postId)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: true })
        .range(offset, offset + 25); // Limit to the first 25 comments

    if (error) {
        console.error('Error loading comments:', error);
        return;
    }

    const { commentsList, viewMoreCommentsButton } = elements;

    await updateCommentCount(postId, elements.commentsButton);

    if (offset === 0) {
        commentsList.innerHTML = ''; // Clear existing comments only on the initial load
    }
    displayComments(
        data.slice(0, 25),
        commentsList,
        viewMoreCommentsButton,
        postId,
        elements.commentsButton,
        postCreatorId
    );

    viewMoreCommentsButton.hidden = data.length <= 25;

}

async function displayComments(comments, commentsList, viewMoreCommentsButton, postId, commentsButton, postCreatorId) {   // Display comments in the comments section, shortening them if they exceed the specified length and adding a "View More" button for longer comments
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    for (const comment of comments) {
        const commentText = comment.comment_text;
        const commentTimestamp = document.createElement('small');
        commentTimestamp.classList.add('comment-timestamp');

        const isEdited = comment.updated_at && new Date(comment.updated_at).getTime() !== new Date(comment.created_at).getTime();
        commentTimestamp.textContent = isEdited ? 'Edited · ' + formatCommentDate(comment.updated_at) : formatCommentDate(comment.created_at);

        const userProfile = await getUserProfile(comment.user_id);
        const profileImageUrl = getProfileImageUrl(userProfile?.image_path);
        const isCommentOwner = user && user.id === comment.user_id;
        const isPostCreator = comment.user_id === postCreatorId;

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

        if (isPostCreator) {
            const creatorLabel = document.createElement('span');
            creatorLabel.textContent = ' · Creator';
            commentUsername.appendChild(creatorLabel);
            creatorLabel.classList.add('creator-label');
        }

        renderCommentText(commentTextDiv, commentText);
        commentDiv.prepend(profileImage);
        commentWrapper.appendChild(commentContent);

        const commentActions = document.createElement('div');
        commentActions.classList.add('comment-actions');


        if (isCommentOwner) {
            const optionsMenu = createCommentOptionsMenu(comment, user, commentDiv, () => {
                updateCommentCount(postId, commentsButton);
            });
            commentContent.appendChild(optionsMenu);
        }

        commentActions.appendChild(commentTimestamp);
        commentActions.appendChild(await createCommentLikeButton(comment, user));

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
        const replyCharCount = document.createElement('small');
        replyCharCount.classList.add('char-count');
        replyCharCount.textContent = `${replyInput.value.length}/1000`;
        replyCharCount.hidden = true;
        commentWrapper.appendChild(replyCharCount);
        replyInput.addEventListener('input', () => {
            replyCharCount.textContent = `${replyInput.value.length}/1000`;
            replyInput.value.trim() === '' ? submitReplyButton.disabled = true : submitReplyButton.disabled = false;
        });

        replyButton.addEventListener('click', () => {
            replyInput.hidden = !replyInput.hidden;
            submitReplyButton.hidden = replyInput.hidden;
            replyCharCount.hidden = replyInput.hidden;
        });
        const submitReplyButton = document.createElement('button');
        submitReplyButton.textContent = 'Post Reply';
        submitReplyButton.classList.add('submit-reply-button');
        submitReplyButton.disabled = true;
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
            replyCharCount.textContent = '0/1000';
            replyCharCount.hidden = true;
            submitReplyButton.disabled = true;

            repliesCount = await getReplyCount(comment.id);
            updateRepliesButton();
        });

        const repliesContainer = document.createElement('div');
        repliesContainer.classList.add('replies-container');
        repliesContainer.hidden = true;
        let displayedReplies = 0; // Track the number of replies currently displayed

        const viewRepliesButton = document.createElement('button');
        viewRepliesButton.classList.add('view-replies-button');
        viewRepliesButton.hidden = true;
        commentWrapper.appendChild(repliesContainer);
        commentWrapper.appendChild(viewRepliesButton);

        let repliesCount = await getReplyCount(comment.id);
        function updateRepliesButton() {
            if (repliesCount === 0) {
                viewRepliesButton.hidden = true;
                return;
            }

            if (displayedReplies === 0) {
                viewRepliesButton.textContent = `View ${repliesCount} ${repliesCount === 1 ? 'Reply' : 'Replies'}`;
                viewRepliesButton.hidden = false;
                return;
            }
            const remainingReplies = repliesCount - displayedReplies;

            if (remainingReplies > 0) {
                viewRepliesButton.textContent = `View ${remainingReplies} more ${remainingReplies === 1 ? 'Reply' : 'Replies'}`;
            }
            else {
                viewRepliesButton.textContent = 'Hide Replies';
            }
        }
        updateRepliesButton();
        viewRepliesButton.addEventListener('click', async () => {
            if (displayedReplies === repliesCount) {
                repliesContainer.hidden = true;
                displayedReplies = 0; // Reset the number of displayed replies
                updateRepliesButton();
                return;
            }
            if (repliesContainer.hidden) {
                repliesContainer.hidden = false;
            }
            await loadReplies(comment.id, repliesContainer, displayedReplies, async () => {
                repliesCount = await getReplyCount(comment.id);
                displayedReplies = Math.max(0, displayedReplies - 1); // Decrease the displayedReplies count when a reply is deleted
                updateRepliesButton();
                if (repliesCount === 0) {
                    repliesContainer.hidden = true;
                }
            }, postCreatorId);
            displayedReplies = Math.min(displayedReplies + 3, repliesCount); // Update the number of displayed replies
            updateRepliesButton();
        });

        commentDiv.appendChild(commentWrapper);
        commentsList.appendChild(commentDiv);   // Append the comment to the comments list
    }

}

function createCommentOptionsMenu(comment, user, commentElement, onDeleteSuccess) {
    const optionsButton = document.createElement('button');
    optionsButton.textContent = '⋮';
    optionsButton.classList.add('comment-options-button');

    const optionsMenu = document.createElement('div');
    optionsMenu.classList.add('comment-options-menu');
    optionsMenu.hidden = true;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('comment-menu-item');
    optionsMenu.appendChild(editButton);
    editButton.addEventListener('click', () => {
        const commentTextElement = commentElement.querySelector('.comment-text');
        const commentTimestampElement = commentElement.querySelector('.comment-timestamp');
        console.log('Edit Button clicked');

        const editInput = document.createElement('textarea');
        editInput.value = comment.comment_text;
        editInput.maxLength = 1000;
        editInput.classList.add('edit-comment-input');
        commentTextElement.replaceWith(editInput);

        const editCharCount = document.createElement('small');
        editCharCount.classList.add('char-count');
        editCharCount.textContent = `${editInput.value.length}/1000`;
        editInput.insertAdjacentElement('afterend', editCharCount);
        editInput.addEventListener('input', () => {
            editCharCount.textContent = `${editInput.value.length}/1000`;
            saveButton.disabled = editInput.value.trim() === '' || editInput.value.trim() === comment.comment_text;
        });

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.classList.add('save-comment-button');
        saveButton.disabled = editInput.value.trim() === '' || editInput.value.trim() === comment.comment_text;

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.classList.add('cancel-comment-button');

        const editActions = document.createElement('div');
        editActions.classList.add('edit-actions');
        editActions.appendChild(saveButton);
        editActions.appendChild(cancelButton);
        editCharCount.insertAdjacentElement('afterend', editActions);

        saveButton.addEventListener('click', async () => {
            const newText = editInput.value.trim();
            if (newText === '' || newText === comment.comment_text) {
                return;
            }

            const updatedAt = await updateComment(comment.id, newText);
            if (updatedAt) {
                comment.comment_text = newText;
                comment.updated_at = updatedAt;
                commentTimestampElement.textContent = 'Edited · ' + formatCommentDate(updatedAt);
                commentTextElement.textContent = '';
                renderCommentText(commentTextElement, newText);
                editInput.replaceWith(commentTextElement);
                editCharCount.remove();
                editActions.remove();
            }

        });
        cancelButton.addEventListener('click', () => {
            editInput.replaceWith(commentTextElement);
            editCharCount.remove();
            editActions.remove();
        });
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('comment-menu-item');
    optionsMenu.appendChild(deleteButton);

    deleteButton.addEventListener('click', async () => {
        const confirmed = confirm('Are you sure you want to delete this comment?');
        if (!confirmed) {
            return;
        }

        const success = await deleteComment(comment.id);
        if (success) {
            commentElement.remove();
            onDeleteSuccess?.();
        }

    });

    optionsButton.addEventListener('click', () => {
        optionsMenu.hidden = !optionsMenu.hidden;
    });
    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('comment-options-container');
    optionsContainer.appendChild(optionsButton);
    optionsContainer.appendChild(optionsMenu);

    return optionsContainer;
}

async function updateComment(commentId, newText) {
    const { data, error } = await supabase
        .from('comments')
        .update({ comment_text: newText, updated_at: new Date().toISOString() })
        .eq('id', commentId)
        .select('id, updated_at');

    if (error) {
        console.error('Error updating comment:', error);
        return false;
    }

    if (!data || data.length === 0) {
        return false;
    }

    return data[0].updated_at;
}

async function deleteComment(commentId) {
    const { data, error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .select('id');

    if (error) {
        console.error('Error deleting comment: ', error);
        return false;
    }

    if (!data || data.length === 0) {
        return false;
    }

    return true;
}

async function createCommentLikeButton(comment, user) {
    const likeButton = document.createElement('button');
    likeButton.classList.add('like-button');
    let isLiked = user ? await hasUserLiked(user.id, comment.id, 'comment') : false;
    likeButton.textContent = isLiked ? '\u2665' : '\u2661';

    likeButton.addEventListener('click', async () => {
        if (!user) {
            alert('Please sign in or create account to like comments');
            return;
        }

        let success;
        if (isLiked) {
            success = await removeLike(user.id, comment.id, 'comment');
        }

        else {
            success = await addLike(user.id, comment.id, 'comment');
        }

        if (success) {
            isLiked = !isLiked;
            likeButton.textContent = isLiked ? '\u2665' : '\u2661';
            const updatedLikeCount = await getLikeCount(comment.id, 'comment');
            likeCountSpan.textContent = updatedLikeCount;
        }
    });

    const likeCount = await getLikeCount(comment.id, 'comment');
    const likeCountSpan = document.createElement('span');
    likeCountSpan.classList.add('like-count');
    likeCountSpan.textContent = likeCount;

    const likeContainer = document.createElement('div');
    likeContainer.classList.add('like-container');
    likeContainer.appendChild(likeButton);
    likeContainer.appendChild(likeCountSpan);

    return likeContainer;
}

async function getReplyCount(parentCommentId) {
    const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('parent_comment_id', parentCommentId);

    if (error) {
        console.error('Error fetching reply count: ', error);
        return 0;
    }

    return count;
}

async function loadReplies(parentCommentId, repliesContainer, offset = 0, onReplyDelete, postCreatorId) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    //separate retrieving total reply count from loading actual replies.

    const { data, count, error } = await supabase
        .from('comments')
        .select('id, user_id, comment_text, created_at, updated_at', { count: 'exact' })
        .eq('parent_comment_id', parentCommentId)
        .order('created_at', { ascending: true })
        .range(offset, offset + 2); //Load only 3 replies at a time.

    if (error) {
        console.error('Error loading replies:', error);
        return;
    }

    if (offset === 0) {
        repliesContainer.innerHTML = '';
    }

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

        const isPostCreator = reply.user_id === postCreatorId;
        if (isPostCreator) {
            const creatorLabel = document.createElement('span');
            creatorLabel.textContent = ' · Creator';
            creatorLabel.classList.add('creator-label');
            replyUsername.append(creatorLabel);
        }

        const replyTextDiv = document.createElement('div');
        replyTextDiv.classList.add('comment-text');
        renderCommentText(replyTextDiv, reply.comment_text);
        replyContent.appendChild(replyTextDiv);

        const isReplyOwner = user && user.id === reply.user_id;
        if (isReplyOwner) {
            const optionsMenu = createCommentOptionsMenu(reply, user, replyDiv, onReplyDelete);
            replyContent.appendChild(optionsMenu);
        }

        const replyTimestamp = document.createElement('small');
        replyTimestamp.classList.add('comment-timestamp');

        const isEdited = reply.updated_at && new Date(reply.updated_at).getTime() !== new Date(reply.created_at).getTime();
        replyTimestamp.textContent = isEdited ? 'Edited · ' + formatCommentDate(reply.updated_at) : formatCommentDate(reply.created_at);
        replyDiv.appendChild(replyProfileImage);
        replyWrapper.appendChild(replyContent);
        replyDiv.appendChild(replyWrapper);
        repliesContainer.appendChild(replyDiv);

        const replyActions = document.createElement('div');
        replyActions.classList.add('comment-actions');
        replyActions.appendChild(replyTimestamp);
        replyActions.appendChild(await createCommentLikeButton(reply, user));
        replyWrapper.appendChild(replyActions);
    }

    return count;
}

