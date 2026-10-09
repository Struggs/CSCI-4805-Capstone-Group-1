// Private Messaging - Section 10
document.addEventListener("DOMContentLoaded", function () {
const conversations = document.querySelectorAll(".conversation");
const currentChatTitle = document.querySelector("#current-chat h2");
const messageHistory = document.getElementById("message-history");
//Gets the message form and text box
const messageForm = document.getElementById("message-form")
const messageInput = document.getElementById("message-input");
let selectedConversation = null;
conversations.forEach(function (conversation) {
    conversation.addEventListener("click", function () {
        selectedConversation = conversation;
        //Gets the student's name 
        const studentName = conversation.querySelector("h3").textContent;
        //Displays the student's name at the top of the chat
        currentChatTitle.textContent = studentName;
        clearMessageError();
    });
});
//Runs when the user presses the send button
messageForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearMessageError();
    const messageText = messageInput.value.trim();
    if (selectedConversation == null) {
        showMessageError("Please select a conversation first.")
        return;
    }
    if(messageText.length === 0) {
        showMessageError("Message cannot be empty.");
        return;
    }
    //Prevent messages over 1000 characters
    if (messageText.length > 1000) {
        showMessageError("Message cannot exceed 1000 characters.");
        return;
    }
    //Gets the current time
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString([], { 
        hour: "numeric",
        minute: "2-digit"
    });
    //Creates the sent message container
    const sentMessage = document.createElement("div");
    sentMessage.classList.add("sent-message");
    //Creates the message text
    const messageParagraph = document.createElement("p");
    messageParagraph.textContent = messageText;
    //Creates the message timestamp
    const messageTime = document.createElement("span");
    messageTime.classList.add("message-time");
    messageTime.textContent = formattedTime;
    //Adds the text and timestamp to the message
    sentMessage.appendChild(messageParagraph);
    sentMessage.appendChild(messageTime);
    //Displays the messsage in the conversation 
    messageHistory.appendChild(sentMessage);
    //Updates the conversation preview
    const recentMessage = selectedConversation.querySelector("p");
    const recentMessageTime = selectedConversation.querySelector("span");
    recentMessage.textContenet = messageText;
    recentMessageTime.textContent = formattedTime;
    //Clears the text box after sending
    messageInput.value = "";
    //Scrolls down to the newest message
    messageHistory.scrollTop = messageHistory.scrollHeight;
});
//Displays an error message
function showMessageError(errorText) {
    let messageError = document.getElementById("message-error");
    //Creates the error element if it does not exist yet
    if (!messageError) {
        messageError = document.createElement("p");
        messageError.id = "message-error";
        messageForm.appendChild(messageError);
    }
    messageError.textContent = errorText;

}
//Clears an old error message
function clearMessageError() {
    const messageError = document.getElementById("message-error");
    if (messageError) {
        messageError.textContent = "";
    }
    }

     
});