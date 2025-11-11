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
import FullScreenLoader from "./components/shared/FullScreenLoader"

function Layout() {
  const isLoading = useLoadData();
  const location = useLocation();
  const hideNavRoutes = ["/auth"];
  const { isAuth } = useSelector(state => state.user);

  if(isLoading) return <FullScreenLoader />

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavRoutes.includes(location.pathname) && <HeaderNav />}
      <div className="flex-1">
        <Routes>
          <Route path="/auth" element={isAuth ? <Navigate to="/orders" /> : <Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <Orders />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoutes>
                <Orders />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/tables"
            element={
              <ProtectedRoutes>
                <Tables />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/menu"
            element={
              <ProtectedRoutes>
                <Menu />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <AdminRoutes>
                  <Dashboard />
                </AdminRoutes>
              </ProtectedRoutes>
            }
          />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </div>
    </div>
  );
}

function ProtectedRoutes({ children }) {
  const { isAuth } = useSelector((state) => state.user);
  if (!isAuth) {
    return <Navigate to="/auth" />;
  }

  return children;
}

function AdminRoutes({ children }) {
  const { role } = useSelector((state) => state.user);
  if (role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;