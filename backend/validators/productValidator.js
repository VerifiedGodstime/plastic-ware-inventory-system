const validateProduct = (req, res, next) => {
  const {
    name,
    product_code,
    category_id,
    supplier_id,
    buying_price,
    selling_price,
    reorder_level,
    description,
  } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Product name is required",
    });
  }

  if (
    !product_code ||
    typeof product_code !== "string" ||
    product_code.trim() === ""
  ) {
    return res.status(400).json({
      success: false,
      message: "Product code is required",
    });
  }

  if (!Number.isInteger(Number(category_id))) {
    return res.status(400).json({
      success: false,
      message: "Valid category ID is required",
    });
  }

  if (!Number.isInteger(Number(supplier_id))) {
    return res.status(400).json({
      success: false,
      message: "Valid supplier ID is required",
    });
  }

  if (buying_price === undefined || Number(buying_price) < 0) {
    return res.status(400).json({
      success: false,
      message: "Valid buying price is required",
    });
  }

  if (selling_price === undefined || Number(selling_price) < 0) {
    return res.status(400).json({
      success: false,
      message: "Valid selling price is required",
    });
  }

  if (
    reorder_level !== undefined &&
    (!Number.isInteger(Number(reorder_level)) || Number(reorder_level) < 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "Reorder level must be a non-negative integer",
    });
  }

  req.body.name = name.trim();
  req.body.product_code = product_code.trim();
  req.body.category_id = Number(category_id);
  req.body.supplier_id = Number(supplier_id);
  req.body.buying_price = Number(buying_price);
  req.body.selling_price = Number(selling_price);

  if (reorder_level !== undefined) {
    req.body.reorder_level = Number(reorder_level);
  }

  if (description !== undefined) {
    req.body.description = description.trim();
  }

  next();
};

module.exports = validateProduct;