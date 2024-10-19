import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GroupService from '../../services/GroupService';
import PostService from '../../services/PostService';
import GroupMembershipService from '../../services/GroupMembershipService';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import moment from "moment";
// const token = JSON.parse(localStorage.getItem('user')).token;
const connecteduserId = JSON.parse(localStorage.getItem('user')).id;
const user = JSON.parse(localStorage.getItem('user')).user;

const GroupDetailPage = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [currentUserId, setCurrentUserId] = useState(null)

    const [group, setGroup] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isMember, setIsMember] = useState(false);
    const [error, setError] = useState(null);
    const [adminId, setAdminId] = useState(null); // To keep track of the current user's admin status
    // const [connectedUserGroupInfo, setConnectedUserGroupInfo] = useState([{}])
    // let connectedUserGroupInfo = group.members.filter(opt => opt.id === connecteduserId);

    // Fetch group details
    const fetchGroupDetails = async () => {
        try {
            const fetchedGroup = await GroupService.getGroupById(groupId);
            setGroup(fetchedGroup);
            // setConnectedUserGroupInfo(group.members.filter(opt => opt.id === connecteduserId))
            checkMembershipStatus(); // Check if the user is a member
        } catch (err) {
            setError(err.message);
        }
    };
    const handleLikeToggle = async (postId, likedByUsers) => {
        const likedUsers = likedByUsers.split(',').map(userId => parseInt(userId.trim()));
        const isLiked = likedUsers.includes(currentUserId);

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
    // Fetch posts related to the group
    const fetchGroupPosts = async () => {
        try {
            const groupPosts = await PostService.getPostsByGroupId(groupId);
            setPosts(groupPosts);
        } catch (err) {
            setError(err.message);
        }
    };
    // console.log(adminId);
    // Check if the current user is a member of the group
    const checkMembershipStatus = async () => {
        const user = JSON.parse(localStorage.getItem('user')).user;
        if (user) {
            const membershipStatus = await GroupMembershipService.isUserMember({ groupId });
            console.log("membershipStatus");
            console.log(user);
            setIsMember(membershipStatus.isMember);
            setAdminId(membershipStatus.isAdmin ? user.id : null); // Check if user is admin
        }
    };

    // Handle join group
    const handleJoinGroup = async () => {
        try {
            await GroupMembershipService.joinGroup({ groupId });
            setIsMember(true);
            fetchGroupDetails(); // Refresh group details
        } catch (err) {
            setError(err.message);
        }
    };

    // Handle leave group
    const handleLeaveGroup = async () => {
        try {
            await GroupMembershipService.leaveGroup({ groupId });
            setIsMember(false);
            fetchGroupDetails(); // Refresh group details
        } catch (err) {
            setError(err.message);
        }
    };

    // Handle create post
    const handleCreatePost = () => {
        navigate(`/posts?groupId=${groupId}`);
    };

    // Handle remove member
    const handleRemoveMember = async (memberId) => {
        try {
            await GroupMembershipService.removeMember({ groupId, memberId });
            fetchGroupDetails(); // Refresh group details
        } catch (err) {
            setError(err.message);
        }
    };
    const handleSetMemberAdmin = async (memberId, role) => {
        try {
            // let groupsendI = parseInt(groupId)
            await GroupMembershipService.handleSetMemberAdmin({ groupId, memberId, role });
            fetchGroupDetails(); // Refresh group details
        } catch (err) {
            setError(err.message);
        }
    };
    // console.log(connectedUserGroupInfo);
    useEffect(() => {
        if (user) {
            setCurrentUserId(user.id)
        }
        fetchGroupDetails();
        fetchGroupPosts();
    }, [groupId]);

    return (
        <div className="container mt-5">
            {error && <p className="text-danger">{error}</p>}
            {group ? (
                <div className="row">
                    <div className="col-lg-6 mx-auto">
                        <div className="card shadow-sm mb-4">
                            <div className="card-header">
                                <h1><b>{group.name}</b></h1>
                                <p className="text-muted">{group.description}</p>
                                <div className="mb-4">
                                    {isMember ? (
                                        <>
                                            <button className="btn btn-warning me-2" onClick={handleLeaveGroup}>Leave Group</button>
                                            <button className="btn btn-success" onClick={handleCreatePost}>Create Post</button>
                                        </>
                                    ) : (
                                        <button className="btn btn-primary" onClick={handleJoinGroup}>Join Group</button>
                                    )}
                                </div>
                            </div>
                            <div className="card-body">
                                <h3><b>Members</b></h3>
                                <ul className="list-group mb-4">
                                    {group.members.map(member => (
                                        <li key={member.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <span>
                                                {member.name}
                                                {member.role === 'admin' && (
                                                    <span className="badge bg-success ms-2">Admin</span>
                                                )}
                                                {/* {adminId === member.id &&  */}
                                            </span>
                                            {adminId && adminId !== member.id && (
                                                <>
                                                    {member.role === 'member' && (
                                                        <button className="btn btn-info btn-sm" onClick={() => handleSetMemberAdmin(member.id, 'admin')}>
                                                            Put Admin
                                                        </button>
                                                    )}
                                                    {member.role === 'admin' && (
                                                        <button className="btn btn-info btn-sm" onClick={() => handleSetMemberAdmin(member.id, 'member')}>
                                                            Put Member
                                                        </button>
                                                    )}
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleRemoveMember(member.id)}>
                                                        Remove
                                                    </button>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <h3 className="mt-4">Posts</h3>
                        {/* <div className="row"> */}
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
                        {/* </div> */}
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default GroupDetailPage;
