const validateCategory = (req, res, next) => {
  const { name, description } = req.body;

  // Name is required
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Category name is required",
    });
  }

  // Description is optional, but if provided, it must be text
  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({
      success: false,
      message: "Category description must be a string",
    });
  }

  // Clean up the data
  req.body.name = name.trim();

  if (description !== undefined) {
    req.body.description = description.trim();
  }

  next();
};

module.exports = validateCategory;