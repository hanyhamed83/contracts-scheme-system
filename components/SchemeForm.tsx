
import React, { useState, useEffect } from 'react';
import { Scheme, SchemeStatus, SchemePriority, SchemeCategory } from '../types';

interface SchemeFormProps {
  initialData?: Scheme;
  onAdd: (scheme: Omit<Scheme, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

const SchemeForm: React.FC<SchemeFormProps> = ({ initialData, onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: SchemeCategory.OPERATIONAL,
    priority: SchemePriority.MEDIUM,
    status: SchemeStatus.DRAFT,
    budget: 0,
    createdBy: 'Current User'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        category: initialData.category,
        priority: initialData.priority,
        status: initialData.status,
        budget: initialData.budget || 0,
        createdBy: initialData.createdBy
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 md:p-10 animate-scaleIn border border-slate-100 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              {initialData ? 'Update Scheme' : 'New Scheme Entry'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {initialData ? 'Refine details for existing job scheme.' : 'Define a new operational pipeline project.'}
            </p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Scheme Title</label>
            <input
              required
              type="text"
              placeholder="e.g. Q4 Logistics Optimization"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all hover:bg-white"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
            <textarea
              required
              placeholder="Detail the objectives and expected outcomes..."
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all min-h-[140px] hover:bg-white"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
              <select
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none cursor-pointer"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as SchemeCategory })}
              >
                {Object.values(SchemeCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Priority</label>
              <select
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none cursor-pointer"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as SchemePriority })}
              >
                {Object.values(SchemePriority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Budget Allocation ($)</label>
            <input
              type="number"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all hover:bg-white"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
            />
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-slate-600 font-bold bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-[0.98]"
            >
              Discard
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 text-white font-bold bg-indigo-600 rounded-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-100"
            >
              {initialData ? 'Save Changes' : 'Create System Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchemeForm;
