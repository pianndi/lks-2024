import { Link } from "react-router-dom";

export default function Nav({ user, setUser }) {
  return (
    <nav>
      <h1>Title</h1>
      <Link to="/">Home</Link>
      {user ? (
        <button onClick={() => setUser(null)}>Logout</button>
      ) : (
        <button onClick={() => setUser({ id: 1, name: "Pian" })}>Login</button>
      )}
    </nav>
  );
}
