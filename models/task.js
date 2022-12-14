const mongoose = require("mongoose");
const { subtaskSchema } = require("./subtask");

const taskSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subtasks: [subtaskSchema],
  done: { type: Boolean, default: false },
});

const taskModel = mongoose.model("Task", taskSchema);

module.exports.taskSchema = taskSchema;
module.exports.Task = taskModel;
