const express = require("express");
const router = express.Router();
const boardsController = require('../controllers/boards');

router.get('/getboards', boardsController.getBoards);
router.get('/getboard/:id', boardsController.getBoard);
router.post('/addboard', boardsController.addBoard);
router.put('/updateboard/:id', boardsController.updateBoard);
router.delete('/deleteboard/:id', boardsController.deleteBoard);


module.exports = router;