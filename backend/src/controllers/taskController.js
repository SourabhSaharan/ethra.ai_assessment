const prisma = require("../config/prisma");

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      projectId,
      assignedToId,
    } = req.body;

    // validations
    if (!title || !projectId) {
      return res.status(400).json({
        message: "Title and Project ID are required",
      });
    }

    // check project exists
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // check assigned user exists
    if (assignedToId) {
      const user = await prisma.user.findUnique({
        where: {
          id: assignedToId,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "Assigned user not found",
        });
      }
    }

    // create task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assignedToId,
        createdById: req.user.id,
      },
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const validStatuses = ["TODO", "IN_PROGRESS", "REVIEW", "DONE", "OVERDUE"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const isAdmin = req.user.role === "ADMIN";
    const isAssignedUser = task.assignedToId === req.user.id;

    if (!isAdmin && !isAssignedUser) {
      return res.status(403).json({
        message: "You are not allowed to update this task",
      });
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        status,
        completedAt: status === "DONE" ? new Date() : null,
      },
    });

    res.status(200).json({
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        project: true,
      },
    });
    res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const isAdmin = req.user.role === "ADMIN";
    const isAssignedUser = task.assignedToId === req.user.id;

    if (!isAdmin && !isAssignedUser) {
      return res.status(403).json({
        message: "You are not allowed to delete this task",
      });
    }

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const editTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const {
      title,
      description,
      priority,
    } = req.body;

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const isAdmin = req.user.role === "ADMIN";
    const isAssignedUser = task.assignedToId === req.user.id;

    if (!isAdmin && !isAssignedUser) {
      return res.status(403).json({
        message: "You are not allowed to edit this task",
      });
    }

    const updatedTask =
      await prisma.task.update({
        where: {
          id: taskId,
        },

        data: {
          title,
          description,
          priority,
        },
      });

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createTask,
  updateTaskStatus,
  getTasks,
  deleteTask,
  editTask,
};

