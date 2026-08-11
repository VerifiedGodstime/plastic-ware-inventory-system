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


// Get a single category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const [categories] = await pool.query(
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: categories[0],
    });
  } catch (error) {
    console.error("Get category error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};


// Update a category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const [result] = await pool.query(
      "UPDATE categories SET name = ?, description = ? WHERE id = ?",
      [name, description || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const [updatedCategory] = await pool.query(
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory[0],
    });
  } catch (error) {
    console.error("Update category error:", error.message);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Category name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};


// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM categories WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error.message);

    // Category is being used by a product
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        success: false,
        message: "Cannot delete category because it is being used by a product",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};


module.exports = {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};