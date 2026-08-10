const pool = require("../config/database");

// Get all categories
const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(
      "SELECT * FROM categories ORDER BY id DESC"
    );

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const [result] = await pool.query(
      "INSERT INTO categories (name, description) VALUES (?, ?)",
      [name, description || null]
    );

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        id: result.insertId,
        name,
        description: description || null,
      },
    });
  } catch (error) {
    console.error("Create category error:", error.message);

    // Duplicate category name
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
};