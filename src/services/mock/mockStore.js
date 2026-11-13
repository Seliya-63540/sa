/**
 * SAFAR CYCLE - Stateful Mock Store
 * Simulates a realistic backend storage with full CRUD, reactive subscriptions,
 * and persistence in localStorage.
 */

import {
  INITIAL_CYCLES,
  INITIAL_SERVICES,
  INITIAL_BOOKINGS,
  INITIAL_ENQUIRIES,
  INITIAL_CUSTOMER_CYCLES,
  INITIAL_INVENTORY,
  INITIAL_SALES,
  INITIAL_PAYMENTS,
  INITIAL_CUSTOMER_NOTIFICATIONS,
  INITIAL_ADMIN_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SESSIONS
} from './mockData';

const STORAGE_KEY = 'safar_cycle_store_v2';

class MockStore {
  constructor() {
    this.listeners = new Set();
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure cycles have the latest valid local images
        if (parsed.cycles) {
          parsed.cycles = parsed.cycles.map(c => {
            const initial = INITIAL_CYCLES.find(ic => ic.id === c.id);
            if (initial && (!c.images || c.images.length === 0 || c.images[0].includes('unsplash.com'))) {
              return { ...c, images: initial.images };
            }
            return c;
          });
        }
        return parsed;
      }
    } catch {
      // fallback to initial
    }
    return {
      cycles: INITIAL_CYCLES,
      services: INITIAL_SERVICES,
      bookings: INITIAL_BOOKINGS,
      enquiries: INITIAL_ENQUIRIES,
      customerCycles: INITIAL_CUSTOMER_CYCLES,
      inventory: INITIAL_INVENTORY,
      sales: INITIAL_SALES,
      payments: INITIAL_PAYMENTS,
      customerNotifications: INITIAL_CUSTOMER_NOTIFICATIONS,
      adminNotifications: INITIAL_ADMIN_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
      sessions: INITIAL_SESSIONS
    };
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // ignore
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  // --- CYCLES ---
  getCycles() {
    return [...this.state.cycles];
  }

  getCycleById(id) {
    return this.state.cycles.find((c) => c.id === id) || null;
  }

  addCycle(cycleData) {
    const newCycle = {
      ...cycleData,
      id: `cyc-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      isPublished: cycleData.isPublished !== undefined ? cycleData.isPublished : true,
      stock: Number(cycleData.stock) || 1,
      price: Number(cycleData.price) || 0
    };
    this.state.cycles = [newCycle, ...this.state.cycles];
    this.addAuditLog('Cycle Added', 'Admin', newCycle.sku || newCycle.name, `New cycle added: ${newCycle.name}`);
    this.saveState();
    return newCycle;
  }

  updateCycle(id, updates) {
    this.state.cycles = this.state.cycles.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    this.addAuditLog('Cycle Updated', 'Admin', id, `Updated cycle details for ID ${id}`);
    this.saveState();
    return this.getCycleById(id);
  }

  archiveCycle(id) {
    this.state.cycles = this.state.cycles.map((c) =>
      c.id === id ? { ...c, isPublished: false, isArchived: true } : c
    );
    this.addAuditLog('Cycle Archived', 'Admin', id, `Cycle marked as archived`);
    this.saveState();
  }

  // --- SERVICES ---
  getServices() {
    return [...this.state.services];
  }

  // --- BOOKINGS ---
  getBookings(customerId = null) {
    if (customerId) {
      return this.state.bookings.filter((b) => b.customerId === customerId);
    }
    return [...this.state.bookings];
  }

  getBookingById(id) {
    return this.state.bookings.find((b) => b.id === id) || null;
  }

  createBooking(bookingData) {
    const newId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    
    const newBooking = {
      id: newId,
      customerId: bookingData.customerId || 'cust-current',
      customerName: bookingData.customerName,
      customerPhone: bookingData.customerPhone,
      cycleName: bookingData.cycleName,
      cycleBrand: bookingData.cycleBrand || 'Customer Cycle',
      serviceId: bookingData.serviceId || 'srv-001',
      serviceName: bookingData.serviceName || 'General Cycle Service',
      serviceName_gu: bookingData.serviceName_gu || 'જનરલ સાઇકલ સર્વિસ',
      appointmentDate: bookingData.appointmentDate,
      appointmentTime: bookingData.appointmentTime,
      problemDescription: bookingData.problemDescription || '',
      status: 'REQUESTED',
      estimatedCost: Number(bookingData.estimatedCost) || 0,
      finalCost: 0,
      amountPaid: 0,
      remainingAmount: Number(bookingData.estimatedCost) || 0,
      paymentStatus: 'UNPAID',
      customerNotes: bookingData.customerNotes || '',
      internalNotes: '',
      timeline: [
        { status: 'REQUESTED', date: nowStr, by: bookingData.customerName }
      ]
    };

    this.state.bookings = [newBooking, ...this.state.bookings];
    
    // Add admin alert
    this.state.adminNotifications = [
      {
        id: `adnotif-${Date.now()}`,
        title: `New Service Booking ${newId}`,
        message: `${bookingData.customerName} booked ${newBooking.serviceName} for ${bookingData.appointmentDate}`,
        date: nowStr,
        isRead: false,
        link: '/admin/bookings'
      },
      ...this.state.adminNotifications
    ];

    this.addAuditLog('Booking Requested', bookingData.customerName, newId, `Appointment request submitted for ${bookingData.appointmentDate}`);
    this.saveState();
    return newBooking;
  }

  updateBookingStatus(id, newStatus, internalNotes = '', finalCost = null) {
    const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    this.state.bookings = this.state.bookings.map((b) => {
      if (b.id !== id) return b;
      
      const updated = { ...b, status: newStatus };
      if (internalNotes) updated.internalNotes = internalNotes;
      if (finalCost !== null) {
        updated.finalCost = Number(finalCost);
        updated.remainingAmount = Math.max(0, Number(finalCost) - Number(updated.amountPaid));
      }
      updated.timeline = [
        ...b.timeline,
        { status: newStatus, date: nowStr, by: 'Admin (Workshop)' }
      ];

      // Add customer notification
      this.state.customerNotifications = [
        {
          id: `notif-${Date.now()}`,
          customerId: b.customerId,
          title: `Booking Update: ${newStatus}`,
          title_gu: `બુકિંગ સ્થિતિ: ${newStatus}`,
          message: `Your booking ${id} status has been updated to ${newStatus}.`,
          message_gu: `તમારી બુકિંગ ${id} ની સ્થિતિ બદલાઈને ${newStatus} થઈ છે.`,
          date: nowStr,
          isRead: false,
          link: `/my-bookings/${id}`
        },
        ...this.state.customerNotifications
      ];

      return updated;
    });

    this.addAuditLog(`Booking Status: ${newStatus}`, 'Admin', id, `Updated status to ${newStatus}`);
    this.saveState();
    return this.getBookingById(id);
  }

  cancelBooking(id, reason = 'Cancelled by customer') {
    return this.updateBookingStatus(id, 'CANCELLED', reason);
  }

  // --- ENQUIRIES ---
  getEnquiries(customerId = null) {
    if (customerId) {
      return this.state.enquiries.filter((e) => e.customerPhone === '9876543210' || e.customerName.includes('Arbaz'));
    }
    return [...this.state.enquiries];
  }

  createEnquiry(enquiryData) {
    const newEnq = {
      id: `ENQ-${Math.floor(100 + Math.random() * 900)}`,
      customerName: enquiryData.customerName,
      customerPhone: enquiryData.customerPhone,
      cycleId: enquiryData.cycleId,
      cycleName: enquiryData.cycleName,
      cyclePrice: enquiryData.cyclePrice,
      message: enquiryData.message,
      date: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      status: 'NEW',
      adminNotes: ''
    };
    this.state.enquiries = [newEnq, ...this.state.enquiries];
    this.state.adminNotifications = [
      {
        id: `adnotif-${Date.now()}`,
        title: `New Enquiry ${newEnq.id}`,
        message: `${enquiryData.customerName} enquired about ${enquiryData.cycleName}`,
        date: newEnq.date,
        isRead: false,
        link: '/admin/enquiries'
      },
      ...this.state.adminNotifications
    ];
    this.addAuditLog('Purchase Enquiry', enquiryData.customerName, newEnq.id, `Enquired about ${enquiryData.cycleName}`);
    this.saveState();
    return newEnq;
  }

  updateEnquiryStatus(id, newStatus, adminNotes = '') {
    this.state.enquiries = this.state.enquiries.map((e) =>
      e.id === id ? { ...e, status: newStatus, adminNotes: adminNotes || e.adminNotes } : e
    );
    this.addAuditLog(`Enquiry ${newStatus}`, 'Admin', id, `Enquiry marked as ${newStatus}`);
    this.saveState();
  }

  // --- CUSTOMER CYCLES ---
  getCustomerCycles(customerId = 'cust-current') {
    return this.state.customerCycles.filter((c) => c.customerId === customerId);
  }

  addCustomerCycle(cycle) {
    const newCycle = {
      ...cycle,
      id: `cc-${Date.now().toString().slice(-4)}`,
      customerId: cycle.customerId || 'cust-current'
    };
    this.state.customerCycles = [newCycle, ...this.state.customerCycles];
    this.saveState();
    return newCycle;
  }

  deleteCustomerCycle(id) {
    this.state.customerCycles = this.state.customerCycles.filter((c) => c.id !== id);
    this.saveState();
  }

  // --- SALES & PAYMENTS ---
  getSales() {
    return [...this.state.sales];
  }

  recordSale(saleData) {
    const saleId = `SALE-${Math.floor(800 + Math.random() * 200)}`;
    const newSale = {
      id: saleId,
      saleDate: new Date().toISOString().split('T')[0],
      customerType: saleData.customerType || 'Walk-in',
      customerId: saleData.customerId || null,
      customerName: saleData.customerName,
      customerPhone: saleData.customerPhone,
      cycleId: saleData.cycleId,
      cycleName: saleData.cycleName,
      quantity: Number(saleData.quantity) || 1,
      subtotal: Number(saleData.subtotal),
      discount: Number(saleData.discount) || 0,
      finalAmount: Number(saleData.finalAmount),
      amountReceived: Number(saleData.amountReceived),
      paymentMethod: saleData.paymentMethod || 'CASH',
      paymentReference: saleData.paymentReference || 'Shop Counter',
      remainingBalance: Math.max(0, Number(saleData.finalAmount) - Number(saleData.amountReceived)),
      status: Number(saleData.amountReceived) >= Number(saleData.finalAmount) ? 'PAID_FULL' : 'PARTIAL'
    };

    this.state.sales = [newSale, ...this.state.sales];

    // Also record payment entry
    if (newSale.amountReceived > 0) {
      const payId = `PAY-${Math.floor(500 + Math.random() * 500)}`;
      this.state.payments = [
        {
          id: payId,
          referenceId: saleId,
          type: 'CYCLE_SALE',
          customerName: saleData.customerName,
          totalAmount: newSale.finalAmount,
          amountReceived: newSale.amountReceived,
          paymentMethod: newSale.paymentMethod,
          paymentDate: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
          recordedBy: 'Admin (Owner)'
        },
        ...this.state.payments
      ];
    }

    // Decrement stock of cycle if matched
    if (saleData.cycleId) {
      this.state.cycles = this.state.cycles.map((c) =>
        c.id === saleData.cycleId ? { ...c, stock: Math.max(0, c.stock - newSale.quantity) } : c
      );
    }

    this.addAuditLog('In-Person Sale Recorded', 'Admin', saleId, `Sale of ${newSale.cycleName} to ${newSale.customerName} (₹${newSale.amountReceived} received via ${newSale.paymentMethod})`);
    this.saveState();
    return newSale;
  }

  getPayments() {
    return [...this.state.payments];
  }

  recordPayment(paymentData) {
    const payId = `PAY-${Math.floor(500 + Math.random() * 500)}`;
    const newPayment = {
      id: payId,
      referenceId: paymentData.referenceId,
      type: paymentData.type || 'WORKSHOP_SERVICE',
      customerName: paymentData.customerName,
      totalAmount: Number(paymentData.totalAmount),
      amountReceived: Number(paymentData.amountReceived),
      paymentMethod: paymentData.paymentMethod || 'CASH',
      paymentDate: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      recordedBy: 'Admin (Owner)'
    };

    this.state.payments = [newPayment, ...this.state.payments];

    // If related to booking, update booking amountPaid
    if (paymentData.referenceId && paymentData.referenceId.startsWith('BK-')) {
      this.state.bookings = this.state.bookings.map((b) => {
        if (b.id !== paymentData.referenceId) return b;
        const newPaid = Number(b.amountPaid || 0) + Number(paymentData.amountReceived);
        const effectiveFinal = b.finalCost || b.estimatedCost || 0;
        return {
          ...b,
          amountPaid: newPaid,
          remainingAmount: Math.max(0, effectiveFinal - newPaid),
          paymentStatus: newPaid >= effectiveFinal ? 'PAID_FULL' : 'PARTIAL'
        };
      });
    }

    this.addAuditLog('Payment Received', 'Admin', payId, `Received ₹${newPayment.amountReceived} from ${newPayment.customerName} via ${newPayment.paymentMethod}`);
    this.saveState();
    return newPayment;
  }

  // --- INVENTORY ---
  getInventory() {
    return [...this.state.inventory];
  }

  adjustInventory(id, changeQuantity, reason = 'Workshop adjustment') {
    this.state.inventory = this.state.inventory.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + changeQuantity) } : item
    );
    this.addAuditLog('Stock Adjusted', 'Admin', id, `Adjusted quantity by ${changeQuantity} (${reason})`);
    this.saveState();
  }

  addInventoryItem(item) {
    const newItem = {
      ...item,
      id: `inv-${Date.now().toString().slice(-4)}`,
      quantity: Number(item.quantity) || 0,
      purchaseCost: Number(item.purchaseCost) || 0,
      sellingPrice: Number(item.sellingPrice) || 0,
      reorderLevel: Number(item.reorderLevel) || 5
    };
    this.state.inventory = [newItem, ...this.state.inventory];
    this.addAuditLog('Part Added', 'Admin', newItem.id, `Added spare part ${newItem.name}`);
    this.saveState();
    return newItem;
  }

  // --- NOTIFICATIONS ---
  getCustomerNotifications(customerId = 'cust-current') {
    return this.state.customerNotifications.filter((n) => n.customerId === customerId);
  }

  markCustomerNotificationAsRead(id) {
    this.state.customerNotifications = this.state.customerNotifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    this.saveState();
  }

  markAllCustomerNotificationsAsRead() {
    this.state.customerNotifications = this.state.customerNotifications.map((n) => ({
      ...n,
      isRead: true
    }));
    this.saveState();
  }

  getAdminNotifications() {
    return [...this.state.adminNotifications];
  }

  markAdminNotificationAsRead(id) {
    this.state.adminNotifications = this.state.adminNotifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    this.saveState();
  }

  // --- AUDIT LOGS & SESSIONS ---
  getAuditLogs() {
    return [...this.state.auditLogs];
  }

  addAuditLog(action, actor, record, description) {
    const newLog = {
      id: `log-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      action,
      actor,
      record,
      description
    };
    this.state.auditLogs = [newLog, ...this.state.auditLogs];
  }

  getSessions() {
    return [...this.state.sessions];
  }

  revokeSession(id) {
    this.state.sessions = this.state.sessions.map((s) =>
      s.id === id ? { ...s, status: 'Revoked' } : s
    );
    this.saveState();
  }

  resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.loadState();
    this.notify();
  }
}

export const mockStore = new MockStore();
