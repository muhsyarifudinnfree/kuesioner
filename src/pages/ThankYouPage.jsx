import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Button from "../components/Button";
import { db } from "../firebase/config";
import { ref, update } from "firebase/database";

const ThankYouPage = () => {
  const { respondentData, isExpired, loadingSettings } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const submissionId = location.state?.submissionId;

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    if (loadingSettings) return;

    if (isExpired) {
      alert("Waktu pengisian kuesioner telah berakhir.");
      navigate("/");
    } else if (!respondentData || !respondentData.nama) {
      alert("Harap isi kuesioner terlebih dahulu.");
      navigate("/biodata");
    }
  }, [respondentData, isExpired, loadingSettings, navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Silakan pilih file screenshot terlebih dahulu.");
      return;
    }
    if (!submissionId) {
      alert("ID Responden tidak ditemukan. Gagal mengunggah.");
      return;
    }

    setUploading(true);
    setUploadStatus("Mengunggah...");

    const formData = new FormData();
    formData.append("file", file);
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
        // Simpan URL gambar ke database
        const responseRef = ref(db, `responses/${submissionId}`);
        await update(responseRef, { screenshotUrl: data.secure_url });

        setUploadStatus(
          "✔️ Berhasil diunggah! Anda akan dialihkan dalam 3 detik..."
        );
        setUploading(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        throw new Error("Upload gagal.");
      }
    } catch (error) {
      console.error("Error:", error);
      setUploadStatus("❌ Gagal mengunggah. Coba lagi.");
      setUploading(false);
    }
  };

  if (loadingSettings || isExpired || !respondentData || !respondentData.nama) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Memeriksa status...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-2xl w-full bg-white p-8 md:p-12 rounded-2xl shadow-lg text-center">
        <svg
          className="w-20 h-20 text-green-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="text-3xl font-bold text-slate-900 mb-2 leading-tight">
          Terima Kasih, <br />
          {respondentData.nama && respondentData.noHandphone
            ? `${respondentData.nama}_${respondentData.noHandphone}`
            : "Responden"}
          !
        </h1>
        <p className="text-slate-600 mb-8">
          Partisipasi Anda telah direkam dan sangat kami hargai.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md text-left mb-8">
          <h3 className="font-bold">Dapatkan Merchandise Menarik!</h3>
          <p>
            Anda berkesempatan menjadi 1 dari 10 orang yang beruntung. Caranya:
          </p>
          <ol className="list-decimal list-inside mt-2">
            <li>
              **Screenshot** halaman ini (pastikan nama dan No. HP Anda
              terlihat).
            </li>
            <li>Unggah bukti screenshot di bawah ini.</li>
          </ol>
        </div>
        <div className="space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={uploading}
          />
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? "..." : "Kirim Bukti Screenshot"}
          </Button>
          {uploadStatus && <p className="text-sm mt-2">{uploadStatus}</p>}
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
