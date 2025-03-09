import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiUserCheck, FiUserX, FiMail, FiSlack } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';

function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'member' });
  const [editingUser, setEditingUser] = useState(null);
  
  // Mock data for users
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: 'Alex Johnson', 
      email: 'alex@example.com', 
      role: 'admin', 
      status: 'active',
      lastActive: '2 hours ago',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      slackConnected: true,
      credits: 1250
    },
    { 
      id: 2, 
      name: 'Sarah Miller', 
      email: 'sarah@example.com', 
      role: 'member', 
      status: 'active',
      lastActive: '1 day ago',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      slackConnected: true,
      credits: 850
    },
    { 
      id: 3, 
      name: 'Michael Chen', 
      email: 'michael@example.com', 
      role: 'member', 
      status: 'inactive',
      lastActive: '5 days ago',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      slackConnected: false,
      credits: 320
    },
    { 
      id: 4, 
      name: 'Jessica Taylor', 
      email: 'jessica@example.com', 
      role: 'member', 
      status: 'pending',
      lastActive: 'Never',
      avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
      slackConnected: false,
      credits: 0
    }
  ]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      setUsers([...users, { 
        id: newId, 
        ...newUser, 
        status: 'pending',
        lastActive: 'Never',
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`,
        slackConnected: false,
        credits: 0
      }]);
      setNewUser({ name: '', email: '', role: 'member' });
      setShowAddUserModal(false);
    }
  };

  const handleUpdateUser = () => {
    if (editingUser && editingUser.name && editingUser.email) {
      setUsers(users.map(user => user.id === editingUser.id ? editingUser : user));
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleToggleStatus = (userId, currentStatus) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: currentStatus === 'active' ? 'inactive' : 'active'
        };
      }
      return user;
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">Active</span>;
      case 'inactive':
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400">Inactive</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">Pending</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Page title and action buttons */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Users Management</h2>
          <p className="text-gray-400 text-sm mt-1">Manage user access and permissions for your organization</p>
        </div>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 text-sm font-medium flex items-center"
        >
          <FiPlus className="mr-2" />
          Add New User
        </button>
      </div>

      {/* Search and filters */}
      <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full bg-dark-lighter border border-white/5 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-dark-lighter border border-white/5 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
            <select className="bg-dark-lighter border border-white/5 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Slack</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaRobot className="mr-1" />
                    Credits
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt={user.name} />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white capitalize">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">{user.lastActive}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.slackConnected ? (
                      <div className="flex items-center text-emerald-400">
                        <FiSlack className="mr-1" />
                        <span className="text-sm">Connected</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400">
                        <FiSlack className="mr-1" />
                        <span className="text-sm">Not Connected</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-white">
                      <FaRobot className="mr-1 text-emerald-400" />
                      <span className="text-sm">{user.credits.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => setEditingUser(user)}
                        className="p-1.5 bg-dark-lighter rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
                        title="Edit User"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        className={`p-1.5 bg-dark-lighter rounded-lg ${user.status === 'active' ? 'text-yellow-400 hover:text-yellow-300' : 'text-emerald-400 hover:text-emerald-300'} transition-colors`}
                        title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                      >
                        {user.status === 'active' ? <FiUserX size={16} /> : <FiUserCheck size={16} />}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1.5 bg-dark-lighter rounded-lg text-red-400 hover:text-red-300 transition-colors"
                        title="Delete User"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No users found matching your search criteria.</p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-dark-card border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Add New User</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full bg-dark-lighter border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full bg-dark-lighter border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                <select
                  className="w-full bg-dark-lighter border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 bg-dark-lighter text-gray-300 rounded-lg hover:bg-dark-card hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-dark-card border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Edit User</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full bg-dark-lighter border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Enter full name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full bg-dark-lighter border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Enter email address"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                <select
                  className="w-full bg-dark-lighter border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                <select
                  className="w-full bg-dark-lighter border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  <div className="flex items-center">
                    <FaRobot className="mr-1" />
                    Credits
                  </div>
                </label>
                <input
                  type="number"
                  className="w-full bg-dark-lighter border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Enter credits amount"
                  value={editingUser.credits}
                  onChange={(e) => setEditingUser({...editingUser, credits: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-dark-lighter text-gray-300 rounded-lg hover:bg-dark-card hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300"
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersManagement;
