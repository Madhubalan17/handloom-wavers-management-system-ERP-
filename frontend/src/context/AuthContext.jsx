import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const initialAuthUsers = [
  {
    id: 1,
    name: 'Admin Director',
    email: 'admin@handloom.com',
    password: 'admin123',
    role: 'Admin',
    phone: '9876543200',
    status: 'Active',
    lastLogin: '24 Nov 2026, 10:30 AM',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    village: 'Head Office - Erode',
  },
  {
    id: 2,
    name: 'Ananya Sharma',
    email: 'manager@handloom.com',
    password: 'manager123',
    role: 'Manager',
    phone: '9876543201',
    status: 'Active',
    lastLogin: '24 Nov 2026, 09:15 AM',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    village: 'District Office - Salem',
  },
  {
    id: 3,
    name: 'K. Ramesh',
    email: 'staff@handloom.com',
    password: 'staff123',
    role: 'Staff',
    phone: '9876543202',
    status: 'Active',
    lastLogin: '23 Nov 2026, 04:45 PM',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    village: 'Thingalur Cluster',
  },
  {
    id: 4,
    name: 'G. Soundararajan',
    email: 'storekeeper@handloom.com',
    password: 'store123',
    role: 'Storekeeper',
    phone: '9876543203',
    status: 'Active',
    lastLogin: '24 Nov 2026, 08:00 AM',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    village: 'Central Yarn Depot',
  },
  {
    id: 5,
    name: 'R. Selvi',
    email: 'weaver@handloom.com',
    password: 'weaver123',
    role: 'Weaver',
    phone: '9876543210',
    status: 'Active',
    lastLogin: '23 Nov 2026, 06:10 PM',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    village: 'Nallapatti',
    loomNo: 'L-001',
  },
];

export const AuthProvider = ({ children }) => {
  const STORAGE_USERS_KEY = 'hwms_users_auth_v2';
  const STORAGE_CURRENT_KEY = 'hwms_current_user_v2';

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USERS_KEY);
      return saved ? JSON.parse(saved) : initialAuthUsers;
    } catch {
      return initialAuthUsers;
    }
  });

  // Initial state: currentUser starts as null so visiting localhost:5173 opens LoginPage directly
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      // Clear any previous auto-logged-in session so user lands on Login Page directly
      localStorage.removeItem('hwms_current_user_v2');
      localStorage.removeItem(STORAGE_CURRENT_KEY);
      sessionStorage.removeItem(STORAGE_CURRENT_KEY);
    } catch {}
    return null;
  });

  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Check backend health & fetch live users on load
  useEffect(() => {
    let isMounted = true;
    const fetchBackendUsers = async () => {
      try {
        const healthy = await api.health();
        if (healthy && isMounted) {
          setIsBackendConnected(true);
          const backendUsers = await api.auth.getUsers();
          if (backendUsers && backendUsers.length > 0) {
            setUsers(backendUsers);
          }
        } else if (isMounted) {
          setIsBackendConnected(false);
        }
      } catch (err) {
        if (isMounted) setIsBackendConnected(false);
      }
    };

    fetchBackendUsers();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_CURRENT_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_CURRENT_KEY);
    }
  }, [currentUser]);

  // Login handler: calls Django API `/api/auth/login/` with local fallback
  const login = async (emailOrUsername, password) => {
    try {
      // 1. Try Backend API
      const result = await api.auth.login(emailOrUsername, password);
      if (result && result.success && result.user) {
        setIsBackendConnected(true);
        setCurrentUser(result.user);
        return { success: true, user: result.user };
      }
    } catch (err) {
      console.warn('Backend login attempt failed, trying local data:', err.message);
    }

    // 2. Local Fallback
    const user = users.find(
      (u) =>
        (u.email?.toLowerCase() === emailOrUsername.toLowerCase() ||
          u.name?.toLowerCase() === emailOrUsername.toLowerCase()) &&
        u.password === password
    );

    if (!user) {
      return { success: false, error: 'Invalid username/email or password.' };
    }

    if (user.status !== 'Active') {
      return { success: false, error: 'Your account is deactivated. Please contact Admin.' };
    }

    const updatedUser = {
      ...user,
      lastLogin: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    return { success: true, user: updatedUser };
  };

  // Quick switch role for testing
  const switchRole = (roleName) => {
    const target = users.find((u) => u.role?.toLowerCase() === roleName.toLowerCase()) || users[0];
    setCurrentUser(target);
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
  };

  // Admin manages user logins: Add User
  const addUser = async (userData) => {
    let createdUser = null;
    try {
      if (isBackendConnected) {
        createdUser = await api.auth.createUser(userData);
      }
    } catch (err) {
      console.warn('Could not create user on backend, falling back to local:', err.message);
    }

    const newUser = createdUser || {
      id: users.length + 1,
      status: 'Active',
      lastLogin: 'Never logged in',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      ...userData,
    };

    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  // Admin manages user logins: Update User & Password
  const updateUser = async (userId, updatedFields) => {
    try {
      if (isBackendConnected) {
        await api.auth.updateUser(userId, updatedFields);
      }
    } catch (err) {
      console.warn('Could not update user on backend:', err.message);
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updatedFields } : u))
    );

    if (currentUser?.id === userId) {
      setCurrentUser((prev) => ({ ...prev, ...updatedFields }));
    }
  };

  // Admin manages user logins: Toggle Status
  const toggleUserStatus = async (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    await updateUser(userId, { status: newStatus });
  };

  // Admin manages user logins: Delete User
  const deleteUser = async (userId) => {
    try {
      if (isBackendConnected) {
        await api.auth.deleteUser(userId);
      }
    } catch (err) {
      console.warn('Could not delete user on backend:', err.message);
    }

    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        isBackendConnected,
        login,
        logout,
        switchRole,
        addUser,
        updateUser,
        toggleUserStatus,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
