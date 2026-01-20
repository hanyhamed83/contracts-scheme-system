
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Scheme, SchemeStatus } from '../types';

interface DashboardProps {
  schemes: Scheme[];
}

const Dashboard: React.FC<DashboardProps> = ({ schemes }) => {
  const statusData = Object.values(SchemeStatus).map(status => ({
    name: status,
    count: schemes.filter(s => s.status === status).length
  }));

  const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

  const stats = [
    { label: 'Total Schemes', value: schemes.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Pending Approval', value: schemes.filter(s => s.status === SchemeStatus.PENDING).length, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Approved', value: schemes.filter(s => s.status === SchemeStatus.APPROVED).length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'High Priority', value: schemes.filter(s => s.priority === 'High' || s.priority === 'Critical').length, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group opacity-0 animate-slideUp"
            style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'forwards' }}
          >
            <span className="text-slate-500 text-sm font-medium group-hover:text-indigo-600 transition-colors">{stat.label}</span>
            <div className="flex items-center gap-4">
              <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
              <div className={`px-2 py-1 ${stat.bg} ${stat.color} text-[10px] font-bold rounded uppercase tracking-wider group-hover:scale-110 transition-transform`}>
                Updated
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div 
          className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 opacity-0 animate-scaleIn"
          style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
        >
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            Workflow Distribution
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={1500} animationBegin={800}>
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div 
          className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 opacity-0 animate-scaleIn"
          style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
        >
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            Priority Breakdown
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
          </h3>
          <div className="h-64 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  animationDuration={1500}
                  animationBegin={1000}
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
