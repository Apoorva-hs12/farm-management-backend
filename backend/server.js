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

// ✅ Use dynamic port (FIX FOR RAILWAY)
const PORT = process.env.PORT || 4000;

const SECRET_KEY = 'gokulam_super_secret_key';

// Middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// ✅ Root route
app.get('/', (req, res) => {
  res.send('<h1>✅ Backend is running successfully</h1>');
});

// 🔐 Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
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
  try {
    await initDB();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ DB FAILED:", err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

start();