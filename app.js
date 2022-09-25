const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { findBoard } = require("./services");
const { findColumn } = require("./services");
const { Board } = require("./models/board");
const { Column } = require("./models/column");
const { Task } = require("./models/task");
const { Subtask } = require("./models/subtask");

const app = express();
const port = 3000;

mongoose
  .connect(
    "mongodb+srv://aemara:IboPx1f7PFeZOZxa@cluster0.tcsvd.mongodb.net/task-managment?retryWrites=true&w=majority"
  )
  .then(() => console.log("Database is connected."))
  .catch(() => console.log("Connection failed."));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 *
 * A POST endpoint for adding a board
 */
app.post("/addboard", (req, res) => {
  const board = new Board({
    title: req.body.title,
  });

  if (req.body.columns) {
    req.body.columns.forEach((column) => {
      const newColumn = new Column({ title: column.title });
      newColumn.save();
      board.columns.push(newColumn);
    });
  }

  board.save((err, document) => {
    res.status(200).json({
      message: "A board was added successfully.",
      boardId: document._id,
    });
  });
});

/**
 *
 * A POST endpoint for adding a column to a board
 */
app.post("/addcolumn/:boardId", (req, res) => {
  const boardId = req.params["boardId"];
  const column = new Column({
    title: req.body.title,
  });

  Board.findById(boardId, (err, board) => {
    column.save();
    board.columns.push(column);
    board.save();
    res.status(201).json({
      message: "A board was found and a column was added",
    });
  });
});

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
 * GET endpoint for fetching all boards.
 *
 * This endpoint returns only the titles of the boards
 */
app.get("/boards", (req, res, next) => {
  Board.find().then((boards) => {
    res.status(200).json({
      message: "Boards fetched successfully!",
      boards: boards,
    });
  });
});

/**
 * GET endpoint for fetching a board with a specific id
 *
 * This endpoint returns a board document populated with its columns documents, its tasks, and its subtasks.
 */
app.get("/board/:id", (req, res) => {
  if (req.params["id"] === "-1") {
    /**The following statement returns the last added board */
    Board.find()
      .sort({ _id: -1 })
      .limit(1)
      .populate({
        path: "columns",
        populate: { path: "tasks", populate: { path: "subtasks" } },
      })
      .exec((err, board) => {
        res.status(200).json({
          message: "Board was fetched successfully",
          board: board,
        });
      });
  } else {
    /**Recursively populating the Board document */
    Board.findById(req.params["id"])
      .populate({
        path: "columns",
        populate: { path: "tasks", populate: { path: "subtasks" } },
      })
      .exec((err, board) => {
        res.status(200).json({
          message: "Board was fetched successfully",
          board: board,
        });
      });
  }
});

/**
 * GET endpoint for fetching the columns of a board
 */

app.get("/columns/:boardId", (req, res) => {
  Board.findById(req.params["boardId"])
    .populate({
      path: "columns",
    })
    .exec((err, board) => {
      res.status(200).json({
        boardTitle: board.title,
        columns: board.columns,
      });
    });
});

/**
 * GET endpoint for fetching a column
 */

app.get("/column/:columnId", (req, res) => {
  Column.find({ _id: req.params["columnId"] }).then((column) => {
    res.status(200).json({
      message: "Column fetched successfully",
      column: column,
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
 * GET endpoint for fetching subtasks of a task
 */

app.get("/subtasks/:taskId", (req, res) => {
  Subtask.find({ taskId: req.params["taskId"] }).then((subtasks) => {
    res.status(200).json({
      message: "Subtasks fetched successfully",
      subtasks: subtasks,
    });
  });
});

/**
 * PUT endpoint for updating a board
 */

app.put("/editboard/:id", (req, res) => {
  /**If there is a new board title */
  if (req.body.title) {
    console.log(req.body.title);
    const updatedBoard = { title: req.body.title };
    Board.findByIdAndUpdate(req.params["id"], updatedBoard).exec();
  }

  req.body.columns.forEach((column) => {
    if (!column.columnId) {
      const newColumn = new Column({ title: column.columnName });
      newColumn.save();
      Board.findById(req.params["id"], (err, board) => {
        board.columns.push(newColumn);
        board.save();
      });
    } else {
      const updatedColumn = { title: column.columnName };
      Column.findByIdAndUpdate(column.columnId, updatedColumn);
    }
  });

  /**If there are columns to be deleted */
  if (req.body.deletedColumns) {
    req.body.deletedColumns.forEach((id) => {
      Column.findByIdAndDelete(id).exec();
    });
  }

  res.status(200).json({
    message: "done",
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
            column.save();
          });
        });
      });
  }
  res.status(200).json({
    message: "Task updated successfully",
  });
});

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
 * DELETE endpoint for removing a board
 */

app.delete("/removeboard/:boardId", (req, res) => {
  const boardId = req.params["boardId"];
  Board.findById(boardId, (err, board) => {
    board.remove();
    res.status(200).json({
      message: "Board was removed successfully",
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
