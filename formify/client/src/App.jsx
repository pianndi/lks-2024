import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Nav from "./components/Nav";
import { useAuth } from "./utils/auth";
import EditForm from "./pages/EditForm";
import ResponseForm from "./pages/ResponseForm";

export default function App() {
  return (
    <>
      <Nav />
      <div className="container py-4">
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path=":slug" element={<EditForm />} />
            <Route path=":slug/responses" element={<ResponseForm />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<h1>Not found</h1>} />
        </Routes>
      </div>
    </>
  );
}

const ProtectedRoutes = () => {
  const { user } = useAuth();
  return user ? (
    <Outlet />
  ) : user?.loading ? (
    "Loading..."
  ) : (
    <Navigate to="/login" replace />
  );
};
