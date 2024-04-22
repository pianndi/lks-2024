import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import { useState } from "react";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Nav user={user} setUser={setUser}></Nav>

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <h1>Home</h1>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<h1>Login</h1>} />
      </Routes>
    </>
  );
}

const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" />;
};
