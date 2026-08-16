import { buildApp } from './app.js';
import { loadAuthConfig } from '@platform/config';

async function start() {
  const config = loadAuthConfig();
  const app = await buildApp();

  try {
    await app.listen({
      host: '0.0.0.0',
      port: config.AUTH_SERVICE_PORT,
    });

    app.log.info(
      `Auth service running on http://localhost:${config.AUTH_SERVICE_PORT}`,
    );
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void start();