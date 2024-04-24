import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Nav from "./components/Nav";
import { useAuth } from "./utils/auth";
import EditForm from "./pages/EditForm";
import ResponseForm from "./pages/ResponseForm";
import CreateForm from "./pages/CreateForm";

export default function App() {
  const { user, logout } = useAuth();
  return (
    <>
      <Nav user={user} logout={logout} />
      <div className="container py-4">
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home user={user} />} />
            <Route path=":slug" element={<EditForm user={user} />} />
            <Route path=":slug/responses" element={<ResponseForm user={user} />} />
            <Route path="form/create" element={<CreateForm user={user} />} />
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
  return (user?.loading ? <h1>Loading..</h1> : (user ? <Outlet /> : <Navigate to='login' replace />))

};
