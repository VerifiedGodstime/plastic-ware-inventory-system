const express = require("express");
const pool = require("./config/database");
const categoryRoutes = require("./routes/categoryRoutes");
const app = express();

const PORT = 5000;

app.use(express.json());
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Plastic Ware Inventory API is running",
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS result");

    res.json({
      success: true,
      message: "Database connection successful",
      result: rows[0].result,
    });
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});