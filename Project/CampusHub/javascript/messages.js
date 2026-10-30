import { supabase } from './supabaseClient.js';
// Private Messaging - Section 10
export function initializeMessages() {
    const conversationList = document.getElementById("conversation-list");
    const messageFormElement = document.getElementById("message-form");

    if (!conversationList || !messageFormElement) {
        return;
    }

    if (messageFormElement.dataset.initialized === "true") {
        return;
    }

    messageFormElement.dataset.initialized = "true";
    const currentChatTitle = document.querySelector("#current-chat h2");
    const messageHistory = document.getElementById("message-history");
    //Gets the message form and text box
    const messageForm = document.getElementById("message-form")
    const messageInput = document.getElementById("message-input");
    let selectedConversation = null;
    const newConversationButton = document.getElementById("new-conversation-button");
const studentSelect = document.getElementById("student-select");

newConversationButton.addEventListener("click", async function () {
    clearMessageError();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        showMessageError("Please log in first.");
        return;
    }

    const { data: students, error } = await supabase
        .from("profiles")
        .select("id, name")
        .neq("id", user.id)
        .order("name");

    if (error) {
        console.error("Unable to load students:", error);
        showMessageError("Unable to load students.");
        return;
    }

    studentSelect.innerHTML = '<option value="">Select a student</option>';

    for (const student of students) {
        const option = document.createElement("option");
        option.value = student.id;
        option.textContent = student.name || "Unknown student";
        studentSelect.appendChild(option);
    }

    studentSelect.hidden = false;
});

studentSelect.addEventListener("change", async function () {
    const otherUserId = studentSelect.value;

    if (!otherUserId) return;

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        showMessageError("Please log in first.");
        return;
    }

    const { data: existing, error: lookupError } = await supabase
        .from("conversations")
        .select("id, user1_id, user2_id")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

    if (lookupError) {
        console.error("Unable to check conversations:", lookupError);
        showMessageError("Unable to check conversations.");
        return;
    }

    const previous = existing.find(chat =>
        (chat.user1_id === user.id && chat.user2_id === otherUserId) ||
        (chat.user2_id === user.id && chat.user1_id === otherUserId)
    );

    if (!previous) {
        const { error } = await supabase
            .from("conversations")
            .insert({
                user1_id: user.id,
                user2_id: otherUserId
            });

        if (error) {
            console.error("Unable to create conversation:", error);
            showMessageError("Unable to create conversation.");
            return;
        }
    }

    studentSelect.hidden = true;
    studentSelect.value = "";
    await loadConversations();
});
    async function loadConversations() {
        const { data: { user }, error: authError } =
            await supabase.auth.getUser();

        if (authError || !user) {
            showMessageError("Please log in to view conversations.");
            return;
        }

        const { data, error } = await supabase
            .from("conversations")
            .select("id, user1_id, user2_id")
            .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

        if (error) {
            console.error("Error loading conversations:", error);
            showMessageError("Unable to load conversations.");
            return;
        }

       conversationList.querySelectorAll(".conversation").forEach(function (conversation) {
    conversation.remove();
});

if (data.length === 0) {
    return;
}
const conversationsWithTime = await Promise.all(
    data.map(async function (chat) {
        const { data: latestMessage, error } = await supabase
            .from("messages")
            .select("created_at")
            .eq("conversation_id", chat.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error("Unable to load conversation time:", error);
        }

        return {
            ...chat,
            lastMessageTime: latestMessage?.created_at || null
        };
    })
);

conversationsWithTime.sort(function (a, b) {
    return new Date(b.lastMessageTime || 0) -
           new Date(a.lastMessageTime || 0);
});

        for (const chat of conversationsWithTime) { 
            const conversation = document.createElement("div");
            conversation.classList.add("conversation");
            conversation.dataset.conversationId = chat.id;

            const otherUserId =
                chat.user1_id === user.id ? chat.user2_id : chat.user1_id;

            const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", otherUserId)
    .maybeSingle();

if (profileError) {
    console.error("Unable to load student name:", profileError);
}

const name = document.createElement("h3");
name.textContent = profile?.name || "Unknown student";

            const preview = document.createElement("p");

const { data: latestMessage, error: latestMessageError } = await supabase
    .from("messages")
    .select("message_text, created_at ")
    .eq("conversation_id", chat.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

if (latestMessageError) {
    console.error("Unable to load message preview:", latestMessageError);
}

preview.textContent = latestMessage?.message_text || "No messages yet";

            const previewTime = document.createElement("span");
previewTime.classList.add("conversation-time");

const messageDate = latestMessage?.created_at
    ? new Date(latestMessage.created_at)
    : null;

if (messageDate) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
        previewTime.textContent = messageDate.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
        previewTime.textContent = "Yesterday";
    } else {
        previewTime.textContent = messageDate.toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: messageDate.getFullYear() !== today.getFullYear()
                ? "numeric"
                : undefined
        });
    }
}

            conversation.appendChild(name);
            conversation.appendChild(preview);
            conversation.appendChild(previewTime);

            conversationList.appendChild(conversation);

            conversation.addEventListener("click", async function () {
                selectedConversation = conversation;
                currentChatTitle.textContent = name.textContent;
                clearMessageError();

                await loadMessages(chat.id);
            });
        }
    }
    async function loadMessages(conversationId) {
        messageHistory.innerHTML = "";

        const { data: messages, error } = await supabase
            .from("messages")
            .select("id, sender_id, message_text, created_at")
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error loading messages:", error);
            showMessageError("Unable to load messages.");
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();

        for (const message of messages) {
            const messageDiv = document.createElement("div");

            messageDiv.classList.add(
                message.sender_id === user?.id
                    ? "sent-message"
                    : "received-message"
            );

            const text = document.createElement("p");
            text.textContent = message.message_text;

            const time = document.createElement("span");
            time.classList.add("message-time");
            time.textContent = new Date(message.created_at)
                .toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit"
                });

            messageDiv.appendChild(text);
            messageDiv.appendChild(time);
            messageHistory.appendChild(messageDiv);
        }

        messageHistory.scrollTop = messageHistory.scrollHeight;
    }

    loadConversations();
    //Runs when the user presses the send button
    messageForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        clearMessageError();
        const messageText = messageInput.value.trim();
        if (selectedConversation == null) {
            showMessageError("Please select a conversation first.")
            return;
        }
        if (messageText.length === 0) {
            showMessageError("Message cannot be empty.");
            return;
        }
        //Prevent messages over 1000 characters
        if (messageText.length > 1000) {
            showMessageError("Message cannot exceed 1000 characters.");
            return;
        }
        const { data: { user }, error: authError } =
            await supabase.auth.getUser();

        if (authError || !user) {
            showMessageError("Please log in to send messages.");
            return;
        }

        const conversationId = selectedConversation.dataset.conversationId;

        if (!conversationId) {
            showMessageError("This conversation is not connected to the database.");
            return;
        }

        const { error: sendError } = await supabase
            .from("messages")
            .insert({
                conversation_id: conversationId,
                sender_id: user.id,
                message_text: messageText
            });

        if (sendError) {
            console.error("Message failed:", sendError);
            showMessageError("Unable to send message.");
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
        recentMessage.textContent = messageText;
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


}
