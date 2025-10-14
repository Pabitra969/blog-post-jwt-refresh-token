import React from 'react'

export default function Profile(){
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-xl font-semibold">Profile</h2>
      <div className="mt-4">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>ID:</strong> {user?.id}</p>
      </div>
    </div>
  )
}
