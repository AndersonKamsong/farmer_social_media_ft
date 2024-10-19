// components/MessageChat.js

import React, { useState, useEffect } from 'react';
// import MessageService from '../../services/MessageService';
import ChatService from '../../services/ChatService';
import { useParams } from 'react-router-dom';
import './ChatRoom.css';
const user = JSON.parse(localStorage.getItem('user')).user;

const MessageChat = () => {
    let { userId } = useParams()
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null)

    useEffect(() => {
        if (user) {
            setCurrentUserId(user.id)
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
    }, [userId]);

    const handleSendMessage = async () => {
        try {
            const response = await ChatService.createMessage(userId, content);
            setMessages((prevMessages) => [...prevMessages, { content, sender_id: currentUserId, receiver_id: userId, sent_at: new Date(), ...response }]); // Update local messages state
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
                        <div className="messages">
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
