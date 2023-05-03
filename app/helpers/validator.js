module.exports = (req, res,next) => {
  const { validationResult } = require("express-validator");
  console.log("here")
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }
  next()
};
