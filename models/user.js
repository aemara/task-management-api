const mongoose = require("mongoose");
const { boardSchema } = require("./board");

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  boards: [boardSchema],
});

const userModel = mongoose.model("User", userSchema);

mondule.exports.userSchema = userSchema;
module.exports.User = userModel;
