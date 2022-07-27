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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/addboard", (req, res) => {
  const board = new Board({
    title: req.body.title,
    columns: req.body.columns,
  });

  board.save();
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
    numOfTasks: 0,
    tasks: [],
  });
  column.save();
  const board = {};

  findBoard(boardId).then((board) => {
    board = board;
    board.columns.push(column);
    board.save();
  });

  res.status(201).json({
    message: "A board was found and a column was added",
  });
});


/**
 * A POST endpoint for adding a task to a column
 */
app.post("/addtask/:columnId", (req, res) => {
  const columnId = req.params["columnId"];
  const column = {};

  const subtasks = [];
  req.body.subtasks.forEach((subtask) => {
    const newSubtask = new Subtask({
      name: subtask.name,
    });
    newSubtask.save();
    subtasks.push(newSubtask);
  });

  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    subtasks: subtasks,
    status: req.body.status,
  });
  task.save();

  findColumn(columnId).then((column) => {
    column = column;
    column.tasks.push(task);
    column.save();
  });

  res.status(201).json({
    message: "A column was found and a task was added",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
