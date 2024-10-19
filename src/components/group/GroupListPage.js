import React, { useState, useEffect } from 'react';
import GroupService from '../../services/GroupService'; // Import the service to fetch groups
import { Link, useNavigate } from 'react-router-dom';
import GroupMembershipService from '../../services/GroupMembershipService';

const GroupListPage = () => {
    const navigate = useNavigate()
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await GroupService.getAllGroups();
                setGroups(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching groups');
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);
    // Handle join group
    const handleJoinGroup = async (groupId) => {
        try {
            await GroupMembershipService.joinGroup({ groupId });
        } catch (err) {
            setError(err.message);
        }
    };
    if (loading) return <div className="text-center my-5">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-lg-8 mx-auto">
                    <h1 className="text-center mb-4">Groups</h1>
                    <span className='pull-right'>
                        <button className="btn btn-info" onClick={() => { navigate('/groups')}}>Create Group</button>
                    </span>
                    <br/>
                    <br/>
                    {/* <hr/> */}
                    <div className="row">
                        {groups.length > 0 ? (
                            groups.map((group) => (
                                <div className="col-md-6 mb-4" key={group.id}>
                                    <div className="card shadow-sm h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">{group.name}</h5>
                                            <p className="card-text">
                                                {group.description.slice(0, 100)}...
                                            </p>
                                            <p className="text-muted">
                                                Members: {group.members_count}
                                            </p>
                                            <div className="d-flex justify-content-between">
                                                <Link
                                                    to={`/groups/${group.id}`}
                                                    className="btn btn-primary"
                                                >
                                                    View Group
                                                </Link>
                                                <button onClick={() => handleJoinGroup(group.id)} className="btn btn-outline-success">
                                                    Join Group
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12">
                                <h3>No groups available at the moment.</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupListPage;
