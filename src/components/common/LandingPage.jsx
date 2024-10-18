// src/components/LandingPage.js
import React, { useEffect, useState } from 'react';
import PostService from '../../services/PostService';

const LandingPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch allowed posts from the backend
        const fetchPosts = async () => {
            try {
                const response = await PostService.getAllowedPosts();
                setPosts(response); // Update the state with the fetched posts
            } catch (error) {
                setError('Error fetching posts');
            } finally {
                setLoading(false); // Set loading to false once the fetch is done
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center">Latest Posts</h1>
            <div className="row">
                {posts.length > 0 ? (
                    posts.map((post) => (
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
                                    <hr/>
                                    <p className="card-text" style={{maxHeight:"50px"}}>{post.content.slice(0,200)}</p>
                                    <hr/>
                                    <p className="text-muted">By {post.farmer_name}</p>
                                    <p>{post.created_at}</p>
                                    <div className="d-flex justify-content-between">
                                        <span>{post.like_count} Likes</span>
                                        <a href={`/posts/${post.id}`} className="btn btn-primary">
                                            View Post
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <h3>No posts available.</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingPage;
