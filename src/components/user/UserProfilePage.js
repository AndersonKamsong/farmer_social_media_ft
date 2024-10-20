import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserService from '../../services/UserService';
import PostService from '../../services/PostService';
import GroupService from '../../services/GroupService';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
// import 'bootstrap/dist/css/bootstrap.min.css';
import './UserProfilePage.css'; // Custom CSS for profile page
const connectedUser = JSON.parse(localStorage.getItem('user'))?.user;

const UserProfilePage = () => {
    const navigate = useNavigate()
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [followers, setFollowers] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null)

    useEffect(() => {
        if (user) {
            setCurrentUserId(user.id)
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
                setIsFollowing(userResponse.followers.includes(connectedUser.id));
                setLoading(false);
            } catch (error) {
                setError('Error fetching user profile');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await UserService.unfollowFarmer(userId);
            } else {
                await UserService.followFarmer(userId);
            }
            setIsFollowing(!isFollowing);
        } catch (error) {
            setError('Error updating follow status');
        }
    };

    const handleLikeToggle = async (postId, likedByUsers) => {
        try {
            if (likedByUsers.includes(connectedUser.id)) {
                await PostService.disLikePost(postId);
            } else {
                await PostService.likePost(postId);
            }
            const updatedPosts = await PostService.getPostsByUserId(userId);
            setPosts(updatedPosts);
        } catch (error) {
            setError('Error updating like status');
        }
    };

    if (loading) return <div className="text-center my-5">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                {/* Left Sidebar/Navbar */}
                <div className="col-lg-1 sidebar bg-light p-3">
                    {/* <h4>Navigation</h4>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <a className="nav-link" href="/profile">Profile</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/groups">Groups</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/notifications">Notifications</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/settings">Settings</a>
                        </li>
                    </ul> */}
                </div>

                {/* Main Content */}
                <div className="col-lg-9 offset-lg-2">
                    {/* Profile Header */}
                    <div className="card profile-header shadow-sm mb-4">
                        <div className="card-body text-center position-relative">
                            <img
                                src={`http://localhost:5000/images/${user?.cover_image}`}
                                className="img-fluid cover-image"
                                alt="Cover"
                            />
                            <div className="profile-pic-container">
                                <img
                                    src={`http://localhost:5000/images/${user?.profile_image}`}
                                    alt={user?.name}
                                    className="profile-pic rounded-circle"
                                />
                            </div>
                            <h1 className="card-title mt-3">{user?.name}</h1>
                            <p className="text-muted">{user?.bio}</p>
                            <button
                                className={`btn ${isFollowing ? 'btn-danger' : 'btn-primary'} mt-2`}
                                onClick={handleFollowToggle}
                            >
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                        </div>
                    </div>
                    <div className='row'>
                        <div className="col-4">
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
                        </div>
                        <div className="col-8">
                            {/* User's Posts */}
                            <div className="card shadow-sm mb-4">
                                <div className="card-body">
                                    <h3 className="card-title">Posts</h3>
                                    <div className="row">
                                        {posts.length > 0 ? (
                                            posts.map((post) => (
                                                <>
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
                                                                                <span className="date">{moment(post.created_at).fromNow()}</span>
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
                                                                            {post.liked_by_users.includes(currentUserId) ? (
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
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
