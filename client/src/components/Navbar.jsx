import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const userJSON = localStorage.getItem("user");
  const user = userJSON ? JSON.parse(userJSON) : null;

  const logout = async () => {
    try {
      // Inform server to clear cookie and DB token
      const res = await fetch("http://localhost:5002/users/logout", {
        method: "POST",
        credentials: "include",
      });
      // ignore response body
    } catch (e) {
      /* no-op */
    }
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-semibold">
          MyBlog
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="hidden sm:inline">
            Explore
          </Link>
          {user && (
            <Link to="/create" className="btn">
              Create
            </Link>
          )}
          {user && (
            <Link to="/myblogs" className="sm:inline">
              My Blogs
            </Link>
          )}
          {user ? (
            <>
              <span className="px-3 py-1 rounded bg-slate-100">
                {user?.name || "Me"}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1 rounded bg-red-500 text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1 rounded bg-blue-600 text-white"
              >
                Login
              </Link>
              <Link to="/register" className="px-3 py-1 rounded border">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
