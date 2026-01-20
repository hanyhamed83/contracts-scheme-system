
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SchemeList from './components/SchemeList';
import SchemeForm from './components/SchemeForm';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Scheme } from './types';
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

  // Helper to get value regardless of key casing from DB response
  const getVal = (obj: any, key: string) => {
    if (!obj) return undefined;
    const lowerKey = key.toLowerCase();
    // Prioritize exact match, then case-insensitive match
    if (obj[key] !== undefined) return obj[key];
    if (obj[lowerKey] !== undefined) return obj[lowerKey];
    
    for (const k in obj) {
      if (k.toLowerCase() === lowerKey) return obj[k];
    }
    return undefined;
  };

  const fetchSchemes = useCallback(async () => {
    if (!user) return;
    setIsFetching(true);
    const { data, error } = await supabase
      .from('contracts_schemes')
      .select('*');
    
    if (error) {
      console.error('Error fetching schemes:', error);
    } else if (data) {
      const mapped = data.map((item: any) => {
        const Job_no = getVal(item, 'Job_no') || getVal(item, 'job_no') || '';
        return {
          contractorRemarks: getVal(item, 'contractorRemarks') || getVal(item, 'contractorremarks'),
          Rcvd_Date: getVal(item, 'Rcvd_Date') || getVal(item, 'rcvd_date'),
          Sch_Ref: getVal(item, 'Sch_Ref') || getVal(item, 'sch_ref'),
          Job_no: Job_no,
          APPNUMBER: getVal(item, 'APPNUMBER') || getVal(item, 'appnumber'),
          BLK: getVal(item, 'BLK') || getVal(item, 'blk'),
          SUPERVISOR: getVal(item, 'SUPERVISOR') || getVal(item, 'supervisor'),
          Contractor_Name: getVal(item, 'Contractor_Name') || getVal(item, 'contractor_name'),
          Title1: getVal(item, 'Title1') || getVal(item, 'title1'),
          STATUS: getVal(item, 'STATUS') || getVal(item, 'status') || 'N/A',
          DATE_OF_COMPLETED: getVal(item, 'DATE_OF_COMPLETED') || getVal(item, 'date_of_completed'),
          NUMBEROFSS: getVal(item, 'NUMBEROFSS') || getVal(item, 'numberofss'),
          APPSTATUS: getVal(item, 'APPSTATUS') || getVal(item, 'appstatus'),
          REMARKS: getVal(item, 'REMARKS') || getVal(item, 'remarks'),
          DATEOFMEASUREMENT: getVal(item, 'DATEOFMEASUREMENT') || getVal(item, 'dateofmeasurement'),
          CONTRACTORAPPRAISAL: getVal(item, 'CONTRACTORAPPRAISAL') || getVal(item, 'contractorappraisal'),
          AREA: getVal(item, 'AREA') || getVal(item, 'area'),
          TYPE: getVal(item, 'TYPE') || getVal(item, 'type'),
          labCost: getVal(item, 'labCost') || getVal(item, 'labcost'),
          matCost: getVal(item, 'matCost') || getVal(item, 'matcost'),
          PO_NUMBER: getVal(item, 'PO_NUMBER') || getVal(item, 'po_number'),
          UserID: getVal(item, 'UserID') || getVal(item, 'userid'),
          IO: getVal(item, 'IO') || getVal(item, 'io'),
          IUWR_NUMBER: getVal(item, 'IUWR_NUMBER') || getVal(item, 'iuwr_number'),
          totalCost: getVal(item, 'totalCost') || getVal(item, 'totalcost') || '0.000',
          id: Job_no || Math.random().toString(36).substr(2, 9),
          aiInsight: getVal(item, 'REMARKS') || getVal(item, 'remarks')
        };
      });
      setSchemes(mapped);
    }
    setIsFetching(false);
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSchemes();

      const channel = supabase
        .channel('contracts_db_changes_final')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'contracts_schemes' },
          () => fetchSchemes()
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
          <p className="text-slate-400 font-medium animate-pulse">Synchronizing Records...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const handleAddOrUpdateScheme = async (schemeData: Partial<Scheme>) => {
    if (!user) return;
    
    // CRITICAL FIX: PostgreSQL usually lowercases column names in Supabase.
    // We map the UI keys to lowercase database keys to satisfy the schema cache.
    const dbPayload: any = {
      contractorremarks: schemeData.contractorRemarks,
      rcvd_date: schemeData.Rcvd_Date,
      sch_ref: schemeData.Sch_Ref,
      job_no: schemeData.Job_no,
      appnumber: schemeData.APPNUMBER,
      blk: schemeData.BLK,
      supervisor: schemeData.SUPERVISOR,
      contractor_name: schemeData.Contractor_Name,
      title1: schemeData.Title1,
      status: schemeData.STATUS,
      date_of_completed: schemeData.DATE_OF_COMPLETED,
      numberofss: schemeData.NUMBEROFSS,
      appstatus: schemeData.APPSTATUS,
      remarks: schemeData.REMARKS,
      dateofmeasurement: schemeData.DATEOFMEASUREMENT,
      contractorappraisal: schemeData.CONTRACTORAPPRAISAL,
      area: schemeData.AREA,
      type: schemeData.TYPE,
      labcost: schemeData.labCost,
      matcost: schemeData.matCost,
      po_number: schemeData.PO_NUMBER,
      userid: user.id,
      io: schemeData.IO,
      iuwr_number: schemeData.IUWR_NUMBER,
      totalcost: schemeData.totalCost
    };

    try {
      if (editingScheme) {
        const { error } = await supabase
          .from('contracts_schemes')
          .update(dbPayload)
          .eq('job_no', editingScheme.Job_no);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('contracts_schemes')
          .insert([dbPayload]);

        if (error) throw error;
      }
      
      await fetchSchemes();
      setIsFormOpen(false);
      setEditingScheme(null);
    } catch (error: any) {
      console.error('Supabase Save Error:', error);
      alert('Save Failed: ' + (error.message || 'Check database schema compatibility.'));
    }
  };

  const handleUpdateStatus = async (jobNo: string, status: string) => {
    const { error } = await supabase
      .from('contracts_schemes')
      .update({ status: status })
      .eq('job_no', jobNo);

    if (error) console.error('Status Update Error:', error);
    else await fetchSchemes();
  };

  const handleDeleteScheme = async (jobNo: string) => {
    if (!confirm(`Delete scheme ${jobNo}? This action is irreversible.`)) return;
    
    const { error } = await supabase
      .from('contracts_schemes')
      .delete()
      .eq('job_no', jobNo);

    if (error) console.error('Delete Error:', error);
    else await fetchSchemes();
  };

  const handleEditTrigger = (scheme: Scheme) => {
    setEditingScheme(scheme);
    setIsFormOpen(true);
  };

  const handleAnalyzeScheme = async (jobNo: string) => {
    const targetScheme = schemes.find(s => s.Job_no === jobNo);
    if (!targetScheme) return;

    setSchemes(prev => prev.map(s => s.Job_no === jobNo ? { ...s, isAnalyzing: true } : s));

    try {
      const result = await analyzeScheme(targetScheme);
      
      const { error } = await supabase
        .from('contracts_schemes')
        .update({ 
          remarks: `[AI Analysis]: ${result.summary}`,
          appstatus: result.suggestedStatus
        })
        .eq('job_no', jobNo);
      
      if (error) throw error;
      await fetchSchemes();
    } catch (error) {
      console.error("AI Analysis failed", error);
      setSchemes(prev => prev.map(s => s.Job_no === jobNo ? { ...s, isAnalyzing: false } : s));
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
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Contract Pipeline</h2>
              <p className="text-slate-500 text-sm">Processing {schemes.length} industrial job records.</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => { setEditingScheme(null); setIsFormOpen(true); }}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all"
              >
                New Entry
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
                <h2 className="text-3xl font-bold mb-4">Strategic Synthesis</h2>
                <p className="text-slate-400 max-w-lg mb-8">
                  AI-driven audit of all contract remarks, job statuses, and resource allocations.
                </p>
                <button
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:scale-[1.05] transition-all disabled:opacity-50"
                >
                  {isGeneratingReport ? 'Compiling Intelligence...' : 'Generate Executive Report'}
                </button>
              </div>
           </div>

           {globalReport && (
             <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 animate-scaleIn">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Pipeline Audit</h3>
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
          onClose={() => { setIsFormOpen(false); setEditingScheme(null); }}
        />
      )}
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
