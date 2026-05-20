"use client";

import { useState, useEffect } from "react";

export default function ProfileCard() {

  const [name, setName] = useState("User");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");

  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");
    const storedPhoto = localStorage.getItem("photo");

    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
    if (storedPhoto) setPhoto(storedPhoto);
  }, []);

  const handlePhoto = (e:any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(reader.result as string);
      localStorage.setItem("photo", reader.result as string);
    };

    if (file) reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    localStorage.setItem("name", newName);
    localStorage.setItem("email", newEmail);

    setName(newName);
    setEmail(newEmail);

    setOpen(false);
  };

  return (
    <>
      {/* ✅ HEADER */}
      <div className="flex items-center justify-between bg-gray-900 p-6 rounded-xl">

        <div className="flex items-center gap-4">

          <label className="cursor-pointer">
            <input type="file" hidden onChange={handlePhoto} />

            {photo ? (
              {photo}
            ) : (
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                📸
              </div>
            )}
          </label>

          <div>
            <h2 className="text-xl font-semibold">{name}</h2>

            {email && (
              <p className="text-gray-400 text-sm">
                {email}
              </p>
            )}
          </div>

        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Edit Profile
        </button>

      </div>

      {/* ✅ MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="bg-gray-900 p-6 rounded-xl w-80 space-y-4">

            <h2 className="text-lg">Edit Profile</h2>

            <input
              placeholder="Name"
              value={newName}
              onChange={(e)=>setNewName(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded"
            />

            <input
              placeholder="Email"
              value={newEmail}
              onChange={(e)=>setNewEmail(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded"
            />

            <div className="flex justify-end gap-2">

              <button
                onClick={()=>setOpen(false)}
                className="px-3 py-1 bg-gray-700 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveProfile}
                className="px-3 py-1 bg-green-500 rounded"
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}
