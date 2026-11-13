import app from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { getDatabase, closeDatabase } from './database/connection.js';

async function startServer() {
  try {
    // 1. Verify database connectivity at startup
    logger.info('Initializing SQLite database connection...');
    await getDatabase();
    logger.info('Database connection verified.');

    // 2. Start HTTP Listener
    const server = app.listen(env.PORT, () => {
      logger.info(`=======================================================`);
      logger.info(` SAFAR CYCLE Backend API Server Running`);
      logger.info(` Environment: ${env.NODE_ENV}`);
      logger.info(` Port:        ${env.PORT}`);
      logger.info(` Health URL:  http://localhost:${env.PORT}/api/health`);
      logger.info(` Timezone:    ${env.BUSINESS_TIMEZONE}`);
      logger.info(` Currency:    ${env.BUSINESS_CURRENCY}`);
      logger.info(`=======================================================`);
    });

    // 3. Graceful Shutdown Handlers
    const shutdown = async (signal) => {
      logger.info(`Received ${signal}. Shutting down SAFAR CYCLE server gracefully...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        try {
          await closeDatabase();
          logger.info('Database connection closed cleanly.');
          process.exit(0);
        } catch (dbErr) {
          logger.error(`Error closing database: ${dbErr.message}`);
          process.exit(1);
        }
      });

      // Force exit if shutdown hangs beyond 10s
      setTimeout(() => {
        logger.error('Forced shutdown after timeout.');
        process.exit(1);
      }, 10000).unref();
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (error) {
    logger.error(`Fatal error starting server: ${error.message}`);
    process.exit(1);
  }
}

startServer();
