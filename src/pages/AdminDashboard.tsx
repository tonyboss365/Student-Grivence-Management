import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExpandingGallery } from '../components/ui/ExpandingGallery';
import { GrievanceModal } from '../components/ui/GrievanceModal';
import { PongLoader } from '../components/ui/PongLoader';
import { Shield, Users, FileText } from 'lucide-react';
import { StrokeSearch as Search, StrokeFilter as Filter, StrokeCheck as CheckCircle } from '../components/ui/HandDrawnIcons';

export default function AdminDashboard() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchGrievances();
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchGrievances = async () => {
    setLoading(true);
    const minWait = new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/grievances', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        await minWait;
        setGrievances(data);
      }
    } catch (error) {
      console.error('Failed to fetch grievances', error);
      await minWait;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/grievances/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setGrievances(prev => prev.map((g: any) => g.id === id ? { ...g, status: newStatus } : g));
        if (selectedGrievance && (selectedGrievance as any).id === id) {
          setSelectedGrievance(prev => ({ ...prev, status: newStatus } as any));
        }
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  if (loading) return <PongLoader />;

  const filteredGrievances = grievances.filter((g: any) => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         g.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || g.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const underReview = filteredGrievances.filter((g: any) => g.status === 'pending');
  const underResolution = filteredGrievances.filter((g: any) => g.status === 'in_progress');
  const completed = filteredGrievances.filter((g: any) => g.status === 'resolved' || g.status === 'rejected');

  const stats = [
    { label: 'Total Grievances', value: analytics?.total || grievances.length, icon: FileText, color: 'text-[#F5B889]' },
    { label: 'System Health', value: '100%', icon: Shield, color: 'text-[#E5C4E5]' },
    { label: 'Avg Satisfaction', value: analytics?.averageRating ? `${analytics.averageRating}/5` : '5.0/5', icon: CheckCircle, color: 'text-[#EBCBD8]' },
    { label: 'Resolved Rate', value: grievances.length ? `${Math.round((completed.length / grievances.length) * 100)}%` : '0%', icon: CheckCircle, color: 'text-[#F8C8A5]' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-16 px-4">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
        >
          <h2 className="text-5xl font-serif text-[#111110] dark:text-[#FDFCF8] mb-4 transition-colors duration-300">System</h2>
          <p className="text-[#6B6B66] dark:text-[#A1A1AA] font-sans max-w-md transition-colors duration-300">
            Global administrative overview. Monitor system-wide grievance trends and department performance metrics.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="px-6 py-6 bg-[#F2EFE5] dark:bg-[#18181B] rounded-[32px] border border-[#E5E3D9] dark:border-[#333333] transition-colors duration-500"
            >
              <stat.icon className={`w-4 h-4 mb-4 ${stat.color}`} />
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#888880] dark:text-[#A1A1AA] mb-1">{stat.label}</p>
              <p className="text-2xl font-serif text-[#111110] dark:text-[#FDFCF8]">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-[#F2EFE5] dark:bg-[#18181B] rounded-[24px] border border-[#E5E3D9] dark:border-[#333333] transition-colors duration-500">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888880]" />
          <input 
            type="text"
            placeholder="SEARCH SYSTEM-WIDE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-transparent font-mono text-xs uppercase tracking-wider outline-none text-[#111110] dark:text-[#FDFCF8]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#888880] ml-2" />
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-12 px-4 bg-transparent font-mono text-xs uppercase tracking-wider outline-none text-[#111110] dark:text-[#FDFCF8] cursor-pointer"
          >
            <option value="all">ALL CATEGORIES</option>
            <option value="academic">ACADEMIC</option>
            <option value="administrative">ADMINISTRATIVE</option>
            <option value="facilities">FACILITIES</option>
            <option value="harassment">HARASSMENT</option>
          </select>
        </div>
      </div>

      <div className="space-y-20">
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-serif text-[#111110] dark:text-[#FDFCF8] flex items-center gap-4 transition-colors duration-300">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
              Under Review
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888880]">{underReview.length} TOTAL</span>
          </div>
          <ExpandingGallery items={underReview} onSelect={setSelectedGrievance} />
        </section>
        
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-serif text-[#111110] dark:text-[#FDFCF8] flex items-center gap-4 transition-colors duration-300">
              <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              Under Resolution
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888880]">{underResolution.length} TOTAL</span>
          </div>
          <ExpandingGallery items={underResolution} onSelect={setSelectedGrievance} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-serif text-[#111110] dark:text-[#FDFCF8] flex items-center gap-4 transition-colors duration-300">
              <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
              Completed
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888880]">{completed.length} TOTAL</span>
          </div>
          <ExpandingGallery items={completed} onSelect={setSelectedGrievance} />
        </section>

        {/* New Feature: System Activity Feed */}
        <section className="pt-12 border-t border-[#E5E3D9] dark:border-[#333333]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-serif text-[#111110] dark:text-[#FDFCF8]">System Pulse</h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888880]">Live Activity</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { type: 'Alert', msg: 'Harassment report submitted in CS Dept', time: '2m ago' },
              { type: 'Check', msg: 'EE-429 grievance reached Resolution', time: '15m ago' },
              { type: 'User', msg: 'New Staff account verified: Dr. Sarah', time: '1h ago' },
            ].map((activity, i) => (
              <div key={i} className="p-6 bg-[#FDFCF8] dark:bg-[#111110] border border-[#E5E3D9] dark:border-[#333333] rounded-2xl flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm text-[#111110] dark:text-[#FDFCF8] font-medium">{activity.msg}</p>
                  <p className="text-[10px] font-mono text-[#888880] uppercase mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {selectedGrievance && (
          <GrievanceModal 
            grievance={selectedGrievance} 
            onClose={() => setSelectedGrievance(null)} 
            isStaff={true}
            onUpdateStatus={updateStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
