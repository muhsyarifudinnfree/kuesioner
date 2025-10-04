import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { ref, get, set } from "firebase/database";
import Button from "./Button";

const DeadlineEditor = () => {
  // State akan menyimpan format 'YYYY-MM-DDTHH:mm'
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const deadlineRef = ref(db, "settings/deadline");
    get(deadlineRef).then((snapshot) => {
      if (snapshot.exists()) {
        setDeadline(snapshot.val().endDate || "");
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!deadline) {
      alert("Silakan pilih tanggal dan waktu terlebih dahulu.");
      return;
    }
    const deadlineRef = ref(db, "settings/deadline");
    try {
      await set(deadlineRef, { endDate: deadline });
      alert(
        `Batas waktu berhasil diatur ke: ${new Date(deadline).toLocaleString(
          "id-ID",
          { dateStyle: "full", timeStyle: "short" }
        )}`
      );
    } catch (error) {
      alert("Gagal menyimpan batas waktu.");
      console.error(error);
    }
  };

  if (loading) return <p>Memuat...</p>;

  return (
    <div className="space-y-3">
      <label
        htmlFor="deadline-datetime"
        className="block text-sm font-medium text-slate-700"
      >
        Pilih Tanggal & Waktu Berakhir
      </label>
      {/* Ganti input type menjadi 'datetime-local' */}
      <input
        type="datetime-local"
        id="deadline-datetime"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
      <Button onClick={handleSave} className="w-full">
        Simpan Batas Waktu
      </Button>
    </div>
  );
};

export default DeadlineEditor;
