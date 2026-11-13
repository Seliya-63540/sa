import argon2 from 'argon2';

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536, // 64 MB
  timeCost: 3,       // 3 iterations
  parallelism: 1
};

export const passwordService = {
  /**
   * Hash a plaintext password using Argon2id
   */
  async hash(password) {
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }
    return argon2.hash(password, ARGON2_OPTIONS);
  },

  /**
   * Verify a plaintext password against an Argon2id hash
   */
  async verify(hash, password) {
    if (!hash || !password) return false;
    try {
      return await argon2.verify(hash, password);
    } catch {
      return false;
    }
  }
};
