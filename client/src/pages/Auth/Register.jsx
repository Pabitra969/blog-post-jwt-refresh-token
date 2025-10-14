import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/register", { name, email, password });
      // After registration, immediately log in to receive tokens
      const loginRes = await api.post("/users/login", { email, password });
      const { accessToken, user } = loginRes.data;
      localStorage.setItem("user", JSON.stringify({ ...user, accessToken }));
      navigate("/myblogs");
    } catch (err) {
      alert(err?.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="input"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input"
        />
        <button className="px-4 py-2 rounded bg-green-600 text-white">
          Register
        </button>
      </form>
    </div>
  );
}
