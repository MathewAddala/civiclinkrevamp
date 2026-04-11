import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.js';
import { request } from '../services/apiClient.js';

const AuthContext = createContext(null);
const GUEST_USER = { name: 'Guest', role: 'guest' };
const TOKEN_KEY = 'civiclinkToken';

const normalizeAuthResponse = (response) => {
  if (!response || typeof response !== 'object') {
    return { user: null, token: null };
  }

  return {
    user: response.user || response.data?.user || null,
    token: response.token || response.data?.token || null,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {
    const bootstrapUser = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setUser(GUEST_USER);
        setInitialLoadComplete(true);
        return;
      }

      try {
        const currentUserResponse = await authService.getCurrentUser();
        const currentUser = currentUserResponse?.user || currentUserResponse?.data || currentUserResponse;
        if (currentUser?.role) {
          setUser(currentUser);
        } else {
          setUser(GUEST_USER);
          localStorage.removeItem(TOKEN_KEY);
        }
      } catch {
        setUser(GUEST_USER);
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setInitialLoadComplete(true);
      }
    };

    bootstrapUser();
  }, []);

  const handleAuthError = (err, fallbackMessage) => {
    setError(err instanceof Error ? err.message : fallbackMessage);
    setIsAuthenticating(false);
  };

  const storeSession = (sessionUser, token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    setUser(sessionUser);
  };

  const refreshProfile = async () => {
    try {
      const profile = await request('/me/profile');
      if (profile?.role) setUser(profile);
    } catch {

    }
  };


  const login = async (email, password) => {
    if (isAuthenticating) return false;
    setError(null);
    setIsAuthenticating(true);

    try {
      const response = await authService.login({ email, password });
      const session = normalizeAuthResponse(response);
      if (!session.user) {
        throw new Error('Invalid login response from server.');
      }
      storeSession(session.user, session.token);
      navigate('/dashboard', { replace: true });
      await refreshProfile();
      setIsAuthenticating(false);
      return true;
    } catch (err) {
      handleAuthError(err, 'Login failed. Please try again.');
      return false;
    }
  };

  const register = async (name, email, password, role) => {
    if (isAuthenticating) return false;
    setError(null);
    setIsAuthenticating(true);

    try {
      const response = await authService.register({ name, email, password, role });
      const session = normalizeAuthResponse(response);
      if (!session.user) {
        throw new Error('Invalid registration response from server.');
      }
      storeSession(session.user, session.token);
      navigate('/dashboard', { replace: true });
      await refreshProfile();
      setIsAuthenticating(false);
      return true;
    } catch (err) {
      handleAuthError(err, 'Registration failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    setUser(GUEST_USER);
    localStorage.removeItem(TOKEN_KEY);
    navigate('/login', { replace: true });
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    refreshProfile,
    isAuthenticating,
    error,
    setError,
  };

  if (!initialLoadComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};