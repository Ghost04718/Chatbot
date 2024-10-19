// Function to send a message
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (message) {
        const chatId = document.querySelector('.chat-messages').dataset.chatId;
        
        fetch('/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `chat_id=${chatId}&message=${encodeURIComponent(message)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
                return;
            }
            appendMessage(data.user_message, true);
            appendMessage(data.ai_message, false);
            messageInput.value = '';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

// Function to append a message to the chat
function appendMessage(message, isUser) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = isUser ? 'message user-message' : 'message ai-message';
    
    if (isUser) {
        messageElement.textContent = message;
    } else {
        // Use innerHTML for AI messages to render the HTML content
        messageElement.innerHTML = message;
    }
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Event listener for sending messages
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Function to create a new chat
function createChat() {
    const title = prompt('Enter chat title:');
    if (title) {
        fetch('/create_chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `title=${encodeURIComponent(title)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

// Function to delete a chat
function deleteChat(chatId) {
    if (confirm('Are you sure you want to delete this chat?')) {
        fetch(`/delete_chat/${chatId}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

// Function to load chat history
function loadChatHistory(chatId) {
    fetch(`/get_chat_history/${chatId}`)
        .then(response => response.json())
        .then(data => {
            const chatMessages = document.querySelector('.chat-messages');
            chatMessages.innerHTML = '';
            data.forEach(message => {
                appendMessage(message.content, message.is_user);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Event listener for chat selection
document.querySelectorAll('.chat-item').forEach(item => {
    item.addEventListener('click', function() {
        const chatId = this.dataset.chatId;
        document.querySelector('.chat-messages').dataset.chatId = chatId;
        loadChatHistory(chatId);
    });
});
