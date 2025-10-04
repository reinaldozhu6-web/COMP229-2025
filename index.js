const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const createError = require("http-errors");
const connectDB = require("./config/db");

const contactRoutes = require("./app/routers/contactRoutes");
const projectRoutes = require("./app/routers/projectRoutes");
const serviceRoutes = require("./app/routers/serviceRoutes");
const userRoutes = require("./app/routers/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Root endpoint
app.get("/", (req, res) => {
    res.json({ message: "Welcome to My Portfolio" });
});

// API routes
app.use("/api/contacts", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/users", userRoutes);

// Handle 404
app.use((req, res, next) => {
    next(createError(404, "Not Found"));
});

// Global error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: { message: err.message || "Internal Server Error" },
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
