import { useEffect, useState } from "react";

import Toast from "../components/Toast";
import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import useToast from "../utils/useToast";

import {
    getProjects,
    createProject,
} from "../services/projectService";

function ProjectsPage() {
    const [projects, setProjects] = useState([]);

    const [showModal, setShowModal] =
        useState(false);

    const [loading, setLoading] = useState(false);

    const [projectName, setProjectName] =
        useState("");
    const { toast, showToast, clearToast } =
        useToast();

    useEffect(() => {
        fetchProjects();
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

    const handleCreateProject = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            await createProject(
                {
                    name: projectName,
                },
                token
            );

            setProjectName("");

            setShowModal(false);

            fetchProjects();
            showToast(
                "Project created successfully"
            );
        } catch (error) {
            console.log(error);

            showToast(
                error.response?.data?.message ||
                    "Failed to create project",
                "error"
            );
        } finally {
            setLoading(false);
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
                        Projects
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Manage all team projects
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-cyan-500 hover:bg-cyan-400 transition-all px-5 py-3 rounded-xl font-semibold"
                >
                    + Create Project
                </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <motion.div
                        key={project.id}
                        whileHover={{
                            y: -5,
                        }}
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.3,
                        }}

                        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">
                                {project.name}
                            </h2>

                            <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm">
                                Active
                            </span>
                        </div>

                        <p className="text-slate-400 mb-6">
                            {project.description ||
                                "No description provided"}
                        </p>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">
                                    Tasks
                                </p>

                                <h3 className="text-xl font-bold">
                                    {project.tasks?.length || 0}
                                </h3>
                            </div>

                            <div>
                                <p className="text-slate-400 text-sm">
                                    Members
                                </p>

                                <h3 className="text-xl font-bold">
                                    {project.members?.length || 0}
                                </h3>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md">
                        <h2 className="text-3xl font-bold mb-6">
                            Create Project
                        </h2>

                        <input
                            type="text"
                            placeholder="Project Name"
                            value={projectName}
                            onChange={(e) =>
                                setProjectName(e.target.value)
                            }
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 mb-6"
                        />

                        <div className="flex gap-4">
                            <button
                                onClick={handleCreateProject}
                                disabled={loading}
                                className="flex-1 bg-cyan-500 hover:bg-cyan-400 transition-all py-3 rounded-xl font-semibold"
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create"}
                            </button>

                            <button
                                onClick={() =>
                                    setShowModal(false)
                                }
                                className="flex-1 bg-slate-700 hover:bg-slate-600 transition-all py-3 rounded-xl font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

export default ProjectsPage;
