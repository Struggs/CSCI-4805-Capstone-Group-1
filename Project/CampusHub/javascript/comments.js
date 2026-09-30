const postButton = document.getElementById('post');
const commentInput = document.getElementById('comment');
const commentsSection = document.getElementById('comments-section');
const commentsButton = document.getElementById('comments-button');
const viewMoreCommentsButton = document.getElementById('view-more-comments-button');
const shortenedCommentLength = 200; // Length at which comments will be shortened
const charCount = document.getElementById('char-count');
const commentsList = document.getElementById('comments-list');

postButton.addEventListener('click', () => {
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

commentInput.addEventListener('input', () => {
    const currentLength = commentInput.value.length;
    charCount.textContent = `${currentLength}/1000`;
    postButton.disabled = commentInput.value.trim() === '';
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
        if (commentsList.children.length >= 25) {
            commentDiv.hidden = true;
        }
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
        commentsList.appendChild(commentDiv);
        if (commentsList.querySelector('.comment[hidden]')) {
            viewMoreCommentsButton.hidden = false;
        }
    });
}