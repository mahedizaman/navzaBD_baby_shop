// Load Environment Variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http"); // <-- Node HTTP server
const { Server } = require("socket.io"); // <-- Socket.io server
const errorHandler = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const spaces = require("./config/swagger");
const swaggerUi = require("swagger-ui-express");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRouters = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const paymentRoutes = require("./routes/paymentsRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const statsRoutes = require("./routes/statsRoutes");
const { handleStripeWebhook } = require("./controllers/paymentController");

const app = express();
const PORT = process.env.PORT || 8000;

// Database Connection
connectDB();

// HTTP server needed for socket.io
const httpServer = http.createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173", // Admin panel
      "http://localhost:3000", // Client
    ],
    credentials: true,
  },
});

// Socket connection listener
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Make io accessible in controllers (e.g., to emit events)
app.set("io", io);

// Stripe webhook
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:8000",
    ],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRouters);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/stats", statsRoutes);

// Swagger Docs
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(spaces, {
    explorer: true,
    customCss: ".swagger-ui .topbar {display:none}",
    customSiteTitle: "NavzaBD API Documentation",
  }),
);

// Home route
app.get("/", (req, res) => res.send("API is running..."));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Error handler (at the bottom)
app.use(errorHandler);

// Start HTTP server (not app.listen!)
httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} 🚀`);
});
