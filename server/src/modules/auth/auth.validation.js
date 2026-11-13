import { z } from 'zod';

/**
 * Normalizes an Indian phone number to standard E.164 (+91XXXXXXXXXX)
 * Accepts formats: 9876543210, +919876543210, 09876543210, 919876543210
 */
export function normalizeIndianPhone(input) {
  if (!input || typeof input !== 'string') return null;
  const digits = input.replace(/\D/g, '');

  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return `+91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('0') && /^[6-9]\d{9}$/.test(digits.slice(1))) {
    return `+91${digits.slice(1)}`;
  }
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]\d{9}$/.test(digits.slice(2))) {
    return `+91${digits.slice(2)}`;
  }
  return null;
}

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z.string().refine((val) => normalizeIndianPhone(val) !== null, {
    message: 'Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)'
  }),
  password: z.string().min(4, 'Password must be at least 4 characters').max(128),
  preferredLanguage: z.enum(['en', 'gu']).default('gu'),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions'
  }).optional()
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Identifier (Phone or Admin username) is required'),
  password: z.string().min(1, 'Password is required'),
  portal: z.enum(['CUSTOMER', 'ADMIN']).optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(4, 'New password must be at least 4 characters').max(128)
});
