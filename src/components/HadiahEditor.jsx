import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { ref, get, set } from "firebase/database";
import Button from "./Button";

const HadiahEditor = () => {
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementDate, setAnnouncementDate] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prizeRef = ref(db, "settings/hadiah");
    get(prizeRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setIsPublished(data.isAnnounced || false);
        setAnnouncementText(data.winnersText || "");
        setAnnouncementDate(data.announcementDate || "");
      }
      setLoading(false);
    });
  }, []);

  const handlePublish = async () => {
    if (!announcementText.trim()) {
      alert("Teks pengumuman tidak boleh kosong.");
      return;
    }
    const prizeRef = ref(db, "settings/hadiah");
    await set(prizeRef, {
      isAnnounced: true,
      winnersText: announcementText,
      announcementDate: announcementDate,
    });
    setIsPublished(true);
    alert("Pengumuman pemenang berhasil dipublikasikan!");
  };

  const handleSetPending = async () => {
    if (!announcementDate) {
      alert("Tanggal pengumuman harus diisi.");
      return;
    }
    const prizeRef = ref(db, "settings/hadiah");
    await set(prizeRef, {
      isAnnounced: false, // Pastikan statusnya belum diumumkan
      announcementDate: announcementDate,
      winnersText: "", // Kosongkan teks pemenang saat mengatur tanggal
    });
    setIsPublished(false);
    setAnnouncementText("");
    alert('Tanggal pengumuman berhasil disimpan. Status diatur ke "Nantikan".');
  };

  // --- FUNGSI BARU UNTUK TOMBOL RESET ---
  const handleReset = async () => {
    if (
      window.confirm(
        "Ini akan menarik kembali pengumuman pemenang dan mengembalikannya ke status 'Nantikan'. Anda yakin?"
      )
    ) {
      const prizeRef = ref(db, "settings/hadiah");
      await set(prizeRef, {
        isAnnounced: false,
        announcementDate: announcementDate, // Pertahankan tanggal yang sudah ada
        winnersText: "", // Kosongkan daftar pemenang
      });
      setIsPublished(false);
      setAnnouncementText("");
      alert("Pengumuman berhasil di-reset.");
    }
  };

  if (loading) return <p>Memuat editor hadiah...</p>;

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Status Saat Ini:{" "}
        <span className="font-bold">
          {isPublished ? "Sudah Diumumkan" : "Belum Diumumkan"}
        </span>
      </p>

      {/* Pengaturan Tanggal Pengumuman */}
      <div className="space-y-2 p-4 bg-slate-50 rounded-lg">
        <label
          htmlFor="announcementDate"
          className="block text-sm font-medium text-slate-700"
        >
          Atur Tanggal Pengumuman
        </label>
        <input
          type="date"
          id="announcementDate"
          value={announcementDate}
          onChange={(e) => setAnnouncementDate(e.target.value)}
          className="block w-full rounded-md border-slate-300 shadow-sm"
        />
        <Button
          onClick={handleSetPending}
          variant="secondary"
          className="w-full"
        >
          Simpan Tanggal
        </Button>
      </div>

      {/* Pengaturan Teks Pemenang */}
      <div className="space-y-2">
        <label
          htmlFor="announcement"
          className="block text-sm font-medium text-slate-700"
        >
          Teks Pengumuman Pemenang
        </label>
        <textarea
          id="announcement"
          rows={7}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
          placeholder="Contoh:&#10;Selamat kepada para pemenang!&#10;1. Budi Santoso - 0812xxxx6678 &#10;2. Ani Handayani - 0813xxxx2256"
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handlePublish} className="w-full">
            Umumkan Pemenang
          </Button>
          {/* --- TOMBOL RESET YANG BARU --- */}
          <Button
            onClick={handleReset}
            variant="secondary"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
          >
            Reset Pengumuman
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HadiahEditor;
