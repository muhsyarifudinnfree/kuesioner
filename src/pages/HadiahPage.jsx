import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { db } from "../firebase/config";
import { ref, get } from "firebase/database";
import FooterCredit from "../components/FooterCredit";

const HadiahPage = () => {
  const navigate = useNavigate();
  const [hadiahData, setHadiahData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prizeRef = ref(db, "settings/hadiah");
    get(prizeRef).then((snapshot) => {
      if (snapshot.exists()) {
        setHadiahData(snapshot.val());
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Tampilan jika pemenang sudah diumumkan
  if (hadiahData && hadiahData.isAnnounced) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl w-full bg-white p-8 md:p-12 rounded-2xl shadow-lg text-center">
          <svg
            className="w-20 h-20 text-yellow-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            ></path>
          </svg>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Selamat kepada Para Pemenang!
          </h1>
          <p className="text-slate-600 mb-6">
            Terima kasih kepada semua yang telah berpartisipasi. Berikut adalah
            pemenang yang beruntung:
          </p>
          <div className="bg-green-50 text-green-800 p-6 rounded-lg mb-8 text-left whitespace-pre-line">
            {hadiahData.winnersText}
          </div>
          <Button onClick={() => navigate("/")} variant="secondary">
            Kembali ke Halaman Utama
          </Button>
          <FooterCredit />
        </div>
      </div>
    );
  }

  // Tampilan default jika pemenang belum diumumkan
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-2xl w-full bg-white p-8 md:p-12 rounded-2xl shadow-lg text-center">
        <svg
          className="w-20 h-20 text-blue-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Nantikan Pengumumannya!
        </h1>
        <p className="text-slate-600 mb-4">
          Terima kasih atas partisipasi Anda dalam undian merchandise.
        </p>
        <div className="bg-blue-50 text-blue-800 p-6 rounded-lg mb-8">
          <p className="font-semibold">
            Pengumuman pemenang yang beruntung akan dilaksanakan pada:
          </p>
          <p className="text-2xl font-bold mt-2">
            {/* Tampilkan tanggal dari database, atau teks default jika kosong */}
            {hadiahData?.announcementDate
              ? new Date(hadiahData.announcementDate).toLocaleDateString(
                  "id-ID",
                  { day: "numeric", month: "long", year: "numeric" }
                )
              : "Tanggal belum diatur"}
          </p>
          <p className="mt-2">
            Pastikan untuk mengunjungi kembali halaman ini pada tanggal
            tersebut.
          </p>
        </div>
        <Button onClick={() => navigate("/")} variant="secondary">
          Kembali ke Halaman Utama
        </Button>
        <FooterCredit />
      </div>
    </div>
  );
};

export default HadiahPage;
