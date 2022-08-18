const mongoose = require("mongoose");
const { subtaskSchema } = require("./subtask");

const taskSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  column: {type: String, required: true},
  columnId: { type: String },
});

const taskModel = mongoose.model("Task", taskSchema);

module.exports.taskSchema = taskSchema;
module.exports.Task = taskModel;
