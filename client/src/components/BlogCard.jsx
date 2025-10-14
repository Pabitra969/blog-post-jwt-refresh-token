import React from "react";
import { Link } from "react-router-dom";

export default function BlogCard({ blog, view }) {
  if (view === "list") {
    return (
      <article className="card flex flex-row gap-4 p-4">
        {blog.image_path && (
          <img
            src={`http://localhost:5002/${blog.image_path}`}
            alt={blog.title}
            className="w-48 h-auto object-cover rounded-lg"
          />
        )}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold line-clamp-2">Title : {blog.title}</h3>
          <h3 className="text-xl font-semibold line-clamp-2">Author : {blog.name}</h3>
          <p className="text-sm text-slate-600 mt-1 line-clamp-3">
            {blog.description}
          </p>
          <div className="mt-auto">
            <Link to={`/blogs/${blog.id}`} className="text-sm text-blue-600">
              Read More
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card flex flex-col gap-3">
      {blog.image_path && (
        <img
          src={`http://localhost:5002/${blog.image_path}`}
          alt={blog.title}
          className="w-full h-48 object-cover rounded-lg"
        />
      )}
      <div>
        <h3 className="text-xl font-semibold line-clamp-2">Title : {blog.title}</h3>
        <h3 className="text-xl font-light line-clamp-2">Author :{blog.name}</h3>
        <p className="text-sm text-slate-600 mt-1 line-clamp-3">
          {blog.description}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between">
        {/* <span className="text-xs text-slate-500">By {blog.user_id || 'Unknown'}</span> */}
        <Link to={`/blogs/${blog.id}`} className="text-sm text-blue-600">
          Read
        </Link>
      </div>
    </article>
  );
}
