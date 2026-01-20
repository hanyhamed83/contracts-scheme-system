
import React, { useState } from 'react';
import { Scheme, SchemeStatus } from '../types';

interface SchemeListProps {
  schemes: Scheme[];
  onAnalyze: (id: string) => void;
  onUpdateStatus: (id: string, status: SchemeStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (scheme: Scheme) => void;
}

const SchemeList: React.FC<SchemeListProps> = ({ schemes, onAnalyze, onUpdateStatus, onDelete, onEdit }) => {
  const [filter, setFilter] = useState<string>('');
  
  const filteredSchemes = schemes.filter(s => 
    s.title.toLowerCase().includes(filter.toLowerCase()) || 
    s.category.toLowerCase().includes(filter.toLowerCase())
  );

  const getStatusBadge = (status: SchemeStatus) => {
    switch (status) {
      case SchemeStatus.APPROVED: 
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-tight">Approved</span>;
      case SchemeStatus.PENDING: 
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 uppercase tracking-tight">Pending</span>;
      case SchemeStatus.REJECTED: 
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 uppercase tracking-tight">Rejected</span>;
      case SchemeStatus.IN_PROGRESS: 
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-tight">Active</span>;
      default: 
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 uppercase tracking-tight">Draft</span>;
    }
  };

  const getPriorityTag = (priority: string) => {
    switch (priority) {
      case 'Critical': return <span className="text-rose-600 font-bold">• Critical</span>;
      case 'High': return <span className="text-orange-600 font-semibold">• High</span>;
      case 'Medium': return <span className="text-indigo-600 font-medium">• Medium</span>;
      default: return <span className="text-slate-400">• Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between animate-slideInLeft">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search schemes or categories..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all shadow-sm hover:border-slate-300"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-slideUp">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Scheme Details</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchemes.map((scheme, index) => (
                <React.Fragment key={scheme.id}>
                  <tr 
                    className="hover:bg-slate-50/50 transition-all duration-300 group opacity-0 animate-slideInLeft"
                    style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
                  >
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{scheme.title}</span>
                        <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">{scheme.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-semibold text-slate-600 px-2 py-1 bg-slate-100 group-hover:bg-white rounded-md transition-colors border border-transparent group-hover:border-slate-200">
                        {scheme.category}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-xs">
                        {getPriorityTag(scheme.priority)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-mono font-semibold text-slate-700">
                        ${scheme.budget?.toLocaleString() || '0'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {getStatusBadge(scheme.status)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(scheme)}
                          title="Edit Scheme"
                          className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-900 hover:text-white transition-all duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => onAnalyze(scheme.id)}
                          disabled={scheme.isAnalyzing}
                          title="Run AI Analysis"
                          className={`p-2 rounded-xl transition-all duration-300 ${
                            scheme.isAnalyzing 
                            ? 'bg-indigo-50 text-indigo-300' 
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-110'
                          }`}
                        >
                          {scheme.isAnalyzing ? (
                            <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          )}
                        </button>
                        
                        <div className="relative group/dropdown">
                          <button className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                          <div className="absolute right-0 top-full mt-1 hidden group-hover/dropdown:block bg-white border border-slate-200 rounded-xl shadow-xl p-2 min-w-[160px] z-20 animate-slideDown">
                            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Update Status</div>
                            {Object.values(SchemeStatus).map(st => (
                              <button
                                key={st}
                                onClick={() => onUpdateStatus(scheme.id, st)}
                                className="w-full text-left px-3 py-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-xs font-medium text-slate-600 transition-colors"
                              >
                                {st}
                              </button>
                            ))}
                            <div className="border-t border-slate-50 mt-1 pt-1">
                              <button
                                onClick={() => onDelete(scheme.id)}
                                className="w-full text-left px-3 py-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-xs font-bold text-slate-600 transition-colors"
                              >
                                Delete Scheme
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {scheme.aiInsight && (
                    <tr className="bg-indigo-50/20">
                      <td colSpan={6} className="px-6 py-3 border-b border-slate-100">
                        <div className="flex items-start gap-3 animate-slideDown">
                          <div className="mt-0.5 animate-bounce">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-0.5">AI Insights & Assessment</span>
                            <p className="text-xs text-indigo-900 font-medium italic">"{scheme.aiInsight}"</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredSchemes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center opacity-40 animate-fadeIn">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-slate-500 font-medium">No schemes found matching your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SchemeList;
