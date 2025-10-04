import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SEOMetadata from "./components/SEOMetadata"; // <-- 1. Impor komponen SEO

// Import Halaman Publik
import LandingPage from "./pages/LandingPage";
import BiodataPage from "./pages/BiodataPage";
import QuestionnairePage from "./pages/QuestionnairePage";
import ThankYouPage from "./pages/ThankYouPage";
import HadiahPage from "./pages/HadiahPage";

// Import Halaman & Komponen Admin
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const backgroundImageUrl =
    "https://sm.pcmag.com/t/pcmag_au/how-to/d/dont-recyc/dont-recycle-it-reuse-it-10-clever-uses-for-your-old-smartph_h7sd.1920.jpg";

  return (
    <Router basename="/kuesioner">
      <SEOMetadata /> {/* <-- 2. Tambahkan komponen di sini */}
      <div
        className="min-h-screen font-sans text-slate-800 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
      >
        <Routes>
          {/* == Rute untuk Pengguna Publik == */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/biodata" element={<BiodataPage />} />
          <Route path="/kuesioner" element={<QuestionnairePage />} />
          <Route path="/selesai" element={<ThankYouPage />} />
          <Route path="/hadiah" element={<HadiahPage />} />

          {/* == Rute untuk Admin == */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
