import React, { useEffect, useState } from 'react'; 
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import MathCaptcha from '../components/common/MathCaptcha.jsx';

const AuthForm = ({ formType }) => {
    const { login, register, isAuthenticating, error, setError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState('');
    const [isCaptchaValid, setIsCaptchaValid] = useState(false);

    const isLogin = formType === 'login';

    useEffect(() => {
        setFormError('');
        setError(null);
    }, [formType, setError]);
    

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
        

        if (!isCaptchaValid) {
            setFormError("Please correctly solve the security CAPTCHA.");
            return;
        }

        if (isLogin) {
            await login(email, password);
        } else {
            await register(name, email, password, 'citizen');
        }
    };
    
    const buttonText = isLogin ? (isAuthenticating ? 'Logging In...' : 'Login') : (isAuthenticating ? 'Signing Up...' : 'Sign Up');
    

    const isSubmitDisabled = isAuthenticating || !isCaptchaValid;


    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {(error || formError) && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20"
                >
                    {error || formError}
                </motion.div>
            )}


            {!isLogin && (
                <>
                    <div>
                        <label htmlFor="name" className="block text-gray-400 text-sm font-bold mb-2">Full Name</label>
                        <div className="relative">
                            <UserCircle size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full p-3.5 pl-11 rounded-xl bg-white/5 text-white border border-white/10 focus:border-white/50 outline-none transition-colors shadow-inner" disabled={isAuthenticating} />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 -mt-1">
                        New users are registered as citizens. Admin access is granted only by an existing admin.
                    </p>
                </>
            )}


            <div>
                <label htmlFor="email" className="block text-gray-400 text-sm font-bold mb-2">Email</label>
                <div className="relative">
                    <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3.5 pl-11 rounded-xl bg-black/40 text-white border border-white/10 focus:border-white/30 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] outline-none transition-all" placeholder="name@example.com" disabled={isAuthenticating} />
                </div>
            </div>


            <div>
                <label htmlFor="password" className="block text-gray-400 text-sm font-bold mb-2">Password</label>
                <div className="relative">
                    <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3.5 pl-11 rounded-xl bg-black/40 text-white border border-white/10 focus:border-white/30 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] outline-none transition-all" placeholder="Minimum 6 characters" disabled={isAuthenticating} />
                </div>
            </div>


            {!isLogin && (
                <div>
                    <label htmlFor="confirmPassword" className="block text-gray-400 text-sm font-bold mb-2">Confirm Password</label>
                    <div className="relative">
                        <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3.5 pl-11 rounded-xl bg-white/5 text-white border border-white/10 focus:border-blue-500 outline-none transition-colors shadow-inner" placeholder="Confirm your password" disabled={isAuthenticating} />
                    </div>
                </div>
            )}
            

            <div className="glass-panel p-3 rounded-xl border-white/10 backdrop-blur-lg">
                <MathCaptcha 
                    onValidationChange={setIsCaptchaValid} 
                    isAuthenticating={isAuthenticating}
                />
            </div>

            <motion.button
                type="submit"
                disabled={isSubmitDisabled}
                className={`w-full p-4 rounded-xl font-bold transition-all flex items-center justify-center mt-6 shadow-[0_0_20px_rgba(255,255,255,0.1)] ${isLogin ? 'bg-gradient-to-r from-gray-200 to-white text-black hover:scale-[1.02]' : 'bg-gradient-to-r from-gray-200 to-white text-black hover:scale-[1.02]'} disabled:opacity-50 disabled:cursor-not-allowed`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {isAuthenticating && (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                )}
                {buttonText}
            </motion.button>
        </form>
    );
};


export default function LoginPage() {
  const { isAuthenticating, user } = useAuth();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('login');


  useEffect(() => {
    if (user && user.role !== 'guest') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-gray-100 p-4 relative overflow-hidden">

      <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-panel p-8 rounded-[32px] w-full max-w-sm z-10 border border-white/10"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white font-orbitron tracking-tight">CivicLink</h1>
        </div>


        <div className="flex mb-6 bg-black/40 rounded-xl p-1.5 border border-white/5 backdrop-blur-md">
            <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-sm rounded-lg font-bold transition-all ${authMode === 'login' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-gray-500 hover:text-white'}`}
                disabled={isAuthenticating}
            >
                Login
            </button>
            <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 text-sm rounded-lg font-bold transition-all ${authMode === 'signup' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-gray-500 hover:text-white'}`}
                disabled={isAuthenticating}
            >
                Create Account
            </button>
        </div>

        <AuthForm formType={authMode} />

      </motion.div>
    </div>
  );
}
