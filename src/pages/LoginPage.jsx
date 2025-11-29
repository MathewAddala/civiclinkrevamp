import React, { useEffect, useState } from 'react'; 
import { motion } from 'framer-motion';
import { LogIn, User, Shield, Mail, Lock, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import MathCaptcha from '../components/common/MathCaptcha.jsx'; // 🌟 NEW IMPORT 🌟

const AuthForm = ({ formType }) => {
    const { login, register, isAuthenticating, error, setError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('citizen');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState('');
    const [isCaptchaValid, setIsCaptchaValid] = useState(false); // 🌟 NEW CAPTCHA STATE 🌟

    const isLogin = formType === 'login';

    useEffect(() => {
        setFormError('');
        setError(null);
    }, [formType, setError]);
    
    // Handle form submission logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!email || !password || (!isLogin && (!name || !confirmPassword))) {
            setFormError("All fields are required.");
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            setFormError("Passwords do not match.");
            return;
        }
        
        // 🌟 CAPTCHA CHECK 🌟
        if (!isCaptchaValid) {
            setFormError("Please correctly solve the security CAPTCHA.");
            return;
        }

        if (isLogin) {
            await login(email, password);
        } else {
            await register(name, email, password, role);
        }
    };
    
    const buttonText = isLogin ? (isAuthenticating ? 'Logging In...' : 'Login') : (isAuthenticating ? 'Signing Up...' : 'Sign Up');
    
    // Determine if the main button should be disabled
    const isSubmitDisabled = isAuthenticating || !isCaptchaValid;


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display global Auth context error or local form error */}
            {(error || formError) && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-900/50 text-red-300 rounded-lg border border-red-700"
                >
                    {error || formError}
                </motion.div>
            )}

            {/* Sign Up Fields */}
            {!isLogin && (
                <>
                    <div>
                        <label htmlFor="name" className="block text-gray-400 text-sm font-bold mb-2">Full Name</label>
                        <div className="relative">
                            <UserCircle size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500" placeholder="John Doe" disabled={isAuthenticating} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-gray-400 text-sm font-bold mb-2">Role</label>
                        <select id="role" value={role} onChange={(e) => setRole(e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 appearance-none" disabled={isAuthenticating}>
                            <option value="citizen">Citizen (Standard Access)</option>
                            <option value="admin">Admin (Requires Approval)</option>
                        </select>
                    </div>
                </>
            )}

            {/* Email Field */}
            <div>
                <label htmlFor="email" className="block text-gray-400 text-sm font-bold mb-2">Email</label>
                <div className="relative">
                    <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500" placeholder="name@example.com" disabled={isAuthenticating} />
                </div>
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="password" className="block text-gray-400 text-sm font-bold mb-2">Password</label>
                <div className="relative">
                    <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500" placeholder="Minimum 6 characters" disabled={isAuthenticating} />
                </div>
            </div>

            {/* Confirm Password Field */}
            {!isLogin && (
                <div>
                    <label htmlFor="confirmPassword" className="block text-gray-400 text-sm font-bold mb-2">Confirm Password</label>
                    <div className="relative">
                        <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500" placeholder="Confirm your password" disabled={isAuthenticating} />
                    </div>
                </div>
            )}
            
            {/* 🌟 CAPTCHA INTEGRATION 🌟 */}
            <MathCaptcha 
                onValidationChange={setIsCaptchaValid} 
                isAuthenticating={isAuthenticating}
            />

            <motion.button
                type="submit"
                disabled={isSubmitDisabled} // Use the combined disabled state
                className={`w-full p-3 rounded-lg font-semibold transition-colors glow-effect flex items-center justify-center mt-6 ${isLogin ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {isAuthenticating && (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                )}
                {buttonText}
            </motion.button>
        </form>
    );
};


export default function LoginPage() {
  const { isAuthenticating, user } = useAuth();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  // FIX: If user is logged in, redirect them away from /login
  useEffect(() => {
    if (user && user.role !== 'guest') {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="holographic-card p-8 rounded-xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <LogIn size={64} className="mx-auto text-blue-500 glow-text" strokeWidth={1.5}/>
          <h1 className="text-4xl font-extrabold text-white mt-4 glow-text font-orbitron">CivicLink</h1>
          <p className="text-gray-400 mt-2">Access the platform securely.</p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
            <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${authMode === 'login' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                disabled={isAuthenticating}
            >
                Login
            </button>
            <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${authMode === 'signup' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                disabled={isAuthenticating}
            >
                Sign Up
            </button>
        </div>

        <AuthForm formType={authMode} />

      </motion.div>
    </div>
  );
}