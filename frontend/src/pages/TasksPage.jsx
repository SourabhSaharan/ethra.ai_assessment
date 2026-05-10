import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import Toast from "../components/Toast";
import useToast from "../utils/useToast";

import { getProjects } from "../services/projectService";
import { motion } from "framer-motion";

import {
    createTask,
    getTasks,
    updateTaskStatus,
    deleteTask,
    editTask,
} from "../services/taskService";

function TasksPage() {
    const [projects, setProjects] = useState([]);

    const [showModal, setShowModal] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [tasksLoading, setTasksLoading] =
        useState(true);
    const [editLoading, setEditLoading] =
        useState(false);

    const [tasks, setTasks] = useState([]);

    const [editModal, setEditModal] =
        useState(false);

    const [selectedTask, setSelectedTask] =
        useState(null);

    const [editData, setEditData] =
        useState({
            title: "",
            description: "",
            priority: "MEDIUM",
        });

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "MEDIUM",
        projectId: "",
    });
    const { toast, showToast, clearToast } =
        useToast();

    useEffect(() => {
        fetchProjects();
        fetchTasks();
    }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("token");

            const data = await getProjects(token);

            setProjects(data.projects || []);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchTasks = async () => {
        try {
            setTasksLoading(true);
            const token = localStorage.getItem("token");

            const data = await getTasks(token);

            setTasks(data.tasks || []);
        } catch (error) {
            console.log(error);
            showToast(
                "Failed to load tasks",
                "error"
            );
        } finally {
            setTasksLoading(false);
        }
    };

    const handleStatusChange = async (
        taskId,
        status
    ) => {
        try {
            const token = localStorage.getItem("token");

            await updateTaskStatus(
                taskId,
                status,
                token
            );

            fetchTasks();
        } catch (error) {
            console.log(error);

            showToast(
                error.response?.data?.message ||
                    "Failed to update status",
                "error"
            );
        }
    };

    const handleDeleteTask = async (
        taskId
    ) => {
        try {
            const confirmed = window.confirm(
                "Are you sure you want to delete this task?"
            );

            if (!confirmed) return;

            const token = localStorage.getItem("token");

            await deleteTask(taskId, token);

            fetchTasks();
            showToast(
                "Task deleted successfully"
            );
        } catch (error) {
            console.log(error);

            showToast(
                error.response?.data?.message ||
                    "Failed to delete task",
                "error"
            );
        }
    };

    const openEditModal = (task) => {
        setSelectedTask(task);

        setEditData({
            title: task.title || "",
            description:
                task.description || "",
            priority: task.priority || "MEDIUM",
        });

        setEditModal(true);
    };

    const handleEditTask = async () => {
        try {
            setEditLoading(true);
            const token =
                localStorage.getItem("token");

            await editTask(
                selectedTask.id,
                editData,
                token
            );

            setEditModal(false);
            setSelectedTask(null);

            fetchTasks();
            showToast(
                "Task updated successfully"
            );
        } catch (error) {
            console.log(error);

            showToast(
                error.response?.data?.message ||
                    "Failed to edit task",
                "error"
            );
        } finally {
            setEditLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCreateTask = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            await createTask(
                formData,
                token
            );

            fetchTasks();

            setFormData({
                title: "",
                description: "",
                priority: "MEDIUM",
                projectId: "",
            });

            setShowModal(false);
            showToast(
                "Task created successfully"
            );
        } catch (error) {
            console.log(error);

            showToast(
                error.response?.data?.message ||
                    "Failed to create task",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "URGENT":
                return "bg-red-500";

            case "HIGH":
                return "bg-orange-500";

            case "MEDIUM":
                return "bg-yellow-500";

            default:
                return "bg-cyan-500";
        }
    };

    return (
        <MainLayout>
            <Toast
                toast={toast}
                onClose={clearToast}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold">
                        Tasks
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Manage and track team tasks
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-cyan-500 hover:bg-cyan-400 transition-all px-5 py-3 rounded-xl font-semibold"
                >
                    + Create Task
                </button>
            </div>

            {/* Kanban Board */}
            {tasksLoading ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-500" />

                    <p className="text-slate-300 font-semibold">
                        Loading tasks...
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                    "TODO",
                    "IN_PROGRESS",
                    "REVIEW",
                    "DONE",
                ].map((status) => (
                    <div
                        key={status}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 min-h-[500px]"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">
                                {status.replace("_", " ")}
                            </h2>

                            <span className="bg-cyan-500 text-black text-sm px-3 py-1 rounded-full font-bold">
                                {
                                    tasks.filter(
                                        (task) =>
                                            task.status === status
                                    ).length
                                }
                            </span>
                        </div>


                        <div className="space-y-4">
                            {tasks.filter(
                                (task) =>
                                    task.status === status
                            ).length === 0 ? (
                                <div className="border border-dashed border-slate-700 rounded-xl p-6 text-center text-slate-500">
                                    <p className="text-sm">
                                        No tasks available
                                    </p>
                                </div>
                            ) : (
                                tasks
                                    .filter(
                                        (task) =>
                                            task.status === status
                                    )
                                    .map((task) => (
                                        <motion.div
                                            key={task.id}
                                            whileHover={{
                                                scale: 1.02,
                                            }}
                                            initial={{
                                                opacity: 0,
                                                y: 10,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            transition={{
                                                duration: 0.2,
                                            }}

                                            className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-cyan-500 transition-all"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-bold text-lg">
                                                    {task.title}
                                                </h3>

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(
                                                        task.priority
                                                    )}`}
                                                >
                                                    {task.priority}
                                                </span>
                                            </div>

                                            <p className="text-slate-400 text-sm mb-4">
                                                {task.description}
                                            </p>


                                            <div className="flex items-center justify-between gap-3">
                                                <select
                                                    value={task.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            task.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm outline-none"
                                                >
                                                    <option value="TODO">
                                                        TODO
                                                    </option>

                                                    <option value="IN_PROGRESS">
                                                        IN PROGRESS
                                                    </option>

                                                    <option value="REVIEW">
                                                        REVIEW
                                                    </option>

                                                    <option value="DONE">
                                                        DONE
                                                    </option>

                                                    <option value="OVERDUE">
                                                        OVERDUE
                                                    </option>
                                                </select>

                                                <button
                                                    onClick={() =>
                                                        openEditModal(task)
                                                    }
                                                    className="bg-yellow-500 hover:bg-yellow-400 transition-all px-3 py-2 rounded-lg text-sm font-semibold"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDeleteTask(task.id)
                                                    }
                                                    className="bg-red-500 hover:bg-red-400 transition-all px-3 py-2 rounded-lg text-sm font-semibold"
                                                >
                                                    Delete
                                                </button>

                                                <span className="text-xs text-slate-400">
                                                    {task.project?.name}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))
                            )}
                        </div>
                    </div>
                ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                    onClick={() => {
                        setShowModal(false);
                        setFormData({
                            title: "",
                            description: "",
                            priority: "MEDIUM",
                            projectId: "",
                        });
                    }}
                >
                    <div
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-lg"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        <h2 className="text-3xl font-bold mb-6">
                            Create Task
                        </h2>

                        <div className="space-y-5">
                            <input
                                type="text"
                                name="title"
                                placeholder="Task Title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                            />

                            <textarea
                                name="description"
                                placeholder="Task Description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                            />

                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                            >
                                <option value="LOW">
                                    LOW
                                </option>

                                <option value="MEDIUM">
                                    MEDIUM
                                </option>

                                <option value="HIGH">
                                    HIGH
                                </option>

                                <option value="URGENT">
                                    URGENT
                                </option>
                            </select>

                            <select
                                name="projectId"
                                value={formData.projectId}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                            >
                                <option value="">
                                    Select Project
                                </option>

                                {projects.map((project) => (
                                    <option
                                        key={project.id}
                                        value={project.id}
                                    >
                                        {project.name}
                                    </option>
                                ))}
                            </select>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleCreateTask}
                                    disabled={loading}
                                    className="flex-1 bg-cyan-500 hover:bg-cyan-400 transition-all py-3 rounded-xl font-semibold"
                                >
                                    {loading
                                        ? "Creating..."
                                        : "Create"}
                                </button>

                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setFormData({
                                            title: "",
                                            description: "",
                                            priority: "MEDIUM",
                                            projectId: "",
                                        });
                                    }}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 transition-all py-3 rounded-xl font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModal && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                    onClick={() => {
                        setEditModal(false);
                        setSelectedTask(null);
                    }}
                >
                    <div
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-lg"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        <h2 className="text-3xl font-bold mb-6">
                            Edit Task
                        </h2>

                        <div className="space-y-5">
                            <input
                                type="text"
                                value={editData.title}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        title:
                                            e.target.value,
                                    })
                                }
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                            />

                            <textarea
                                value={editData.description}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        description:
                                            e.target.value,
                                    })
                                }
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                            />

                            <select
                                value={editData.priority}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        priority:
                                            e.target.value,
                                    })
                                }
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                            >
                                <option value="LOW">
                                    LOW
                                </option>

                                <option value="MEDIUM">
                                    MEDIUM
                                </option>

                                <option value="HIGH">
                                    HIGH
                                </option>

                                <option value="URGENT">
                                    URGENT
                                </option>
                            </select>

                            <div className="flex gap-4">
                                <button
                                    onClick={
                                        handleEditTask
                                    }
                                    disabled={editLoading}
                                    className="flex-1 bg-yellow-500 hover:bg-yellow-400 transition-all py-3 rounded-xl font-semibold"
                                >
                                    {editLoading
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                                <button
                                    onClick={() => {
                                        setEditModal(false);
                                        setSelectedTask(
                                            null
                                        );
                                    }}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 transition-all py-3 rounded-xl font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

export default TasksPage;
