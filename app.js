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

  board.save((err, document) => {
    if (req.body.columns.length > 0) {
      req.body.columns.forEach((column) => {
        const newColumn = new Column({
          title: column.title,
          boardId: document._id,
        });

        newColumn.save();
      });
    }
  });
  res.status(201).json({
    message: "A board was added successfully.",
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
    boardId: boardId,
  });
  column.save();

  res.status(201).json({
    message: "A board was found and a column was added",
  });
});

/**
 * A POST endpoint for adding a task to a column
 */
app.post("/addtask/:columnName/:columnId", (req, res) => {
  const columnId = req.params["columnId"];
  const columnName = req.params["columnName"];

  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    column: columnName,
    columnId: columnId,
    done: false,
  });

  task.save((err, document) => {
    if (req.body.subtasks.length > 0) {
      req.body.subtasks.forEach((subtask) => {
        const newSubtask = new Subtask({
          name: subtask.name,
          taskId: document._id,
          columnId: columnId,
          done: false,
        });
        newSubtask.save();
      });
    }
  });

  res.status(200).json({
    message: "A column was found and a task was added",
  });
});

/**
 * GET endpoint for fetching all boards
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
 */
app.get("/board/:id", (req, res) => {
  if (req.params["id"] === "-1") {
    Board.find()
      .sort({ _id: -1 })
      .limit(1)
      .then((board) => {
        res.status(200).json({
          message: "Board was fetched successfully",
          board: board,
        });
      });
  } else {
    Board.findById(req.params["id"], (err, board) => {
      res.status(200).json({
        message: "Board was fetched successfully",
        board: board,
      });
    });
  }
});

/**
 * PUT endpoint for updating a board
 */

app.put("/editboard/:id", (req, res) => {
  const updatedBoard = {
    title: req.body.title,
  };

  const columns = req.body.columns;
  const deletedColumnsIds = req.body.deletedColumns;
  Board.updateOne({ _id: req.params["id"] }, updatedBoard, (err, result) => {
    if (result.acknowledged) {
      columns.forEach((column) => {
        const updatedColumn = { title: column.name };
        Column.updateOne(
          { _id: column.columnId },
          updatedColumn,
          (err, result) => {}
        );
      });

      if (deletedColumnsIds.length > 0) {
        deletedColumnsIds.forEach((id) => {
          Column.findOneAndDelete({ _id: id }, function (err, column) {});
          Task.find({ columnId: id }, (err, tasks) => {
            tasks.forEach((task) => task.remove());
          });
          Subtask.find({ columnId: id }, (err, subtasks) => {
            subtasks.forEach((subtask) => subtask.remove());
          });
        });
      }

      res.status(200).json({
        message: "Board was updated successfully",
      });
    }
  });
});

/**
 * PUT endpoint to update a task
 */

app.put("/edittask/:id", (req, res) => {
  const columnId = req.body.columnId;
  const taskId = req.params["id"];
  /**
   * Finding column name to add it to updatedTask
   */
  let columnName;
  Column.findById(columnId, (err, column) => {
    columnName = column.title;
  });

  const updatedTask = {
    title: req.body.title,
    description: req.body.description,
    column: columnName,
  };

  const subtasks = req.body.subtasks;
  const deletedSubtasksIds = req.body.deletedSubtasks;

  Task.updateOne({ _id: taskId }, updatedTask, (err, result) => {
    if (result.acknowledged) {
      subtasks.forEach((subtask) => {
        const updatedSubtask = {
          name: subtask.name,
          taskId: taskId,
          columnId: columnId,
          done: subtask.done,
        };
        Subtask.findOneAndUpdate(
          { _id: subtask.subtaskId },
          updatedSubtask,
          { upsert: true },
          (result) => {}
        );
      });
    }

    if (deletedSubtasksIds.length > 0) {
      deletedSubtasksIds.forEach((id) => {
        Subtask.findOneAndDelete({ _id: id }, function (err, subtask) {});
      });
    }
  });

  res.status(200).json({
    message: "Task was editing successfully",
  });
});

/**
 * PUT endpoint for toggling the 'done' status of a subtask
 */

app.put("/toggledone/:id", (req, res) => {
  const subtaskId = req.params["id"];
  Subtask.findOne({ _id: subtaskId }, (err, subtask) => {
    if (subtask.done) {
      subtask.done = false;
    } else {
      subtask.done = true;
    }
    subtask.save();

    res.status(200).json({
      message: "Toggle was successful",
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
