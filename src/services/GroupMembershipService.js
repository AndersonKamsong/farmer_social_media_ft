const API_URL = 'http://localhost:5000/group-membership/';

class GroupMembershipService {
    // Join a group
    async joinGroup(groupId) {
        const token = JSON.parse(localStorage.getItem('user')).token;

        const response = await fetch(`${API_URL}join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
            body: JSON.stringify(groupId), // Pass the group ID in the request body
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        return response.json(); // Return confirmation of joining the group
    }

    // Leave a group
    async leaveGroup(groupId) {
        const token = JSON.parse(localStorage.getItem('user')).token;

        const response = await fetch(`${API_URL}leave`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
            body: JSON.stringify(groupId), // Pass the group ID in the request body
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        return response.json(); // Return confirmation of leaving the group
    }

    // Get all members of a group
    async getGroupMembers(groupId) {
        const response = await fetch(`${API_URL}${groupId}/members`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json(); // Return list of group members
    }

    // Check if user is a member of a group
    async isUserMember(groupId) {
        const token = JSON.parse(localStorage.getItem('user')).token;

        const response = await fetch(`${API_URL}is-member`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
            body: JSON.stringify(groupId), // Pass the group ID in the request body
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        return response.json(); // Return membership status
    }

    async removeMember({ groupId, memberId }) {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(`${API_URL}remove-member`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include your token if needed
            },
            body: JSON.stringify({ groupId, memberId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        return response.json(); // Return the response if needed
    };
    async handleSetMemberAdmin({ groupId, memberId, role }) {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(`${API_URL}set-admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include your token if needed
            },
            body: JSON.stringify({ groupId, memberId, role }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        return response.json(); // Return the response if needed
    };
}

export default new GroupMembershipService();
