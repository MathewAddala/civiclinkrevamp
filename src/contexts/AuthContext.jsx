import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// Function to simulate getting all registered users from localStorage "database"
const getRegisteredUsers = () => {
    try {
        const users = localStorage.getItem('civiclinkUsers');
        return users ? JSON.parse(users) : {};
    } catch (error) {
        console.error("Error reading users from localStorage:", error);
        return {};
    }
};

// Function to simulate saving all registered users to localStorage "database"
const saveRegisteredUsers = (users) => {
    try {
        localStorage.setItem('civiclinkUsers', JSON.stringify(users));
    } catch (error) {
        console.error("Error saving users to localStorage:", error);
    }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // On initial app load, check localStorage for a saved user session.
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('civiclinkUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser({ name: 'Guest', role: 'guest' });
      }
    } catch (error) {
      setUser({ name: 'Guest', role: 'guest' });
    } finally {
      setInitialLoadComplete(true);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    if (isAuthenticating) return; 
    setError(null);
    setIsAuthenticating(true);

    await new Promise(resolve => setTimeout(resolve, 700));

    const users = getRegisteredUsers();
    const userToFind = Object.values(users).find(
        u => u.email === email && u.password === password
    );

    if (userToFind) {
        setUser(userToFind);
        localStorage.setItem('civiclinkUser', JSON.stringify(userToFind));
        navigate('/', { replace: true }); 
    } else {
        setError("Invalid email or password. Please try again.");
    }
    
    setIsAuthenticating(false);
  };
  
  //  NEW: Registration Function 
  const register = async (name, email, password, role) => {
    if (isAuthenticating) return;
    setError(null);
    setIsAuthenticating(true);

    await new Promise(resolve => setTimeout(resolve, 700));
    
    const users = getRegisteredUsers();

    if (users[email]) {
        setError("Account already exists with this email address.");
        setIsAuthenticating(false);
        return false;
    }

    const newUser = { name, email, password, role, id: Date.now().toString() };
    
    // Save new user to the simulated database
    users[email] = newUser;
    saveRegisteredUsers(users);

    // Automatically log in the new user
    setUser(newUser);
    localStorage.setItem('civiclinkUser', JSON.stringify(newUser));
    navigate('/', { replace: true });
    
    setIsAuthenticating(false);
    return true;
  };

  // Logout function
  const logout = () => {
    setUser({ name: 'Guest', role: 'guest' });
    localStorage.removeItem('civiclinkUser');
    navigate('/login', { replace: true });
  };

  // Expose register and error state
  const value = { user, login, register, logout, isAdmin: user?.role === 'admin', isAuthenticating, error, setError };

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