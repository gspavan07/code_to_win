import React, { Suspense } from "react";
import {
  BrowserRouter, // <-- ADD THIS
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import FacultyDashboard from "./pages/dashboards/FacultyDashboard";
import HeadDashboard from "./pages/dashboards/HeadDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import NotFound from "./pages/NotFound";
import LoadingSpinner from "./common/LoadingSpinner";
import { useAuth } from "./context/AuthContext";
import Dev from "./pages/Dev";
import ContactUs from "./pages/Contact";
import RankingTable from "./components/Ranking";
import Home from "./pages/Home";

const ProtectedRoute = ({ children, role }) => {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (role && role !== userRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/dev" element={<Dev />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/rank" element={<RankingTable />} />

            {/* Protected routes - Student */}
            <Route
              path="/student"
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected routes - Faculty */}
            <Route
              path="/faculty"
              element={
                <ProtectedRoute role="faculty">
                  <FacultyDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected routes - HOD */}
            <Route
              path="/hod"
              element={
                <ProtectedRoute role="hod">
                  <HeadDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected routes - Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
};

export default App;
