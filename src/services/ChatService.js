import { currentUser } from "../components/common/Header";

const API_URL = 'http://127.0.0.1:8000/chat/';

class ChatService {
    // Create or get a chat room
    async getOrCreateChatRoom(userId) {
        const response = await fetch(`${API_URL}room/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user1_id: currentUser.id,
                user2_id: userId,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }
        return response.json();  // Return the created or retrieved chat room data
    }

    // Send a message to a chat room
    async sendMessage(chatRoomId, senderId, content) {
        const response = await fetch(`${API_URL}message/send/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_room_id: chatRoomId,
                sender_id: senderId,
                content: content,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }
        return response.json();  // Return the sent message data
    }

    // Get all messages in a chat room
    async getMessages(chatRoomId) {
        const response = await fetch(`${API_URL}messages/${chatRoomId}/`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();  // Return the messages in the chat room
    }
    async getUserChatRooms(userId) {
        const response = await fetch(`${API_URL}user/${userId}/chat_rooms/`, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }
        return response.json();  // Return the chat rooms for the user
    }
}

export default new ChatService();

