const postButton = document.getElementById('post');
const commentInput = document.getElementById('comment');
const commentsSection = document.getElementById('comments-section');
const commentsButton = document.getElementById('comments-button');
const viewMoreCommentsButton = document.getElementById('view-more-comments-button');
const shortenedCommentLength = 200; // Length at which comments will be shortened
const charCount = document.getElementById('char-count');
const commentsList = document.getElementById('comments-list');
const commentForm = document.getElementById('comment-form');

commentForm.addEventListener('submit', (event) => {     //Prevent the default form submission behavior
    event.preventDefault();
    const commentText = commentInput.value;
    if (commentText.trim()) {
        displayComments([commentText]);
        commentInput.value = '';
        charCount.textContent = '0/1000';
        postButton.disabled = true;
    }
    else {
        postButton.disabled = true;
    }
});

commentInput.addEventListener('input', () => {  // Update character count and enable/disable post button based on input
    const currentLength = commentInput.value.length;
    charCount.textContent = `${currentLength}/1000`;
    postButton.disabled = commentInput.value.trim() === '';
});

commentsButton.addEventListener('click', () => {    // Show the comments section and check if there are hidden comments to display the "View More Comments" button
    commentsSection.hidden = false;
    const hiddenComments = commentsSection.querySelectorAll('.comment[hidden]');
    if (hiddenComments.length > 0) {
        viewMoreCommentsButton.hidden = false;
    }
})

viewMoreCommentsButton.addEventListener('click', () => {    // Show the next 25 hidden comments and hide the "View More Comments" button if there are no more hidden comments
    const hiddenComments = commentsSection.querySelectorAll('.comment[hidden]');
    const nextComments = Array.from(hiddenComments).slice(0, 25);
    nextComments.forEach(comment => {
        comment.hidden = false;

    });
    const remainingComments = commentsSection.querySelectorAll('.comment[hidden]'); // Check if there are any remaining hidden comments
    if (remainingComments.length === 0) {
        viewMoreCommentsButton.hidden = true;
    }
});

function displayComments(comments) {    // Display comments in the comments section, shortening them if they exceed the specified length and adding a "View More" button for longer comments
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        if (commentsList.children.length >= 25) {
            commentDiv.hidden = true;
        }
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
        if (commentsList.querySelector('.comment[hidden]')) {
            viewMoreCommentsButton.hidden = false;
        }
    });
}