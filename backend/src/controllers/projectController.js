const prisma = require("../config/prisma");

const createProject = async (req, res) => {
  try {
    const { name, description, deadline } = req.body;

    // validations
    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    // create project
    const project = await prisma.project.create({
      data: {
        name,
        description,
        deadline: deadline ? new Date(deadline) : null,
        createdById: req.user.id,
      },
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },

        tasks: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      projects,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const addMemberToProject = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    // validations
    if (!projectId || !userId) {
      return res.status(400).json({
        message: "Project ID and User ID are required",
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

    // check user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // check already member
    const existingMember = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId,
      },
    });

    if (existingMember) {
      return res.status(400).json({
        message: "User already added to project",
      });
    }

    // add member
    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId,
      },
    });

    res.status(201).json({
      message: "Member added successfully",
      member,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  addMemberToProject,
};