const pool = require("../config/database");

// Get all inventory transactions
const getInventory = async (req, res) => {
  try {
    const [transactions] = await pool.query(`
      SELECT
        i.id,
        i.product_id,
        p.name AS product_name,
        p.product_code,
        i.type,
        i.quantity,
        i.reason,
        i.created_by,
        u.full_name AS created_by_name,
        i.created_at
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      JOIN users u ON i.created_by = u.id
      ORDER BY i.created_at DESC
    `);

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Get inventory error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory transactions",
    });
  }
};

// Record an inventory transaction
const createInventoryTransaction = async (req, res) => {
  try {
    const {
      product_id,
      type,
      quantity,
      reason,
    } = req.body;

    // Check if product exists
    const [products] = await pool.query(
      "SELECT id, name FROM products WHERE id = ?",
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // If this is an OUT transaction, check current stock
    if (type === "OUT") {
      const [stockResult] = await pool.query(
        `
        SELECT
          COALESCE(
            SUM(
              CASE
                WHEN type = 'IN' THEN quantity
                WHEN type = 'OUT' THEN -quantity
              END
            ),
            0
          ) AS current_stock
        FROM inventory
        WHERE product_id = ?
        `,
        [product_id]
      );

      const currentStock = Number(stockResult[0].current_stock);

      if (quantity > currentStock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Current stock is ${currentStock}`,
        });
      }
    }

    // Create the transaction
    const [result] = await pool.query(
      `
      INSERT INTO inventory
      (product_id, type, quantity, reason, created_by)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        product_id,
        type,
        quantity,
        reason || null,
        req.user.id,
      ]
    );

    // Get the newly created transaction
    const [transaction] = await pool.query(
      `
      SELECT
        i.id,
        i.product_id,
        p.name AS product_name,
        p.product_code,
        i.type,
        i.quantity,
        i.reason,
        i.created_by,
        u.full_name AS created_by_name,
        i.created_at
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      JOIN users u ON i.created_by = u.id
      WHERE i.id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Inventory transaction recorded successfully",
      data: transaction[0],
    });
  } catch (error) {
    console.error(
      "Create inventory transaction error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to record inventory transaction",
    });
  }
};

// Get current stock summary
const getStockSummary = async (req, res) => {
  try {
    const [stock] = await pool.query(`
      SELECT
        p.id AS product_id,
        p.name AS product_name,
        p.product_code,
        p.reorder_level,
        COALESCE(
          SUM(
            CASE
              WHEN i.type = 'IN' THEN i.quantity
              WHEN i.type = 'OUT' THEN -i.quantity
            END
          ),
          0
        ) AS current_stock
      FROM products p
      LEFT JOIN inventory i ON p.id = i.product_id
      GROUP BY
        p.id,
        p.name,
        p.product_code,
        p.reorder_level
      ORDER BY p.name ASC
    `);

    res.status(200).json({
      success: true,
      data: stock,
    });
  } catch (error) {
    console.error("Get stock summary error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch stock summary",
    });
  }
};

// Get low-stock products
const getLowStockProducts = async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT
        p.id AS product_id,
        p.name AS product_name,
        p.product_code,
        p.reorder_level,
        COALESCE(
          SUM(
            CASE
              WHEN i.type = 'IN' THEN i.quantity
              WHEN i.type = 'OUT' THEN -i.quantity
            END
          ),
          0
        ) AS current_stock
      FROM products p
      LEFT JOIN inventory i ON p.id = i.product_id
      GROUP BY
        p.id,
        p.name,
        p.product_code,
        p.reorder_level
      HAVING current_stock <= p.reorder_level
      ORDER BY current_stock ASC
    `);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Get low-stock products error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch low-stock products",
    });
  }
};

module.exports = {
  getInventory,
  createInventoryTransaction,
  getStockSummary,
  getLowStockProducts,
};