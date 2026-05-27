import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useUser } from "../context/UserContext";

function Register() {
  const [numeComplet, setNumeComplet] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { refreshUser } = useUser();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Parolele nu coincid.");
      return;
    }
    if (password.length < 6) {
      setError("Parola trebuie să aibă minim 6 caractere.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        nume_complet: numeComplet,
        email,
        parola: password,
      });

      localStorage.setItem("token", response.data.token);
      await refreshUser();
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Eroare la înregistrare.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <h1>Register</h1>
        <p>Create a new account</p>

        <form className="auth-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full name"
            value={numeComplet}
            onChange={(e) => setNumeComplet(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Se creează contul..." : "Register"}
          </button>
        </form>

        <span>
          Already have an account? <Link to="/login">Log in.</Link>
        </span>
      </div>
    </div>
  );
}

export default Register;
