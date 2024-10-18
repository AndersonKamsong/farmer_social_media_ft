import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import UserService from '../../services/UserService';

export const currentUser = UserService.getCurrentUser(); // Get current logged-in user

export default function Header() {
    const [openMenu, setOpenMenu] = useState(false);
    const navigate = useNavigate(); // React Router hook for navigation

    const toggleMenu = () => setOpenMenu(!openMenu);

    const handleLogout = () => {
        UserService.logout(); // Clear user session or token
        navigate('/login'); // Redirect to login page after logging out
    };

    return (
        <div className="container mt-5">
            {/* Navigation Header */}
            <header className="mb-4">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <NavLink className="navbar-brand" onClick={() => setOpenMenu(false)} to="/">Campaign Portal</NavLink>
                    <button 
                        className="navbar-toggler" 
                        onClick={toggleMenu} 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNav" 
                        aria-controls="navbarNav" 
                        aria-expanded={openMenu} 
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${openMenu ? 'show' : ''}`} id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            {currentUser ? (
                                <>
                                    {/* Logged-in user links */}
                                    <li className="nav-item">
                                        <NavLink className="nav-link" onClick={() => setOpenMenu(false)} to="/campaigns">
                                            Campaigns
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" onClick={() => setOpenMenu(false)} to="/wallet">
                                            Wallet
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" onClick={() => setOpenMenu(false)} to="/chat">
                                            Chat
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" onClick={() => setOpenMenu(false)} to="/investment">
                                            Investment
                                        </NavLink>
                                    </li>
                                    {/* Admin Links */}
                                    {currentUser.role === 'admin' && (
                                        <>
                                            <li className="nav-item">
                                                <NavLink className="nav-link" onClick={() => setOpenMenu(false)} to="/campaigns/list">
                                                    Campaign List
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink className="nav-link" onClick={() => setOpenMenu(false)} to="/users">
                                                    User List
                                                </NavLink>
                                            </li>
                                        </>
                                    )}
                                    {/* Logout */}
                                    <li className="nav-item">
                                        <button className="nav-link btn btn-link" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    {/* Links for non-logged-in users */}
                                    <li className="nav-item">
                                        <NavLink className="nav-link" onClick={() => setOpenMenu(false)} to="/login">
                                            Login
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" onClick={() => setOpenMenu(false)} to="/signup">
                                            Signup
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </nav>
            </header>
            <Outlet />
        </div>
    );
}
