import { USE_MOCK, apiClient } from './api/apiClient';
import { mockStore } from './mock/mockStore';

export const bookingService = {
  async getMyBookings(customerId = 'cust-current') {
    if (USE_MOCK) {
      return mockStore.getBookings(customerId);
    }
    return apiClient('/me/bookings');
  },

  async getBookingById(id) {
    if (USE_MOCK) {
      const b = mockStore.getBookingById(id);
      if (!b) throw new Error('Booking not found');
      return b;
    }
    return apiClient(`/me/bookings/${id}`);
  },

  async createBooking(bookingData) {
    if (USE_MOCK) {
      return mockStore.createBooking(bookingData);
    }
    return apiClient('/bookings', { method: 'POST', data: bookingData });
  },

  async cancelBooking(id, reason) {
    if (USE_MOCK) {
      return mockStore.cancelBooking(id, reason);
    }
    return apiClient(`/me/bookings/${id}/cancel`, { method: 'POST', data: { reason } });
  },

  async getCustomerCycles(customerId = 'cust-current') {
    if (USE_MOCK) {
      return mockStore.getCustomerCycles(customerId);
    }
    return apiClient('/me/cycles');
  },

  async addCustomerCycle(cycleData) {
    if (USE_MOCK) {
      return mockStore.addCustomerCycle(cycleData);
    }
    return apiClient('/me/cycles', { method: 'POST', data: cycleData });
  },

  async deleteCustomerCycle(id) {
    if (USE_MOCK) {
      return mockStore.deleteCustomerCycle(id);
    }
    return apiClient(`/me/cycles/${id}`, { method: 'DELETE' });
  }
};
