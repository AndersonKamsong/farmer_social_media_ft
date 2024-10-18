import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GroupService from '../../services/GroupService';
import PostService from '../../services/PostService';
import GroupMembershipService from '../../services/GroupMembershipService';
// const token = JSON.parse(localStorage.getItem('user')).token;
const connecteduserId = JSON.parse(localStorage.getItem('user')).id;
const GroupDetailPage = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();

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
        fetchGroupDetails();
        fetchGroupPosts();
    }, [groupId]);

    return (
        <div className="container mt-5">
            {error && <p className="text-danger">{error}</p>}
            {group ? (
                <div className="card mb-4">
                    <div className="card-header">
                        <h1>{group.name}</h1>
                        <p className="text-muted">{group.description}</p>
                    </div>
                    <div className="card-body">
                        <h3>Members</h3>
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

                        <h3 className="mt-4">Posts</h3>
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
                                                <p className="card-text" style={{ maxHeight: "50px" }}>{post.content.slice(0, 200)}</p>
                                                <hr />
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
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default GroupDetailPage;
