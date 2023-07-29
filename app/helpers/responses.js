module.exports = {
  internalServer: (res) => {
    res.status(500).send({ message: "Internal Server Error" });
  },
  error: (res, err) => {
    res.status(err.statusCode).send({ message: err.message });
  },
};
