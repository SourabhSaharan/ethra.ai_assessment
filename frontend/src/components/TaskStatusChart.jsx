import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#06b6d4", "#8b5cf6", "#f59e0b", "#22c55e"];

function TaskStatusChart({ data }) {
  const chartData = [
    { name: "TODO", value: data?.todo || 0 },
    { name: "IN_PROGRESS", value: data?.inProgress || 0 },
    { name: "REVIEW", value: data?.review || 0 },
    { name: "DONE", value: data?.done || 0 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">Task Status Distribution</h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" outerRadius={120} label>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TaskStatusChart;