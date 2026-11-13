import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { CycleCataloguePage } from '../pages/public/CycleCataloguePage';
import { CycleDetailPage } from '../pages/public/CycleDetailPage';
import { ServicesPage } from '../pages/public/ServicesPage';
import { AboutPage } from '../pages/public/AboutPage';
import { ContactPage } from '../pages/public/ContactPage';
import { PrivacyPolicyPage, TermsPage } from '../pages/public/LegalPages';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { AdminLoginPage } from '../pages/auth/AdminLoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

// Customer Protected Pages
import { CustomerDashboardPage } from '../pages/customer/CustomerDashboardPage';
import { MyBookingsPage } from '../pages/customer/MyBookingsPage';
import { BookingDetailPage } from '../pages/customer/BookingDetailPage';
import { BookServicePage } from '../pages/customer/BookServicePage';
import { MyCyclesPage } from '../pages/customer/MyCyclesPage';
import { MyEnquiriesPage } from '../pages/customer/MyEnquiriesPage';
import { MyPurchasesPage } from '../pages/customer/MyPurchasesPage';
import { CustomerNotificationsPage } from '../pages/customer/CustomerNotificationsPage';
import { CustomerProfilePage } from '../pages/customer/CustomerProfilePage';

// Admin Protected Pages
import { AdminDashboardOverview } from '../pages/admin/AdminDashboardOverview';
import { AdminCyclesPage } from '../pages/admin/AdminCyclesPage';
import { AdminAddCyclePage } from '../pages/admin/AdminAddCyclePage';
import { AdminEditCyclePage } from '../pages/admin/AdminEditCyclePage';
import { AdminEnquiriesPage } from '../pages/admin/AdminEnquiriesPage';
import { AdminBookingsPage } from '../pages/admin/AdminBookingsPage';
import { AdminBookingDetailPage } from '../pages/admin/AdminBookingDetailPage';
import { AdminRepairsPage } from '../pages/admin/AdminRepairsPage';
import { AdminSalesPage } from '../pages/admin/AdminSalesPage';
import { AdminNewSalePage } from '../pages/admin/AdminNewSalePage';
import { AdminPaymentsPage } from '../pages/admin/AdminPaymentsPage';
import { AdminInventoryPage } from '../pages/admin/AdminInventoryPage';
import { AdminCustomersPage, AdminCustomerDetailPage } from '../pages/admin/AdminCustomersPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';
import { AdminSessionsPage } from '../pages/admin/AdminSessionsPage';
import { AdminNotificationsPage } from '../pages/admin/AdminNotificationsPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';
import { AdminAuditLogsPage } from '../pages/admin/AdminAuditLogsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Public Routes with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cycles" element={<CycleCataloguePage />} />
        <Route path="/cycles/:id" element={<CycleDetailPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/book-service" element={<BookServicePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* 2. Admin Standalone Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* 3. Customer Protected Routes with CustomerLayout */}
      <Route
        element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/my-account" element={<CustomerDashboardPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/my-bookings/:id" element={<BookingDetailPage />} />
        <Route path="/my-cycles" element={<MyCyclesPage />} />
        <Route path="/my-enquiries" element={<MyEnquiriesPage />} />
        <Route path="/my-purchases" element={<MyPurchasesPage />} />
        <Route path="/notifications" element={<CustomerNotificationsPage />} />
        <Route path="/profile" element={<CustomerProfilePage />} />
      </Route>

      {/* 4. Admin Protected Routes with AdminLayout */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardOverview />} />
        <Route path="cycles" element={<AdminCyclesPage />} />
        <Route path="cycles/add" element={<AdminAddCyclePage />} />
        <Route path="cycles/:id/edit" element={<AdminEditCyclePage />} />
        <Route path="enquiries" element={<AdminEnquiriesPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="bookings/:id" element={<AdminBookingDetailPage />} />
        <Route path="repairs" element={<AdminRepairsPage />} />
        <Route path="sales" element={<AdminSalesPage />} />
        <Route path="sales/new" element={<AdminNewSalePage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="inventory" element={<AdminInventoryPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route path="customers/:id" element={<AdminCustomerDetailPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="sessions" element={<AdminSessionsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
      </Route>

      {/* Fallback to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
