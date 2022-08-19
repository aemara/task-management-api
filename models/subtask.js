const mongoose = require("mongoose");

const subtaskSchema = mongoose.Schema({
  name: { type: String, required: true },
  taskId: { type: String },
  columnId: {type: String}
});
const subtaskModel = mongoose.model("Subtask", subtaskSchema);

module.exports.subtaskSchema = subtaskSchema;
module.exports.Subtask = subtaskModel;
