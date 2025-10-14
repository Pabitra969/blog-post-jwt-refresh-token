import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BlogDetails from "./pages/BlogDetails";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import CreateEdit from "./pages/CreateEdit";
import MyBlogs from "./pages/MyBlogs";
import Profile from "./pages/Profile";

function RequireAuth({ children }) {
  const userJSON = localStorage.getItem("user");
  const isAuthed = !!userJSON;
  return isAuthed ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/create"
            element={
              <RequireAuth>
                <CreateEdit />
              </RequireAuth>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <RequireAuth>
                <CreateEdit editMode />
              </RequireAuth>
            }
          />

          <Route
            path="/myblogs"
            element={
              <RequireAuth>
                <MyBlogs />
              </RequireAuth>
            }
          />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
