import { USE_MOCK, apiClient } from './api/apiClient';
import { mockStore } from './mock/mockStore';

export const enquiryService = {
  async getMyEnquiries(customerId = 'cust-current') {
    if (USE_MOCK) {
      return mockStore.getEnquiries(customerId);
    }
    return apiClient('/me/enquiries');
  },

  async createEnquiry(enquiryData) {
    if (USE_MOCK) {
      return mockStore.createEnquiry(enquiryData);
    }
    return apiClient('/enquiries', { method: 'POST', data: enquiryData });
  }
};
