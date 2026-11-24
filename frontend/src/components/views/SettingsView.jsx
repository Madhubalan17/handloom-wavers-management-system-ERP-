import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Users,
  ShieldCheck,
  Lock,
  Key,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Settings,
  Sliders,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const SettingsView = () => {
  const {
    users,
    currentUser,
    addUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
  } = useAuth();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'users' | 'password' | 'system'
  const [successToast, setSuccessToast] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'add_user' | 'edit_user' | null
  const [selectedUser, setSelectedUser] = useState(null);

  // Profile Form (Screen 11)
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || 'Admin',
    email: currentUser?.email || 'admin@handloom.com',
  });

  // Password Form (Screen 11)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // New User Form (Admin creates login credentials for Admin, Manager, Staff, Storekeeper, Weaver)
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Weaver',
    phone: '',
    village: 'Erode',
  });

  const [showUserPassword, setShowUserPassword] = useState({});

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateUser(currentUser.id, profileForm);
    setSuccessToast('Profile information updated successfully!');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    updateUser(currentUser.id, { password: passwordForm.newPassword });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setSuccessToast('Password changed successfully!');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    addUser(userForm);
    setActiveModal(null);
    setUserForm({ name: '', email: '', password: '', role: 'Weaver', phone: '', village: 'Erode' });
    setSuccessToast(`User ${userForm.name} (${userForm.role}) login account created!`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleEditUserSubmit = (e) => {
    e.preventDefault();
    if (selectedUser) {
      updateUser(selectedUser.id, selectedUser);
      setActiveModal(null);
      setSelectedUser(null);
      setSuccessToast(`User login credentials updated!`);
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  const togglePasswordVisibility = (userId) => {
    setShowUserPassword((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-slate-900 text-white';
      case 'Manager':
        return 'bg-emerald-700 text-white';
      case 'Staff':
        return 'bg-indigo-700 text-white';
      case 'Storekeeper':
        return 'bg-amber-700 text-white';
      case 'Weaver':
        return 'bg-blue-700 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h1 className="text-xl font-bold text-slate-900 font-serif">
          Settings & Access Control
        </h1>
        <p className="text-xs text-slate-500">
          Manage system preferences and configure login accounts for all roles (Admin, Manager, Staff, Storekeeper, Weaver)
        </p>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Settings Card with Sub-navigation (matching Screen 11 layout) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
        {/* Left Sub-sidebar inside Settings */}
        <div className="md:col-span-3 border-r border-slate-100 p-4 space-y-1 bg-slate-50/50">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'users', label: 'User Logins & Access', icon: Users, badge: `${users.length} Users` },
            { id: 'password', label: 'Change Password', icon: Key },
            { id: 'system', label: 'System Settings', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1e5bbf] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isActive ? 'bg-blue-400/30 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-9 p-6">
          {/* 1. Profile Tab (Screen 11) */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-lg">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Admin Profile</h3>
                <p className="text-xs text-slate-500">Personal details and system credentials</p>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{currentUser?.name}</h4>
                  <p className="text-xs text-slate-500 font-mono">{currentUser?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-900 text-white">
                    {currentUser?.role}
                  </span>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1e5bbf] hover:bg-[#164799] text-white font-bold shadow-xs transition-colors"
                >
                  Update Profile
                </button>
              </form>
            </div>
          )}

          {/* 2. User Management & Logins (Admin controls all login accounts) */}
          {activeTab === 'users' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    User Accounts & Login Credentials
                  </h3>
                  <p className="text-xs text-slate-500">
                    Administrator management of all user logins across 5 roles (Admin, Manager, Staff, Storekeeper, Weaver)
                  </p>
                </div>

                <button
                  onClick={() => setActiveModal('add_user')}
                  className="px-3.5 py-2 rounded-xl bg-[#1e5bbf] hover:bg-[#164799] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add User Account</span>
                </button>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b">
                    <tr>
                      <th className="py-2.5 px-3">User & Contact</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Password</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Last Login</th>
                      <th className="py-2.5 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((usr) => (
                      <tr key={usr.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={usr.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{usr.name}</p>
                              <p className="text-[11px] text-slate-500 font-mono">{usr.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getRoleBadge(usr.role)}`}>
                            {usr.role}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700">
                            <span>{showUserPassword[usr.id] ? usr.password : '••••••••'}</span>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(usr.id)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              {showUserPassword[usr.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => toggleUserStatus(usr.id)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                              usr.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border-rose-200'
                            }`}
                            title="Click to toggle Active/Inactive"
                          >
                            {usr.status}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                          {usr.lastLogin}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedUser(usr);
                                setActiveModal('edit_user');
                              }}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                              title="Edit user credentials"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {usr.role !== 'Admin' && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete login account for ${usr.name}?`)) {
                                    deleteUser(usr.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                                title="Delete user"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Change Password Tab (Screen 11) */}
          {activeTab === 'password' && (
            <div className="space-y-6 max-w-lg">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Change Admin Password</h3>
                <p className="text-xs text-slate-500">Update your secret credentials for login</p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Password *</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">New Password *</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1e5bbf] hover:bg-[#164799] text-white font-bold shadow-xs transition-colors"
                >
                  Save New Password
                </button>
              </form>
            </div>
          )}

          {/* 4. System Settings Tab (Screen 11) */}
          {activeTab === 'system' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">System Configurations</h3>
                <p className="text-xs text-slate-500">Master tax rates, measurement units, and cluster defaults</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-800">GST Rates</h4>
                  <p className="text-slate-600">Handloom Standard: <span className="font-bold">5% GST</span></p>
                  <p className="text-slate-600">Luxury Zari & Apparel: <span className="font-bold">12% GST</span></p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-800">Active Weaving Clusters</h4>
                  <p className="text-slate-600">Nallapatti, Thingalur, Erode, Salem, Kanchipuram</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal (Admin registers accounts for Manager, Staff, Storekeeper, Weaver) */}
      <Modal
        isOpen={activeModal === 'add_user'}
        onClose={() => setActiveModal(null)}
        title="Create New User Login Account"
        subtitle="Provision credentials for Admin, Manager, Staff, Storekeeper, or Weaver"
      >
        <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">User Full Name *</label>
              <input
                type="text"
                placeholder="e.g. S. Murugan"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Assigned Role *</label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                required
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
                <option value="Storekeeper">Storekeeper</option>
                <option value="Weaver">Weaver</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Login Email / Username *</label>
              <input
                type="email"
                placeholder="e.g. murugan@handloom.com"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Temporary Password *</label>
              <input
                type="text"
                placeholder="e.g. weave123"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="98765 XXXXX"
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Village / Cluster Location</label>
              <input
                type="text"
                value={userForm.village}
                onChange={(e) => setUserForm({ ...userForm, village: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1e5bbf] text-white font-bold hover:bg-[#164799]"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={activeModal === 'edit_user' && selectedUser !== null}
        onClose={() => setActiveModal(null)}
        title={`Edit User: ${selectedUser?.name}`}
        subtitle="Update account credentials, role permission, or password"
      >
        <form onSubmit={handleEditUserSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={selectedUser?.name || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Role</label>
              <select
                value={selectedUser?.role || 'Weaver'}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                required
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
                <option value="Storekeeper">Storekeeper</option>
                <option value="Weaver">Weaver</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email / Username</label>
              <input
                type="email"
                value={selectedUser?.email || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Reset Password</label>
              <input
                type="text"
                value={selectedUser?.password || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1e5bbf] text-white font-bold hover:bg-[#164799]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
