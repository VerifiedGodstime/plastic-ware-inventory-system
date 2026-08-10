const pool = require("../config/database");

// Get all products
const getProducts = async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.product_code,
        p.category_id,
        c.name AS category_name,
        p.supplier_id,
        s.name AS supplier_name,
        p.buying_price,
        p.selling_price,
        p.reorder_level,
        p.description,
        p.created_at,
        p.updated_at
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.id DESC
    `);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.query(
      `
      SELECT
        p.id,
        p.name,
        p.product_code,
        p.category_id,
        c.name AS category_name,
        p.supplier_id,
        s.name AS supplier_name,
        p.buying_price,
        p.selling_price,
        p.reorder_level,
        p.description,
        p.created_at,
        p.updated_at
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.id = ?
      `,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: products[0],
    });
  } catch (error) {
    console.error("Get product error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      product_code,
      category_id,
      supplier_id,
      buying_price,
      selling_price,
      reorder_level,
      description,
    } = req.body;

    const [result] = await pool.query(
      `UPDATE products
       SET
         name = ?,
         product_code = ?,
         category_id = ?,
         supplier_id = ?,
         buying_price = ?,
         selling_price = ?,
         reorder_level = ?,
         description = ?
       WHERE id = ?`,
      [
        name,
        product_code,
        category_id,
        supplier_id,
        buying_price,
        selling_price,
        reorder_level ?? 10,
        description || null,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const [updatedProduct] = await pool.query(
      `
      SELECT
        p.id,
        p.name,
        p.product_code,
        p.category_id,
        c.name AS category_name,
        p.supplier_id,
        s.name AS supplier_name,
        p.buying_price,
        p.selling_price,
        p.reorder_level,
        p.description,
        p.created_at,
        p.updated_at
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.id = ?
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct[0],
    });
  } catch (error) {
    console.error("Update product error:", error.message);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Product code already exists",
      });
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        success: false,
        message: "Invalid category or supplier",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM products WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};


// Create a product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      product_code,
      category_id,
      supplier_id,
      buying_price,
      selling_price,
      reorder_level,
      description,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO products
      (
        name,
        product_code,
        category_id,
        supplier_id,
        buying_price,
        selling_price,
        reorder_level,
        description
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        product_code,
        category_id,
        supplier_id,
        buying_price,
        selling_price,
        reorder_level ?? 10,
        description || null,
      ]
    );

    const [product] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product[0],
    });
  } catch (error) {
    console.error("Create product error:", error.message);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Product code already exists",
      });
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        success: false,
        message: "Invalid category or supplier",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};