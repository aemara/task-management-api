const { Board } = require("./models/board");
const { Column } = require("./models/column");
const { Task } = require("./models/task");
const { Subtask } = require("./models/subtask");
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
