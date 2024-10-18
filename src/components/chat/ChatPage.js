// ChatPage.js
import React, { useEffect, useState } from 'react';
import ChatService from '../../services/ChatService'; // Your updated chat service
import { Outlet, useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';

const ChatPage = () => {
    const [chats, setChats] = useState([]); // State for chats
    const [users, setUsers] = useState([]); // State for all users
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const navigate = useNavigate();

    // Fetch user's chat rooms
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const chatData = await ChatService.getUserChatRooms(); // Fetch user's chat list
                setChats(chatData);
            } catch (error) {
                console.error('Error fetching chats:', error);
            } finally {
                setLoadingChats(false);
            }
        };

        fetchChats();
    }, []);

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userData = await UserService.getAllUsers(); // Fetch all users
                setUsers(userData);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, []);

    // Navigate to the chat with a specific user
    const handleChatClick = async (userId) => {
        try {
            const chatRoom = await ChatService.getOrCreateChatRoom(userId); // Get or create a chat room
            navigate(`/chat/${chatRoom.chat_room_id}`); // Redirect to the chat page with the selected user
        } catch (error) {
            console.error('Error creating or retrieving chat room:', error);
        }
    };

    return (
        <div className="container mt-5">
            {["/chat/", "/chat"].includes(window.location.pathname) ? (
                <>
                    {/* <h2 className="text-center">Your Chats</h2> */}

                    {/* {loadingChats ? (
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading chats...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="list-group mb-4">
                            {chats.length > 0 ? (
                                chats.map(chat => (
                                    <div
                                        key={chat.id}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => handleChatClick(chat.other_user_id)}
                                    >
                                        <strong>{chat.other_user_name}</strong>
                                        <p>{chat.last_message}</p>
                                        <small>{new Date(chat.timestamp).toLocaleString()}</small>
                                    </div>
                                ))
                            ) : (
                                <p>No chats found.</p>
                            )}
                        </div>
                    )} */}

                    <h2 className="text-center">Start a New Chat</h2>

                    {loadingUsers ? (
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading users...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="list-group">
                            {users.length > 0 ? (
                                users.map(user => (
                                    <div
                                        key={user.id}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => handleChatClick(user.id)}
                                    >
                                        {user.full_name} ({user.email})
                                    </div>
                                ))
                            ) : (
                                <p>No users found.</p>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <Outlet />
            )}
        </div>
    );
};

export default ChatPage;
