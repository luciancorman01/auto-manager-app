import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        parola: password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (err) {
      if (!err.response) {
        setError(
          "Serverul nu răspunde. Pornește backend-ul: npm run server (din folderul server)."
        );
        return;
      }
      setError(
        err.response?.data?.message || "Email sau parolă greșită."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Log in</h1>
        <p>Log in to your account</p>

        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Log in</button>
        </form>

        <span>
          Don’t have an account? <Link to="/register">Create.</Link>
        </span>
      </div>
    </div>
  );
}

export default Login;
