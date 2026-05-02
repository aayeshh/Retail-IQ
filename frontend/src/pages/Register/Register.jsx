import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import PageLayout from "../../components/PageLayout/PageLayout";
import { apiRequest } from "../../api/client";

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ text: "", type: "" });

  const fullNameTrimmed = fullName.trim();
  const phoneDigits = phone.replace(/\D/g, "");
  const emailTrimmed = email.trim();

  const fullNameGuide =
    fullNameTrimmed.length > 0 && (fullNameTrimmed.length < 3 || fullNameTrimmed.length > 20)
      ? "Name should be 3 to 20 characters."
      : "";
  const phoneGuide =
    phoneDigits.length > 0 && phoneDigits.length !== 11 ? "Phone number should be exactly 11 digits." : "";
  const emailGuide =
    emailTrimmed.length > 0 && !emailTrimmed.toLowerCase().endsWith("@gmail.com")
      ? "Use a valid @gmail.com address."
      : "";
  const passwordGuide =
    password.length > 0 && (password.length < 6 || password.length > 14)
      ? "Password should be 6 to 14 characters."
      : "";
  const confirmGuide = confirmPassword.length > 0 && password !== confirmPassword ? "Passwords do not match." : "";

  async function onSubmit() {
    if (!fullName.trim() || !phone.trim() || !email.trim() || !password) {
      setStatus({ text: "Full Name, Phone, Email and Password are required.", type: "error" });
      return;
    }

    if (fullName.trim().length < 3 || fullName.trim().length > 20) {
      setStatus({ text: "Full Name (Username) must be between 3 and 20 characters.", type: "error" });
      return;
    }

    if (!email.trim().toLowerCase().endsWith("@gmail.com")) {
      setStatus({ text: "Email must be in @gmail.com format.", type: "error" });
      return;
    }

    if (phoneDigits.length !== 11) {
      setStatus({ text: "Phone number must be exactly 11 digits.", type: "error" });
      return;
    }

    if (password.length < 6 || password.length > 14) {
      setStatus({ text: "Password must be between 6 and 14 characters.", type: "error" });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ text: "Password and Confirm Password do not match.", type: "error" });
      return;
    }

    setSubmitting(true);
    setStatus({ text: "", type: "" });
    try {
      await apiRequest("/api/register/create", {
        method: "POST",
        body: JSON.stringify({
          account_type: "individual",
          full_name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          password,
        }),
      });
      setStatus({ text: "Registration saved to MongoDB successfully.", type: "success" });
      setFullName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (err) {
      setStatus({ text: err.message || "Failed to save registration", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageLayout contentClassName="register-page" showSidebar={false}>
      <section className="register-shell">
        <div className="register-header">
          <h1>Create Your RetailIQ Account.</h1>
          <p className="subtitle">Join the platform and start forecasting with precision.</p>
        </div>
        <div className="register-container">
          <article className="register-card">
            <h3>Account Registration</h3>

            <label className="register-field">
              <span>Full Name *</span>
              <input
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {fullNameGuide && <p className="field-guide">{fullNameGuide}</p>}
            </label>

            <label className="register-field">
              <span>Phone Number *</span>
              <input
                placeholder="03XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {phoneGuide && <p className="field-guide">{phoneGuide}</p>}
            </label>

            <label className="register-field">
              <span>Email Address *</span>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailGuide && <p className="field-guide">{emailGuide}</p>}
            </label>

            <label className="register-field">
              <span>Password *</span>
              <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordGuide && <p className="field-guide">{passwordGuide}</p>}
            </label>

            <label className="register-field">
              <span>Confirm Password *</span>
              <input
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmGuide && <p className="field-guide">{confirmGuide}</p>}
            </label>

            <button onClick={onSubmit} disabled={submitting}>
              {submitting ? "Saving..." : "Create Account"}
            </button>
          </article>
        </div>
        {status.text && <p className={`register-toast ${status.type}`}>{status.text}</p>}
        <div className="benefits">
          Platform Benefits: Access real-time insights, customized alerts, team collaboration.
        </div>
      </section>
    </PageLayout>
  );
}

export default Register;
