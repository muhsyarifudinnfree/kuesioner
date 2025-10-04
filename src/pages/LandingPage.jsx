import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { ref, get } from "firebase/database";
import Button from "../components/Button";
import { useAppContext } from "../context/AppContext";
import FooterCredit from "../components/FooterCredit";

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        Hari: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Jam: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Menit: Math.floor((difference / 1000 / 60) % 60),
        Detik: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents = Object.keys(timeLeft).map((interval, i) => (
    <div key={i} className="text-center">
      <div className="text-2xl md:text-4xl font-bold bg-blue-500 text-white p-3 rounded-lg min-w-[60px]">
        {String(timeLeft[interval]).padStart(2, "0")}
      </div>
      <div className="text-xs mt-1 uppercase">{interval}</div>
    </div>
  ));

  return timerComponents.length ? (
    <div className="flex justify-center gap-3 md:gap-4">{timerComponents}</div>
  ) : (
    <span className="text-xl font-bold text-red-600">
      Pengumpulan data telah berakhir.
    </span>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  // Ambil semua data yang dibutuhkan dari context
  const { setRespondentData, isExpired, deadline, loadingSettings } =
    useAppContext();

  const [researcherInfo, setResearcherInfo] = useState({});
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    // useEffect ini sekarang hanya untuk mengambil data profil peneliti
    const fetchProfile = async () => {
      try {
        const profileRef = ref(db, "settings/researcherProfile");
        const profileSnap = await get(profileRef);
        if (profileSnap.exists()) setResearcherInfo(profileSnap.val());
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleStart = () => {
    setRespondentData({});
    navigate("/biodata");
  };

  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  if (loadingProfile || loadingSettings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg">
          Memuat...
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-2xl w-full bg-white p-8 md:p-12 rounded-2xl shadow-lg text-center">
        <img
          src={researcherInfo.imageUrl || "https://via.placeholder.com/150"}
          alt={`Foto ${researcherInfo.name}`}
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover ring-4 ring-blue-200"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          Kuesioner Manfaat Smartphone
        </h1>
        <p className="text-lg font-medium text-slate-700">
          Oleh: <strong>{researcherInfo.name || "..."}</strong>
        </p>
        <p className="text-slate-600 leading-relaxed mt-6 mb-8">
          {researcherInfo.intro || "..."}
        </p>

        <div className="mb-8 p-4 bg-slate-50 rounded-lg">
          <h3 className="font-semibold text-slate-800 mb-2">
            {isExpired
              ? "Status Pengumpulan Data"
              : "Batas Waktu Pengumpulan Data"}
          </h3>
          {deadline ? (
            <>
              {!isExpired && (
                <p className="text-sm text-slate-600 mb-4">
                  Berakhir pada: {formattedDeadline}
                </p>
              )}
              <CountdownTimer targetDate={deadline} />
            </>
          ) : (
            <p>Batas waktu belum diatur.</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleStart} disabled={isExpired}>
            {isExpired ? "Waktu Habis" : "Mulai Isi Kuesioner"}
          </Button>
          <Button onClick={() => navigate("/hadiah")} variant="secondary">
            Lihat Info Hadiah
          </Button>
        </div>
        <FooterCredit />
      </div>
    </div>
  );
};

export default LandingPage;
