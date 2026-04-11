import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const generateCaptcha = () => {
  let value = '';
  for (let i = 0; i < 6; i += 1) {
    value += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return value;
};

export default function MathCaptcha({ onValidationChange, isAuthenticating }) {
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [inputValue, setInputValue] = useState('');
  const canvasRef = useRef(null);
  const isValid = useMemo(() => inputValue.trim().toUpperCase() === captcha, [inputValue, captcha]);

  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 6; i += 1) {
      ctx.strokeStyle = `rgba(255,255,255,${0.1 + Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    ctx.font = 'bold 30px monospace';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < captcha.length; i += 1) {
      const char = captcha[i];
      const x = 14 + i * 28;
      const y = 28 + (Math.random() * 8 - 4);
      const angle = (Math.random() * 24 - 12) * (Math.PI / 180);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = '#f3f4f6';
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }, [captcha]);

  const handleRefresh = () => {
    setCaptcha(generateCaptcha());
    setInputValue('');
  };

  let StatusIcon = null;
  let iconColor = 'text-gray-500';
  if (inputValue.length > 0) {
    StatusIcon = isValid ? CheckCircle : XCircle;
    iconColor = isValid ? 'text-green-400' : 'text-red-400';
  }

  return (
    <motion.div
      className="p-1 space-y-3"
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
          className="text-gray-400 hover:text-white transition-colors"
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <RefreshCw size={18} />
        </motion.button>
      </div>

      <div className="flex items-center space-x-3">
        <canvas ref={canvasRef} width={180} height={56} className="w-1/2 bg-[#0a0a0a] rounded-xl border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
            className="w-full p-3.5 pr-10 rounded-xl bg-white/5 text-white border border-white/10 focus:border-white/50 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] outline-none transition-all text-lg tracking-widest uppercase"
            placeholder="Code"
            disabled={isAuthenticating}
            maxLength={6}
          />
          {StatusIcon && <StatusIcon size={20} className={`absolute right-3 top-1/2 -translate-y-1/2 ${iconColor}`} />}
        </div>
      </div>
    </motion.div>
  );
}