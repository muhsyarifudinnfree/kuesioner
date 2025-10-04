import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfileEditor from "../../components/ProfileEditor";
import HadiahEditor from "../../components/HadiahEditor";
import DeadlineEditor from "../../components/DeadlineEditor";
import QuestionEditor from "../../components/QuestionEditor"; // Impor baru
import QuestionnaireStats from "../../components/QuestionnaireStats";
import RespondentTable from "../../components/RespondentTable";
import FooterCredit from "../../components/FooterCredit";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Gagal untuk logout", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Login sebagai: {currentUser.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <main className="grid grid-cols-1 gap-8">
        {/* Bagian Pengaturan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Pengaturan Profil</h2>
            <ProfileEditor />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Pengaturan Batas Waktu
            </h2>
            <DeadlineEditor />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Pengaturan Hadiah</h2>
            <HadiahEditor />
          </div>
        </div>

        {/* Bagian Editor Pertanyaan */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Editor Pertanyaan & Jawaban
          </h2>
          <QuestionEditor />
        </div>

        {/* Bagian Statistik */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Statistik Kuesioner</h2>
          <QuestionnaireStats />
        </div>

        {/* Bagian Tabel Responden */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Detail Jawaban Responden
          </h2>
          <RespondentTable />
        </div>
      </main>
      <FooterCredit />
    </div>
  );
};

export default Dashboard;
