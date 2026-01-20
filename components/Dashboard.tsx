
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Scheme } from '../types';

interface DashboardProps {
  schemes: Scheme[];
}

const Dashboard: React.FC<DashboardProps> = ({ schemes }) => {
  // Extract unique statuses
  const statusLabels = Array.from(new Set(schemes.map(s => s.STATUS || 'Undefined')));
  const statusData = statusLabels.map(label => ({
    name: label,
    count: schemes.filter(s => s.STATUS === label).length
  }));

  const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

  const totalValue = schemes.reduce((acc, curr) => {
    const cost = parseFloat((curr.totalCost || '0').toString().replace(/[^0-9.]/g, ''));
    return acc + (isNaN(cost) ? 0 : cost);
  }, 0);

  const stats = [
    { label: 'Active Contracts', value: schemes.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Portfolio Value', value: `BD ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 3 })}`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Apps', value: schemes.filter(s => (s.APPSTATUS || '').includes('Pending')).length, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Avg Job Cost', value: schemes.length ? `BD ${(totalValue / schemes.length).toFixed(3)}` : 'BD 0.000', color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100">
        <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-widest">Workflow Allocation</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
