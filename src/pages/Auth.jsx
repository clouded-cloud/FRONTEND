import React, { useEffect, useState } from "react";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";

const Auth = () => {
  useEffect(() => {
    document.title = "POS | Login";
  }, []);

  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1>{isRegister ? "Register" : "Login"}</h1>
        </div>

        {/* Form Body */}
        <div className="auth-body">
          {isRegister ? <Register /> : <Login />}

          {/* Toggle Link */}
          <div className="auth-footer">
            {isRegister ? "Already have an account? " : "Don't have an account? "}
            <button onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;