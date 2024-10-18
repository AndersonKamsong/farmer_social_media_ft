// ChatRoom.js
import React, { useEffect, useState } from 'react';
import ChatService from '../../services/ChatService'; // Import the ChatService
import { useParams } from 'react-router-dom'; // For accessing route parameters
import { currentUser } from '../common/Header'; // Get current user details
import './ChatRoom.css';

const ChatRoom = () => {
    const { chatRoomId } = useParams(); // Get chat room ID from the URL
    const [messages, setMessages] = useState([]); // State to hold chat messages
    const [newMessage, setNewMessage] = useState(''); // State for new message input
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch messages for the chat room
    const fetchMessages = async () => {
        setLoading(true);
        try {
            const messageData = await ChatService.getMessages(chatRoomId); // Fetch messages
            setMessages(messageData.messages); // Update messages state
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };
    console.log(messages);
    // Fetch messages on component mount
    useEffect(() => {
        fetchMessages();
    }, [chatRoomId]);

    // Handle sending a new message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return; // Prevent sending empty messages

        try {
            const messageData = await ChatService.sendMessage(chatRoomId, currentUser.id, newMessage); // Send message
            setMessages(prevMessages => [...prevMessages, messageData]); // Update messages with new message
            setNewMessage(''); // Clear input
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Chat Room</h2>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading messages...</span>
                    </div>
                </div>
            ) : (
                <div className="chat-messages" style={{ maxHeight: '400px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <div key={message.id} className={`message ${message.sender_id === currentUser.id ? 'sent' : 'received'}`}>
                                <strong>{message.sender_id === currentUser.id ? 'You' : message.sender_name}:</strong>
                                <p>{message.content}</p>
                                <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
                            </div>
                        ))
                    ) : (
                        <p>No messages yet.</p>
                    )}
                </div>
            )}

            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;
