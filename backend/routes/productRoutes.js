const express = require("express");

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

router.post("/", validateProduct, createProduct);

router.put("/:id", validateProduct, updateProduct);

router.delete("/:id", deleteProduct)

module.exports = router;