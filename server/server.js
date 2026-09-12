// 🚀 KATHA Heritage Platform - Server Entry Point
// 🎯 Purpose: Connects to the database and starts the HTTP server

import app from './app.js';
import dbManager from './utils/database.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  dbManager.setupEventListeners();
  await dbManager.connect();

  if (dbManager.isConnected) {
    await dbManager.createIndexes();
  }

  app.listen(PORT, () => {
    console.log('🚀 KATHA Heritage Platform Server Started!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🌐 Server running on: http://localhost:${PORT}`);
    console.log(`📱 API Endpoint: http://localhost:${PORT}/api`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 Ready for KATHA development!');
    console.log('🙏 Jai Hind! Let\'s build something amazing!');
  });
};

// 🎯 Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  await dbManager.disconnect();
  process.exit(0);
});

startServer();

export default app;
