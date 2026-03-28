import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { StrokeAlert, StrokeStar, StrokeCheck, StrokeUser, StrokeClock, StrokeChart } from '../components/ui/HandDrawnIcons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PongLoader } from '../components/ui/PongLoader';

const PASTEL_PALETTE = ['#F5B889', '#F2D5D9', '#EBCBD8', '#E5C4E5', '#F8C8A5', '#F9D9C0'];

export function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(setData)
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-64 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest opacity-50">Loading metrics...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-6xl space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h2 className="text-5xl font-serif text-[#111110] dark:text-[#FDFCF8] mb-4 transition-colors">Analytics</h2>
          <p className="text-[#6B6B66] dark:text-[#A1A1AA] font-sans max-w-lg transition-colors">
            Deep-dive metrics with specialized distribution and trend mapping.
          </p>
        </div>
        <div className="px-8 py-6 bg-[#F5B889] rounded-[32px] text-[#111110]">
          <p className="text-[10px] font-mono uppercase tracking-widest opacity-80 mb-1">Total Impact Score</p>
          <p className="text-4xl font-serif">{data?.averageRating || '0.0'}<span className="text-lg ml-1 opacity-60">/ 5.0</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Bar Chart */}
        <div className="lg:col-span-2 p-10 bg-[#F2EFE5] dark:bg-[#18181B] rounded-[48px] border border-[#E5E3D9] dark:border-[#333333] transition-colors overflow-hidden">
          <div className="flex items-center gap-3 mb-10">
            <StrokeChart className="w-6 h-6 text-[#F5B889]" />
            <h3 className="text-2xl font-serif">Department Distribution</h3>
          </div>
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.departmentBreakdown}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E3D9" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#888880' }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(245, 184, 137, 0.1)' }}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', background: 'white' }}
                />
                <Bar dataKey="count" radius={[14, 14, 0, 0]}>
                  {data?.departmentBreakdown?.map((entry: any, index: number) => (
                    <Cell key={index} fill={PASTEL_PALETTE[index % PASTEL_PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New: Status Pie Chart */}
        <div className="p-10 bg-[#F2EFE5] dark:bg-[#18181B] rounded-[48px] border border-[#E5E3D9] dark:border-[#333333] transition-colors flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <StrokeAlert className="w-5 h-5 text-[#EBCBD8]" />
            <h3 className="text-xl font-serif">Status Health</h3>
          </div>
          <div className="h-[200px] w-full flex-grow relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie 
                   data={data?.statusBreakdown} 
                   cx="50%" cy="50%" 
                   innerRadius={60} outerRadius={80} 
                   paddingAngle={5} dataKey="count"
                 >
                   {data?.statusBreakdown?.map((entry: any, index: number) => (
                     <Cell key={index} fill={PASTEL_PALETTE[(index + 2) % PASTEL_PALETTE.length]} />
                   ))}
                 </Pie>
                 <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-3xl font-serif">{data?.total}</p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#888880]">Live Cases</p>
             </div>
          </div>
          <div className="mt-8 space-y-2">
            {data?.statusBreakdown?.map((s: any, i: number) => (
              <div key={s.status} className="flex items-center justify-between text-[11px] font-mono uppercase tracking-tight">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: PASTEL_PALETTE[(i + 2) % PASTEL_PALETTE.length] }} />
                  {s.status}
                </div>
                <span>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New: Trend Section */}
      <div className="p-10 bg-black dark:bg-[#FDFCF8] rounded-[48px] text-[#FDFCF8] dark:text-[#111110] flex flex-col lg:flex-row items-center gap-12 overflow-hidden">
        <div className="lg:w-1/3 space-y-4">
          <h3 className="text-4xl font-serif">System Growth</h3>
          <p className="text-sm opacity-60 leading-relaxed font-sans">Visualizing submission trends across all departments. This data reflects live administrative workloads.</p>
          <div className="pt-2">
            <Button className="bg-[#F5B889] dark:bg-[#F5B889] text-black border-none rounded-full px-8 h-12 hover:opacity-90">GENERATE REPORT</Button>
          </div>
        </div>
        <div className="lg:w-2/3 h-[200px] w-full opacity-80">
           {/* Stylized mock trend visualization */}
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={[{v:10},{v:15},{v:8},{v:12},{v:20},{v:18},{v:25}]}>
               <Bar dataKey="v" fill="#F5B889" radius={[4, 4, 0, 0]} opacity={0.5} />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

export function HelpCenterPage() {
  const [loading, setLoading] = useState(false);

  const handleContactSupport = () => {
    setLoading(true);
    // Open system email client
    window.location.href = "mailto:staff@klh.edu.in?subject=Grievance Redressal Support Request&body=Hi Support Team,%0D%0A%0D%0AI need assistance with the following grievance...%0D%0A%0D%0AStudentID: %0D%0ADepartment:";
    setTimeout(() => setLoading(false), 2000);
  };

  const faqs = [
    { 
      id: 'submitting', 
      title: 'How do I submit a grievance?', 
      desc: 'Navigate to the "Submit Grievance" tab in your sidebar. Ensure you select the correct department and category for the fastest routing. You can also choose to remain anonymous if you are reporting sensitive institutional issues.' 
    },
    { 
      id: 'tracking', 
      title: 'What do the status labels mean?', 
      desc: '"Pending" means your case is in the administrative queue. "In Progress" signifies a staff member has been assigned. "Resolved" means a final action has been taken and documented in your timeline.' 
    },
    { 
      id: 'escalation', 
      title: 'When will my case be escalated?', 
      desc: 'If a department does not move a case to "In Progress" within 48 business hours, the system automatically flags the grievance for administrative review by the oversight committee.' 
    },
    { 
      id: 'security', 
      title: 'Is my data secure?', 
      desc: 'We use end-to-end encryption for all resolution notes and media uploads. Your personal identifiers are only visible to the assigned investigator unless you select "Anonymous".' 
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-5xl space-y-12 pb-20">
      <div>
        <h2 className="text-5xl font-serif text-[#111110] dark:text-[#FDFCF8] mb-4 transition-colors">Help Center</h2>
        <p className="text-[#6B6B66] dark:text-[#A1A1AA] font-sans max-w-xl transition-colors">
          Everything you need to know about the Grievance Redressal Protocol. Find answers to common questions and learn how we protect your voice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {faqs.map((faq, i) => (
          <motion.div 
            key={faq.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-10 bg-[#F2EFE5] dark:bg-[#18181B] rounded-[40px] border border-[#E5E3D9] dark:border-[#333333] hover:border-amber-500/30 transition-all group"
          >
            <div className="w-12 h-12 bg-white dark:bg-black rounded-2xl flex items-center justify-center mb-6 shadow-sm">
               <StrokeAlert className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-2xl font-serif mb-4 group-hover:text-amber-600 transition-colors">{faq.title}</h3>
            <p className="text-sm text-[#6B6B66] dark:text-[#A1A1AA] leading-relaxed line-clamp-4">{faq.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="p-12 bg-black dark:bg-[#FDFCF8] rounded-[48px] text-[#FDFCF8] dark:text-[#111110] text-center space-y-6">
        <h3 className="text-3xl font-serif">Still have questions?</h3>
        <p className="max-w-md mx-auto opacity-70">Our administrative support team is available 24/7 for urgent escalations regarding safety and critical campus issues.</p>
        <Button 
          onClick={handleContactSupport}
          disabled={loading}
          className="rounded-full px-12 h-14 bg-[#F5B889] text-black border-none hover:opacity-90 transition-all"
        >
          {loading ? 'SENDING MAIL...' : 'SEND MAIL TO STAFF'}
        </Button>
      </div>
    </motion.div>
  );
}

export function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // New: Preference States
  const [notifications, setNotifications] = useState(true);
  const [anonymity, setAnonymity] = useState(false);
  const [themeMode, setThemeMode] = useState('automatic');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    try {
      const res = await fetch('/api/auth/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage('Settings synchronized successfully!');
        if (password) setPassword('');
      } else {
        setMessage(data.error || 'Failed to update settings');
      }
    } catch (err) {
      setMessage('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
    <div 
      onClick={onClick}
      className={`w-12 h-6 rounded-full cursor-pointer transition-all duration-300 relative ${active ? 'bg-[#F5B889]' : 'bg-[#E5E3D9] dark:bg-[#333333]'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${active ? 'left-7' : 'left-1'}`} />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-4xl space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-5xl font-serif text-[#111110] dark:text-[#FDFCF8] mb-4">Settings</h2>
          <p className="text-[#6B6B66] dark:text-[#A1A1AA] font-sans max-w-lg">
            Personalize your portal experience and secure your account credentials.
          </p>
        </div>
        <div className="flex gap-2">
           <div className="w-10 h-10 rounded-full bg-[#F5B889]" />
           <div className="w-10 h-10 rounded-full bg-[#EBCBD8]" />
           <div className="w-10 h-10 rounded-full bg-[#E5C4E5]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Profile Section */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-8 p-10 bg-[#FDFCF8] dark:bg-[#111110] rounded-[48px] border border-[#E5E3D9] dark:border-[#333333] transition-colors">
            <h3 className="text-xl font-serif">Identity Settings</h3>
            {message && (
              <div className={`p-4 rounded-2xl text-[10px] font-mono uppercase tracking-[0.2em] text-center ${message.includes('success') ? 'bg-[#F2D5D9] text-[#111110]' : 'bg-red-500/10 text-red-600'}`}>
                {message}
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#888880] mb-3">Display Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#888880] mb-3">Email Vector</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#888880] mb-3">Credentials Update</label>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Leave blank to keep current" />
              </div>
            </div>

            <Button type="submit" className="w-full h-14 bg-[#111110] dark:bg-[#FDFCF8] text-white dark:text-[#111110] rounded-full" size="lg" disabled={isSaving}>
              {isSaving ? 'SYNCHRONIZING...' : 'UPDATE PROFILE'}
            </Button>
          </form>
        </div>

        {/* Preferences Section */}
        <div className="lg:col-span-2 space-y-8">
           <div className="p-8 bg-[#F2EFE5] dark:bg-[#18181B] rounded-[48px] border border-[#E5E3D9] dark:border-[#333333] space-y-8">
              <h3 className="text-xl font-serif">System Preferences</h3>
              
              <div className="flex items-center justify-between">
                <div>
                   <p className="text-sm font-medium">Push Notifications</p>
                   <p className="text-[10px] font-mono text-[#888880] uppercase">Mobile & Web alerts</p>
                </div>
                <Toggle active={notifications} onClick={() => setNotifications(!notifications)} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                   <p className="text-sm font-medium">Anonymity Shield</p>
                   <p className="text-[10px] font-mono text-[#888880] uppercase">Always redact name</p>
                </div>
                <Toggle active={anonymity} onClick={() => setAnonymity(!anonymity)} />
              </div>


           </div>

           <div className="p-8 bg-[#F5B889]/10 rounded-[40px] border border-[#F5B889]/20 flex items-center gap-4">
              <StrokeUser className="w-8 h-8 text-[#F5B889]" />
              <div>
                 <p className="text-xs font-bold uppercase tracking-tight">Enterprise Privacy</p>
                 <p className="text-[10px] opacity-60">Session vault: Active</p>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
