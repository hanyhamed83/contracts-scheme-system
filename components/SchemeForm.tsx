
import React, { useState, useEffect } from 'react';
import { Scheme } from '../types';

interface SchemeFormProps {
  initialData?: Scheme;
  onAdd: (scheme: Partial<Scheme>) => void;
  onClose: () => void;
}

const SchemeForm: React.FC<SchemeFormProps> = ({ initialData, onAdd, onClose }) => {
  const [formData, setFormData] = useState<Partial<Scheme>>({
    Job_no: '',
    APPNUMBER: '',
    Contractor_Name: '',
    Title1: '',
    STATUS: 'Pending',
    totalCost: '0.000',
    TYPE: '',
    AREA: '',
    contractorRemarks: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">{initialData ? 'Update Record' : 'New Contract Entry'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Job Number *</label>
            <input
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.Job_no}
              onChange={(e) => setFormData({ ...formData, Job_no: e.target.value })}
              placeholder="e.g. JOB-2024-001"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">App Number</label>
            <input
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.APPNUMBER}
              onChange={(e) => setFormData({ ...formData, APPNUMBER: e.target.value })}
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contractor Name</label>
            <input
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.Contractor_Name}
              onChange={(e) => setFormData({ ...formData, Contractor_Name: e.target.value })}
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Scheme Title / Description</label>
            <input
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.Title1}
              onChange={(e) => setFormData({ ...formData, Title1: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Type / Category</label>
            <input
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.TYPE}
              onChange={(e) => setFormData({ ...formData, TYPE: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Total Cost (BD)</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.totalCost}
              onChange={(e) => setFormData({ ...formData, totalCost: e.target.value })}
              placeholder="0.000"
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contractor Remarks</label>
            <textarea
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
              value={formData.contractorRemarks}
              onChange={(e) => setFormData({ ...formData, contractorRemarks: e.target.value })}
            />
          </div>
          <div className="md:col-span-2 flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all">Discard</button>
            <button type="submit" className="flex-2 py-4 font-bold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 px-10">
              {initialData ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchemeForm;
