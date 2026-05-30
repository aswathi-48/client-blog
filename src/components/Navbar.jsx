import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>MERN Blog</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/create-blog">Create Blog</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;