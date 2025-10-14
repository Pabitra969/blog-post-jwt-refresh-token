import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/blogs/${id}`)
      .then((r) => setBlog(r.data.blog))
      .catch(console.error);
  }, [id]);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isOwner = !!user && blog && blog.user_id === user.id;

  const handleDelete = async () => {
    if (!confirm("Delete this blog?")) return;
    try {
      await api.delete(`/blogs/delete/${id}`);
      alert("Deleted");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Fail");
    }
  };

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="card">
      {blog.image_path && (
        <img
          src={`http://localhost:5002/${blog.image_path}`}
          alt={blog.title}
          className="w-full h-72 object-cover rounded-lg mb-4"
        />
      )}
      <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
      <p className="text-sm text-slate-600 mb-4">{blog.description}</p>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
      <div className="flex gap-3 mt-6">
        {isOwner && (
          <>
            <Link
              to={`/edit/${id}`}
              className="px-3 py-1 rounded bg-yellow-400"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-3 py-1 rounded bg-red-500 text-white"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
