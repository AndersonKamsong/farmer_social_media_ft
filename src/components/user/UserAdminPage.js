import React, { useEffect, useState } from 'react';
import UserService from '../../services/UserService'; // Assumes you have a service for API calls
import './UsersAdminPage.css'; // Optional, you can style your table

const UsersAdminPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    // Fetch all users from the API
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await UserService.getAllUsers();
            setUsers(response);
            setLoading(false);
        } catch (error) {
            setError('Error fetching users');
            setLoading(false);
        }
    };

    // Block or reactivate a user
    const toggleUserStatus = async (userId, isBlocked) => {
        try {
            if (isBlocked) {
                await UserService.reactivateUser(userId);
            } else {
                await UserService.blockUser(userId);
            }
            fetchUsers(); // Re-fetch users after updating status
        } catch (error) {
            setError('Error updating user status');
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-8 mx-auto">
            <h2>Users Management</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
                                <td>
                                    <button
                                        className={`btn btn-${user.isBlocked ? 'success' : 'danger'}`}
                                        onClick={() => toggleUserStatus(user.id, user.isBlocked)}
                                    >
                                        {user.isBlocked ? 'Reactivate' : 'Block'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            </div>
            </div>
        </div>
    );
};

export default UsersAdminPage;
