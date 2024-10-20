import React, { useEffect, useState } from 'react';
import PostService from '../../services/PostService';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
const user = JSON.parse(localStorage.getItem('user'))?.user;

const LandingPage = () => {
    const navigate = useNavigate()
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null)
    // const currentUserId = user; // Replace this with the actual ID of the connected user

    useEffect(() => {
        // Fetch allowed posts from the backend
        if (user) {
            setCurrentUserId(user.id)
        }
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

    const checkUserLiked = (likedByUsers) => {
        const likedUsers = likedByUsers.split(',').map(userId => parseInt(userId.trim()));
        const isLiked = likedUsers.includes(currentUserId);
        return isLiked
    }
    // Handle liking or disliking a post
    const handleLikeToggle = async (postId, likedByUsers) => {
        let isLiked = false
        if (likedByUsers) {
            const likedUsers = likedByUsers.split(',').map(userId => parseInt(userId.trim()));
            isLiked = likedUsers.includes(currentUserId);
        }

        try {
            if (isLiked) {
                // If already liked, call dislike API
                await PostService.disLikePost(postId);
                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post.id === postId
                            ? { ...post, total_likes: post.total_likes - 1, liked_by_users: likedByUsers.replace(`${currentUserId}`, '') }
                            : post
                    )
                );
            } else {
                // If not liked, call like API
                await PostService.likePost(postId);
                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post.id === postId
                            ? { ...post, total_likes: post.total_likes + 1, liked_by_users: likedByUsers ? `${likedByUsers},${currentUserId}` : `${currentUserId}` }
                            : post
                    )
                );
            }
        } catch (error) {
            console.error('Error liking/disliking post:', error);
        }
    };

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
                <div className="col-lg-6 mx-auto">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <>
                                {/* <div className="col-md-4" key={post.id}>
                                <div className="card mb-4">
                                    <img
                                        src={`http://localhost:5000/images/${post.id}`}
                                        className="card-img-top"
                                        alt={post.title}
                                        style={{ height: '200px', objectFit: 'cover' }}  // Fixed height for the image
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{post.title}</h5>
                                        <hr />
                                        <p className="card-text" style={{ maxHeight: '50px', overflow: 'hidden' }}>
                                            {post.content.slice(0, 200)}...
                                        </p>
                                        <hr />
                                        <p className="text-muted">
                                            By <a href={`/users/${post.farmer_id}`} className="text-decoration-none">{post.farmer_name}</a>
                                        </p>
                                        <p>{new Date(post.created_at).toLocaleDateString()}</p>
                                        <div className="d-flex justify-content-between">
                                            <span>{post.total_likes} Likes</span>
                                            <div>
                                                <button
                                                    className={`btn ${post.liked_by_users.includes(currentUserId) ? 'btn-danger' : 'btn-outline-success'} mr-2`}
                                                    onClick={() => handleLikeToggle(post.id, post.liked_by_users)}
                                                >
                                                    {post.liked_by_users.includes(currentUserId) ? 'Dislike' : 'Like'}
                                                </button>
                                                <a href={`/post/${post.id}`} className="btn btn-primary">
                                                    View Post
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                                <div className="card shadow-sm mb-4">

                                    <div className="card-body">
                                        <div className="post">
                                            <div className="container">
                                                <div className="user">
                                                    <div className="userInfo">
                                                        <img src={`http://localhost:5000/images/${post.id}`}
                                                            alt="" width={40} />
                                                        <div className="details">
                                                            <Link
                                                                // to={`/profile/${post.userId}`}
                                                                style={{ textDecoration: "none", color: "inherit" }}
                                                            >
                                                                <span className="name">{post.title}</span>
                                                            </Link>

                                                            <span className="date pull-right">{moment(post.created_at).fromNow()}</span>
                                                        </div>
                                                    </div>
                                                    {/* <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
                                        {menuOpen && post.userId === currentUser.id && (
                                            <button onClick={handleDelete}>delete</button>
                                        )} */}
                                                </div>
                                                <hr />
                                                <div className="content">
                                                    <p>{post.content}</p>
                                                    <img src={`http://localhost:5000/images/${post.id}`} alt="" style={{ width: "100%" }} />
                                                </div>
                                                <hr />
                                                <div className="info d-flex justify-content-around" >
                                                    <div className="item">
                                                        {post.liked_by_users?.includes(currentUserId) ? (
                                                            <FavoriteOutlinedIcon
                                                                style={{ color: "red" }}
                                                                onClick={() => handleLikeToggle(post.id, post.liked_by_users)}
                                                            />
                                                        ) : (
                                                            <FavoriteBorderOutlinedIcon
                                                                onClick={() => handleLikeToggle(post.id, post.liked_by_users)} />
                                                        )}
                                                        {post.total_likes} Likes
                                                    </div>
                                                    <div className="item" onClick={() => navigate(`/post/${post.id}`)}>
                                                        <TextsmsOutlinedIcon />
                                                        See Comments
                                                    </div>
                                                    <div className="item">
                                                        <ShareOutlinedIcon />
                                                        Share
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <br /> */}
                            </>
                        ))
                    ) : (
                        <div className="col-12">
                            <h3>No posts available.</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
