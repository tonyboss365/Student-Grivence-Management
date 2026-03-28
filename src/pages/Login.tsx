import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion } from 'motion/react';
import { TextReveal } from '../components/ui/TextReveal';
import { Logo } from '../components/ui/Logo';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { PongLoader } from '../components/ui/PongLoader';
import { AnimatePresence } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const minWait = new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      await minWait;
      
      if (!res.ok) throw new Error(data.error || 'Failed to login');
      
      login(data.token, data.user);
      navigate(`/dashboard/${data.user.role}`);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen flex text-[#111110] dark:text-[#FDFCF8] relative overflow-hidden bg-[#FDFCF8] dark:bg-[#111110] transition-colors duration-300">
      <AnimatePresence>
        {isLoading && <PongLoader />}
      </AnimatePresence>
      
      {/* Theme Toggle */}
      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle isDarkMode={theme === 'dark'} onToggle={toggleTheme} />
      </div>

      {/* Left Side - Typography */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 p-20 relative z-10 bg-[#F2EFE5] dark:bg-[#18181B] border-r border-[#E5E3D9] dark:border-[#333333]">
        <div className="max-w-xl space-y-12 h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar pr-6">
          <div className="mb-12">
            <Logo className="mb-8" />
            <h1 className="font-serif text-6xl leading-[1.1] tracking-tight mb-8 text-[#111110] dark:text-[#FDFCF8]">
              <TextReveal text="A better way to resolve grievances." />
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl text-[#6B6B66] dark:text-[#A1A1AA] font-light leading-relaxed"
            >
              Transparent, efficient, and fair. Submit your concerns and track their resolution in real-time.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="space-y-8 pt-8 border-t border-[#E5E3D9] dark:border-[#333333]"
          >
            <div>
              <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-[#888880] mb-4">Vision & Purpose</h3>
              <p className="text-[#6B6B66] dark:text-[#A1A1AA] text-sm leading-relaxed">
                The Student Grievance Management System was born from a need for radical transparency in academic administration. No more lost emails or ignored complaints. Every voice is tracked, every issue is logged, and every resolution is finalized.
              </p>
            </div>

            <div className="p-8 bg-black/5 dark:bg-white/5 rounded-[32px] border border-dashed border-[#E5E3D9] dark:border-[#333333]">
              <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-[#888880] mb-4">About the Developers</h3>
              <p className="text-[#111110] dark:text-[#FDFCF8] text-sm font-serif leading-relaxed italic">
                &ldquo;We are a team of passionate engineers committed to building tools that empower students. This portal is the result of months of research into UX patterns that promote trust and accountability within institutions.&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#111110] dark:text-[#FDFCF8] mb-2">Core Features</h4>
                <ul className="text-[11px] text-[#6B6B66] dark:text-[#A1A1AA] space-y-2 list-disc pl-4">
                  <li>Real-time Status Tracking</li>
                  <li>Department-wise Routing</li>
                  <li>Anonymous Submission Support</li>
                  <li>Interactive Activity Timelines</li>
                  <li>Resolution Quality Feedback</li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#111110] dark:text-[#FDFCF8] mb-2">Tech Stack</h4>
                <ul className="text-[11px] text-[#6B6B66] dark:text-[#A1A1AA] space-y-2 list-disc pl-4 marker:text-[#F5B889]">
                  <li>React + TypeScript</li>
                  <li className="marker:text-[#F2D5D9]">Node.js + Express</li>
                  <li className="marker:text-[#EBCBD8]">MySQL Database</li>
                  <li className="marker:text-[#E5C4E5]">Framer Motion Animations</li>
                  <li className="marker:text-[#F8C8A5]">Tailwind CSS Styling</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-[#888880] mb-6">Development Team</h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { name: 'Akshay', id: '2420030604', email: '2420030604@klh.edu.in' },
                  { name: 'Bhuvan', id: '2420030135', email: '2420030135@klh.edu.in' },
                  { name: 'Girish', id: '2420030031', email: '2420030031@klh.edu.in' },
                  { name: 'Eshwar M', id: '2420030644', email: '2420030644@klh.edu.in' }
                ].map((member, i) => (
                  <motion.div 
                    key={member.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + (i * 0.1) }}
                    className="flex items-center justify-between p-4 bg-[#F2EFE5] dark:bg-[#18181B] rounded-2xl border border-[#E5E3D9] dark:border-[#333333]"
                  >
                    <div>
                      <p className="text-sm font-serif">{member.name}</p>
                      <p className="text-[10px] font-mono text-[#888880]">{member.email}</p>
                    </div>
                    <span className="text-[10px] font-mono bg-[#F5B889]/20 text-[#111110] dark:bg-[#F5B889]/30 dark:text-[#FDFCF8] px-3 py-1 rounded-full">{member.id}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="lg:hidden absolute top-8 left-8">
          <Logo className="w-12 h-12" />
        </div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-white/80 dark:bg-[#18181B]/80 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E5E3D9] dark:border-[#333333]"
        >
          <h2 className="text-3xl font-serif mb-2 tracking-tight">Welcome back</h2>
          <p className="text-[#6B6B66] dark:text-[#A1A1AA] mb-8">Sign in to your account to continue.</p>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm border border-red-100 dark:border-red-900/50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#555550] dark:text-[#A1A1AA]">Email address</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#555550] dark:text-[#A1A1AA]">Password</label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <Button type="submit" className="w-full mt-4" size="lg">
              Sign in
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#E5E3D9] dark:border-[#333333]">
            <p className="text-center text-sm text-[#6B6B66] dark:text-[#A1A1AA] mb-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#111110] dark:text-[#FDFCF8] font-medium hover:underline underline-offset-4">
                Create one
              </Link>
            </p>

            <div className="p-5 bg-[#F2D5D9]/20 dark:bg-[#F2D5D9]/10 rounded-2xl border border-[#F2D5D9]/30">
               <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#111110] dark:text-[#FDFCF8] mb-3">Institutional Roles (Demo)</h3>
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-[11px]">
                     <span className="text-[#888880]">Admin Vector:</span>
                     <code className="bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">admin@example.com / admin123</code>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                     <span className="text-[#888880]">Staff Vector:</span>
                     <code className="bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">staff@example.com / staff123</code>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                     <span className="text-[#888880]">Default Student:</span>
                     <code className="bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">student@example.com / student123</code>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
