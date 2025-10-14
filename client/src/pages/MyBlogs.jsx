import React, {useEffect, useState} from 'react'
import api from '../api'
import { Link } from 'react-router-dom'
import config from './config'


export default function MyBlogs(){
  const [blogs, setBlogs] = useState([]);
  useEffect(()=>{ fetchMyBlogs() },[])

  console.log(api);

  const fetchMyBlogs = async () => {
    try{
      const res = await api.get('/blogs/you'); // backend route
      setBlogs(res.data.blogs || []);
      console.log(res);
    }catch(err){ console.error(err) }
  }

  const handleDelete = async (id) => {
    if(!confirm('Delete this blog?')) return;
    try{
      await api.delete(`/blogs/delete/${id}`);
      setBlogs(b => b.filter(x => x.id !== id));
    }catch(err){ console.error(err) }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">My Blogs</h2>
        <Link to="/create" className="px-3 py-1 rounded bg-blue-600 text-white">Create New</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogs.map(b => (
          <div key={b.id} className="card flex flex-col">
            {b.image_path && <img src={`${config.BASE_URL}${b.image_path}`} alt={b.title} className="h-44 object-cover rounded" />}
            <div className="mt-3 flex-1">
              <h3 className="font-semibold"> Title : {b.title}</h3>
              <h3 className="font-light">Author : {b.name}</h3>
              <p className="text-sm text-slate-600">{b.description}</p>
            </div>
            <div className="flex gap-2 mt-3">
              <Link to={`/edit/${b.id}`} className="px-3 py-1 rounded bg-yellow-400">Edit</Link>
              <button onClick={()=>handleDelete(b.id)} className="px-3 py-1 rounded bg-red-500 text-white">Delete</button>
              <Link to={`/blogs/${b.id}`} className="px-3 py-1 rounded border ml-auto">View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
