import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { setupNotifications } from "../notificationService";

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8080/user/login",
        form
      );

      const { token, user } = res.data;

      // ✅ Store JWT & User Info
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      // 🔥 Call notification setup (DO NOT use await)
      await setupNotifications();

      alert("Login Successful");

      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition"
          >
            Login
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          Don’t have account?{" "}
          <Link to="/register" className="text-yellow-500 font-semibold">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}