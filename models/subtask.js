const mongoose = require("mongoose");

const subtaskSchema = mongoose.Schema({
  name: { type: String, required: true },
  task: { type: mongoose.Types.ObjectId, ref: "Task" },
  done: { type: Boolean, default: false },
});
const subtaskModel = mongoose.model("Subtask", subtaskSchema);

module.exports.subtaskSchema = subtaskSchema;
module.exports.Subtask = subtaskModel;
