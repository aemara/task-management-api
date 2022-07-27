const express = require("express");
const mongoose = require("mongoose");
const { Board } = require("./models/board");
const { Column } = require("./models/column");
const { Task } = require("./models/task");
const { Subtask } = require("./models/subtask");

const app = express();
const port = 3000;

mongoose
  .connect(
    "mongodb+srv://aemara:IboPx1f7PFeZOZxa@cluster0.tcsvd.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Database is connected."))
  .catch(() => console.log("Connection failed."));

app.get("/", (req, res) => {});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
