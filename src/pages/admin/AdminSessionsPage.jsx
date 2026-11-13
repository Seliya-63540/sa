import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Activity, ShieldCheck, Smartphone, Monitor, XCircle } from 'lucide-react';

export const AdminSessionsPage = () => {
  const [sessions, setSessions] = useState([]);

  const loadSessions = async () => {
    const list = await adminService.getSessions();
    setSessions(list);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleRevoke = async (id) => {
    await adminService.revokeSession(id);
    await loadSessions();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">
          Active Login Sessions
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Monitor authenticated devices and active browser sessions (Section 35)
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Account / User</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Device & Platform</th>
                <th className="px-4 py-3.5">IP Location</th>
                <th className="px-4 py-3.5">Last Activity</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-stone-900">
                    {s.accountName}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.role === 'ADMIN' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {s.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-stone-600">
                    {s.device}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-stone-500">
                    {s.ip}
                  </td>
                  <td className="px-4 py-3.5 text-stone-500">
                    {s.lastActivity}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      s.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-500'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {s.status === 'Active' && (
                      <button
                        type="button"
                        onClick={() => handleRevoke(s.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
