import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExpandingGallery } from '../components/ui/ExpandingGallery';
import { GrievanceModal } from '../components/ui/GrievanceModal';
import { PongLoader } from '../components/ui/PongLoader';
import { Info, BarChart3, Activity, ArrowLeft } from 'lucide-react';
import { StrokeSearch as Search, StrokeFilter as Filter, StrokeCheck as CheckCircle2, StrokeClock as Clock, StrokeAlert as AlertCircle } from '../components/ui/HandDrawnIcons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function StudentDashboard() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewAllSection, setViewAllSection] = useState<string | null>(null);
  const [selectedGrievance, setSelectedGrievance] = useState(null);

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
      let data = [];
      if (res.ok) {
        data = await res.json();
      }
      
      await minWait;
      setGrievances(data);
    } catch (error) {
      console.error('Failed to fetch grievances', error);
      await minWait;
    } finally {
      setLoading(false);
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
    { label: 'Total Submitted', value: grievances.length, color: 'bg-[#111110] dark:bg-[#FDFCF8]', textColor: 'text-[#FDFCF8] dark:text-[#111110]' },
    { label: 'Under Review', value: grievances.filter((g: any) => g.status === 'pending').length, color: 'bg-[#F5B889]', textColor: 'text-[#111110]' },
    { label: 'In Progress', value: grievances.filter((g: any) => g.status === 'in_progress').length, color: 'bg-[#F2D5D9]', textColor: 'text-[#111110]' },
    { label: 'Resolved', value: grievances.filter((g: any) => g.status === 'resolved').length, color: 'bg-[#EBCBD8]', textColor: 'text-[#111110]' },
  ];

  const chartData = [
    { name: 'Pending', count: grievances.filter((g: any) => g.status === 'pending').length, color: '#F5B889' },
    { name: 'In Progress', count: grievances.filter((g: any) => g.status === 'in_progress').length, color: '#F2D5D9' },
    { name: 'Resolved', count: grievances.filter((g: any) => g.status === 'resolved').length, color: '#EBCBD8' },
    { name: 'Rejected', count: grievances.filter((g: any) => g.status === 'rejected').length, color: '#E5C4E5' },
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
                {viewAllSection === 'pending' ? 'Under Review' : viewAllSection === 'in_progress' ? 'Under Resolution' : 'Resolved'}
              </h2>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888880] sm:ml-4 sm:pt-2">
              {(viewAllSection === 'pending' ? underReview : viewAllSection === 'in_progress' ? underResolution : completed).length} ITEMS
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(viewAllSection === 'pending' ? underReview : viewAllSection === 'in_progress' ? underResolution : completed).map((item: any) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedGrievance(item)}
                className="group relative h-[400px] rounded-2xl overflow-hidden bg-[#F2EFE5] dark:bg-[#18181B] cursor-pointer"
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start pt-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="lg:col-span-2 space-y-8"
            >
              <div>
                <h2 className="text-5xl font-serif text-[#111110] dark:text-[#FDFCF8] mb-4 transition-colors duration-300">Overview</h2>
                <p className="text-[#6B6B66] dark:text-[#A1A1AA] font-sans max-w-md transition-colors duration-300">
                  Welcome back. Here is a summary of your active concerns and their current progress in the system.
                </p>
              </div>

              {/* Graph Section */}
              <div className="p-8 bg-[#F2EFE5] dark:bg-[#18181B] rounded-[32px] border border-[#E5E3D9] dark:border-[#333333] transition-colors duration-500">
                <div className="flex items-center gap-3 mb-8">
                  <BarChart3 className="w-5 h-5 text-[#111110] dark:text-[#FDFCF8]" />
                  <h3 className="text-xl font-serif text-[#111110] dark:text-[#FDFCF8]">Status Distribution</h3>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E3D9" opacity={0.5} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#888880' }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#888880' }}
                      />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ 
                          backgroundColor: '#111110', 
                          border: 'none', 
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontFamily: 'monospace',
                          color: '#FDFCF8'
                        }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 bg-[#F2EFE5] dark:bg-[#18181B] rounded-3xl border border-[#E5E3D9] dark:border-[#333333] transition-colors duration-500"
                  >
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#888880] dark:text-[#A1A1AA] mb-2">{stat.label}</p>
                    <p className="text-3xl font-serif text-[#111110] dark:text-[#FDFCF8]">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Progress Tracker Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 bg-[#111110] dark:bg-[#FDFCF8] rounded-[32px] text-[#FDFCF8] dark:text-[#111110] transition-colors duration-500"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-5 h-5" />
                  <h3 className="text-xl font-serif">Live Progress</h3>
                </div>
                <div className="space-y-6">
                  {grievances.slice(0, 3).map((g: any, i) => (
                    <div key={g.id} className="relative pl-6 border-l border-white/20 dark:border-black/20">
                      <div className={`absolute left-[-5px] top-0 w-2 h-2 rounded-full ${
                        g.status === 'resolved' ? 'bg-green-500' : 
                        g.status === 'rejected' ? 'bg-red-500' :
                        g.status === 'in_progress' ? 'bg-blue-500' : 'bg-amber-500'
                      }`} />
                      <p className="text-[10px] font-mono uppercase tracking-widest opacity-60 mb-1">
                        {new Date(g.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-medium mb-1 truncate">{g.title}</p>
                      <p className="text-[9px] font-mono uppercase tracking-wider opacity-80">
                        STATUS: {g.status.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-[#F2EFE5] dark:bg-[#18181B] rounded-[24px] border border-[#E5E3D9] dark:border-[#333333] transition-colors duration-500">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888880]" />
              <input 
                type="text"
                placeholder="SEARCH GRIEVANCES..."
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

          {/* Info Banner */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 p-6 bg-[#111110] dark:bg-[#FDFCF8] rounded-[24px] text-[#FDFCF8] dark:text-[#111110] transition-colors duration-500"
          >
            <Info className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-mono uppercase tracking-widest leading-relaxed">
              Click any card to view its full activity timeline, resolution notes from staff, and provide feedback on completed cases.
            </p>
          </motion.div>

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
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888880]">{underReview.length} ITEMS</span>
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
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888880]">{underResolution.length} ITEMS</span>
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
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888880]">{completed.length} ITEMS</span>
                </div>
              </div>
              <ExpandingGallery items={completed.slice(0, 3)} onSelect={setSelectedGrievance} />
            </section>
            <section className="pt-20 border-t border-[#E5E3D9] dark:border-[#333333]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-serif text-[#111110] dark:text-[#FDFCF8]">Support Center</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888880]">Guided Resources</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: 'Anonymity Shield', desc: 'Secure encryption protocols protect your identity from department view.', icon: AlertCircle },
                  { title: 'Response Timeline', desc: 'Detailed breakdown of standard and priority 48-hour resolution windows.', icon: Clock },
                  { title: 'Live Chat', desc: 'Secure channel for evidence clarification with administrative staff.', icon: Activity }
                ].map((card, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -5 }}
                    className="group p-8 bg-[#F2EFE5] dark:bg-[#18181B] border border-[#E5E3D9] dark:border-[#333333] rounded-[32px] transition-all duration-500 cursor-pointer"
                  >
                    <card.icon className="w-6 h-6 text-amber-500 mb-6 group-hover:scale-110 transition-transform" />
                    <h4 className="text-xl font-serif mb-2">{card.title}</h4>
                    <p className="text-sm text-[#6B6B66] dark:text-[#A1A1AA] leading-relaxed line-clamp-2">{card.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}

      <AnimatePresence>
        {selectedGrievance && (
          <GrievanceModal 
            grievance={selectedGrievance} 
            onClose={() => setSelectedGrievance(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
