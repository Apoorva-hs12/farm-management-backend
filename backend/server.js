// 🔥 Handle crashes (VERY IMPORTANT)
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
});

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { initDB } = require('./db_mongo');

const authRoutes = require('./routes/auth');
const animalRoutes = require('./routes/animals');
const milkRoutes = require('./routes/milk');
const expenseRoutes = require('./routes/expenses');
const dashboardRoutes = require('./routes/dashboard');
const healthRoutes = require('./routes/health');
const userRoutes = require('./routes/users');

const app = express();

// ✅ Use dynamic port for Railway
const PORT = process.env.PORT || 4000;

// ✅ Use environment variable for secret, or fallback to default
const SECRET_KEY = process.env.JWT_SECRET || 'gokulam_super_secret_key';

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// ✅ Root route (Health Check for Deployment)
app.get('/', (req, res) => {
  res.status(200).send(`<h1>🚜 Gokulam Backend Live</h1><p>Status: All systems go on port ${PORT}</p>`);
});

// 🔐 Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.error('🚫 Token missing in request header');
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error('🚫 Invalid token session:', err.message);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/animals', authenticateToken, animalRoutes);
app.use('/api/milk', authenticateToken, milkRoutes);
app.use('/api/expenses', authenticateToken, expenseRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);
app.use('/api/health', authenticateToken, healthRoutes);
app.use('/api/users', authenticateToken, userRoutes);

// 🚀 Start server safely
async function start() {
  console.log(`\n-----------------------------------------`);
  console.log(`🚀 SYSTEM STARTING IN ${process.env.NODE_ENV || 'production'} MODE...`);
  console.log(`📅 Time: ${new Date().toLocaleString()}`);
  
  // 1. Immediately bind server to 0.0.0.0 (REQUIRED for Railway health checks)
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ PORT READY: Server is listening on port ${PORT}`);
    console.log(`🔗 Interface: 0.0.0.0`);
    console.log(`-----------------------------------------\n`);
  });

  // 2. Connect to database in the background (prevents health-check timeouts)
  console.log('⏳ Connecting to Database...');
  try {
    await initDB();
    console.log('✅ DATABASE CONNECTION SUCCESSFUL');
  } catch (err) {
    console.error('❌ DATABASE CONNECTION FAILED:', err.message);
    console.log('⚠️ Server will remain active but DB-dependent routes will fail.');
  }

  // Handle server errors
  server.on('error', (err) => {
    console.error('🔥 SERVER CRASHED:', err);
    process.exit(1);
  });
}

start();