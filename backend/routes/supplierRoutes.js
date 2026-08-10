const express = require("express");

const {
  getSuppliers,
  createSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");

const validateSupplier = require("../validators/supplierValidator");

const router = express.Router();

router.get("/", getSuppliers);

router.get("/:id", getSupplierById);

router.post("/", validateSupplier, createSupplier);

router.put("/:id", validateSupplier, updateSupplier);

router.delete("/:id", deleteSupplier);

module.exports = router;