const prisma = require("../config/prisma");

const getDashboardData = async (req, res) => {
  try {
    const totalProjects = await prisma.project.count();

    const totalTasks = await prisma.task.count();

    const completedTasks = await prisma.task.count({
      where: {
        status: "DONE",
      },
    });

    const pendingTasks = await prisma.task.count({
      where: {
        status: {
          in: ["TODO", "IN_PROGRESS", "REVIEW"],
        },
      },
    });

    const overdueTasks = await prisma.task.count({
      where: {
        dueDate: {
          lt: new Date(),
        },
        status: {
          not: "DONE",
        },
      },
    });

    const recentTasks = await prisma.task.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },

      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const taskStatusData = {
      todo: await prisma.task.count({
        where: {
          status: "TODO",
        },
      }),

      inProgress: await prisma.task.count({
        where: {
          status: "IN_PROGRESS",
        },
      }),

      review: await prisma.task.count({
        where: {
          status: "REVIEW",
        },
      }),

      done: await prisma.task.count({
        where: {
          status: "DONE",
        },
      }),
    };

    res.status(200).json({
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      taskStatusData,
      recentTasks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getDashboardData,
};