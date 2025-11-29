// src/components/common/MathCaptcha.jsx
import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return {
        question: `${num1} + ${num2}`,
        answer: num1 + num2,
    };
};

export default function MathCaptcha({ onValidationChange, isAuthenticating }) {
    const [captcha, setCaptcha] = useState(generateCaptcha);
    const [inputValue, setInputValue] = useState('');
    const [isValid, setIsValid] = useState(false);

    // Communicate validation state back to the parent form
    useEffect(() => {
        onValidationChange(isValid);
    }, [isValid, onValidationChange]);

    const handleInputChange = (e) => {
        const input = e.target.value.trim();
        setInputValue(input);
        
        // Convert input to number for comparison
        const inputNumber = parseInt(input);

        // Check if input matches the generated answer
        const isCorrect = !isNaN(inputNumber) && inputNumber === captcha.answer;
        setIsValid(isCorrect);
    };

    const handleRefresh = () => {
        setCaptcha(generateCaptcha());
        setInputValue('');
        setIsValid(false);
    };
    
    // Determine status icon
    let StatusIcon = null;
    let iconColor = 'text-gray-500';

    if (inputValue.length > 0) {
        if (isValid) {
            StatusIcon = CheckCircle;
            iconColor = 'text-green-400';
        } else {
            StatusIcon = XCircle;
            iconColor = 'text-red-400';
        }
    }


    return (
        <motion.div 
            className="p-4 bg-gray-800/70 border border-gray-700 rounded-lg space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex justify-between items-center">
                <label className="text-gray-300 text-sm font-bold">Security Check (CAPTCHA)</label>
                <motion.button 
                    type="button" 
                    onClick={handleRefresh} 
                    disabled={isAuthenticating}
                    className="text-blue-400 hover:text-white transition-colors"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <RefreshCw size={18} />
                </motion.button>
            </div>
            
            <div className="flex items-center space-x-3">
                {/* CAPTCHA Question Display */}
                <div className="w-1/2 p-3 bg-gray-900 rounded-lg text-white text-xl font-bold text-center font-orbitron border border-blue-600/50">
                    {captcha.question} = ?
                </div>
                
                {/* User Input Field */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        className="w-full p-3 pr-10 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 text-lg"
                        placeholder="Your Answer"
                        disabled={isAuthenticating}
                        maxLength={3}
                    />
                    {/* Status Icon */}
                    {StatusIcon && (
                        <StatusIcon size={20} className={`absolute right-3 top-1/2 -translate-y-1/2 ${iconColor}`} />
                    )}
                </div>
            </div>
        </motion.div>
    );
}