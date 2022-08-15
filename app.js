const cors = require('cors');
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


/**
 * GET endpoint for fetching all boards
 */
app.get('/boards', (req, res, next) => {
    Board.find().then(boards => {
       res.status(200).json({
        message: "Boards fetched successfully!",
        boards: boards,
       })
    })
})


/**
 * GET endpoint for fetching a board with a specific id 
 */
app.get('/board/:id', (req, res) => {
    if(req.params['id'] === '-1') {
        Board.find().sort({ _id: -1 }).limit(1).then(board  => {
            res.status(200).json({
                message: "Board was fetched successfully",
                board: board,
            })
        })
    } else {
      Board.findById(req.params['id'], (err, board) => {
        res.status(200).json({
          message: "Board was fetched successfully",
          board: board
        })
      })
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


