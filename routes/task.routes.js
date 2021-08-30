const router = require("express").Router();
const auth = require("../middleware/auth");
const taskController = require("../controllers/task.controller");

// CREATE A NEW TASK
router.post("/", auth, taskController.addTask);

// GET TASK BY ID
router.get("/:taskId/:username", auth, taskController.getTaskById);

// ADD MARKS TO A TASK OF A STUDENT
router.post("/marks", auth, taskController.updateMarks);

// SUBMIT A TASK 
router.post("/submit", auth, taskController.submitTask);

// GET TASKS OF A USER
router.get("/:username", auth, taskController.getTasksByUser);

module.exports = router;