const { Board } = require("../models/board");
const { Column } = require("../models/column");

module.exports = {
  addBoard: (req, res) => {
    const board = new Board({
      title: req.body.title,
    });

    if (req.body.columns) {
      req.body.columns.forEach((column) => {
        const newColumn = new Column({ title: column.title });
        newColumn.save().then((savedCol) => {
          board.columns.push(savedCol);
        });
      });
    }

    board.save((err, document) => {
      res.status(200).json({
        message: "A board was added successfully.",
        boardId: document._id,
      });
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
    /**If there is a new board title */
    if (req.body.title) {
      const updatedBoard = { title: req.body.title };
      await Board.findByIdAndUpdate(req.params["id"], updatedBoard).exec();
    }

    for (var column of req.body.columns) {
      console.log(`beginning of iteration`);
      if (!column.columnId) {
        const newColumn = new Column({ title: column.columnName });
        await newColumn.save();
        const board = await Board.findById(req.params["id"]);
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
