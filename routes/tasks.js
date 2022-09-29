const express = require("express");
const router = express.Router();
const tasksControllers = require('../controllers/tasks');

router.post('/addtask/:columnId', tasksControllers.addTask);
router.get('/gettasks/:columnId', tasksControllers.getTasks);
router.get('/gettask/:taskId', tasksControllers.getTask);
router.put('/updatetask/:taskId', tasksControllers.updateTask);
router.put('/changecolumn/:taskId/:currentColumnId/:newColumnId', tasksControllers.changeColumn);
router.delete('/deletetask/:taskId', tasksControllers.deleteTask);


module.exports = router;