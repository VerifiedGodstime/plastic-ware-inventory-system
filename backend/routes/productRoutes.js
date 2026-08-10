const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const validateProduct = require("../validators/productValidator");

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  authenticate,
  authorize("admin", "manager"),
  validateProduct,
  createProduct
);

router.put(
  "/:id",
  authenticate,
  authorize("admin", "manager"),
  validateProduct,
  updateProduct
);

// router.delete("/:id", deleteProduct)
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteProduct
);

module.exports = router;