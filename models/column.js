const mongoose = require("mongoose");
const { taskSchema } = require("./task");

const columnSchema = mongoose.Schema({
  title: { type: String, required: true },
  tasks: { type: mongoose.Types.ObjectId, ref: "Task" },
});

const columnModel = mongoose.model("Column", columnSchema);

module.exports.columnSchema = columnSchema;
module.exports.Column = columnModel;
