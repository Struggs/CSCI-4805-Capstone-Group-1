const postButton = document.getElementById('post');
const commentInput = document.getElementById('comment');
const commentsSection = document.getElementById('comments-section');
const commentsButton = document.getElementById('comments-button');
const viewMoreCommentsButton = document.getElementById('view-more-comments-button');
const shortenedCommentLength = 200; // Length at which comments will be shortened

postButton.addEventListener('click', () => {
    const commentText = commentInput.value;
    if (commentText) {
        displayComments([commentText]);
        commentInput.value = '';
    }
});

commentsButton.addEventListener('click', () => {
    commentsSection.hidden = false;
    const hiddenComments = commentsSection.querySelectorAll('.comment[hidden]');
    if (hiddenComments.length > 0) {
        viewMoreCommentsButton.hidden = false;
    }
})

viewMoreCommentsButton.addEventListener('click', () => {
    const hiddenComments = commentsSection.querySelectorAll('.comment[hidden]');
    const nextComments = Array.from(hiddenComments).slice(0, 25);
    nextComments.forEach(comment => {
        comment.hidden = false;

    });
    const remainingComments = commentsSection.querySelectorAll('.comment[hidden]');
    if (remainingComments.length === 0) {
        viewMoreCommentsButton.hidden = true;
    }
});

function displayComments(comments) {
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        if (comment.length > shortenedCommentLength) {
            commentDiv.textContent = comment.substring(0, shortenedCommentLength) + '...';
            const viewMoreButton = document.createElement('button');
            viewMoreButton.textContent = 'View More';
            commentDiv.appendChild(viewMoreButton);
            let isExpanded = false;
            viewMoreButton.addEventListener('click', () => {
                if (isExpanded) {
                    commentDiv.textContent = comment.substring(0, shortenedCommentLength) + '...';
                    viewMoreButton.textContent = 'View More';
                } else {
                    commentDiv.textContent = comment;
                    viewMoreButton.textContent = 'View Less';
                }
                commentDiv.appendChild(viewMoreButton);
                isExpanded = !isExpanded;
            });
        } else {
            commentDiv.textContent = comment;
        }
        commentsSection.appendChild(commentDiv);
    });
}