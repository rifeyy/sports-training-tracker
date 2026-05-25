"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProgressPhotos() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadPhotos = async () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");

      if (!userId) {
        setPhotos([]);
        return;
      }

      const res = await fetch(`/api/client/photos?userId=${userId}`);
      const data = await res.json();

      if (data.success) {
        setPhotos(data.data || []);
      } else {
        setPhotos([]);
      }
    } catch (error) {
      console.log("LOAD PHOTOS ERROR:", error);
      toast.error("Failed to load photos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleUpload = (e: any) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        setUploading(true);

        const userId = localStorage.getItem("userId");
        const goal = localStorage.getItem("clientGoal") || "Maintain";

        if (!userId) {
          toast.error("User not connected");
          return;
        }

        const res = await fetch("/api/client/photos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            image: reader.result,
            goal,
            date: new Date().toLocaleDateString(),
          }),
        });

        const data = await res.json();

        if (!data.success) {
          toast.error(data.message || "Photo upload failed");
          return;
        }

        toast.success(`Photo uploaded. Score: ${data.data.score}/100`);

        loadPhotos();
      } catch (error) {
        console.log("UPLOAD PHOTO ERROR:", error);
        toast.error("Upload error");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const clearPhotos = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete all progress photos from MongoDB?"
    );

    if (!confirmed) return;

    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("User not connected");
      return;
    }

    await fetch(`/api/client/photos?userId=${userId}`, {
      method: "DELETE",
    });

    setPhotos([]);

    toast.success("Progress photos deleted from MongoDB");
  };

  if (loading) {
    return (
      <div className="premium-card animate-pulse">
        <div className="h-5 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-40 bg-gray-800 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="premium-card">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">

        <div>
          <h2 className="text-xl font-bold">
            Progress Photos
          </h2>

          <p className="text-gray-400 text-sm">
            Upload transformation photos. Rating is based on your goal and saved metrics.
          </p>
        </div>

        <div className="flex gap-3">

          <label className="bg-purple-500 hover:bg-purple-400 text-black px-4 py-2 rounded-xl cursor-pointer transition">
            {uploading ? "Uploading..." : "Upload Photo"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>

          {photos.length > 0 && (
            <button
              onClick={clearPhotos}
              className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-xl transition"
            >
              Clear
            </button>
          )}

        </div>

      </div>

      {photos.length === 0 ? (
        <div className="border border-dashed border-gray-700 rounded-xl p-8 text-center text-gray-500">
          No progress photos yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {photos.map((photo) => (
            <div
              key={photo._id}
              className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700"
            >

              <img
                src={photo.image}
                alt="Progress photo"
                className="w-full h-64 object-cover"
              />

              <div className="p-4 space-y-2">

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    {photo.date}
                  </p>

                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                    {photo.score}/100
                  </span>
                </div>

                <p className="text-sm">
                  Goal: <span className="text-blue-400">{photo.goal}</span>
                </p>

                <p className="text-sm text-gray-300">
                  {photo.feedback}
                </p>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}




