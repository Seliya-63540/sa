import { USE_MOCK, apiClient } from './api/apiClient';
import { mockStore } from './mock/mockStore';

export const cycleService = {
  async getAllCycles() {
    if (USE_MOCK) {
      return mockStore.getCycles();
    }
    return apiClient('/cycles');
  },

  async getCycleById(id) {
    if (USE_MOCK) {
      const cycle = mockStore.getCycleById(id);
      if (!cycle) throw new Error('Cycle not found');
      return cycle;
    }
    return apiClient(`/cycles/${id}`);
  },

  async getServices() {
    if (USE_MOCK) {
      return mockStore.getServices();
    }
    return apiClient('/services');
  }
};
