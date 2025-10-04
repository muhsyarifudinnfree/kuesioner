import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Button from "../components/Button";

const BiodataPage = () => {
  const navigate = useNavigate();
  const { respondentData, setRespondentData, isExpired, loadingSettings } =
    useAppContext();

  useEffect(() => {
    if (loadingSettings) return;

    if (isExpired) {
      alert("Waktu pengisian kuesioner telah berakhir.");
      navigate("/");
    }
  }, [isExpired, loadingSettings, navigate]);

  const [formData, setFormData] = useState({
    nama: respondentData.nama || "",
    noHandphone: respondentData.noHandphone || "",
    domisili: respondentData.domisili || "",
    usia: respondentData.usia || "",
  });

  const [domisiliError, setDomisiliError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [usiaError, setUsiaError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "domisili" && value.includes(",")) {
      setDomisiliError("");
    }
    if (name === "usia" && value.length <= 2) {
      setUsiaError("");
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value !== "" && !/^[0-9]*$/.test(value)) return;
    if (value.startsWith("08") && value.length > 13) return;
    if (value.length > 13) return;

    if (value.startsWith("08")) {
      setPhoneError("");
    }

    setFormData({ ...formData, noHandphone: value });
  };

  const handleUsiaChange = (e) => {
    const value = e.target.value;
    if (value !== "" && !/^[0-9]*$/.test(value)) return;
    if (value.length > 2) return;
    if (value.length <= 2) {
      setUsiaError("");
    }
    setFormData({ ...formData, usia: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    if (!formData.noHandphone.startsWith("08")) {
      setPhoneError("Nomor handphone harus diawali dengan '08'.");
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (!formData.domisili.includes(",")) {
      setDomisiliError("Format salah. Harap isi Kecamatan, Kota/Kabupaten.");
      isValid = false;
    } else {
      setDomisiliError("");
    }

    if (
      formData.usia.length === 0 ||
      formData.usia.length > 2 ||
      Number(formData.usia) < 1
    ) {
      setUsiaError("Usia harus diisi (maks. 2 digit).");
      isValid = false;
    } else {
      setUsiaError("");
    }

    if (isValid) {
      setRespondentData(formData);
      navigate("/kuesioner");
    }
  };

  if (loadingSettings || isExpired) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Memeriksa status...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Langkah 1: Isi Biodata Anda
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="nama"
              className="block text-sm font-medium text-slate-700"
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama"
              id="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Contoh: Putri Diana Andini"
              required
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="noHandphone"
              className="block text-sm font-medium text-slate-700"
            >
              No. Handphone (Terhubung Whatsapp Aktif)
            </label>
            <input
              type="tel"
              name="noHandphone"
              id="noHandphone"
              value={formData.noHandphone}
              onChange={handlePhoneChange}
              placeholder="Contoh: 081234567890"
              required
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                phoneError ? "border-red-500" : "border-slate-300"
              }`}
            />
            {phoneError ? (
              <p className="text-red-600 text-sm mt-1">{phoneError}</p>
            ) : (
              <p className="text-xs text-slate-500 mt-1">
                Wajib diawali '08', maksimal 13 digit.
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="domisili"
              className="block text-sm font-medium text-slate-700"
            >
              Domisili (Kecamatan, Kota/Kabupaten)
            </label>
            <input
              type="text"
              name="domisili"
              id="domisili"
              value={formData.domisili}
              onChange={handleChange}
              placeholder="Contoh: Koja, Jakarta Utara"
              required
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                domisiliError ? "border-red-500" : "border-slate-300"
              }`}
            />
            {domisiliError && (
              <p className="text-red-600 text-sm mt-1">{domisiliError}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="usia"
              className="block text-sm font-medium text-slate-700"
            >
              Usia
            </label>
            <input
              type="number"
              name="usia"
              id="usia"
              value={formData.usia}
              onChange={handleUsiaChange}
              placeholder="Contoh: 21"
              required
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                usiaError ? "border-red-500" : "border-slate-300"
              }`}
            />
            {usiaError ? (
              <p className="text-red-600 text-sm mt-1">{usiaError}</p>
            ) : (
              <p className="text-xs text-slate-500 mt-1">Maksimal 2 digit.</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row-reverse gap-4 pt-2">
            <Button type="submit" className="w-full">
              Lanjutkan Isi Kuesioner
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/")}
              variant="secondary"
              className="w-full"
            >
              Kembali
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BiodataPage;
