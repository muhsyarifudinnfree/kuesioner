import React, { createContext, useState, useContext, useEffect } from "react";
import { db } from "../firebase/config";
import { ref, get } from "firebase/database";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [respondentData, setRespondentData] = useState({});
  const [deadline, setDeadline] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [questionnaireData, setQuestionnaireData] = useState(null); // <-- State baru
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    const fetchAllSettings = async () => {
      try {
        const deadlineRef = ref(db, "settings/deadline");
        const questionnaireRef = ref(db, "settings/questionnaire"); // <-- Ref baru

        const [deadlineSnap, questionnaireSnap] = await Promise.all([
          get(deadlineRef),
          get(questionnaireRef), // <-- Ambil data kuesioner
        ]);

        if (deadlineSnap.exists()) setDeadline(deadlineSnap.val().endDate);
        if (questionnaireSnap.exists())
          setQuestionnaireData(questionnaireSnap.val()); // <-- Simpan data kuesioner
      } catch (error) {
        console.error("Gagal mengambil data settings:", error);
      } finally {
        setLoadingSettings(false);
      }
    };
    fetchAllSettings();
  }, []);

  useEffect(() => {
    if (!deadline) {
      if (!loadingSettings) setIsExpired(false);
      return;
    }
    const checkExpiration = () => {
      const isNowExpired = new Date(deadline) < new Date();
      setIsExpired(isNowExpired);
    };
    checkExpiration();
    const interval = setInterval(checkExpiration, 1000);
    return () => clearInterval(interval);
  }, [deadline, loadingSettings]);

  const value = {
    respondentData,
    setRespondentData,
    deadline,
    isExpired,
    questionnaireData, // <-- Kirim data kuesioner ke semua komponen
    loadingSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
