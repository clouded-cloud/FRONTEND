import React, { useEffect } from "react";
import Login from "../components/auth/Login";

const Auth = () => {
  useEffect(() => {
    document.title = "POS | Login";
  }, []);

  // Auth page intentionally only allows sign-in. Registration removed.

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1>Login</h1>
        </div>

        {/* Form Body */}
        <div className="auth-body">
          <Login />
        </div>
      </div>
    </div>
  );
};

export default Auth;