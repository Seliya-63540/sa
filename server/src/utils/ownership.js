import { NotFoundError } from './errors.js';
import { getDatabase } from '../database/connection.js';

/**
 * Reusable ownership validation utilities ensuring strict customer data isolation.
 * Always prefers parameterized queries that bind WHERE customer_id = ? / user_id = ?
 * preventing unauthorized record enumeration or data leaks.
 */
export const ownership = {
  /**
   * Verify that a customer cycle belongs to the authenticated user
   */
  async verifyCustomerCycle(customerCycleId, authenticatedUserId) {
    const db = await getDatabase();
    const cycle = await db.get(
      'SELECT * FROM customer_cycles WHERE id = ? AND customer_id = ? AND archived_at IS NULL;',
      [customerCycleId, authenticatedUserId]
    );

    if (!cycle) {
      throw new NotFoundError('Bicycle record not found in your garage');
    }
    return cycle;
  },

  /**
   * Verify that a service booking belongs to the authenticated user
   */
  async verifyBooking(bookingId, authenticatedUserId) {
    const db = await getDatabase();
    const booking = await db.get(
      'SELECT * FROM service_bookings WHERE id = ? AND customer_id = ?;',
      [bookingId, authenticatedUserId]
    );

    if (!booking) {
      throw new NotFoundError('Booking record not found');
    }
    return booking;
  },

  /**
   * Verify that an enquiry belongs to the authenticated user
   */
  async verifyEnquiry(enquiryId, authenticatedUserId) {
    const db = await getDatabase();
    const enquiry = await db.get(
      'SELECT * FROM cycle_enquiries WHERE id = ? AND customer_id = ?;',
      [enquiryId, authenticatedUserId]
    );

    if (!enquiry) {
      throw new NotFoundError('Enquiry record not found');
    }
    return enquiry;
  },

  /**
   * Verify that a notification belongs to the authenticated user
   */
  async verifyNotification(notificationId, authenticatedUserId) {
    const db = await getDatabase();
    const notification = await db.get(
      'SELECT * FROM notifications WHERE id = ? AND recipient_user_id = ?;',
      [notificationId, authenticatedUserId]
    );

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }
    return notification;
  }
};
