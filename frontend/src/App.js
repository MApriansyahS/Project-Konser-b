import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./auth/AuthProvider";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard.js";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage.js";
import AdminKonser from "./pages/AdminKonser.js";
import AdminTiket from "./pages/AdminTiket.js";
import Detail from "./pages/Details.js";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { accessToken } = useAuthContext();
  const isAuthenticated = !!accessToken;

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/admin-dashboard"
        element={
          isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/AdminKonser"
        element={isAuthenticated ? <AdminKonser /> : <Navigate to="/login" />}
      />
      <Route
        path="/AdminTIket"
        element={isAuthenticated ? <AdminTiket /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard/:id"
        element={isAuthenticated ? <Detail /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
