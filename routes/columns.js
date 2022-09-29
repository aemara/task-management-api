const express = require("express");
const router = express.Router();
const columnsController = require('../controllers/columns');

router.post('/addcolumn', columnsController.addColumn);
router.get('/getcolumns', columnsController.getColumns);
router.get('/getcolumn', columnsController.getColumn);


module.exports = router;