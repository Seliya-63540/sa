import { USE_MOCK, apiClient } from './api/apiClient';
import { mockStore } from './mock/mockStore';

export const adminService = {
  async getDashboardStats() {
    if (USE_MOCK) {
      const bookings = mockStore.getBookings();
      const cycles = mockStore.getCycles();
      const enquiries = mockStore.getEnquiries();
      const sales = mockStore.getSales();
      const inventory = mockStore.getInventory();

      const todayStr = new Date().toISOString().split('T')[0];
      const todayBookings = bookings.filter((b) => b.appointmentDate === todayStr);
      const pendingRequests = bookings.filter((b) => b.status === 'REQUESTED');
      const confirmedAppts = bookings.filter((b) => b.status === 'CONFIRMED');
      const ongoingRepairs = bookings.filter((b) => b.status === 'IN_PROGRESS' || b.status === 'CHECKED_IN');
      const completedRepairs = bookings.filter((b) => b.status === 'COMPLETED');
      const noShowBookings = bookings.filter((b) => b.status === 'NO_SHOW');
      const availableCycles = cycles.filter((c) => c.stock > 0 && c.isPublished);
      const newEnquiries = enquiries.filter((e) => e.status === 'NEW');
      const todaySales = sales.filter((s) => s.saleDate === todayStr);
      const todaySalesAmount = todaySales.reduce((sum, s) => sum + s.amountReceived, 0);
      const outstandingPayments = bookings.reduce((sum, b) => sum + (b.remainingAmount || 0), 0) +
        sales.reduce((sum, s) => sum + (s.remainingBalance || 0), 0);

      return {
        todayBookingsCount: todayBookings.length,
        pendingRequestsCount: pendingRequests.length,
        confirmedAppointmentsCount: confirmedAppts.length,
        ongoingRepairsCount: ongoingRepairs.length,
        completedRepairsCount: completedRepairs.length,
        noShowCount: noShowBookings.length,
        availableCyclesCount: availableCycles.length,
        newEnquiriesCount: newEnquiries.length,
        todaySalesAmount,
        outstandingPayments,
        todayBookings,
        pendingRequests: pendingRequests.slice(0, 5)
      };
    }
    return apiClient('/admin/dashboard');
  },

  async getAllBookings() {
    if (USE_MOCK) {
      return mockStore.getBookings();
    }
    return apiClient('/admin/bookings');
  },

  async updateBookingStatus(id, newStatus, internalNotes, finalCost) {
    if (USE_MOCK) {
      return mockStore.updateBookingStatus(id, newStatus, internalNotes, finalCost);
    }
    return apiClient(`/admin/bookings/${id}/status`, {
      method: 'PATCH',
      data: { status: newStatus, internalNotes, finalCost }
    });
  },

  async getAllCycles() {
    if (USE_MOCK) {
      return mockStore.getCycles();
    }
    return apiClient('/admin/cycles');
  },

  async addCycle(cycleData) {
    if (USE_MOCK) {
      return mockStore.addCycle(cycleData);
    }
    return apiClient('/admin/cycles', { method: 'POST', data: cycleData });
  },

  async updateCycle(id, updates) {
    if (USE_MOCK) {
      return mockStore.updateCycle(id, updates);
    }
    return apiClient(`/admin/cycles/${id}`, { method: 'PATCH', data: updates });
  },

  async archiveCycle(id) {
    if (USE_MOCK) {
      return mockStore.archiveCycle(id);
    }
    return apiClient(`/admin/cycles/${id}/archive`, { method: 'POST' });
  },

  async getEnquiries() {
    if (USE_MOCK) {
      return mockStore.getEnquiries();
    }
    return apiClient('/admin/enquiries');
  },

  async updateEnquiryStatus(id, status, notes) {
    if (USE_MOCK) {
      return mockStore.updateEnquiryStatus(id, status, notes);
    }
    return apiClient(`/admin/enquiries/${id}`, { method: 'PATCH', data: { status, notes } });
  },

  async getSales() {
    if (USE_MOCK) {
      return mockStore.getSales();
    }
    return apiClient('/admin/sales');
  },

  async recordSale(saleData) {
    if (USE_MOCK) {
      return mockStore.recordSale(saleData);
    }
    return apiClient('/admin/sales', { method: 'POST', data: saleData });
  },

  async getPayments() {
    if (USE_MOCK) {
      return mockStore.getPayments();
    }
    return apiClient('/admin/payments');
  },

  async recordPayment(paymentData) {
    if (USE_MOCK) {
      return mockStore.recordPayment(paymentData);
    }
    return apiClient('/admin/payments', { method: 'POST', data: paymentData });
  },

  async getInventory() {
    if (USE_MOCK) {
      return mockStore.getInventory();
    }
    return apiClient('/admin/inventory');
  },

  async adjustInventory(id, changeQuantity, reason) {
    if (USE_MOCK) {
      return mockStore.adjustInventory(id, changeQuantity, reason);
    }
    return apiClient(`/admin/inventory/${id}/adjust`, {
      method: 'POST',
      data: { changeQuantity, reason }
    });
  },

  async addInventoryItem(item) {
    if (USE_MOCK) {
      return mockStore.addInventoryItem(item);
    }
    return apiClient('/admin/inventory', { method: 'POST', data: item });
  },

  async getNotifications() {
    if (USE_MOCK) {
      return mockStore.getAdminNotifications();
    }
    return apiClient('/admin/notifications');
  },

  async markNotificationAsRead(id) {
    if (USE_MOCK) {
      return mockStore.markAdminNotificationAsRead(id);
    }
    return apiClient(`/admin/notifications/${id}/read`, { method: 'POST' });
  },

  async getAuditLogs() {
    if (USE_MOCK) {
      return mockStore.getAuditLogs();
    }
    return apiClient('/admin/audit-logs');
  },

  async getSessions() {
    if (USE_MOCK) {
      return mockStore.getSessions();
    }
    return apiClient('/admin/sessions');
  },

  async revokeSession(id) {
    if (USE_MOCK) {
      return mockStore.revokeSession(id);
    }
    return apiClient(`/admin/sessions/${id}/revoke`, { method: 'POST' });
  }
};
