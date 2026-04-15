import runApp from './lib/core.js';

const port = process.env.PORT || 3000;

let server;

(async () => {
  try {
    server = await runApp({ port });

    const shutdown = (signal) => {
      console.log();
      if (server) {
        server.close(() => {
          console.log('Server closed');
          process.exit(0);
        });
        setTimeout(() => { process.exit(1); }, 10000);
      } else {
        process.exit(0);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));
  } catch (err) {
    console.error('Fatal:', err);
    process.exit(1);
  }
})();
