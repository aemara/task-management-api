const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const {findBoard} = require('./services');
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
app.use(bodyParser.urlencoded({extended: false}));

app.post("/addboard", (req, res) => {

    const board = new Board({
        title: req.body.title,
        columns: req.body.columns
    });

    board.save();
    res.status(201).json({
        message: "A board was added successfully."
    })
});

app.post("/addcolumn/:boardId", (req, res) => {
  const boardId = req.params["boardId"];
  const column = new Column({
    title: req.body.title,
    numOfTasks: 0,
    tasks: []
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
