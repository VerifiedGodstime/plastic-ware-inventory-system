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

router.get("/", authenticate, getCategories);

router.get("/:id", authenticate, getCategoryById);

router.post(
  "/",
  authenticate,
  authorize("admin", "manager"),
  validateCategory,
  createCategory
);

router.put(
  "/:id",
  authenticate,
  authorize("admin", "manager"),
  validateCategory,
  updateCategory
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteCategory
);

module.exports = router;