const { Column } = require("./models/column");
const { Task } = require("./models/task");

/**
 * A POST endpoint for adding a task to a column
 */
app.post("/addtask/:columnId", async (req, res) => {
  const columnId = req.params["columnId"];

  const task = new Task({
    title: req.body.title,
    description: req.body.description,
  });

  if (req.body.subtasks.length > 0) {
    req.body.subtasks.forEach((subtask) => {
      const newSubtask = new Subtask({
        name: subtask.name,
      });
      task.subtasks.push(newSubtask); /**Then we add it to its task */
    });
  }

  await task.save(); /**Then we add the task to its collection */

  /** Now we add the task to the column and add the column to its collection */
  Column.findById(columnId, (err, column) => {
    column.tasks.push(task);
    column.save();
    res.status(200).json({
      message: "A column was found and a task was added",
    });
  });
});

/**
 * GET endpoint for fetching tasks of a column
 */

app.get("/tasks/:columnId", (req, res) => {
  Task.find({ columnId: req.params["columnId"] }).then((tasks) => {
    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks: tasks,
    });
  });
});

/**
 * GET endpoint for fetching a task
 */

app.get("/task/:taskId", (req, res) => {
  Task.find({ _id: req.params["taskId"] }).then((doc) => {
    res.status(200).json({
      task: doc,
    });
  });
});

/**
 * PUT endpoint for updating a task
 */

app.put("/edittask/:taskId", async (req, res) => {
  const taskId = req.params["taskId"];
  const task = await Task.findById(taskId);
  task.title = req.body.newTitle;
  task.description = req.body.newDescription;
  task.subtasks = req.body.newSubtasks;
  console.log("right before saving task");
  await task.save();

  if (req.body.newColumnId) {
    /**Remove the task from its current column*/
    Column.findOne({ _id: req.body.currentColumnId })
      .populate({ path: "tasks" })
      .exec((err, column) => {
        let filtered = column.tasks.filter(function (task, index, arr) {
          return task._id != taskId;
        });
        column.tasks = filtered;
        column.save();

        /**Now we add the task to its new column */
        Task.findOne({ _id: taskId }, (err, task) => {
          Column.findOne({ _id: req.body.newColumnId }, (err, column) => {
            column.tasks.push(task);
            console.log("right before saving column");
            column.save();
          });
        });
      });
  }

  console.log("right before response");
  res.status(200).json({
    message: "Task updated successfully",
  });
});

/**
 * PUT endpoint for changing the column of a task
 */

app.put("/changecolumn/:taskId/:currentColumnId/:newColumnId", (req, res) => {
  const taskId = req.params["taskId"];
  const currentColumnId = req.params["currentColumnId"];
  const newColumnId = req.params["newColumnId"];

  /**Remove the task from its current column*/
  Column.findOne({ _id: currentColumnId })
    .populate({ path: "tasks" })
    .exec((err, column) => {
      let filtered = column.tasks.filter(function (task, index, arr) {
        return task._id != taskId;
      });
      column.tasks = filtered;
      column.save();

      /**Now we add the task to its new column */
      Task.findOne({ _id: taskId }, (err, task) => {
        Column.findOne({ _id: newColumnId }, (err, column) => {
          column.tasks.push(task);
          column.save();
          res.status(200).json({
            message: "update was successful",
          });
        });
      });
    });
});

/**
 * DELETE endpoint for removing a task
 */

app.delete("/deletetask/:taskId", (req, res) => {
  const taskId = req.params["taskId"];
  Task.findById(taskId, (err, task) => {
    task.remove();
    res.status(200).json({
      message: "Task was removed successfully",
    });
  });
});
