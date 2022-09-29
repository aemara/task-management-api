const express = require("express");
const router = express.Router();
const subtasksController = require("../controllers/subtasks");

router.get("/getsubtasks/:taskId", subtasksController.getSubtasks);
router.put("/toggledone/:subtaskId/:taskId", subtasksController.toggleDone);

module.exports = router;
