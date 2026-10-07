

var storedUser = localStorage.getItem("campusHubUser");
var currentUser = storedUser ? JSON.parse(storedUser) : { name: "Test Student", profilePicture: "image.png" };

//

let feedPosts = [ {
id: 1,
author: "get author",
profilePicture: "image.png",
timeStamp: "get time function",
audienceFilter: "get filter function",
title: "get title",
decription: "get description",
image: "image1.png",
commentCount:0,
likeCount: 0
}
]
function createPostInterface() {
    var interfaceDiv = document.getElementById('createPostInterface');
    if (interfaceDiv) {
        interfaceDiv.style.display = "block";
    }
}

function closeCreatePostInterface() {
    var interfaceDiv = document.getElementById('createPostInterface');
    if (interfaceDiv) {
        interfaceDiv.style.display = "none";
    }
}
function showActivityFeed(posts, container, filteredAudience = "ALl"){
if (filteredAudience === undefined) {
        filteredAudience = "All";
    }
if (filteredAudience === "All") {
        filteredPosts = posts;
    } else {
        filteredPosts = posts.filter(function(post) {
            return post.audienceFilter === filteredAudience;
        });
    }
    container.innerHTML = "";
    var template = document.getElementById('post-template');

    filteredPosts.forEach(function(post) {
        var postClone = template.content.cloneNode(true);

        postClone.querySelector('.post-title').textContent = post.title;
        postClone.querySelector('.post-author').textContent = "By: " + post.author;
        postClone.querySelector('.post-desc').textContent = post.description;
        postClone.querySelector('.post-stats').textContent = "❤️ " + post.likeCount + " | 💬 " + post.commentCount;

        container.appendChild(postClone);
    });    
}

function createPost(userId){

    const postTitle = document.getElementById('postTitle').value.trim();
    const postDescription = document.getElementById('postDescription').value.trim();
    const postImage = document.getElementById('postImage').value.trim();
    var audienceFilter = document.getElementById('audienceFilter').value;

    // Handle nested dropdown values
    if (audienceFilter === "Major") {
        audienceFilter = document.getElementById('majorSelect').value;
    } else if (audienceFilter === "Year") {
        audienceFilter = document.getElementById('yearSelect').value;
    }

    if (!postTitle || !postDescription) {
        alert('Please fill out the title and description!');
        return;
    }

const newPost = {
        id: Date.now(), 
        author: userId.name,
        profilePicture: userId.profilePicture,
        timeStamp: new Date(), 
        audienceFilter: audienceFilter || "All",
        title: postTitle,
        description: postDescription,
        image: postImage || "",
        commentCount: 0,
        likeCount: 0
    };

    feedPosts.unshift(newPost);

    var feedContainer = document.getElementById('feed');
    showActivityFeed(feedPosts, feedContainer, "All");
}
function handleAudienceChange() {
    var primaryDropdown = document.getElementById('audienceFilter');
    var majorDropdown = document.getElementById('majorSelect');
    var yearDropdown = document.getElementById('yearSelect');

    majorDropdown.style.display = "none";
    yearDropdown.style.display = "none";

    if (primaryDropdown.value === "Major") {
        majorDropdown.style.display = "block";
    } else if (primaryDropdown.value === "Year") {
        yearDropdown.style.display = "block";
    }
}
function PostSubmission() {
    createPost(currentUser);
}
window.onload = function() {
    var feedContainer = document.getElementById('feed');
    showActivityFeed(feedPosts, feedContainer, "All");
};
