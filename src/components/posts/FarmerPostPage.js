// src/components/FarmerPostPage.js
import React, { useState, useEffect } from 'react';
import PostService from '../../services/PostService';
import { useLocation } from 'react-router-dom';

const FarmerPostPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const groupId = queryParams.get('groupId');
    const [posts, setPosts] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: null, // Handle image uploads
        groupId: groupId ? groupId : null
    });
    const [editingPostId, setEditingPostId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    // Fetch farmer's posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let response;
                if (groupId) {
                    response = await PostService.getPostsByGroupId(groupId); // Fetch posts by groupId
                } else {
                    response = await PostService.getAllPosts(); // Fetch all posts if no groupId
                }
                setPosts(response);
            } catch (error) {
                setError('Error fetching posts');
            }
        };

        fetchPosts();
    }, [groupId]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData({ ...formData, [name]: files[0] }); // For image upload
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handle form submission (Create or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingPostId) {
                // Update post
                await PostService.updatePost(editingPostId, formData);
            } else {
                // Create new post
                await PostService.createPost(formData);
            }
            setFormData({ title: '', content: '', image: null });
            setEditingPostId(null);
            window.location.reload(); // Reload posts after create/update
        } catch (error) {
            setError('Error creating/updating post');
        } finally {
            setLoading(false);
        }
    };

    // Edit a post
    const handleEdit = (post) => {
        setEditingPostId(post.id);
        setFormData({
            title: post.title,
            content: post.content,
            image: null, // Image is not required for updating
        });
    };

    // Delete a post
    const handleDelete = async (postId) => {
        try {
            await PostService.deletePost(postId);
            setPosts(posts.filter((post) => post.id !== postId)); // Remove from state
        } catch (error) {
            setError('Error deleting post');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-lg-8 mx-auto">

                    <h1 className="text-center">{editingPostId ? 'Update Post' : 'Create New Post'}</h1>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Content</label>
                            <textarea
                                className="form-control"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Image (optional)</label>
                            <input type="file" className="form-control" name="image" onChange={handleChange} />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : editingPostId ? 'Update Post' : 'Create Post'}
                        </button>
                    </form>

                    <hr />

                    <h2>Your Posts</h2>

                    {posts.length > 0 ? (
                        <div className="row">
                            {posts.map((post) => (
                                <div className="col-md-4" key={post.id}>
                                    <div className="card mb-4">
                                        <img
                                            src={`http://localhost:5000/images/${post.id}`}
                                            className="card-img-top"
                                            alt={post.title}
                                            style={{ height: '200px', objectFit: 'cover' }}  // Fixed height for the image
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{post.title}</h5>
                                            <p className="card-text">{post.content}</p>
                                            <div className="d-flex justify-content-between">
                                                <button
                                                    className="btn btn-warning"
                                                    onClick={() => handleEdit(post)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDelete(post.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <h4>No posts found</h4>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FarmerPostPage;
