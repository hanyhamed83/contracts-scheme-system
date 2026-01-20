
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'schemes' | 'reports';
  setActiveTab: (tab: 'dashboard' | 'schemes' | 'reports') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 animate-slideInLeft">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center animate-pulse">
              <span className="text-xs">SF</span>
            </div>
            SchemeFlow <span className="text-indigo-400">Pro</span>
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          {(['dashboard', 'schemes', 'reports'] as const).map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 animate-slideInLeft ${
                activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 scale-[1.02]' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:pl-6'
              }`}
              style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'forwards' }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 animate-fadeIn" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-3 px-2 group mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 transition-transform group-hover:scale-110">
              <span className="text-sm font-medium">{user?.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium group-hover:text-indigo-400 transition-colors truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all duration-300 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out System
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto bg-[#f8fafc]">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 animate-fadeIn">
          <h2 className="text-lg font-semibold text-slate-800 capitalize tracking-tight">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full group">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">System Live</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
