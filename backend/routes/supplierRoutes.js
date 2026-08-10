const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

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

router.post(
  "/",
  authenticate,
  authorize("admin", "manager"),
  validateSupplier,
  createSupplier
);

router.put(
  "/:id",
  authenticate,
  authorize("admin", "manager"),
  validateSupplier,
  updateSupplier
);

router.delete("/:id", deleteSupplier);

module.exports = router;