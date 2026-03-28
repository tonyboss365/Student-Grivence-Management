import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PongLoader } from '../components/ui/PongLoader';
import { Plus, Minus, Calendar, Clock, Check, ChevronRight } from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Personal Info' },
  { id: 2, name: 'Grievance Details' },
  { id: 3, name: 'Review & Submit' }
];

export default function SubmitGrievance() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    title: '',
    category: 'academic',
    departmentId: '1',
    priority: 3,
    notes: '',
    isAnonymous: false,
    agreed: false
  });

  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({
          ...prev,
          fullName: data.name || '',
          email: data.email || ''
        }));
      }
    } catch (error) {
      console.error('Failed to fetch user', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/departments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDepartments(data);
        if (data.length > 0) updateField('departmentId', data[0].id.toString());
      }
    } catch (error) {
      console.error('Failed to fetch departments', error);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.agreed) return;
    setIsSubmitting(true);
    
    // Ensure loader works for at least 2 seconds
    const minWait = new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          title: formData.title || formData.fullName + "'s Grievance",
          description: formData.notes,
          department_id: formData.departmentId,
          category: formData.category,
          contact_email: formData.email,
          contact_phone: formData.phone,
          is_anonymous: formData.isAnonymous,
          priority: formData.priority
        })
      });

      await minWait;

      if (res.ok) {
        navigate('/dashboard');
      } else {
        const errorData = await res.json();
        alert('Server Error: ' + (errorData.error || 'Failed to submit grievance. Please ensure MySQL is running properly and try again.'));
      }
    } catch (error) {
      console.error('Failed to submit grievance', error);
      alert('Network Error: Could not connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* PongLoader for submission */}
      <AnimatePresence>
        {isSubmitting && <PongLoader />}
      </AnimatePresence>

      {/* Step Indicator */}
      <div className="flex justify-end mb-12">
        <div className="flex items-center gap-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono transition-all duration-500 ${
                step >= s.id 
                  ? 'bg-[#111110] dark:bg-[#FDFCF8] text-[#FDFCF8] dark:text-[#111110]' 
                  : 'bg-[#EAE6D7] dark:bg-[#27272A] text-[#888880] dark:text-[#A1A1AA]'
              }`}>
                {s.id}
              </div>
              <div className="hidden sm:block">
                <p className={`text-[10px] uppercase tracking-widest font-mono ${
                  step >= s.id ? 'text-[#111110] dark:text-[#FDFCF8]' : 'text-[#888880] dark:text-[#A1A1AA]'
                }`}>
                  {s.name}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-8 h-[1px] bg-[#EAE6D7] dark:bg-[#333333] ml-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Form Fields */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888880] dark:text-[#A1A1AA]">Full Name</label>
                  <Input 
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="ENTER YOUR FULL NAME"
                    className="h-16 bg-[#F2EFE5] dark:bg-[#18181B] border-none font-mono text-sm tracking-wider"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888880] dark:text-[#A1A1AA]">Email Address</label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="EMAIL@INSTITUTION.EDU"
                    className="h-16 bg-[#F2EFE5] dark:bg-[#18181B] border-none font-mono text-sm tracking-wider"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888880] dark:text-[#A1A1AA]">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-[#888880]">+ 1</span>
                    <Input 
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="555-0123"
                      className="h-16 pl-12 bg-[#F2EFE5] dark:bg-[#18181B] border-none font-mono text-sm tracking-wider"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888880] dark:text-[#A1A1AA]">One Line Problem Name</label>
                  <Input 
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="SHORT TITLE FOR YOUR GRIEVANCE..."
                    className="h-16 bg-[#F2EFE5] dark:bg-[#18181B] border-none font-mono text-sm tracking-wider font-bold"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={nextStep} className="w-full h-14 font-mono uppercase tracking-widest">
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888880] dark:text-[#A1A1AA]">Department</label>
                  <select
                    className="w-full h-16 px-4 bg-[#F2EFE5] dark:bg-[#18181B] rounded-xl font-mono text-sm tracking-wider text-[#111110] dark:text-[#FDFCF8] outline-none appearance-none cursor-pointer"
                    value={formData.departmentId}
                    onChange={(e) => updateField('departmentId', e.target.value)}
                  >
                    <option value="" disabled>Select Department</option>
                    {departments.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888880] dark:text-[#A1A1AA]">Grievance Type</label>
                  <select
                    className="w-full h-16 px-4 bg-[#F2EFE5] dark:bg-[#18181B] rounded-xl font-mono text-sm tracking-wider text-[#111110] dark:text-[#FDFCF8] outline-none appearance-none cursor-pointer"
                    value={formData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                  >
                    <option value="academic">Academic</option>
                    <option value="administrative">Administrative</option>
                    <option value="facilities">Facilities</option>
                    <option value="harassment">Harassment</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888880] dark:text-[#A1A1AA]">Priority Level ({formData.priority} is highest priority)</label>
                  <div className="flex items-center gap-6 h-16 px-6 bg-[#F2EFE5] dark:bg-[#18181B] rounded-xl">
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      step="1"
                      value={formData.priority}
                      onChange={(e) => updateField('priority', parseInt(e.target.value))}
                      className="flex-1 accent-[#111110] dark:accent-[#FDFCF8] h-1 bg-[#D9D7CE] dark:bg-[#333333] rounded-full appearance-none cursor-pointer"
                    />
                    <span className="font-mono text-sm w-4">{formData.priority}</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="ghost" onClick={prevStep} className="flex-1 h-14 font-mono uppercase tracking-widest">
                    Previous
                  </Button>
                  <Button onClick={nextStep} className="flex-1 h-14 font-mono uppercase tracking-widest">
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888880] dark:text-[#A1A1AA]">Description of Problem</label>
                  <textarea
                    rows={6}
                    className="w-full p-4 bg-[#F2EFE5] dark:bg-[#18181B] rounded-xl font-mono text-sm tracking-wider text-[#111110] dark:text-[#FDFCF8] outline-none resize-none"
                    value={formData.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="PROVIDE ADDITIONAL DETAILS..."
                  />
                </div>

                <div className="p-6 bg-[#D9F99D] dark:bg-[#365314] rounded-xl border border-[#BEF264] dark:border-[#4D7C0F] transition-colors duration-500">
                  <p className="text-xs font-mono text-[#365314] dark:text-[#D9F99D] leading-relaxed">
                    Please ensure all details are correct before submitting. This grievance will be routed to the appropriate department for resolution.
                  </p>
                </div>

                <div className="flex items-center gap-4 py-4">
                  <button 
                    onClick={() => updateField('agreed', !formData.agreed)}
                    className={`w-6 h-6 rounded border transition-all duration-300 flex items-center justify-center ${
                      formData.agreed 
                        ? 'bg-[#111110] dark:bg-[#FDFCF8] border-[#111110] dark:border-[#FDFCF8]' 
                        : 'border-[#D9D7CE] dark:border-[#333333]'
                    }`}
                  >
                    {formData.agreed && <Check className="w-4 h-4 text-[#FDFCF8] dark:text-[#111110]" />}
                  </button>
                  <label className="text-xs font-mono text-[#6B6B66] dark:text-[#A1A1AA] cursor-pointer" onClick={() => updateField('agreed', !formData.agreed)}>
                    I AGREE TO THE TERMS & CONDITIONS
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="ghost" onClick={prevStep} className="flex-1 h-14 font-mono uppercase tracking-widest">
                    Previous
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!formData.agreed || isSubmitting}
                    className="flex-1 h-14 font-mono uppercase tracking-widest disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Request'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Live Summary / Preview */}
        <div className="hidden lg:block">
          <div className="sticky top-32 p-8 bg-[#F2EFE5] dark:bg-[#18181B] rounded-[32px] border border-[#E5E3D9] dark:border-[#333333] space-y-8 transition-colors duration-500">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-[#888880] dark:text-[#A1A1AA]">Application Summary</h3>
            
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-mono uppercase text-[#888880] dark:text-[#A1A1AA]">Full Name</p>
                <p className="font-mono text-sm truncate">{formData.fullName || '---'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono uppercase text-[#888880] dark:text-[#A1A1AA]">Email Address</p>
                <p className="font-mono text-sm truncate">{formData.email || '---'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono uppercase text-[#888880] dark:text-[#A1A1AA]">Phone Number</p>
                <p className="font-mono text-sm">{formData.phone ? `+1 ${formData.phone}` : '---'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono uppercase text-[#888880] dark:text-[#A1A1AA]">Grievance Title</p>
                <p className="font-mono text-sm font-bold truncate">{formData.title || '---'}</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono uppercase text-[#888880] dark:text-[#A1A1AA]">Priority</p>
                  <p className="font-mono text-sm">{formData.priority}</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-[#E5E3D9] dark:border-[#333333]">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-mono uppercase text-[#888880] dark:text-[#A1A1AA]">Submission Status</p>
                <p className="font-mono text-lg font-bold">READY</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
