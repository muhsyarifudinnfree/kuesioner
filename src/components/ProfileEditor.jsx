import React, { useState, useEffect } from "react";
import { db } from "../firebase/config"; // Hanya butuh 'db'
import { ref as dbRef, get, set } from "firebase/database";
import Button from "./Button";

const ProfileEditor = () => {
  const [profile, setProfile] = useState({ name: "", intro: "" });
  const [imageUrl, setImageUrl] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileRef = dbRef(db, "settings/researcherProfile");
      const snapshot = await get(profileRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setProfile({ name: data.name || "", intro: data.intro || "" });
        setImageUrl(data.imageUrl || null);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    let finalImageUrl = imageUrl;

    // --- BLOK KODE YANG DIUBAH ---
    // Logika upload sekarang menggunakan Cloudinary, bukan Firebase Storage
    if (newImage) {
      const formData = new FormData();
      formData.append("file", newImage);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        if (data.secure_url) {
          finalImageUrl = data.secure_url;
        } else {
          throw new Error("Upload ke Cloudinary gagal.");
        }
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        alert("Gagal mengunggah gambar profil!");
        setSaving(false);
        return;
      }
    }
    // --- AKHIR BLOK KODE YANG DIUBAH ---

    // Logika menyimpan ke Realtime Database (tetap sama)
    try {
      const profileRef = dbRef(db, "settings/researcherProfile");
      await set(profileRef, {
        name: profile.name,
        intro: profile.intro,
        imageUrl: finalImageUrl,
      });
      setImageUrl(finalImageUrl);
      setNewImage(null);
      alert("Profil berhasil diperbarui!");
    } catch (error) {
      console.error("Error saving profile to Realtime DB:", error);
      alert("Gagal menyimpan profil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Memuat profil...</p>;

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700"
        >
          Nama Peneliti
        </label>
        <input
          type="text"
          id="name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
        />
      </div>
      <div>
        <label
          htmlFor="intro"
          className="block text-sm font-medium text-slate-700"
        >
          Teks Perkenalan & Tujuan
        </label>
        <textarea
          id="intro"
          rows={5}
          value={profile.intro}
          onChange={(e) => setProfile({ ...profile, intro: e.target.value })}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Foto Profil
        </label>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full my-2 object-cover"
          />
        )}
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  );
};

export default ProfileEditor;
