const express = require("express");
const router = express.Router();
const columnsController = require('../controllers/columns');

router.post('/addcolumn/:boardId', columnsController.addColumn);
router.get('/getcolumns/:boardId', columnsController.getColumns);
router.get('/getcolumn/:columnId', columnsController.getColumn);


module.exports = router;