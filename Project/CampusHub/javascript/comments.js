const postButton = document.getElementById('post');
const commentInput = document.getElementById('comment');
const commentsSection = document.getElementById('comments-section');

postButton.addEventListener('click', () => {
    const commentText = commentInput.value;
    if (commentText) {
        const commentDiv = document.createElement('div');
        commentDiv.textContent = commentText;
        commentsSection.appendChild(commentDiv);
        commentInput.value = '';
    }
});
