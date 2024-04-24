import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../utils/auth";
import axios from "axios";

export default function Nav() {
  const { user, logout } = useAuth();
  const handleLogout = async () => {
    await axios.post(
      "http://localhost:8000/api/v1/auth/logout",
      {},
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + user.accessToken,
        },
      }
    );
    localStorage.removeItem("user");
    logout();
  };
  return (
    <nav className="navbar navbar-expand-sm bg-primary" data-bs-theme="dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Navbar
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink className="nav-link" aria-current="page" to="/">
              Home
            </NavLink>
            {!user ? (
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
            ) : (
              <button onClick={handleLogout} className="nav-link">
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
