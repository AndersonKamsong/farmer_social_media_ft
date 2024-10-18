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
            
            <Outlet />
        </div>
    );
}
