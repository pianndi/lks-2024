import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    setErrors(null);
    setMessage(null);
    e.preventDefault();
    const formData = new FormData(e.target);
    const body = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/auth/login",
        body,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      localStorage.setItem("user", JSON.stringify(data.user));
      login(data.user);
      navigate("/", { replace: true });
      setMessage(data.message);
    } catch ({ response }) {
      setErrors(response.data.errors);
      setMessage(response.data.message);
    }
    setLoading(false);
  };
  return (
    <>
      {message && (
        <div className="alert alert-danger" role="alert">
          Error: {message}
        </div>
      )}
      <div className="card ">
        <div className="card-header text-center">
          <h2 className="card-title">Login Form</h2>
        </div>
        <form
          method="post"
          onSubmit={handleSubmit}
          className="card-body text-start"
        >
          <div className="form-group mb-2">
            <label htmlFor="email" className="form-label ">
              Email
            </label>
            <input
              name="email"
              type="email"
              className={"form-control " + (errors?.email && "is-invalid")}
              placeholder="Input your email"
              disabled={loading}
            ></input>
            <div className="invalid-feedback">{errors?.email}</div>
          </div>
          <div className="form-group mb-2">
            <label htmlFor="email" className="form-label">
              Password
            </label>
            <input
              name="password"
              type="password"
              className={"form-control " + (errors?.password && "is-invalid")}
              placeholder="Input your password"
              disabled={loading}
            ></input>
            <div className="invalid-feedback">{errors?.password}</div>
          </div>
          <div className="form-group text-center">
            <button
              type="submit"
              className="btn btn-primary "
              disabled={loading}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
