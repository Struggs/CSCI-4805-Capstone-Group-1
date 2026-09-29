const postButton = document.getElementById('post');
const commentInput = document.getElementById('comment');
const commentsSection = document.getElementById('comments-section');
const commentsButton = document.getElementById('comments-button');
const viewMoreCommentsButton = document.getElementById('view-more-comments-button');
const shortenedCommentLength = 200; // Length at which comments will be shortened

postButton.addEventListener('click', () => {
    const commentText = commentInput.value;
    if (commentText) {
        const commentDiv = document.createElement('div');
        commentDiv.textContent = commentText;
        commentsSection.appendChild(commentDiv);
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

for (let i = 1; i <= 100; i++) {
    const testComment = document.createElement('div');
    testComment.classList.add('comment');
    if (i === 1) {
        testComment.textContent = `This is a long test comment. `.repeat(10);
        if (testComment.textContent.length > shortenedCommentLength) {
            testComment.textContent =
                testComment.textContent.slice(0, shortenedCommentLength) + '...';
        }
    } else {
        testComment.textContent = `Test comment ${i}`;
    }

    if (i > 25) {
        testComment.hidden = true;
    }
    commentsSection.appendChild(testComment);
}