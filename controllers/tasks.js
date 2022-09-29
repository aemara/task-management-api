const { Column } = require("../models/column");
const { Task } = require("../models/task");
const { Subtask } = require("../models/subtask");

module.exports = {
  addTask: async (req, res) => {
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
    const column = await Column.findById(columnId);
    column.tasks.push(task);
    await column.save();
    res.status(200).json({
      message: "A column was found and a task was added",
    });
  },

  getTasks: (req, res) => {
    Task.find({ columnId: req.params["columnId"] }).then((tasks) => {
      res.status(200).json({
        message: "Tasks fetched successfully",
        tasks: tasks,
      });
    });
  },

  getTask: (req, res) => {
    Task.find({ _id: req.params["taskId"] }).then((doc) => {
      res.status(200).json({
        task: doc,
      });
    });
  },

  updateTask: async (req, res) => {
    const taskId = req.params["taskId"];
    const task = await Task.findById(taskId);
    task.title = req.body.newTitle;
    task.description = req.body.newDescription;
    task.subtasks = req.body.newSubtasks;
    await task.save();

    if (req.body.newColumnId) {
      /**Remove the task from its current column*/
      const oldColumn = await Column.findOne({ _id: req.body.currentColumnId })
        .populate({ path: "tasks" })
        .exec();
      const filteredTasks = oldColumn.tasks.filter(function (task, index, arr) {
        return task._id != taskId;
      });
      oldColumn.tasks = filteredTasks;
      await oldColumn.save();

      /**Now we add the task to its new column */
      const task = await Task.findOne({ _id: taskId });
      const newColumn = await Column.findOne({ _id: req.body.newColumnId });
      newColumn.tasks.push(task);
      await newColumn.save();
    }

    res.status(200).json({
      message: "Task updated successfully",
    });
  },

  changeColumn: (req, res) => {
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
        column.save().then(() => {
          /**Now we add the task to its new column */
          Task.findOne({ _id: taskId }, (err, task) => {
            Column.findOne({ _id: newColumnId }, (err, column) => {
              column.tasks.push(task);
              column.save().then(() => {
                res.status(200).json({
                  message: "update was successful",
                });
              });
            });
          });
        });
      });
  },

  deleteTask: (req, res) => {
    const taskId = req.params["taskId"];
    Task.findById(taskId, (err, task) => {
      task.remove().then(() => {
        res.status(200).json({
          message: "Task was removed successfully",
        });
      });
    });
  },
};
