import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { History, Search, ShieldCheck } from 'lucide-react';

export const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const data = await adminService.getAuditLogs();
      setLogs(data);
    }
    load();
  }, []);

  const filteredLogs = logs.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.action?.toLowerCase().includes(q) ||
      l.actor?.toLowerCase().includes(q) ||
      l.record?.toLowerCase().includes(q) ||
      l.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Audit Trails & Business Activity Log
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Immutable log of cycle updates, booking transitions, in-person sales, and inventory changes
          </p>
        </div>
      </div>

      <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, actor, or record ID..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Action Executed</th>
                <th className="px-4 py-3.5">Actor</th>
                <th className="px-4 py-3.5">Related Record</th>
                <th className="px-5 py-3.5">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-stone-500 text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-stone-900">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 border border-stone-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-stone-700">
                    {log.actor}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-emerald-800">
                    {log.record}
                  </td>
                  <td className="px-5 py-3.5 text-stone-600 leading-snug">
                    {log.description}
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
