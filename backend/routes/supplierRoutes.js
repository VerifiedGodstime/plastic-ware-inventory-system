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

router.get("/", authenticate, getSuppliers);

router.get("/:id", authenticate, getSupplierById);

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

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteSupplier
);

module.exports = router;