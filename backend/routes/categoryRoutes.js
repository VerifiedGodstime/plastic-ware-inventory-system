const express = require("express");
const {
  getCategories,
  createCategory,
} = require("../controllers/categoryController");

const validateCategory = require("../validators/categoryValidator");

const router = express.Router();

router.get("/", getCategories);

router.post("/", validateCategory, createCategory);

module.exports = router;