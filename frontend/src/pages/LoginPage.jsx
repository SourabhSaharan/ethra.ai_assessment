import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Toast from "../components/Toast";
import { loginUser } from "../services/authService";
import useToast from "../utils/useToast";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { toast, showToast, clearToast } =
    useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      showToast(
        error.response?.data?.message ||
          "Login failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      <Toast
        toast={toast}
        onClose={clearToast}
      />

      {/* Left Side */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-cyan-500 to-purple-600">
        <div className="max-w-md text-center px-10">
          <h1 className="text-6xl font-bold mb-6">
            Ethra.ai
          </h1>

          <p className="text-xl text-white/90 leading-relaxed">
            Manage projects, collaborate with teams,
            and track productivity with a modern
            workflow platform.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl">
          <h2 className="text-4xl font-bold mb-3">
            Welcome Back
          </h2>

          <p className="text-slate-400 mb-8">
            Login to continue managing your team.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block mb-2 text-sm text-slate-400">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-400">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 transition-all py-3 rounded-xl font-bold text-lg"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-slate-400 text-center mt-6">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-cyan-400 hover:text-cyan-300"
            >
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
