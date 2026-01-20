
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SchemeList from './components/SchemeList';
import SchemeForm from './components/SchemeForm';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Scheme, SchemeStatus } from './types';
import { analyzeScheme, generateGlobalReport } from './services/geminiService';
import { supabase } from './lib/supabase';

const MainApp: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schemes' | 'reports'>('dashboard');
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  const [globalReport, setGlobalReport] = useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchSchemes = useCallback(async () => {
    if (!user) return;
    setIsFetching(true);
    const { data, error } = await supabase
      .from('schemes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching schemes:', error);
    } else if (data) {
      const mapped = data.map((item: any) => ({
        ...item,
        createdBy: item.created_by,
        createdAt: item.created_at,
        aiInsight: item.ai_insight
      }));
      setSchemes(mapped);
    }
    setIsFetching(false);
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSchemes();

      // Real-time subscription
      const channel = supabase
        .channel('schema_db_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'schemes' },
          (payload) => {
            console.log('Real-time update received:', payload);
            fetchSchemes(); // Re-fetch all to ensure order and relations are correct
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated, fetchSchemes]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Initializing System...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const handleAddOrUpdateScheme = async (schemeData: Omit<Scheme, 'id' | 'createdAt'>) => {
    if (!user) return;
    
    if (editingScheme) {
      const { error } = await supabase
        .from('schemes')
        .update({
          title: schemeData.title,
          description: schemeData.description,
          status: schemeData.status,
          priority: schemeData.priority,
          category: schemeData.category,
          budget: schemeData.budget
        })
        .eq('id', editingScheme.id);

      if (error) {
        console.error('Error updating scheme:', error);
        alert('Failed to update scheme.');
      }
    } else {
      const { error } = await supabase
        .from('schemes')
        .insert([
          {
            title: schemeData.title,
            description: schemeData.description,
            status: schemeData.status,
            priority: schemeData.priority,
            category: schemeData.category,
            budget: schemeData.budget,
            created_by: user.id
          }
        ]);

      if (error) {
        console.error('Error adding scheme:', error);
        alert('Failed to save scheme.');
      }
    }
    
    setEditingScheme(null);
    setIsFormOpen(false);
  };

  const handleUpdateStatus = async (id: string, status: SchemeStatus) => {
    const { error } = await supabase
      .from('schemes')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteScheme = async (id: string) => {
    if (!confirm('Are you sure you want to remove this scheme?')) return;
    
    const { error } = await supabase
      .from('schemes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting scheme:', error);
    }
  };

  const handleEditTrigger = (scheme: Scheme) => {
    setEditingScheme(scheme);
    setIsFormOpen(true);
  };

  const handleAnalyzeScheme = async (id: string) => {
    const targetScheme = schemes.find(s => s.id === id);
    if (!targetScheme) return;

    setSchemes(prev => prev.map(s => s.id === id ? { ...s, isAnalyzing: true } : s));

    try {
      const result = await analyzeScheme(targetScheme);
      
      const { error } = await supabase
        .from('schemes')
        .update({ 
          ai_insight: result.summary,
          priority: result.suggestedPriority 
        })
        .eq('id', id);

      if (error) throw error;
      // Real-time will trigger the fetch
    } catch (error) {
      console.error("AI Analysis failed", error);
      setSchemes(prev => prev.map(s => s.id === id ? { ...s, isAnalyzing: false } : s));
    }
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const report = await generateGlobalReport(schemes);
      setGlobalReport(report);
    } catch (error) {
      console.error("Report generation failed", error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard schemes={schemes} />}
      
      {activeTab === 'schemes' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <div className="animate-slideInLeft">
              <h2 className="text-2xl font-bold text-slate-800">Operational Pipeline</h2>
              <p className="text-slate-500 text-sm">Monitor and manage all active job schemes.</p>
            </div>
            <div className="flex gap-4">
              {isFetching && (
                <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full animate-pulse">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                  Database Syncing
                </div>
              )}
              <button
                onClick={() => {
                  setEditingScheme(null);
                  setIsFormOpen(true);
                }}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-indigo-200 flex items-center gap-2 animate-scaleIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Scheme
              </button>
            </div>
          </div>
          <SchemeList 
            schemes={schemes} 
            onAnalyze={handleAnalyzeScheme}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteScheme}
            onEdit={handleEditTrigger}
          />
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
           <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4 animate-slideUp">Strategic AI Intelligence</h2>
                <p className="text-slate-400 max-w-lg mb-8 animate-slideUp" style={{ animationDelay: '100ms' }}>
                  Leverage Gemini 3 to synthesize all current schemes into a cohesive organizational report. 
                  Identify risks before they manifest and optimize resource allocation.
                </p>
                <button
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 hover:scale-[1.05] active:scale-[0.95] transition-all duration-300 flex items-center gap-3 disabled:opacity-50 animate-slideUp"
                  style={{ animationDelay: '200ms' }}
                >
                  {isGeneratingReport ? (
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                       <span>Processing Intelligence...</span>
                    </div>
                  ) : 'Generate Executive Summary'}
                  {!isGeneratingReport && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 group-hover:animate-bounce" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.243 14.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM6.464 14.95a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 011.414-1.414l.707.707z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                 <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#6366F1" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.2C87.4,-33.3,90,-16.6,89.1,-0.5C88.2,15.6,83.7,31.2,75.4,44.2C67,57.2,54.7,67.6,40.7,74.5C26.6,81.4,10.8,84.9,-4.1,91.9C-19,99,-32.9,109.6,-45.5,106.4C-58.1,103.2,-69.4,86.2,-78.4,70.5C-87.3,54.8,-93.8,40.5,-95.1,25.8C-96.5,11.1,-92.6,-4,-88.4,-18.2C-84.2,-32.4,-79.6,-45.7,-70.5,-55.9C-61.4,-66.1,-47.8,-73.2,-34.5,-79.5C-21.2,-85.8,-8.1,-91.3,4.2,-98.6C16.5,-105.9,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                 </svg>
              </div>
           </div>

           {globalReport && (
             <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 prose prose-slate max-w-none animate-scaleIn">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Pipeline Synthesis</h3>
                <div className="whitespace-pre-wrap text-slate-600 leading-relaxed font-medium">
                  {globalReport}
                </div>
             </div>
           )}
        </div>
      )}

      {isFormOpen && (
        <SchemeForm 
          initialData={editingScheme || undefined}
          onAdd={handleAddOrUpdateScheme}
          onClose={() => {
            setIsFormOpen(false);
            setEditingScheme(null);
          }}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideUp { animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideDown { animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideInLeft { animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scaleIn { animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .shimmer {
          background: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;
