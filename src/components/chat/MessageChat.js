// components/MessageChat.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatService from '../../services/ChatService';
import { io } from 'socket.io-client'; // Import Socket.io client
import './ChatRoom.css';

const user = JSON.parse(localStorage.getItem('user'))?.user;
const socket = io('http://localhost:5000'); // Adjust URL as needed

const MessageChat = () => {
    const { userId } = useParams();
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        if (user) {
            setCurrentUserId(user.id);
        }

        const fetchMessages = async () => {
            try {
                const fetchedMessages = await ChatService.getMessagesBetweenUsers(userId);
                setMessages(fetchedMessages);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchMessages();

        // Listen for incoming messages
        socket.on('receiveMessage', (message) => {
            console.log(message)
            if (message.receiver_id === currentUserId.toString())
                setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Clean up the socket connection on component unmount
        return () => {
            socket.off('receiveMessage');
        };
    }, [userId]);

    const handleSendMessage = async () => {
        try {
            const messageData = {
                sender_id: currentUserId,
                receiver_id: userId,
                content,
                sent_at: new Date()
            };

            await ChatService.createMessage(userId, content); // Send message to backend
            socket.emit('sendMessage', messageData); // Emit the message to the socket
            setMessages((prevMessages) => [...prevMessages, { ...messageData }]); // Update local messages state
            setContent(''); // Clear the input field
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-6 mx-auto">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="message-container">
                        <h3>Chat</h3>
                        <div className="messages" style={{ maxHeight: "350px", overflowY: "auto" }}>
                            {messages.map((message) => (
                                <div key={message.id} className={`message ${message.sender_id === currentUserId ? 'sent' : 'received'}`}>
                                    <p>{message.content}</p>
                                    <small>{new Date(message.sent_at).toLocaleTimeString()}</small>
                                </div>
                            ))}
                        </div>
                        <div className="input-group mt-3">
                            <input
                                type="text"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="form-control"
                                placeholder="Type your message..."
                            />
                            <button onClick={handleSendMessage} className="btn btn-primary">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageChat;
