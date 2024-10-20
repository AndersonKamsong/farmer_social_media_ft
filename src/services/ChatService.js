// services/MessageService.js

const API_URL = 'http://localhost:5000/messages/'; // Adjust according to your backend API URL
const token = JSON.parse(localStorage.getItem('user'))?.token;


const getMessagesBetweenUsers = async (userId) => {
    try {
        const response = await fetch(`${API_URL}${userId}`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        return await response.json(); // Return the messages
    } catch (error) {
        throw new Error('Error fetching messages: ' + error.message);
    }
};

const createMessage = async (receiverId, content) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({
                receiverId,
                content,
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        return await response.json(); // Return the response from the server
    } catch (error) {
        throw new Error('Error sending message: ' + error.message);
    }
};

export default {
    getMessagesBetweenUsers,
    createMessage,
};
