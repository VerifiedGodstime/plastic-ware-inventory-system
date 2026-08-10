const express = require("express");

const {
  getCategories,
  createCategory,
  getCategoryById,
} = require("../controllers/categoryController");

const validateCategory = require("../validators/categoryValidator");

const router = express.Router();

router.get("/", getCategories);

router.get("/:id", getCategoryById);

router.post("/", validateCategory, createCategory);

router.put("/:id", validateCategory, updateCategory);

module.exports = router;