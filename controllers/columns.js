const { Board } = require("../models/board");
const { Column } = require("../models/column");

module.exports = {
  addColumn: async (req, res) => {
    const boardId = req.params["boardId"];
    const column = new Column({
      title: req.body.title,
    });

    const board = await Board.findById(boardId);
    const savedColumn = await column.save();
    board.columns.push(savedColumn);
    await board.save();
    res.status(200).json({
      message: "A board was found and a column was added",
    });
  },

  getColumns: async (req, res) => {
    try {
      const board = await Board.findById(req.params["boardId"]).populate({
        path: "columns",
      });
      res.status(200).json({
        boardTitle: board.title,
        columns: board.columns,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: "An error occured",
      });
    }
  },

  getColumn: (req, res) => {
    Column.find({ _id: req.params["columnId"] }).then((column) => {
      res.status(200).json({
        message: "Column fetched successfully",
        column: column,
      });
    });
  },
};
