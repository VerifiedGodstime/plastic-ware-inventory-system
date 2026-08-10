const pool = require("../config/database");

// Get all suppliers
const getSuppliers = async (req, res) => {
  try {
    const [suppliers] = await pool.query(
      "SELECT * FROM suppliers ORDER BY id DESC"
    );

    res.status(200).json({
      success: true,
      data: suppliers,
    });
  } catch (error) {
    console.error("Get suppliers error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch suppliers",
    });
  }
};

// Create a supplier
const createSupplier = async (req, res) => {
  try {
    const {
      name,
      contact_person,
      phone,
      email,
      address,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO suppliers
      (name, contact_person, phone, email, address)
      VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        contact_person || null,
        phone || null,
        email || null,
        address || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      data: {
        id: result.insertId,
        name,
        contact_person: contact_person || null,
        phone: phone || null,
        email: email || null,
        address: address || null,
      },
    });
  } catch (error) {
    console.error("Create supplier error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create supplier",
    });
  }
};


// Get a single supplier by ID
const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    const [suppliers] = await pool.query(
      "SELECT * FROM suppliers WHERE id = ?",
      [id]
    );

    if (suppliers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      success: true,
      data: suppliers[0],
    });
  } catch (error) {
    console.error("Get supplier error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch supplier",
    });
  }
};

// Update a supplier
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      contact_person,
      phone,
      email,
      address,
    } = req.body;

    const [result] = await pool.query(
      `UPDATE suppliers
       SET name = ?, contact_person = ?, phone = ?, email = ?, address = ?
       WHERE id = ?`,
      [
        name,
        contact_person || null,
        phone || null,
        email || null,
        address || null,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    const [updatedSupplier] = await pool.query(
      "SELECT * FROM suppliers WHERE id = ?",
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      data: updatedSupplier[0],
    });
  } catch (error) {
    console.error("Update supplier error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update supplier",
    });
  }
};

// Delete a supplier
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM suppliers WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    console.error("Delete supplier error:", error.message);

    // Supplier is being used by a product
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        success: false,
        message: "Cannot delete supplier because it is being used by a product",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete supplier",
    });
  }
};
module.exports = {
  getSuppliers,
  createSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};