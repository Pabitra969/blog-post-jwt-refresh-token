import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

export default function CreateEdit({ editMode=false }) {
  const { id } = useParams();
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [about,setAbout] = useState('');
  const [content,setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    if (editMode && id) {
      api.get(`/blogs/${id}`).then(res => {
        const b = res.data.blog;
        setTitle(b.title);
        setDescription(b.description);
        setAbout(b.about);
        setContent(b.content);
        if (b.image_path) setPreview(`http://localhost:5002/${b.image_path}`);
      }).catch(console.error);
    }
  },[editMode, id]);

  useEffect(()=>{
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  },[file]);

  const submit = async (e) => {
    e.preventDefault();
    try{
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('about', about);
      formData.append('content', content);
      if(file) formData.append('image', file);

      if(editMode){
        await api.put(`/blogs/update/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Updated');
        navigate('/myblogs');
      } else {
        await api.post('/blogs/create', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Created');
        navigate('/myblogs');
      }
    }catch(err){
      console.error(err);
      alert('Operation failed');
    }
  }

  return (
    <div className="max-w-3xl mx-auto card">
      <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Blog' : 'Create Blog'}</h2>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="input" />
        <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Short description" className="input" />
        <input value={about} onChange={e=>setAbout(e.target.value)} placeholder="About author / excerpt" className="input" />
        <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Content (HTML or markdown)" rows="8" className="input" />
        <div>
          <label className="block mb-2">Image</label>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
          {preview && <img src={preview} alt="preview" className="mt-3 w-full max-h-80 object-cover rounded" />}
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded bg-blue-600 text-white">{editMode ? 'Update' : 'Create'}</button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded border">Cancel</button>
        </div>
      </form>
    </div>
  )
}
