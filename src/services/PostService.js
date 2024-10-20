const API_URL = 'http://localhost:5000/posts/';
const token = JSON.parse(localStorage.getItem('user'))?.token;

class PostService {
    async createPost(postData) {
        const token = JSON.parse(localStorage.getItem('user')).token;

        // First, create the post with the basic data (title, content, etc.)
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
            body: JSON.stringify(postData), // postData includes title, content, etc.
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        // Get the created post's ID from the response
        const createdPost = await response.json();

        // Upload the image (if provided)
        if (postData.image) {
            console.log(createdPost);
            let formData = new FormData();
            formData.append('images', postData.image); // Assume imageFile is the file to upload

            const imageUploadResponse = await fetch(`http://localhost:5000/api/uploadFile/${createdPost.postId}`, {
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

        return createdPost; // Return the created post data
    }

    // Get all posts (accessible by all users)
    async getAllPosts() {
        const response = await fetch(`${API_URL}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json(); // Return list of all posts
    }
    async getAllPostsAdmin() {
        const response = await fetch(`${API_URL}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json(); // Return list of all posts
    }
    async getPostsByGroupId(groupId) {
        const response = await fetch(`${API_URL}group/${groupId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json(); // Return list of all posts
    }
    async getAllCreatedPosts() {
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

        return response.json(); // Return list of all posts
    }
    async getPostsByUserId(userId) {
        const token = JSON.parse(localStorage.getItem('user')).token; // Assuming you store token in localStorage
        const response = await fetch(`${API_URL}user/${userId}/posts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json(); // Return list of posts
    }
    // Get all allowed posts
    async getAllowedPosts() {
        const response = await fetch(`${API_URL}allowed/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    }
    // Get a post by its ID (accessible by all users)
    async getPostById(postId) {
        const response = await fetch(`${API_URL}${postId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json(); // Return the post data
    }
    // Update a post (only accessible by the farmer who created it)
    async updatePost(postId, postData) {
        const token = JSON.parse(localStorage.getItem('user')).token;

        // First, update the post with the new data (title, content, etc.)
        const response = await fetch(`${API_URL}${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
            body: JSON.stringify(postData), // postData includes updated title, content, etc.
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        // Get the updated post's ID from the response
        const updatedPost = await response.json();

        // Upload the new image (if provided)
        if (postData.image) {
            let formData = new FormData();
            formData.append('images', postData.image); // Assume imageFile is the file to upload

            const imageUploadResponse = await fetch(`http://localhost:5000/api/uploadFile/${postId}`, {
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

        return updatedPost; // Return the updated post data
    }

    // async updatePost(postId, postData) {
    //     const token = JSON.parse(localStorage.getItem('user')).token;
    //     const response = await fetch(`${API_URL}${postId}`, {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //         },
    //         body: JSON.stringify(postData),
    //     });

    //     if (!response.ok) {
    //         const errorData = await response.json();
    //         throw new Error(`Error: ${response.status} - ${errorData.message}`);
    //     }

    //     return response.json(); // Return updated post data
    // }

    // Delete a post (only accessible by the farmer who created it)
    async deletePost(postId) {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(`${API_URL}${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json(); // Return a success message or deleted post data
    }

    // Like a post (accessible by all users)
    async likePost(postId) {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(`${API_URL}${postId}/like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        return response.json(); // Return success or post data
    }
    async disLikePost(postId) {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(`${API_URL}${postId}/dislike`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        return response.json(); // Return success or post data
    }

    // Comment on a post (accessible by all users)
    async commentOnPost(postId, commentData) {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch(`${API_URL}${postId}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(commentData), // commentData is the content of the comment
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        return response.json(); // Return the created comment
    }

    // Get comments for a post (accessible by all users)
    async getCommentsForPost(postId) {
        const response = await fetch(`${API_URL}${postId}/comments`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json(); // Return the list of comments for the post
    }
    async getLikesForPost(postId) {
        const response = await fetch(`${API_URL}${postId}/likes`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json(); // Return the list of comments for the post
    }

    // Get like count for a post (accessible by all users)
    async getLikeCountForPost(postId) {
        const response = await fetch(`${API_URL}${postId}/like-count`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json(); // Return the number of likes for the post
    }

    // Get users who liked a post (accessible by all users)
    async getUsersWhoLikedPost(postId) {
        const response = await fetch(`${API_URL}${postId}/users-who-liked`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json(); // Return the list of users who liked the post
    }

    async blockPost(postId) {
        const response = await fetch(`${API_URL}block/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
        });
        return response.json();
    };

    async reactivatePost(postId) {
        const response = await fetch(`${API_URL}reactivate/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
        });
        return response.json();
    };
}

export default new PostService();
