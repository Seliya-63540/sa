import readline from 'readline';
import crypto from 'crypto';
import { getDatabase, closeDatabase } from '../connection.js';
import { authRepository } from '../../modules/auth/auth.repository.js';
import { passwordService } from '../../modules/auth/password.service.js';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { AUTH_EVENTS } from '../../modules/auth/auth.constants.js';

function askQuestion(query, hidden = false) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    if (!hidden) {
      rl.question(query, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    } else {
      // For masked password input
      process.stdout.write(query);
      let password = '';
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf8');

      const onData = (char) => {
        if (char === '\n' || char === '\r' || char === '\u0004') {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.removeListener('data', onData);
          rl.close();
          console.log();
          resolve(password.trim());
        } else if (char === '\u0003') {
          // Ctrl+C
          process.exit(1);
        } else if (char === '\b' || char.charCodeAt(0) === 127) {
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
        } else {
          password += char;
          process.stdout.write('*');
        }
      };

      process.stdin.on('data', onData);
    }
  });
}

export async function bootstrapAdmin({
  name = null,
  username = null,
  phone = null,
  password = null,
  silent = false
} = {}) {
  const db = await getDatabase();

  const finalName = name || env.INITIAL_ADMIN_NAME || 'SAFAR Workshop Owner';
  const finalUsername = username || env.INITIAL_ADMIN_USERNAME || 'admin';
  const finalPhone = phone || env.INITIAL_ADMIN_PHONE || '9876543210';
  const finalPassword = password || env.INITIAL_ADMIN_PASSWORD;

  if (!finalPassword) {
    throw new Error('Admin password must be provided via argument, interactive prompt, or INITIAL_ADMIN_PASSWORD env variable');
  }

  // Check if admin with this username or phone already exists
  const existingUsername = await authRepository.findByUsername(finalUsername);
  if (existingUsername) {
    if (!silent) {
      console.log(`Notice: Admin user '${finalUsername}' already exists in database. Skipping duplicate creation.`);
    }
    return existingUsername;
  }

  const passwordHash = await passwordService.hash(finalPassword);
  const adminId = `admin-${crypto.randomUUID().slice(0, 8)}`;

  const createdAdmin = await authRepository.createAdmin({
    id: adminId,
    fullName: finalName,
    username: finalUsername,
    phone: finalPhone,
    passwordHash,
    preferredLanguage: 'en'
  });

  await authRepository.recordAuditLog({
    actorId: adminId,
    action: AUTH_EVENTS.ADMIN_CREATED,
    entityType: 'USER',
    entityId: adminId,
    afterData: { username: finalUsername, fullName: finalName, role: 'ADMIN' }
  });

  if (!silent) {
    console.log(`\n======================================================`);
    console.log(` SAFAR CYCLE — Administrator Account Initialized`);
    console.log(` ID:       ${adminId}`);
    console.log(` Name:     ${finalName}`);
    console.log(` Username: ${finalUsername}`);
    console.log(` Role:     ADMIN`);
    console.log(` Password: [PROTECTED & HASHED VIA ARGON2id]`);
    console.log(`======================================================\n`);
  }

  return createdAdmin;
}

// CLI Interactive Handler
if (process.argv[1] && process.argv[1].endsWith('createAdmin.js')) {
  (async () => {
    try {
      console.log('\n--- SAFAR CYCLE ADMIN ACCOUNT BOOTSTRAP ---');

      let name = process.env.INITIAL_ADMIN_NAME;
      let username = process.env.INITIAL_ADMIN_USERNAME;
      let phone = process.env.INITIAL_ADMIN_PHONE;
      let password = process.env.INITIAL_ADMIN_PASSWORD;

      if (!password && process.stdin.isTTY) {
        name = await askQuestion('Enter Admin Full Name (default: SAFAR Workshop Owner): ');
        username = await askQuestion('Enter Admin Username (default: admin): ');
        phone = await askQuestion('Enter Contact Phone (optional): ');
        password = await askQuestion('Enter Secure Admin Password (min 6 chars): ', true);
      }

      await bootstrapAdmin({
        name: name || undefined,
        username: username || undefined,
        phone: phone || undefined,
        password: password || undefined,
        silent: false
      });

      await closeDatabase();
      process.exit(0);
    } catch (err) {
      console.error('\nAdmin bootstrap failed:', err.message);
      await closeDatabase().catch(() => {});
      process.exit(1);
    }
  })();
}
