const validateSupplier = (req, res, next) => {
  const {
    name,
    contact_person,
    phone,
    email,
    address,
  } = req.body;

  // Name is required
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Supplier name is required",
    });
  }

  // Optional fields must be strings if provided
  if (
    contact_person !== undefined &&
    typeof contact_person !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Contact person must be a string",
    });
  }

  if (phone !== undefined && typeof phone !== "string") {
    return res.status(400).json({
      success: false,
      message: "Phone must be a string",
    });
  }

  if (email !== undefined && typeof email !== "string") {
    return res.status(400).json({
      success: false,
      message: "Email must be a string",
    });
  }

  if (address !== undefined && typeof address !== "string") {
    return res.status(400).json({
      success: false,
      message: "Address must be a string",
    });
  }

  // Clean up the data
  req.body.name = name.trim();

  if (contact_person !== undefined) {
    req.body.contact_person = contact_person.trim();
  }

  if (phone !== undefined) {
    req.body.phone = phone.trim();
  }

  if (email !== undefined) {
    req.body.email = email.trim();
  }

  if (address !== undefined) {
    req.body.address = address.trim();
  }

  next();
};

module.exports = validateSupplier;