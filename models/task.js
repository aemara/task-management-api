const mongoose = require("mongoose");
const { subtaskSchema } = require("./subtask");

const taskSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subtasks: { type: [subtaskSchema], required: true },
  status: { type: String, required: true },
  columnId: { type: Number, required: true },
});

const taskModel = mongoose.model("Task", taskSchema);

module.exports.taskSchema = taskSchema;
module.exports.Task = taskModel;
