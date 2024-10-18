import React, { useEffect, useState } from 'react';
import UserService from '../../services/UserService';  // Import your user service
import ChatService from '../../services/ChatService';  // Import your chat service
import { useNavigate } from 'react-router-dom';

const UserListPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', role: 'User' });

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await UserService.getAllUsers();  // Fetch users from the API
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();  // Fetch users on component mount
    }, []);

    // Handle user creation
    const handleCreateUser = async () => {
        try {
            const createdUser = await UserService.createUser(newUser);  // Create user via API
            setUsers([...users, createdUser]);  // Add the new user to the list
            setNewUser({ firstName: '', lastName: '', email: '', role: 'User' });  // Reset form
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Failed to create user. Please try again.');
        }
    };

    // Handle blocking a user
    const handleBlockUser = async (userId) => {
        try {
            await UserService.blockUser(userId);  // Block user via API
            setUsers(users.map(user => user.id === userId ? { ...user, isActive: false } : user));  // Update user status
        } catch (error) {
            console.error('Error blocking user:', error);
            alert('Failed to block user. Please try again.');
        }
    };

    // Handle reactivating a user
    const handleReactivateUser = async (userId) => {
        try {
            await UserService.reactivateUser(userId);  // Reactivate user via API
            setUsers(users.map(user => user.id === userId ? { ...user, isActive: true } : user));  // Update user status
        } catch (error) {
            console.error('Error reactivating user:', error);
            alert('Failed to reactivate user. Please try again.');
        }
    };

    // Handle chat redirection
    const handleChat = async (userId) => {
        console.log(userId);
        try {
            const chatRoom = await ChatService.getOrCreateChatRoom(userId); // Get or create a chat room
            navigate(`/chat/${chatRoom.chat_room_id}`); // Redirect to the chat page with the selected user
        } catch (error) {
            console.error('Error creating or retrieving chat room:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">User Management</h2>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger text-center">
                    {error}
                </div>
            ) : (
                <>
                    {/* User Creation Form */}
                    <div className="mb-4">
                        <h4>Create New User</h4>
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="First Name"
                            value={newUser.firstName}
                            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                        />
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Last Name"
                            value={newUser.lastName}
                            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                        />
                        <input
                            type="email"
                            className="form-control mb-2"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                        <select
                            className="form-control mb-2"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                        <button className="btn btn-success" onClick={handleCreateUser}>Create User</button>
                    </div>

                    {/* User List */}
                    <div className="row">
                        {users.length > 0 ? (
                            users.map(user => (
                                <div className="col-md-4 mb-4" key={user.id}>
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">{user.firstName} {user.lastName}</h5>
                                            <p className="card-text"><strong>Email:</strong> {user.email}</p>
                                            <p className="card-text"><strong>Status:</strong> {user.isActive ? 'Active' : 'Blocked'}</p>
                                            <div className="d-flex justify-content-between">
                                                {user.isActive ? (
                                                    <button className="btn btn-danger" onClick={() => handleBlockUser(user.id)}>
                                                        Block
                                                    </button>
                                                ) : (
                                                    <button className="btn btn-secondary" onClick={() => handleReactivateUser(user.id)}>
                                                        Reactivate
                                                    </button>
                                                )}
                                                <button className="btn btn-info" onClick={() => handleChat(user.id)}>
                                                    Chat
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center">
                                <p>No users found.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default UserListPage;
