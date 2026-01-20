
import React, { useState } from 'react';
import { Scheme } from '../types';

interface SchemeListProps {
  schemes: Scheme[];
  onAnalyze: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onEdit: (scheme: Scheme) => void;
}

const SchemeList: React.FC<SchemeListProps> = ({ schemes, onAnalyze, onUpdateStatus, onDelete, onEdit }) => {
  const [filter, setFilter] = useState<string>('');
  
  const filteredSchemes = schemes.filter(s => {
    const jobNo = (s.Job_no || '').toLowerCase();
    const contractor = (s.Contractor_Name || '').toLowerCase();
    const title = (s.Title1 || '').toLowerCase();
    const search = filter.toLowerCase();
    
    return jobNo.includes(search) || contractor.includes(search) || title.includes(search);
  });

  const getStatusBadge = (status: string) => {
    const s = (status || 'N/A').toUpperCase();
    if (s.includes('APPROV') || s.includes('COMPLET')) 
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-tight">{status}</span>;
    if (s.includes('PENDING')) 
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-tight">{status}</span>;
    if (s.includes('REJECT')) 
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 uppercase tracking-tight">{status}</span>;
    return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-tight">{status || 'N/A'}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="relative w-full md:w-96">
        <input
          type="text"
          placeholder="Search Job No, Contractor, or Title..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all shadow-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Job / App No.</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contractor</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type / Area</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Cost</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchemes.map((scheme) => (
                <React.Fragment key={scheme.id}>
                  <tr className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{scheme.Job_no || 'N/A'}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{scheme.APPNUMBER || 'No App No'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-700">{scheme.Contractor_Name || 'Unassigned'}</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{scheme.Title1 || 'Untitled'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-600">{scheme.TYPE || 'General'}</span>
                        <span className="text-[10px] text-slate-400">{scheme.AREA || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-bold text-indigo-600">
                        BD {scheme.totalCost || '0.000'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(scheme.STATUS)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => onEdit(scheme)} className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => onAnalyze(scheme.Job_no)}
                          disabled={scheme.isAnalyzing || !scheme.Job_no}
                          className={`p-2 rounded-xl transition-all ${scheme.isAnalyzing ? 'animate-pulse bg-indigo-50 text-indigo-300' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </button>
                        <button onClick={() => onDelete(scheme.Job_no)} className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all" disabled={!scheme.Job_no}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {scheme.REMARKS && scheme.REMARKS.includes('[AI Analysis]') && (
                    <tr className="bg-indigo-50/10">
                      <td colSpan={6} className="px-6 py-3 border-b border-slate-100">
                        <div className="flex gap-2">
                          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest whitespace-nowrap">AI Intel:</span>
                          <p className="text-xs text-indigo-900 font-medium italic">"{scheme.REMARKS.replace('[AI Analysis]: ', '')}"</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SchemeList;
