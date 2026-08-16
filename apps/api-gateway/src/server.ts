import { buildApp } from './app.js';
import { loadConfig } from '@platform/config';

async function start() {
  const config = loadConfig();
  const app = await buildApp();

  try {
    await app.listen({
      host: '0.0.0.0',
      port: config.API_GATEWAY_PORT,
    });

    app.log.info(
      `API Gateway running on http://localhost:${config.API_GATEWAY_PORT}`,
    );
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void start();