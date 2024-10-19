import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService'; // Import your user service to fetch users
import './UserListPage.css';  // Import custom CSS if needed
// import 'bootstrap/dist/css/bootstrap.min.css';  // Ensure Bootstrap is loaded

const UserListPage = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    // Fetch users from the backend
    const fetchUsers = async () => {
        try {
            const allUsers = await UserService.getAllUsers();  // Fetch all users
            setUsers(allUsers);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchUsers();  // Fetch users when the component mounts
    }, []);

    return (
        <div className="user-list-page container mt-5">
            <h2 className="mb-4">All Users</h2>
            {error && <p className="text-danger">{error}</p>}
            <div className="row">
                <div className="col-lg-6 mx-auto">
                    {users.length > 0 ? (
                        users.map(user => (
                            <div key={user.id} className="">
                                <div className="card shadow-sm">
                                    <div className="card-body text-center">
                                        <img
                                            src={`http://localhost:5000/images/${user.profile_image}`}
                                            alt={user.name}
                                            className="img-fluid rounded-circle mb-3"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                        <h5 className="card-title">{user.name}</h5>
                                        <p className="card-text">{user.email}</p>
                                        <div className="btn-group">
                                            <Link to={`/users/${user.id}`} className="btn btn-primary">View Profile</Link>
                                            <button className="btn btn-info" onClick={()=>{navigate(`/chat/${user.id}`)}}>Chats</button>
                                            <button className="btn btn-outline-success">Follow</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No users found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserListPage;
