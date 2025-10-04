import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

const StatusToggle = () => {
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      const docRef = doc(db, "settings", "questionnaireStatus");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setIsActive(docSnap.data().isActive);
      }
      setLoading(false);
    };
    fetchStatus();
  }, []);

  const handleToggle = async () => {
    const newStatus = !isActive;
    setIsActive(newStatus);
    const docRef = doc(db, "settings", "questionnaireStatus");
    try {
      await setDoc(docRef, { isActive: newStatus });
      alert(`Kuesioner berhasil di-${newStatus ? "aktifkan" : "nonaktifkan"}.`);
    } catch (error) {
      console.error("Error updating status: ", error);
      alert("Gagal memperbarui status.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex items-center justify-between">
      <p className="text-gray-700">
        Kuesioner saat ini{" "}
        <span
          className={`font-bold ${
            isActive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isActive ? "AKTIF" : "NONAKTIF"}
        </span>
      </p>
      <button
        onClick={handleToggle}
        className={`px-4 py-2 rounded-md text-white ${
          isActive
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {isActive ? "Nonaktifkan" : "Aktifkan"}
      </button>
    </div>
  );
};

export default StatusToggle;
