const express = require("express");
const validateInventoryTransaction = require("../validators/inventoryValidator");

const {
  getInventory,
  createInventoryTransaction,
  getStockSummary,
  getLowStockProducts,
} = require("../controllers/inventoryController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authenticate, getInventory);

router.get("/stock", authenticate, getStockSummary);

router.get("/low-stock", authenticate, getLowStockProducts);

router.post(
  "/",
  authenticate,
  authorize("admin", "manager"),
  validateInventoryTransaction,
  createInventoryTransaction,
);

module.exports = router;