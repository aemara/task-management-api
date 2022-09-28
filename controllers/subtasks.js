const { Task } = require("./models/task");

/**
 * PUT endpoint for toggling the 'done' status of a subtask
 */

app.put("/toggledone/:subtaskId/:taskId", (req, res) => {
  const subtaskId = req.params["subtaskId"];
  const taskId = req.params["taskId"];

  Task.findOne({ _id: taskId }, (err, task) => {
    task.subtasks.forEach((subtask) => {
      if (subtask._id.toString() === subtaskId) {
        if (subtask.done) {
          subtask.done = false;
        } else {
          subtask.done = true;
        }
      }
    });
    task.save();
    res.status(200).json({
      message: "Subtask's status changed",
    });
  });
});
