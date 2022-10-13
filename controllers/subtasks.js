const { Task } = require("../models/task");
const { Subtask } = require("../models/subtask");

module.exports = {
  getSubtasks: (req, res) => {
    Subtask.find({ taskId: req.params["taskId"] }).then((subtasks) => {
      res.status(200).json({
        message: "Subtasks fetched successfully",
        subtasks: subtasks,
      });
    });
  },

  toggleDone: async (req, res) => {
    const subtaskId = req.params["subtaskId"];
    const taskId = req.params["taskId"];

    const task = await Task.findOne({ _id: taskId }).exec();
    for (var subtask of task.subtasks) {
      if (subtask._id.toString() === subtaskId) {
        if (subtask.done) {
          subtask.done = false;
        } else {
          subtask.done = true;
        }
      }
    }

    await task.save();
    res.status(200).json({
      message: "Subtask's status changed",
    });
  },
};
