import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      toast.success("Logged in");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="page-card" style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputContainer}>
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputContainer}>
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.link}>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    maxWidth: 400,
    margin: "40px auto",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#4f46e5",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 4,
    borderRadius: "4px",
    border: "1px solid #e5e7eb",
    outline: "none",
    transition: "border-color 0.3s",
  },
  button: {
    padding: "10px 12px",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
    transition: "background-color 0.3s",
  },
  link: {
    marginTop: 12,
    textAlign: "center",
  },
};

export default LoginPage;
