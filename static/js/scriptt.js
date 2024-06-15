document.addEventListener('DOMContentLoaded', function() {
    
    const themeBtn = document.getElementById('theme-btn');
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const chatContainer = document.querySelector('.chat-container');
    // Event listener for send button to send message
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLightMode = document.body.classList.contains('light-mode');
        themeBtn.textContent = isLightMode ? 'dark_mode' : 'light_mode';
    });
    // Event listener for Enter key in chat input to send message
    sendBtn.addEventListener('click', sendMessage);

    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
    // Function to send message to Flask backend
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message !== '') {
            // Display user's message in chat
            displayMessage(message, 'outgoing');

            // Send message to Flask using AJAX
            fetch('/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            })
            .then(response => response.json())
            .then(data => {
                // Handle response from Flask
                const responseMessage = data.processed_message || "No response received from server.";
                displayMessage(responseMessage, 'incoming');
            })
            .catch(error => {
                console.error('Error sending message to Flask:', error);
            });

            // Clear input field
            chatInput.value = '';
        }
    }
    // Function to display message in chat
    function displayMessage(message, className) {
        const chatDiv = document.createElement("div");
        chatDiv.classList.add("chat", className);
        chatDiv.innerHTML = `<div class="chat-content">
                                <div class="chat-details">
                                    <img src="static/images/${className === 'incoming' ? 'ai' : 'user'}.png" alt="${className === 'incoming' ? 'ai-img' : 'user-img'}">
                                    <p>${message}</p>
                                </div>
                            </div>`;
        chatContainer.appendChild(chatDiv);
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
    }
});