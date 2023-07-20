const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true}
);

const emailModel = mongoose.model("Email", emailSchema);

module.exports = emailModel;
