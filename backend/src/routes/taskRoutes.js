const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createTask,
  updateTaskStatus,
  getTasks,
  deleteTask,
  editTask,
} = require("../controllers/taskController");

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createTask
);

router.patch(
  "/:taskId/status",
  authMiddleware,
  updateTaskStatus
);

router.get(
  "/",
  authMiddleware,
  getTasks
);

router.delete(
  "/:taskId",
  authMiddleware,
  deleteTask
);

router.put(
  "/:taskId",
  authMiddleware,
  editTask
);

module.exports = router;