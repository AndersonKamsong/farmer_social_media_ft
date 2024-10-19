// src/components/AdminPostsPage.js

import React, { useState, useEffect } from 'react';
import PostService from '../../services/PostService';
// import PostService from '../services/PostService';

const AdminPostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const result = await PostService.getAllPostsAdmin();
                setPosts(result);
            } catch (err) {
                setError('Failed to fetch posts');
            }
        };
        fetchPosts();
    }, []);

    const handleBlock = async (postId) => {
        console.log(postId);
        try {
            await PostService.blockPost(postId);
            setPosts(posts.map(post => post.id === postId ? { ...post, isBlocked: true } : post));
        } catch (err) {
            setError('Failed to block post');
        }
    };

    const handleReactivate = async (postId) => {
        try {
            await PostService.reactivatePost(postId);
            setPosts(posts.map(post => post.id === postId ? { ...post, isBlocked: false } : post));
        } catch (err) {
            setError('Failed to reactivate post');
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-8 mx-auto">
                    <h2>Admin Posts Management</h2>
                    {error && <p className="text-danger">{error}</p>}
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Post ID</th>
                                <th>Title</th>
                                <th>Content</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post.id}>
                                    <td>{post.id}</td>
                                    <td>{post.title}</td>
                                    <td>{post.content}</td>
                                    <td>{post.isBlocked ? 'Blocked' : 'Active'}</td>
                                    <td>
                                        {post.isBlocked ? (
                                            <button className="btn btn-success btn-sm me-2" onClick={() => handleReactivate(post.id)}>Reactivate</button>
                                        ) : (
                                            <button className="btn btn-danger btn-sm me-2" onClick={() => handleBlock(post.id)}>Block</button>
                                        )}
                                        <a href={`/post/${post.id}`} className="btn btn-primary btn-sm me-2">
                                            View Post
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPostsPage;
