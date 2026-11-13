import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { mockStore } from '../../services/mock/mockStore';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  Bell, 
  CheckCheck, 
  Calendar, 
  ArrowRight, 
  Info 
} from 'lucide-react';

export const CustomerNotificationsPage = () => {
  const { currentUser } = useAuth();
  const { language } = useLanguage();

  const [notifications, setNotifications] = useState([]);

  const loadNotifications = () => {
    const list = mockStore.getCustomerNotifications(currentUser?.id || 'cust-current');
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
  }, [currentUser]);

  const handleMarkAsRead = (id) => {
    mockStore.markCustomerNotificationAsRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = () => {
    mockStore.markAllCustomerNotificationsAsRead();
    loadNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            {language === 'gu' ? 'સૂચનાઓ' : 'Notifications'}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {language === 'gu'
              ? 'બુકિંગ અપડેટ્સ અને વર્કશોપ મેસેજીસ'
              : 'Real-time booking and repair status alerts'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-emerald-700" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const displayTitle = language === 'gu' && notif.title_gu ? notif.title_gu : notif.title;
            const displayMsg = language === 'gu' && notif.message_gu ? notif.message_gu : notif.message;

            return (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  notif.isRead
                    ? 'bg-white border-stone-200 text-stone-600'
                    : 'bg-emerald-50/50 border-emerald-300 text-stone-900 shadow-2xs'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    )}
                    <h3 className="text-sm font-bold">{displayTitle}</h3>
                    <span className="text-[10px] text-stone-400 font-mono ml-auto sm:ml-0">
                      {notif.date}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {displayMsg}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {notif.link && (
                    <Link
                      to={notif.link}
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white text-xs font-bold transition-colors inline-flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                  {!notif.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="text-[11px] text-stone-500 hover:text-stone-800 font-medium px-2 py-1"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No Notifications"
          description="You are completely caught up! We will notify you whenever your cycle service status updates."
        />
      )}
    </div>
  );
};
