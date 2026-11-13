import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Bike,
  PlusCircle,
  MessageSquare,
  ShoppingBag,
  Calendar,
  Wrench,
  Boxes,
  Users,
  Activity,
  CreditCard,
  BarChart3,
  Bell,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const { language } = useLanguage();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true }
      ]
    },
    {
      title: 'CYCLE SHOP',
      items: [
        { to: '/admin/cycles', label: 'All Cycles', icon: Bike, exact: true },
        { to: '/admin/cycles/add', label: 'Add New Cycle', icon: PlusCircle },
        { to: '/admin/enquiries', label: 'Purchase Enquiries', icon: MessageSquare },
        { to: '/admin/sales', label: 'Sales Management', icon: ShoppingBag }
      ]
    },
    {
      title: 'WORKSHOP',
      items: [
        { to: '/admin/bookings', label: 'Service Bookings', icon: Calendar },
        { to: '/admin/repairs', label: 'Repair Management', icon: Wrench },
        { to: '/admin/inventory', label: 'Inventory (Parts)', icon: Boxes }
      ]
    },
    {
      title: 'CUSTOMERS',
      items: [
        { to: '/admin/customers', label: 'Customers', icon: Users },
        { to: '/admin/sessions', label: 'Active Sessions', icon: Activity }
      ]
    },
    {
      title: 'FINANCE',
      items: [
        { to: '/admin/payments', label: 'Payments', icon: CreditCard },
        { to: '/admin/reports', label: 'Business Reports', icon: BarChart3 }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { to: '/admin/notifications', label: 'Notifications', icon: Bell },
        { to: '/admin/audit-logs', label: 'Audit History', icon: History },
        { to: '/admin/settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-stone-900 text-stone-300">
      {/* Brand & Badge */}
      <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
        <Logo size="md" invert={true} to="/admin" showTagline={false} />
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Admin
          </span>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            aria-label="Close Admin Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Nav Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="px-3 text-[10px] font-extrabold tracking-wider text-stone-500 uppercase mb-1.5">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-700 text-white font-bold shadow-xs'
                        : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-stone-800 space-y-2">
        {/* Switch back to Customer Portal link */}
        <Link
          to="/"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Customer Store</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
        </Link>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Admin</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 shadow-lg z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs h-full bg-stone-900 shadow-2xl z-10 flex flex-col">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-stone-200 px-4 sm:px-6 py-3 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <span className="hidden sm:inline-block text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                SAFAR CYCLE Management
              </span>
              <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight leading-tight">
                Workshop Operations
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher compact={true} className="sm:hidden" />
            <LanguageSwitcher compact={false} className="hidden sm:inline-flex" />

            <Link
              to="/admin/notifications"
              className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 relative"
              title="Admin Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-black text-xs">
                A
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-stone-900 leading-tight">
                  {currentUser?.name || 'Admin'}
                </p>
                <p className="text-[10px] text-stone-500 font-mono">Owner Portal</p>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
