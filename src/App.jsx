import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Auth, Orders, Tables, Menu, Dashboard } from "./pages";
import HeaderNav from "./components/Shared/HeaderNav";
import { useSelector } from "react-redux";
import useLoadData from "./Hooks/UseLoadData";
import FullScreenLoader from "./components/shared/FullScreenLoader";

// ──────────────────────────────────────────────────────────────
// 1. Protected Route Components
// ──────────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { isAuth } = useSelector((state) => state.user);
  return isAuth ? children : <Navigate to="/auth" replace />;
};

const AdminRoute = ({ children }) => {
  const { role } = useSelector((state) => state.user);
  return role === "admin" ? children : <Navigate to="/orders" replace />;
};

// ──────────────────────────────────────────────────────────────
// 2. Layout with Conditional Header
// ──────────────────────────────────────────────────────────────
const Layout = () => {
  const isLoading = useLoadData();
  const location = useLocation();
  const hideNavRoutes = ["/auth"];

  const showNav = !hideNavRoutes.includes(location.pathname);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showNav && <HeaderNav />}
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route
            path="/auth"
            element={
              <RequireAuth>
                <Auth />
              </RequireAuth>
            }
          />

          {/* Protected */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tables"
            element={
              <ProtectedRoute>
                <Tables />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <Menu />
              </ProtectedRoute>
            }
          />

          {/* Admin Only */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-800">404</h1>
                  <p className="text-xl text-gray-600">Page not found</p>
                  <button
                    onClick={() => window.history.back()}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// 3. Auth Redirect (if already logged in)
// ──────────────────────────────────────────────────────────────
const RequireAuth = ({ children }) => {
  const { isAuth } = useSelector((state) => state.user);
  return isAuth ? <Navigate to="/orders" replace /> : children;
};

// ──────────────────────────────────────────────────────────────
// 4. Main App
// ──────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;