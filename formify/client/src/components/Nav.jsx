import { Link } from "react-router-dom";
import { useAuth } from "./auth";

export default function Nav() {
  const { user, logout } = useAuth();
  return (
    <nav>
      <h1>Title</h1>
      <Link to="/">Home</Link>
      {user ? (
        <button onClick={() => logout()}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
