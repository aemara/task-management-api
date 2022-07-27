const mongoose = require("mongoose");
const { Board } = require("./models/board");
const { Column } = require("./models/column");
const { Task } = require("./models/task");
const { Subtask } = require("./models/subtask");

const findBoard = async (boardId) => {
    const board = await Board.findById(boardId);
    return board;
}

const findColumn = async (columnId) => {
    const column = await Column.findById(columnId);
    return column;
}

module.exports.findBoard = findBoard;
module.exports.findColumn = findColumn;