import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import Nav from "./components/Nav";
import { useAuth } from "./components/auth";
import Login from "./pages/Login";

export default function App() {
  return (
    <>
      <Nav></Nav>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<h1>Home</h1>} path="/" />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  return user ? (
    <Outlet />
  ) : (
    <Navigate replace to="/login" state={{ from: location }} />
  );
};
