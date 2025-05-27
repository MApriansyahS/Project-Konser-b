import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./auth/AuthProvider";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OrderPage from "./pages/OrderPage";
//import UserDashboard from "./pages/UserDashboard";
import KonserApp from "./pages/Konser";
import AdminKonser from "./pages/AdminKonser";
import AdminTiket from "./pages/AdminTiket";
import KonserDetail from "./pages/KonserDetail";

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
        path="/admin"
        element={
          isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />
        }
      />
      {/* <Route
        path="/notes/add"
        element={isAuthenticated ? <AddNote /> : <Navigate to="/login" />}
      /> */}
      <Route
        path="/order"
        element={isAuthenticated ? <OrderPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <KonserApp /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin-dashboard"
        element={
          isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/AdminKonser"
        element={
          isAuthenticated ? <AdminKonser /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/AdminTiket"
        element={
          isAuthenticated ? <AdminTiket /> : <Navigate to="/login" />
        }
      />
      <Route path="/konser/:id" element={<KonserDetail />} />
    </Routes>
  );
}

export default App;
