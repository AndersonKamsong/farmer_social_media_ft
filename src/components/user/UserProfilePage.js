import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserService from '../../services/UserService';
import PostService from '../../services/PostService';
import GroupService from '../../services/GroupService';
const connectedUser = JSON.parse(localStorage.getItem('user')).user;

const UserProfilePage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null)
    const [followers, setFollowers] = useState([]); // State to hold followers

    // const currentUserId = JSON.parse(localStorage.getItem('user'))?.id || null;

    // Fetch user details, posts, and groups
    useEffect(() => {
        if (connectedUser) {
            setCurrentUserId(connectedUser.id)
        }
        const fetchUserData = async () => {
            try {
                const userResponse = await UserService.getUserProfile(userId);
                const groupsResponse = await GroupService.getAllUserGroups(userId);
                const postsResponse = await PostService.getPostsByUserId(userId);
                const followersResponse = await UserService.getFollowersForUser(userId);

                setUser(userResponse);
                setPosts(postsResponse);
                setGroups(groupsResponse);
                setFollowers(followersResponse);
                if (connectedUser) {
                    setIsFollowing(userResponse.followers.includes(connectedUser.id)); // Assuming this is a boolean returned from the user service
                    // setCurrentUserId(connectedUser.id)
                }
                setLoading(false);
            } catch (error) {
                setError('Error fetching user profile');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    // Handle follow/unfollow action
    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await UserService.unfollowFarmer(userId);
            } else {
                await UserService.followFarmer(userId);
            }
            setIsFollowing(!isFollowing); // Toggle the follow state
        } catch (error) {
            setError('Error updating follow status');
        }
    };

    const handleLikeToggle = async (postId, likedByUsers) => {
        try {
            if (likedByUsers.includes(currentUserId)) {
                await PostService.disLikePost(postId);
            } else {
                await PostService.likePost(postId);
            }
            // Refresh posts after like/unlike action
            const updatedPosts = await PostService.getPostsByUserId(userId);
            setPosts(updatedPosts);
        } catch (error) {
            setError('Error updating like status');
        }
    };

    if (loading) return <div className="text-center my-5">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-lg-12 mx-auto">
                    {/* User Profile Card */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body text-center">
                            <h1 className="card-title">{user?.name}</h1>
                            <p className="text-muted">{user?.email}</p>
                            <p className="text-muted">{user?.bio}</p>
                            <button
                                className={`btn ${isFollowing ? 'btn-danger' : 'btn-primary'}`}
                                onClick={handleFollowToggle}
                            >
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                        </div>
                    </div>

                    {/* Followers Section */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h4 className="card-title">Followers</h4>
                            <ul className="list-group">
                                {followers.length > 0 ? (
                                    followers.map((follower) => (
                                        <li key={follower.id} className="list-group-item">
                                            <a href={`/users/${follower.user_id}`} className="text-decoration-none">
                                                {follower.user_name}
                                            </a>
                                        </li>
                                    ))
                                ) : (
                                    <p>No followers yet.</p>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* User's Groups */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h4 className="card-title">Groups</h4>
                            <ul className="list-group">
                                {groups.length > 0 ? (
                                    groups.map((group) => (
                                        <li key={group.id} className="list-group-item">
                                            <a href={`/groups/${group.id}`} className="text-decoration-none">
                                                {group.name}
                                            </a>
                                        </li>
                                    ))
                                ) : (
                                    <p>No groups joined yet.</p>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* User's Posts */}
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h3 className="card-title">Posts</h3>
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
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12">
                                        <h3>No posts available.</h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
