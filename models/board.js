const mongoose = require("mongoose");
const { columnSchema } = require("./column");

const boardSchema = mongoose.Schema({
  title: { type: String, required: true },
  columns: { type: mongoose.Types.ObjectId, ref: "Column" },
});

const boardModel = mongoose.model("Board", boardSchema);

module.exports.boardSchema = boardSchema;
module.exports.Board = boardModel;
