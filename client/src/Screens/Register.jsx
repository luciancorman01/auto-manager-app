import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <h1>Register</h1>
        <p>Create a new account</p>

        <form className="auth-form">
          <input type="email" placeholder="Enter your email address" />
          <input type="password" placeholder="Create a password" />
          <input type="password" placeholder="Confirm your password" />

          <button type="submit">Register</button>
        </form>

        <span>
          Already have an account? <Link to="/login">Log in.</Link>
        </span>
      </div>
    </div>
  );
}

export default Register;