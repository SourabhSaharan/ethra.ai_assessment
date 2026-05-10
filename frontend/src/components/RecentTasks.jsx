function RecentTasks({ tasks }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">
        Recent Tasks
      </h2>

      <div className="flex flex-col gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-slate-800 rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold text-lg">
                {task.title}
              </h3>

              <p className="text-slate-400 text-sm mt-1">
                Project: {task.project?.name}
              </p>

              <p className="text-slate-400 text-sm">
                Assigned to:{" "}
                {task.assignedTo?.name || "Unassigned"}
              </p>
            </div>

            <div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  task.status === "DONE"
                    ? "bg-green-500"
                    : task.status === "IN_PROGRESS"
                    ? "bg-yellow-500"
                    : task.status === "REVIEW"
                    ? "bg-purple-500"
                    : "bg-cyan-500"
                }`}
              >
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentTasks;