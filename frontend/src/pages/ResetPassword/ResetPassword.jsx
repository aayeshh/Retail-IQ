import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import PageLayout from "../../components/PageLayout/PageLayout";

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ text: "", type: "" });

  function onReset() {
    if (!password || !confirmPassword) {
      setStatus({ text: "Both fields are required.", type: "error" });
      return;
    }
    if (password.length < 6 || password.length > 14) {
      setStatus({ text: "Password must be between 6 and 14 characters.", type: "error" });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ text: "Passwords do not match.", type: "error" });
      return;
    }

    // Mock success - in a real app this would call an API
    setStatus({ text: "Password reset successful! Redirecting to login...", type: "success" });
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }

  return (
    <PageLayout showSidebar={false} contentClassName="reset-page">
      <div className="reset-container">
        <h1>Reset <span>Password</span></h1>
        <p className="subtitle">Enter your new password below.</p>
        
        <label>New Password</label>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {status.text && <p className={`toast ${status.type}`}>{status.text}</p>}

        <button onClick={onReset}>Reset Password</button>
        <button className="back-btn" onClick={() => navigate("/login")}>Back to Login</button>
      </div>
    </PageLayout>
  );
}

export default ResetPassword;
