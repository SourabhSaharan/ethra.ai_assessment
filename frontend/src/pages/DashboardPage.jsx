import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaProjectDiagram,
  FaTasks,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFolderOpen,
} from "react-icons/fa";

import MainLayout from "../layouts/MainLayout";
import StatCard from "../components/StatCard";
import TaskStatusChart from "../components/TaskStatusChart";
import RecentTasks from "../components/RecentTasks";

import { getDashboardData } from "../services/dashboardService";

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const data = await getDashboardData(token);

      setDashboardData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const isEmptyDashboard =
    dashboardData &&
    dashboardData.totalProjects === 0 &&
    dashboardData.totalTasks === 0;

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Team productivity overview
        </p>
      </div>

      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-500" />
          <p className="text-slate-300 font-semibold">
            Loading dashboard...
          </p>
        </div>
      ) : isEmptyDashboard ? (
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.12),_transparent_30%)]" />

          <div className="relative mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500/15 text-4xl text-cyan-400">
              <FaFolderOpen />
            </div>

            <h2 className="text-3xl font-bold">
              Your workspace is ready
            </h2>

            <p className="mt-3 text-slate-400">
              Start by creating your first project and adding tasks to build out your dashboard insights.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/projects"
                className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition-all hover:bg-cyan-400"
              >
                Create Project
              </Link>

              <Link
                to="/tasks"
                className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-semibold text-white transition-all hover:border-cyan-500 hover:text-cyan-300"
              >
                Manage Tasks
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-500">
                  Projects
                </p>
                <p className="mt-2 text-2xl font-bold">
                  0
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-500">
                  Tasks
                </p>
                <p className="mt-2 text-2xl font-bold">
                  0
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-500">
                  Completed
                </p>
                <p className="mt-2 text-2xl font-bold">
                  0
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard
              title="Total Projects"
              value={dashboardData.totalProjects}
              icon={<FaProjectDiagram />}
              color="bg-cyan-500"
            />

            <StatCard
              title="Total Tasks"
              value={dashboardData.totalTasks}
              icon={<FaTasks />}
              color="bg-purple-500"
            />

            <StatCard
              title="Completed Tasks"
              value={dashboardData.completedTasks}
              icon={<FaCheckCircle />}
              color="bg-green-500"
            />

            <StatCard
              title="Overdue Tasks"
              value={dashboardData.overdueTasks}
              icon={<FaExclamationTriangle />}
              color="bg-red-500"
            />
          </div>

          {/* Task Status Chart */}
          <div className="mt-10">
            <TaskStatusChart
              data={dashboardData.taskStatusData}
            />
          </div>

          {/* Recent Tasks */}
          <div className="mt-10">
            <RecentTasks
              tasks={dashboardData.recentTasks}
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default DashboardPage;
