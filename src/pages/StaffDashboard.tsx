import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExpandingGallery } from '../components/ui/ExpandingGallery';
import { GrievanceModal } from '../components/ui/GrievanceModal';
import { PongLoader } from '../components/ui/PongLoader';
import { PieChart as PieChartIcon, ArrowLeft } from 'lucide-react';
import { StrokeSearch as Search, StrokeFilter as Filter, StrokeCheck as CheckCircle2, StrokeClock as Clock, StrokeAlert as AlertCircle, StrokeStar as Star, StrokeZap as Zap } from '../components/ui/HandDrawnIcons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function StaffDashboard() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewAllSection, setViewAllSection] = useState<string | null>(null);
  const [extraStats, setExtraStats] = useState({ avgRating: 0, avgResolutionHours: 0 });

  useEffect(() => {
    fetchGrievances();
  }, []);

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

      const statsRes = await fetch('/api/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setExtraStats({
          avgRating: statsData.avgRating,
          avgResolutionHours: statsData.avgResolutionHours
        });
      }
    } catch (error) {
      console.error('Failed to fetch grievances', error);
      await minWait;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string, note?: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/grievances/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus, note })
      });
      if (res.ok) {
        // Update local state to reflect change immediately in UI
        setGrievances(prev => prev.map((g: any) => g.id === id ? { ...g, status: newStatus } : g));
        setSelectedGrievance(prev => {
          if (prev && (prev as any).id === id) {
            return { ...prev, status: newStatus } as any;
          }
          return prev;
        });
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
    { label: 'Assigned', value: grievances.length, icon: AlertCircle, color: 'text-[#F5B889]' },
    { label: 'Resolution', value: `${Math.round(extraStats.avgResolutionHours)}h`, icon: Zap, color: 'text-[#E5C4E5]' },
    { label: 'Satisfaction', value: `${Number(extraStats.avgRating).toFixed(1)}/5`, icon: Star, color: 'text-[#EBCBD8]' },
  ];

  const chartData = [
    { name: 'Pending', value: underReview.length, color: '#F5B889' },
    { name: 'In Progress', value: underResolution.length, color: '#F2D5D9' },
    { name: 'Completed', value: completed.length, color: '#EBCBD8' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-16 px-4">
      {viewAllSection ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8 lg:py-12"
        >
          <button 
            onClick={() => setViewAllSection(null)}
            className="flex items-center gap-2 mb-8 text-[#888880] hover:text-[#111110] dark:hover:text-[#FDFCF8] font-mono text-xs uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-12">
            <div className="flex items-center gap-4">
              <span className={`w-3 h-3 rounded-full ${viewAllSection === 'pending' ? 'bg-amber-500' : viewAllSection === 'in_progress' ? 'bg-blue-500' : 'bg-green-500'} shadow-[0_0_15px_currentColor]`} />
              <h2 className="text-4xl font-serif text-[#111110] dark:text-[#FDFCF8]">
                {viewAllSection === 'pending' ? 'Under Review' : viewAllSection === 'in_progress' ? 'Under Resolution' : 'Completed'}
              </h2>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888880] sm:ml-4 sm:pt-2">
              {(viewAllSection === 'pending' ? underReview : viewAllSection === 'in_progress' ? underResolution : completed).length} ASSIGNED
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(viewAllSection === 'pending' ? underReview : viewAllSection === 'in_progress' ? underResolution : completed).map((item: any) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedGrievance(item)}
                className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer bg-[#F2EFE5] dark:bg-[#18181B]"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(/images/${item.category}.png)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-left">
                  <div className="space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex gap-2 items-center flex-wrap">
                      <div className="px-3 py-1.5 border border-white/30 bg-black/40 backdrop-blur-md text-white/90 font-sans text-[10px] uppercase tracking-widest rounded-sm">
                        {item.category.replace('_', ' ')}
                      </div>
                      {item.ticket_id && (
                        <div className="px-3 py-1.5 border border-amber-500/30 bg-amber-500/10 backdrop-blur-md text-amber-500 font-mono text-[10px] font-bold tracking-widest rounded-sm">
                          {item.ticket_id}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif text-white leading-tight line-clamp-2">{item.title}</h3>
                    <div className="px-3 py-1.5 inline-block border border-white/30 bg-black/40 backdrop-blur-md text-white/80 font-sans text-[10px] rounded-sm">
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <>
          {/* Header & Stats */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 pt-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex-1 space-y-8"
            >
              <div>
                <h2 className="text-5xl font-serif text-[#111110] dark:text-[#FDFCF8] mb-4 transition-colors duration-300">Department</h2>
                <p className="text-[#6B6B66] dark:text-[#A1A1AA] font-sans max-w-md transition-colors duration-300">
                  Manage and resolve student concerns assigned to your department. Click on any card to view details and update status.
                </p>
              </div>

              {/* Graph Section */}
              <div className="p-8 bg-[#F2EFE5] dark:bg-[#18181B] rounded-[32px] border border-[#E5E3D9] dark:border-[#333333] transition-colors duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <PieChartIcon className="w-5 h-5 text-[#111110] dark:text-[#FDFCF8]" />
                  <h3 className="text-xl font-serif text-[#111110] dark:text-[#FDFCF8]">Resolution Progress</h3>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#111110', 
                          border: 'none', 
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontFamily: 'monospace',
                          color: '#FDFCF8'
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value) => <span className="text-[10px] font-mono uppercase tracking-widest text-[#888880]">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="px-8 py-6 bg-[#F2EFE5] dark:bg-[#18181B] rounded-[32px] border border-[#E5E3D9] dark:border-[#333333] transition-colors duration-500 min-w-[160px]"
                  >
                    <stat.icon className={`w-5 h-5 mb-4 ${stat.color}`} />
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#888880] dark:text-[#A1A1AA] mb-1">{stat.label}</p>
                    <p className="text-3xl font-serif text-[#111110] dark:text-[#FDFCF8]">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions / Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-8 bg-[#111110] dark:bg-[#FDFCF8] rounded-[32px] text-[#FDFCF8] dark:text-[#111110] transition-colors duration-500"
              >
                <h3 className="text-xl font-serif mb-4">Staff Guidelines</h3>
                <ul className="space-y-4 text-xs font-mono uppercase tracking-widest opacity-80">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-current mt-1" />
                    Review new assignments within 24 hours.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-current mt-1" />
                    Update status to "In Progress" when starting.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-current mt-1" />
                    Provide clear resolution notes for students.
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-[#F2EFE5] dark:bg-[#18181B] rounded-[24px] border border-[#E5E3D9] dark:border-[#333333] transition-colors duration-500">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888880]" />
              <input 
                type="text"
                placeholder="SEARCH BY TITLE OR DESCRIPTION..."
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
                <div className="flex items-center gap-4">
                  {underReview.length > 3 && (
                    <button 
                      onClick={() => setViewAllSection('pending')}
                      className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500 hover:opacity-80 transition-opacity"
                    >
                      VIEW ALL
                    </button>
                  )}
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888880]">{underReview.length} ASSIGNED</span>
                </div>
              </div>
              <ExpandingGallery items={underReview.slice(0, 3)} onSelect={setSelectedGrievance} />
            </section>
            
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-serif text-[#111110] dark:text-[#FDFCF8] flex items-center gap-4 transition-colors duration-300">
                  <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                  Under Resolution
                </h3>
                <div className="flex items-center gap-4">
                  {underResolution.length > 3 && (
                    <button 
                      onClick={() => setViewAllSection('in_progress')}
                      className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500 hover:opacity-80 transition-opacity"
                    >
                      VIEW ALL
                    </button>
                  )}
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888880]">{underResolution.length} ASSIGNED</span>
                </div>
              </div>
              <ExpandingGallery items={underResolution.slice(0, 3)} onSelect={setSelectedGrievance} />
            </section>
     
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-serif text-[#111110] dark:text-[#FDFCF8] flex items-center gap-4 transition-colors duration-300">
                  <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                  Completed
                </h3>
                <div className="flex items-center gap-4">
                  {completed.length > 3 && (
                    <button 
                      onClick={() => setViewAllSection('resolved')}
                      className="font-mono text-[10px] uppercase tracking-[0.2em] text-green-600 dark:text-green-500 hover:opacity-80 transition-opacity"
                    >
                      VIEW ALL
                    </button>
                  )}
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888880]">{completed.length} ASSIGNED</span>
                </div>
              </div>
              <ExpandingGallery items={completed.slice(0, 3)} onSelect={setSelectedGrievance} />
            </section>
          </div>
        </>
      )}

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
