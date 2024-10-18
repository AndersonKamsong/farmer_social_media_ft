import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostService from '../../services/PostService';
import './PostDetailPage.css';  // Add a CSS file for custom styling

const PostDetailPage = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [likedByUsers, setLikedByUsers] = useState([]);
    const [formData, setFormData] = useState({ content: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch post, likes, and comments
    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const postResponse = await PostService.getPostById(postId);
                const commentsResponse = await PostService.getCommentsForPost(postId);
                const likesResponse = await PostService.getLikesForPost(postId);
                setPost(postResponse);
                setComments(commentsResponse);
                console.log(likesResponse);
                setLikedByUsers(likesResponse); // Assuming the API returns a list of users who liked the post
                setLoading(false);
            } catch (error) {
                setError('Error fetching post details');
                setLoading(false);
            }
        };

        fetchPostData();
    }, [postId]);

    // Handle comment submission
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            await PostService.commentOnPost(postId, formData);
            setFormData({ content: '' });
            // Fetch updated comments
            const updatedComments = await PostService.getCommentsForPost(postId);
            setComments(updatedComments);
        } catch (error) {
            setError('Error adding comment');
        }
    };

    if (loading) return <div className="text-center my-5">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-lg-8 mx-auto">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h1 className="card-title text-center">{post.title}</h1>
                            <hr />
                            <img
                                src={`http://localhost:5000/images/${post.id}`}
                                className="card-img-top"
                                alt={post.title}
                                style={{ height: '300px', objectFit: 'contain' }}  // Fixed height for the image
                            />
                            <hr />
                            <p className="card-text">{post.content}</p>
                            <hr />
                            <div className="text-muted">
                                <p>By <a href={`/users/${post.farmer_id}`} className="text-decoration-none">{post.farmer_name}</a></p>
                                <p>Created at: {new Date(post.created_at).toLocaleDateString()}</p>
                                <p><strong>{post.total_likes}</strong> Likes</p>
                                <p><strong>{comments.length}</strong> Comments</p>
                            </div>
                        </div>
                    </div>

                    {/* Display Group Details if post belongs to a group */}
                    {post.group_details && post.group_details.name && (
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h4 className="card-title">Group Details</h4>
                                <p><strong>Group Name:</strong> {post.group_details.name}</p>
                                <p><strong>Description:</strong> {post.group_details.description}</p>
                                <p>
                                    <a href={`/groups/${post.group_details.id}`} className="btn btn-info">View Group</a>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* List of users who liked the post */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h4 className="card-title">Liked by</h4>
                            <ul className="list-group">
                                {likedByUsers.length > 0 ? (
                                    likedByUsers.map((user) => (
                                        <li key={user.id} className="list-group-item">
                                            <a href={`/users/${user.user_id}`} className="text-decoration-none">{user.user_name}</a>
                                        </li>
                                    ))
                                ) : (
                                    <p>No likes yet.</p>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h3 className="card-title">Comments</h3>
                            <form onSubmit={handleCommentSubmit} className="mb-4">
                                <textarea
                                    className="form-control mb-3"
                                    placeholder="Write a comment..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ content: e.target.value })}
                                    rows="3"
                                    required
                                />
                                <button type="submit" className="btn btn-primary">Add Comment</button>
                            </form>

                            <div className="comments-section">
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="card mb-3 shadow-sm">
                                            <div className="card-body">
                                                <p className="mb-1">{comment.content}</p>
                                                <div className="text-muted small">
                                                    <span>By <a href={`/users/${comment.commenter_id}`} className="text-decoration-none">{comment.commenter_name}</a></span> |
                                                    <span> {new Date(comment.created_at).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No comments yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailPage;
