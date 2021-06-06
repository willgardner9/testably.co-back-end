class CustomError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
}

module.exports = CustomError;
