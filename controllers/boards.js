const { Board } = require("./models/board");
const { Column } = require("./models/column");
const { Task } = require("./models/task");
const { Subtask } = require("./models/subtask");

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
        populate: { path: "tasks" },
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
        populate: { path: "tasks" },
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
 * DELETE endpoint for removing a board
 */

app.delete("/deleteboard/:boardId", (req, res) => {
  const boardId = req.params["boardId"];
  Board.findById(boardId, (err, board) => {
    board.remove();
    res.status(200).json({
      message: "Board was removed successfully",
    });
  });
});
