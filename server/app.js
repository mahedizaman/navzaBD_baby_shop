// Load Environment Variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const spaces = require("./config/swagger");
const swaggerUi = require("swagger-ui-express");
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

const app = express();
const PORT = process.env.PORT || 8000;

// Database Connection
connectDB();

// Middlewares
// CORS setup for security
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: [
      "http://localhost:5173", // admin
      "http://localhost:3000", // client
      "http://localhost:8000", // swagger
    ],
    credentials: true,
  }),
);

//To read Form Data and data limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//Routes
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

//API Documentation
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(spaces, {
    explorer: true,
    customCss: ".swagger-ui .topbar {display:none}",
    customSiteTitle: "NavzaBD API Documentation",
  }),
);
// Home Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Health Check Endpoint (As you requested)
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Error Handler (Must be at the bottom)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT} 🚀`);
});
