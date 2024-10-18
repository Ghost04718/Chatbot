document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.querySelector('.chat-container');
    const chatList = document.getElementById('chat-list');
    const chatMessages = document.getElementById('chat-messages');
    const messageForm = document.getElementById('message-form');
    const userMessageInput = document.getElementById('user-message');
    const createChatForm = document.getElementById('create-chat-form');
    const chatTitleInput = document.getElementById('chat-title');
    const aiTyping = document.getElementById('ai-typing');
    const userMessageTextarea = document.getElementById('user-message');

    let currentChatId = chatContainer.dataset.activeChatId;
    if (currentChatId === 'null') {
        currentChatId = null;
    } else {
        currentChatId = parseInt(currentChatId, 10);
    }

    let isWaitingForResponse = false;

    // Load initial chat history if there's an active chat
    if (currentChatId) {
        fetchChatHistory(currentChatId);
    } else {
        displayNoChatMessage();
    }

    // Create new chat
    createChatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = chatTitleInput.value;
        fetch('/create_chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `title=${encodeURIComponent(title)}`,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const newChatItem = document.createElement('li');
                newChatItem.dataset.chatId = data.chat_id;
                newChatItem.innerHTML = `
                    <span class="chat-title">${data.title}</span>
                    <button class="delete-chat" data-chat-id="${data.chat_id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                chatList.appendChild(newChatItem);
                chatTitleInput.value = '';
                selectChat(newChatItem);
                if (chatList.children.length === 1) {
                    // This is the first chat, remove the "No chats" message
                    chatMessages.innerHTML = '';
                }
            }
        });
    });

    // Select chat
    chatList.addEventListener('click', (e) => {
        const chatItem = e.target.closest('li');
        if (chatItem) {
            const deleteButton = e.target.closest('.delete-chat');
            if (deleteButton) {
                e.stopPropagation(); // Prevent chat selection when clicking delete
                const chatId = deleteButton.dataset.chatId;
                deleteChat(chatId);
            } else {
                selectChat(chatItem);
            }
        }
    });

    function selectChat(chatElement) {
        currentChatId = chatElement.dataset.chatId;
        chatMessages.innerHTML = '';
        fetchChatHistory(currentChatId);
        document.querySelectorAll('#chat-list li').forEach(li => li.classList.remove('active'));
        chatElement.classList.add('active');
        messageForm.style.display = 'flex';
    }

    function deleteChat(chatId) {
        if (confirm('Are you sure you want to delete this chat?')) {
            fetch(`/delete_chat/${chatId}`, {
                method: 'POST',
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const chatElement = document.querySelector(`#chat-list li[data-chat-id="${chatId}"]`);
                    chatElement.remove();
                    if (currentChatId === chatId) {
                        currentChatId = null;
                        chatMessages.innerHTML = '';
                        displayNoChatMessage();
                    }
                    if (chatList.children.length === 0) {
                        displayNoChatMessage();
                    }
                } else {
                    alert('Failed to delete chat. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to delete chat. Please try again.');
            });
        }
    }

    // Send message
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentChatId) {
            alert('Please select or create a chat first');
            return;
        }
        if (isWaitingForResponse) {
            alert('Please wait for the AI to respond before sending another message.');
            return;
        }
        const message = userMessageInput.value;
        if (message.trim() === '') return;
        sendMessage(message);
    });

    function sendMessage(message) {
        isWaitingForResponse = true;
        aiTyping.style.display = 'block';
        userMessageInput.value = '';
        userMessageInput.disabled = true;

        fetch('/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `chat_id=${currentChatId}&message=${encodeURIComponent(message)}`,
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
                alert('Failed to send message. Please try again.');
            } else {
                displayMessage(data.user_message, true);
                displayMessage(data.ai_message, false);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to send message. Please try again.');
        })
        .finally(() => {
            isWaitingForResponse = false;
            aiTyping.style.display = 'none';
            userMessageInput.disabled = false;
            userMessageInput.focus();
        });
    }

    function fetchChatHistory(chatId) {
        fetch(`/get_chat_history/${chatId}`)
            .then(response => response.json())
            .then(history => {
                chatMessages.innerHTML = '';
                if (history.length === 0) {
                    displayWelcomeMessage();
                } else {
                    history.forEach(message => {
                        displayMessage(message.content, message.is_user);
                    });
                }
            });
    }

    function displayMessage(message, isUser) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', isUser ? 'user-message' : 'ai-message');
        
        if (isUser) {
            messageElement.textContent = message;
        } else {
            // Configure marked to use highlight.js for code highlighting
            marked.setOptions({
                highlight: function(code, lang) {
                    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                    return hljs.highlight(code, { language }).value;
                },
                langPrefix: 'hljs language-'
            });
            
            messageElement.innerHTML = marked.parse(message);
        }
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function displayNoChatMessage() {
        chatMessages.innerHTML = '<div class="no-chat-message">No chats yet. Create a new chat to get started!</div>';
        messageForm.style.display = 'none';
    }

    function displayWelcomeMessage() {
        chatMessages.innerHTML = '<div class="welcome-message">Welcome to your new chat! Send a message to start the conversation.</div>';
    }

    // Initial UI setup
    if (!currentChatId) {
        displayNoChatMessage();
    }

    // Auto-resize textarea
    userMessageTextarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Handle key presses in the textarea
    userMessageTextarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Shift+Enter: add a new line
                return true;
            } else {
                // Enter alone: submit the form
                e.preventDefault();
                messageForm.dispatchEvent(new Event('submit'));
            }
        }
    });
});
