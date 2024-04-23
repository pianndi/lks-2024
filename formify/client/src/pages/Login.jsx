import { useState } from "react";
import { useAuth } from "../components/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("https://localhost:8000/api/v1/auth/login", {
      method: "post",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer Token",
      },
      body: {
        email,
        password,
      },
    });
    const data = await data.json();
    console.log(data);
  };
  return (
    <div>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            value={email}
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button>Login</button>
      </form>
    </div>
  );
}
