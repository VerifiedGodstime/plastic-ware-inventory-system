const validateInventoryTransaction = (req, res, next) => {
  const { product_id, type, quantity } = req.body;

  if (!product_id) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required",
    });
  }

  if (!type) {
    return res.status(400).json({
      success: false,
      message: "Transaction type is required",
    });
  }

  if (!["IN", "OUT"].includes(type)) {
    return res.status(400).json({
      success: false,
      message: "Transaction type must be IN or OUT",
    });
  }

  if (quantity === undefined || quantity === null) {
    return res.status(400).json({
      success: false,
      message: "Quantity is required",
    });
  }

  if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be a positive whole number",
    });
  }

  next();
};

module.exports = validateInventoryTransaction;