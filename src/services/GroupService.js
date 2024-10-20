const API_URL = 'http://localhost:5000/groups/';

class GroupService {
    // Create a new group
    async createGroup(groupData) {
        const token = JSON.parse(localStorage.getItem('user')).token;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
            body: JSON.stringify(groupData), // groupData should include { name, description, etc. }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }
        const createdGroup = await response.json();

        if (groupData.image) {
            console.log(groupData);
            let formData = new FormData();
            formData.append('images', groupData.image); // Assume imageFile is the file to upload

            const imageUploadResponse = await fetch(`http://localhost:5000/api/groupImage/${createdGroup.groupId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Same token for image upload
                },
                body: formData,
            });

            if (!imageUploadResponse.ok) {
                const errorData = await imageUploadResponse.json();
                throw new Error(`Error: ${imageUploadResponse.status} - ${errorData.message}`);
            }
        }
        
        return createdGroup; // Return created group
    }

    // Get all groups
    async getAllGroups() {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        return response.json(); // Return list of groups
    }
    async getAllCreatedGroups() {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(`${API_URL}created`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        return response.json(); // Return list of groups
    }
    async getAllUserGroups(userId) {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(`${API_URL}${userId}/groups`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        return response.json(); // Return list of groups
    }

    // Get group by ID
    async getGroupById(groupId) {
        const response = await fetch(`${API_URL}${groupId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        return response.json(); // Return group details
    }

    // Update group
    async updateGroup(groupId, groupData) {
        const token = JSON.parse(localStorage.getItem('user')).token;

        const response = await fetch(`${API_URL}${groupId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
            body: JSON.stringify(groupData), // groupData should include updated fields
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }
        if (groupData.image) {
            console.log(groupData);
            let formData = new FormData();
            formData.append('images', groupData.image); // Assume imageFile is the file to upload

            const imageUploadResponse = await fetch(`http://localhost:5000/api/groupImage/${groupData.groupId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Same token for image upload
                },
                body: formData,
            });

            if (!imageUploadResponse.ok) {
                const errorData = await imageUploadResponse.json();
                throw new Error(`Error: ${imageUploadResponse.status} - ${errorData.message}`);
            }
        }
        
        return response.json(); // Return updated group
    }

    // Delete group
    async deleteGroup(groupId) {
        const token = JSON.parse(localStorage.getItem('user')).token;

        const response = await fetch(`${API_URL}${groupId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }
        
        return response.json(); // Return confirmation of deletion
    }

    // Add post to group
    async addPostToGroup(groupId, postData) {
        const token = JSON.parse(localStorage.getItem('user')).token;

        const response = await fetch(`${API_URL}add-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
            body: JSON.stringify({ groupId, ...postData }), // postData should include { title, content, etc. }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }
        
        return response.json(); // Return added post
    }

    // Get posts from a specific group
    async getPostsFromGroup(groupId) {
        const response = await fetch(`${API_URL}${groupId}/posts`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        return response.json(); // Return list of posts from the group
    }
}

export default new GroupService();
