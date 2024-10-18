import React, { useEffect, useState } from 'react';
import GroupService from '../../services/GroupService';
import { Outlet } from 'react-router-dom';

const GroupManagementPage = () => {
    const [groups, setGroups] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [editingGroupId, setEditingGroupId] = useState(null);
    const [error, setError] = useState(null);

    // Fetch all groups created by the user
    const fetchGroups = async () => {
        try {
            const userGroups = await GroupService.getAllCreatedGroups(); // Update this method in your service to fetch user-specific groups
            setGroups(userGroups);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    // Handle create or update group
    const handleGroupSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingGroupId) {
                await GroupService.updateGroup(editingGroupId, { name: groupName, description: groupDescription });
            } else {
                await GroupService.createGroup({ name: groupName, description: groupDescription });
            }
            setGroupName('');
            setGroupDescription('');
            setEditingGroupId(null);
            fetchGroups();
        } catch (err) {
            setError(err.message);
        }
    };

    // Handle edit group
    const handleEditGroup = (group) => {
        setEditingGroupId(group.id);
        setGroupName(group.name);
        setGroupDescription(group.description);
    };

    // Handle delete group
    const handleDeleteGroup = async (groupId) => {
        if (window.confirm('Are you sure you want to delete this group?')) {
            try {
                await GroupService.deleteGroup(groupId);
                fetchGroups();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="container mt-5">
            {["/groups/", "/groups"].includes(window.location.pathname) ? (
                <>
                    <h1 className="text-center mb-4">Group Management</h1>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <form className="mb-4" onSubmit={handleGroupSubmit}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Group Name"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <textarea
                                className="form-control"
                                placeholder="Group Description"
                                value={groupDescription}
                                onChange={(e) => setGroupDescription(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            {editingGroupId ? 'Update Group' : 'Create Group'}
                        </button>
                        {editingGroupId && (
                            <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditingGroupId(null)}>
                                Cancel
                            </button>
                        )}
                    </form>
                    <h2>Your Groups</h2>
                    <ul className="list-group">
                        {groups.map((group) => (
                            <li className="list-group-item d-flex justify-content-between align-items-center" key={group.id}>
                                <div>
                                    <strong>{group.name}</strong>
                                    <p className="mb-0">{group.description}</p>
                                </div>
                                <div>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditGroup(group)}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteGroup(group.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <Outlet />
            )}
        </div>
    );
};

export default GroupManagementPage;
