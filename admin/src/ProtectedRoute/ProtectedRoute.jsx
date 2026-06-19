import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import Header from "../Share/Header";
import Sidebar from "../Share/Sidebar";

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <header className="bg-white shadow-sm" style={{ zIndex: 1030 }}>
        <Header />
      </header>

      <div className="d-flex flex-grow-1 position-relative">
        <aside
          className="bg-white border-end"
          style={{ width: "260px", flexShrink: 0 }}
        >
          <Sidebar />
        </aside>

        <main className="flex-grow-1 p-4 overflow-auto">
          <div className="container-fluid">
            <Outlet key={location.pathname} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
