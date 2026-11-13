import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Bell, Check, ArrowRight } from 'lucide-react';

export const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    const list = await adminService.getNotifications();
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    await adminService.markNotificationAsRead(id);
    await loadNotifications();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">
          Admin & Workshop Notifications
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          New booking appointments, customer purchase enquiries, and low inventory warnings
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              n.isRead ? 'bg-white border-stone-200 text-stone-600' : 'bg-amber-50/60 border-amber-300 text-stone-900 shadow-2xs'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {!n.isRead && <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />}
                <h3 className="text-sm font-bold">{n.title}</h3>
                <span className="text-[10px] text-stone-400 font-mono">{n.date}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">{n.message}</p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {n.link && (
                <Link
                  to={n.link}
                  onClick={() => handleMarkRead(n.id)}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white text-xs font-bold transition-colors inline-flex items-center gap-1"
                >
                  <span>Open Page</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
              {!n.isRead && (
                <button
                  type="button"
                  onClick={() => handleMarkRead(n.id)}
                  className="text-xs text-stone-500 hover:text-stone-800 font-medium px-2 py-1"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
