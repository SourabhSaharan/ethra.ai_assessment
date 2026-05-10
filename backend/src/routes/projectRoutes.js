const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();
const {
  createProject,
  getProjects,
  addMemberToProject,
} = require("../controllers/projectController");

router.post(
  "/create",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createProject
);

router.get("/", authMiddleware, getProjects);

router.post(
  "/add-member",
  authMiddleware,
  roleMiddleware("ADMIN"),
  addMemberToProject
);
module.exports = router;