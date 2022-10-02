const { Board } = require("../models/board");
const { Column } = require("../models/column");

module.exports = {
  addBoard: async (req, res) => {
    const board = new Board({
      title: req.body.title,
    });
    await board.save();

    if (req.body.columns) {
      for (var column of req.body.columns) {
        const newColumn = new Column({ title: column.title });
        await newColumn.save();
        board.columns.push(newColumn);
      }
    }

    await board.save();
    res.status(200).json({
      message: "A board was added successfully.",
      boardId: board._id,
    });
  },

  getBoards: (req, res) => {
    Board.find().then((boards) => {
      res.status(200).json({
        message: "Boards fetched successfully!",
        boards: boards,
      });
    });
  },

  getBoard: (req, res) => {
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
  },

  updateBoard: async (req, res) => {
    const board = await Board.findById(req.params["id"]);
    /**If there is a new board title */
    if (req.body.title) {
      board.title = req.body.title;
      await board.save();
    }

    for (var column of req.body.columns) {
      if (!column.columnId) {
        const newColumn = new Column({ title: column.columnName });
        await newColumn.save();
        board.columns.push(newColumn);
        await board.save();
      } else {
        const updatedColumn = { title: column.columnName };
        await Column.findByIdAndUpdate(column.columnId, updatedColumn);
      }
    }

    /**If there are columns to be deleted */
    for (var id of req.body.deletedColumns) {
      await Column.findByIdAndRemove(id).exec();
      for (let i = 0; i < board.columns.length; i++) {
        if (board.columns[i].toString() === id) {
          board.columns.splice(i, 1);
        }
      }
    }

    res.status(200).json({
      message: "done",
    });
  },

  deleteBoard: (req, res) => {
    const boardId = req.params["id"];
    Board.findById(boardId, (err, board) => {
      board.remove().then(() => {
        res.status(200).json({
          message: "Board was removed successfully",
        });
      });
    });
  },
};
