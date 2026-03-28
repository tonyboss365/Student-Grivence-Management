import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Send, Circle } from 'lucide-react';
import { StrokeCheck as CheckCircle2, StrokeStar as Star, StrokeClock as Clock, StrokeUser as User } from './HandDrawnIcons';
import { format } from 'date-fns';

interface GrievanceModalProps {
  grievance: any;
  onClose: () => void;
  onUpdateStatus?: (id: number, status: string, note?: string) => void;
  isStaff?: boolean;
}

export function GrievanceModal({ grievance: initialGrievance, onClose, onUpdateStatus, isStaff }: GrievanceModalProps) {
  const [grievance, setGrievance] = useState<any>(initialGrievance);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    if (initialGrievance) {
      setGrievance(initialGrievance);
      setLoading(true);
      fetchDetails();
    }
  }, [initialGrievance?.id]);

  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/grievances/${initialGrievance.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const details = await res.json();
        setGrievance(details);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (status: string) => {
    if ((status === 'resolved' || status === 'rejected') && !note.trim()) {
      alert('Please provide a resolution note.');
      return;
    }
    onUpdateStatus?.(grievance.id, status, note);
    onClose();
  };

  const submitFeedback = async () => {
    if (rating === 0) return alert('Please select a star rating.');
    setIsSubmittingFeedback(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/grievances/${grievance.id}/feedback`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating, feedback })
      });
      if (res.ok) {
        setShowFeedbackForm(false);
        fetchDetails(); // Refresh to show the rating
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (!initialGrievance) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#111110]/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FDFCF8] dark:bg-[#111110] w-full max-w-2xl rounded-[24px] shadow-2xl overflow-hidden border border-[#E5E3D9] dark:border-[#333333] flex flex-col max-h-[90vh] transition-colors duration-300"
      >
        {!isStaff ? (
          <div className="h-32 sm:h-40 bg-cover bg-center relative shrink-0" style={{ backgroundImage: `url(/images/modal_banner.png)` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCF8] dark:from-[#111110] to-[#FDFCF8]/10 dark:to-[#111110]/10" />
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 p-2 bg-white/50 dark:bg-black/50 hover:bg-white/80 dark:hover:bg-black/80 backdrop-blur-md rounded-full text-[#111110] dark:text-[#FDFCF8]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="relative pt-12 px-8">
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 p-2 bg-[#F2EFE5] dark:bg-[#27272A] hover:bg-[#E5E3D9] dark:hover:bg-[#3f3f46] rounded-full text-[#111110] dark:text-[#FDFCF8]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        
        <div className="p-8 pt-0 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-8 gap-4">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h2 className="text-3xl font-serif text-[#111110] dark:text-[#FDFCF8] leading-tight transition-colors duration-300">{grievance?.title || initialGrievance.title}</h2>
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-500 font-mono text-[10px] tracking-widest font-bold rounded-xl whitespace-nowrap">
                  {grievance?.ticket_id || initialGrievance.ticket_id}
                </span>
              </div>
              <p className="text-[#6B6B66] dark:text-[#A1A1AA] font-sans text-xs transition-colors duration-300">Submitted on {format(new Date(grievance?.created_at || initialGrievance.created_at), 'MMMM d, yyyy')}</p>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase shrink-0 transition-all duration-300 ${
              (grievance?.status || initialGrievance.status) === 'resolved' ? 'bg-green-500 text-white' :
              (grievance?.status || initialGrievance.status) === 'rejected' ? 'bg-red-500 text-white' :
              (grievance?.status || initialGrievance.status) === 'in_progress' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white'
            }`}>
              {(grievance?.status || initialGrievance.status).replace('_', ' ')}
            </div>
          </div>
          
          <div className="space-y-12 pb-8">
            {/* Main Content Info */}
            <div className="grid grid-cols-2 gap-8 p-6 bg-[#F2EFE5] dark:bg-[#18181B] rounded-3xl border border-[#E5E3D9] dark:border-[#333333] transition-colors duration-500">
              <div className="col-span-2">
                <h4 className="text-[10px] font-bold text-[#888880] dark:text-[#A1A1AA] uppercase tracking-widest mb-3">Description</h4>
                <p className="text-[#111110] dark:text-[#FDFCF8] leading-relaxed font-sans text-sm whitespace-pre-wrap transition-colors duration-300">{grievance?.description || initialGrievance.description}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-[#888880] dark:text-[#A1A1AA] uppercase tracking-widest mb-1">Category</h4>
                <p className="text-sm text-[#111110] dark:text-[#FDFCF8] capitalize font-medium transition-colors duration-300">{(grievance?.category || initialGrievance.category).replace('_', ' ')}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-[#888880] dark:text-[#A1A1AA] uppercase tracking-widest mb-1">Department</h4>
                <p className="text-sm text-[#111110] dark:text-[#FDFCF8] font-medium transition-colors duration-300">{grievance?.department_name || initialGrievance.department_name}</p>
              </div>
              {isStaff && (
                <div className="col-span-2 grid grid-cols-2 gap-6 pt-4 border-t border-[#E5E3D9] dark:border-[#333333]">
                  <div>
                    <h4 className="text-[10px] font-bold text-[#888880] dark:text-[#A1A1AA] uppercase tracking-widest mb-1">Student</h4>
                    <p className="text-sm text-[#111110] dark:text-[#FDFCF8] font-medium transition-colors duration-300">{grievance?.is_anonymous ? 'Anonymous' : grievance?.student_name}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-[#888880] dark:text-[#A1A1AA] uppercase tracking-widest mb-1">Contact</h4>
                    <p className="text-sm text-[#111110] dark:text-[#FDFCF8] font-medium truncate transition-colors duration-300">{grievance?.is_anonymous ? 'Hidden' : grievance?.contact_email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Vertical Timeline */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-bold text-[#888880] dark:text-[#A1A1AA] uppercase tracking-[0.2em]">Activity Timeline</h4>
                {loading && <div className="text-[10px] font-mono text-amber-500 animate-pulse uppercase">Syncing...</div>}
              </div>
              <div className="space-y-8 relative before:absolute before:inset-0 before:left-[15px] before:w-[1px] before:bg-[#E5E3D9] dark:before:bg-[#333333]">
                {!loading && grievance?.logs?.length === 0 && (
                   <p className="pl-10 text-[11px] text-[#888880] font-mono uppercase italic tracking-wider">No activity logs recorded yet.</p>
                )}
                {grievance?.logs?.map((log: any, idx: number) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={log.id} 
                    className="relative pl-10"
                  >
                    <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#FDFCF8] dark:bg-[#111110] border-2 transition-all duration-500 ${
                      idx === grievance.logs.length - 1 ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-[#E5E3D9] dark:border-[#333333]'
                    }`}>
                      <div className={`w-2 h-2 rounded-full transition-all duration-500 ${idx === grievance.logs.length - 1 ? 'bg-amber-500' : 'bg-[#888880]'}`} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#111110] dark:text-[#FDFCF8] uppercase tracking-wider">
                          {log.status_to === 'pending' ? 'Grievance Submitted' : 
                           log.status_to === 'in_progress' ? 'In Progress (Resolving)' : 
                           log.status_to === 'resolved' ? 'Case Completed' : 
                           'Case Rejected'}
                        </p>
                        <span className="text-[10px] font-mono text-[#888880]">{format(new Date(log.created_at), 'MMM d, h:mm a')}</span>
                      </div>
                      <p className="text-[11px] text-[#6B6B66] dark:text-[#A1A1AA] flex items-center gap-1.5 transition-colors duration-300">
                        <User className="w-3 h-3" /> Updated by {log.user_name}
                      </p>
                      {log.note && (
                        <div className="mt-2 p-3 bg-white dark:bg-[#27272A] border border-[#E5E3D9] dark:border-[#333333] rounded-xl text-xs text-[#111110] dark:text-[#FDFCF8] leading-relaxed transition-colors duration-300">
                          &ldquo;{log.note}&rdquo;
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Resolution Form (Staff Only) */}
            {isStaff && grievance?.status !== 'resolved' && grievance?.status !== 'rejected' && (
              <div className="p-6 bg-[#F2EFE5] dark:bg-[#18181B] rounded-3xl text-[#111110] dark:text-[#FDFCF8] border border-[#E5E3D9] dark:border-[#333333] transition-colors duration-500">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] mb-4 opacity-80">Resolution Action</h4>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter resolution notes for the student..."
                  className="w-full h-24 p-4 bg-white/50 dark:bg-black/50 border-none rounded-2xl outline-none text-sm placeholder:opacity-50 focus:bg-white focus:dark:bg-black transition-all mb-6"
                />
                <div className="flex gap-4">
                  <button 
                     onClick={() => handleUpdateStatus('in_progress')}
                     className="flex-1 py-3 bg-[rgba(17,17,16,0.05)] dark:bg-[rgba(253,252,248,0.05)] text-[#111110] dark:text-[#FDFCF8] border border-[rgba(17,17,16,0.1)] dark:border-[rgba(253,252,248,0.1)] rounded-xl font-mono text-[10px] uppercase tracking-widest hover:bg-[rgba(17,17,16,0.1)] dark:hover:bg-[rgba(253,252,248,0.1)] transition-colors"
                  >
                    In Progress
                  </button>
                  <button 
                     onClick={() => handleUpdateStatus('resolved')}
                     className="flex-1 py-3 bg-[rgba(17,17,16,0.05)] dark:bg-[rgba(253,252,248,0.05)] text-[#111110] dark:text-[#FDFCF8] border border-[rgba(17,17,16,0.1)] dark:border-[rgba(253,252,248,0.1)] rounded-xl font-mono text-[10px] uppercase tracking-widest hover:bg-[rgba(17,17,16,0.1)] dark:hover:bg-[rgba(253,252,248,0.1)] transition-colors"
                  >
                    Resolve
                  </button>
                  <button 
                     onClick={() => handleUpdateStatus('rejected')}
                     className="flex-1 py-3 bg-[rgba(17,17,16,0.05)] dark:bg-[rgba(253,252,248,0.05)] text-[#111110] dark:text-[#FDFCF8] border border-[rgba(17,17,16,0.1)] dark:border-[rgba(253,252,248,0.1)] rounded-xl font-mono text-[10px] uppercase tracking-widest hover:bg-[rgba(17,17,16,0.1)] dark:hover:bg-[rgba(253,252,248,0.1)] transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}

            {/* Feedback Section */}
            {grievance?.status === 'resolved' && (
              <div className="p-8 bg-[#F2EFE5] dark:bg-[#18181B] rounded-3xl border border-[#E5E3D9] dark:border-[#333333] text-[#111110] dark:text-[#FDFCF8] transition-colors duration-500">
                {grievance?.student_rating ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <h4 className="text-xl font-serif">Resolution Feedback</h4>
                    </div>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-5 h-5 ${s <= grievance.student_rating ? 'fill-current' : 'opacity-20'}`} />
                      ))}
                    </div>
                    {grievance.student_feedback && (
                      <div className="p-4 bg-white/40 dark:bg-black/40 rounded-xl text-sm italic transition-colors">
                        &ldquo;{grievance.student_feedback}&rdquo;
                      </div>
                    )}
                  </div>
                ) : !isStaff ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-2xl font-serif mb-2">How was your experience?</h4>
                      <p className="text-sm opacity-80">Help us improve by rating the resolution quality.</p>
                    </div>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} onClick={() => setRating(s)} className="p-1">
                          <Star className={`w-8 h-8 transition-all duration-300 ${rating >= s ? 'fill-amber-500 text-amber-500 scale-110' : 'text-[#888880] hover:text-[#581C87]'}`} />
                        </button>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <textarea 
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Optional comments on the resolution..."
                        className="w-full h-24 p-4 bg-white/50 dark:bg-black/50 border-none rounded-2xl outline-none text-sm placeholder:opacity-50 focus:bg-white focus:dark:bg-black transition-all"
                      />
                      <button 
                        onClick={submitFeedback}
                        disabled={isSubmittingFeedback}
                        className="w-full py-4 bg-[#111110] dark:bg-[#FDFCF8] text-[#FDFCF8] dark:text-[#111110] rounded-2xl font-mono text-xs uppercase tracking-[0.2em] shadow-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmittingFeedback ? 'SENDING...' : (
                          <>Submit Feedback <Send className="w-4 h-4" /></>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 opacity-60">
                    <Clock className="w-5 h-5" />
                    <p className="text-sm font-mono tracking-widest uppercase">Awaiting Student Rating...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
