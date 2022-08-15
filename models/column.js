const mongoose = require("mongoose");
const { taskSchema } = require("./task");

const columnSchema = mongoose.Schema({
  title: { type: String, required: true },
  numOfTasks: { type: Number },
  tasks: { type: [taskSchema] },
  boardId: { type: Number },
});

const columnModel = mongoose.model("Column", columnSchema);

module.exports.columnSchema = columnSchema;
module.exports.Column = columnModel;
