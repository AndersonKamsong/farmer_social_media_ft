const API_URL = 'http://localhost:5000/users/';

class UserService {
    // Register a new user (farmer or normal user)
    async register(userData) {
        const response = await fetch(`${API_URL}register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: userData.firstName + " " + userData.lastName,
                email: userData.email,
                password: userData.password,
                role: userData.accountType, // Farmer or normal user
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        return response.json(); // Return newly created user's data
    }

    // Login a user
    async login(email, password) {
        const response = await fetch(`${API_URL}login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data));  // Save the user data or token in local storage
        return data;
    }

    // Fetch all users (admin access)
    async getAllUsers() {
        const token = JSON.parse(localStorage.getItem('user')).token; // Fetch token from localStorage
        const response = await fetch(`${API_URL}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include the JWT token in the request header
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json();
    }

    // Fetch all farmers (admin access)
    async getAllFarmers() {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(`${API_URL}farmers`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json();
    }

    // Get the user's profile
    async getUserProfile(userId) {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(`${API_URL}${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json();
    }
    async getFollowersForUser(userId) {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(`${API_URL}${userId}/followers`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json();
    }

    // Update the user's profile
    async updateUserProfile(userData) {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(`${API_URL}profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData), // Send updated data
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        return response.json(); // Return updated user's data
    }

    // Follow a farmer
    async followFarmer(farmerId) {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(`${API_URL}${farmerId}/follow`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        return response.json();
    }

    // Unfollow a farmer
    async unfollowFarmer(farmerId) {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(`${API_URL}${farmerId}/unfollow`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        return response.json();
    }

    // Get followers of a farmer
    async getFollowers(farmerId) {
        const response = await fetch(`${API_URL}${farmerId}/followers`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json();
    }

    // Get farmers that a user is following
    async getFollowing() {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(`${API_URL}following`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json();
    }

    // Check if a user is following a farmer
    async isFollowing(farmerId) {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(`${API_URL}${farmerId}/is-following`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json();
    }
    async blockUser(userId) {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(`${API_URL}block/${userId}`, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json();
    };

    async reactivateUser(userId) {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(`${API_URL}reactivate/${userId}`, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json();
        // return axios.post(`${API_URL}/reactivate/${userId}`);
    };

    // Get current logged-in user data
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    // Logout user by clearing local storage
    logout() {
        localStorage.removeItem('user');
    }
}

export default new UserService();
