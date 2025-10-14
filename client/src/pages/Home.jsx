import React, { useEffect, useState } from 'react';
import api from '../api';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';
import config from './config';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const blogsPerPage = config.BLOGS_PER_PAGE;

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/blogs?page=${currentPage}&limit=${blogsPerPage}`);
      setBlogs(res.data.blogs || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Latest Blogs</h1>
        <div className="flex gap-2">
          <button onClick={() => setView('grid')} className={`px-3 py-1 rounded ${view === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Grid</button>
          <button onClick={() => setView('list')} className={`px-3 py-1 rounded ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>List</button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div
            className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-6'}
          >
            {blogs.map(b => (
              <BlogCard key={b.id} blog={b} view={view} />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}
    </div>
  )

}
