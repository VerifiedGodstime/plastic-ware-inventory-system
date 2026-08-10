const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const validateCategory = require("../validators/categoryValidator");

const router = express.Router();

router.get("/", getCategories);

router.get("/:id", getCategoryById);

router.post(
  "/",
  authenticate,
  authorize("admin", "manager"),
  validateCategory,
  createCategory
);

router.put("/:id", validateCategory, updateCategory);

router.delete("/:id", deleteCategory);

module.exports = router;