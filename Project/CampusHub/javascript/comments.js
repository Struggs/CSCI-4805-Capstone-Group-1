import { supabase } from './supabaseClient.js';

// Original standalone comments functionality.
// Being adapted for individual Activity Feed posts.

function getCommentElements(postCard) {
    return {
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
    const { data, error } = await supabase
        .from('comments')
        .select('comment_text')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
        .range(offset, offset + 25); // Limit to the first 25 comments

    if (error) {
        console.error('Error loading comments:', error);
        return;
    }

    const { commentsList, viewMoreCommentsButton } = elements;
    if (offset === 0) {
        commentsList.innerHTML = ''; // Clear existing comments only on the initial load
    }
    displayComments(
        data.slice(0, 25).map(comment => comment.comment_text),
        commentsList,
        viewMoreCommentsButton
    );

    viewMoreCommentsButton.hidden = data.length <= 25;

}

function displayComments(comments, commentsList, viewMoreCommentsButton) {    // Display comments in the comments section, shortening them if they exceed the specified length and adding a "View More" button for longer comments
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        if (comment.length > shortenedCommentLength) { // Check if the comment exceeds the shortened length
            commentDiv.textContent = comment.substring(0, shortenedCommentLength) + '...';
            const viewMoreButton = document.createElement('button');
            viewMoreButton.textContent = 'View More';
            commentDiv.appendChild(viewMoreButton);
            let isExpanded = false;
            viewMoreButton.addEventListener('click', () => {
                if (isExpanded) { // If the comment is expanded, shorten it again and change the button text
                    commentDiv.textContent = comment.substring(0, shortenedCommentLength) + '...';
                    viewMoreButton.textContent = 'View More';
                } else {    // If the comment is shortened, expand it to show the full comment and change the button text
                    commentDiv.textContent = comment;
                    viewMoreButton.textContent = 'View Less';
                }
                commentDiv.appendChild(viewMoreButton);
                isExpanded = !isExpanded;
            });
        } else {
            commentDiv.textContent = comment;
        }
        commentsList.appendChild(commentDiv);   // Append the comment to the comments list
    });
}