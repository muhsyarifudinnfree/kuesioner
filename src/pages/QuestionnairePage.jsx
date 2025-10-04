import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { db } from "../firebase/config";
import { ref, push } from "firebase/database";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";
import { ALL_QUESTIONS } from "../data/questions";

const QuestionnairePage = () => {
  const navigate = useNavigate();
  const { respondentData, isExpired, loadingSettings, questionnaireData } =
    useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState([]);

  const ALL_QUESTIONS = questionnaireData?.questions || [];
  const labels = questionnaireData?.answerChoices || {};

  let questionsPerPage = 10;
  if (ALL_QUESTIONS.length > 0) {
    if (ALL_QUESTIONS.length <= 10) questionsPerPage = ALL_QUESTIONS.length;
    else if (ALL_QUESTIONS.length % 10 === 0) questionsPerPage = 10;
    else if (ALL_QUESTIONS.length % 5 === 0) questionsPerPage = 5;
    else if (ALL_QUESTIONS.length % 8 === 0) questionsPerPage = 8;
    else if (ALL_QUESTIONS.length % 7 === 0) questionsPerPage = 7;
  }
  const totalPages = Math.ceil(ALL_QUESTIONS.length / questionsPerPage) || 1;

  useEffect(() => {
    if (loadingSettings) return;
    if (isExpired) {
      alert("Waktu pengisian kuesioner telah berakhir.");
      navigate("/");
    } else if (!respondentData || !respondentData.nama) {
      alert("Silakan isi biodata Anda terlebih dahulu.");
      navigate("/biodata");
    }
  }, [respondentData, isExpired, loadingSettings, navigate]);

  const handleBackClick = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
      setErrors([]);
    } else {
      navigate("/biodata");
    }
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers({ ...answers, [questionIndex]: value });
    if (errors.includes(questionIndex)) {
      setErrors(errors.filter((err) => err !== questionIndex));
    }
  };

  const validateCurrentPage = () => {
    const questionStartIndex = (currentPage - 1) * questionsPerPage;
    const questionsOnPage = ALL_QUESTIONS.slice(
      questionStartIndex,
      questionStartIndex + questionsPerPage
    );
    const unansweredQuestions = [];
    for (let i = 0; i < questionsOnPage.length; i++) {
      const questionIndex = questionStartIndex + i;
      if (answers[questionIndex] === undefined) {
        unansweredQuestions.push(questionIndex);
      }
    }
    setErrors(unansweredQuestions);
    return unansweredQuestions.length === 0;
  };

  const handleNextClick = () => {
    if (validateCurrentPage()) {
      setCurrentPage((p) => p + 1);
    }
  };

  const handleSubmit = async () => {
    if (validateCurrentPage()) {
      const finalData = {
        biodata: respondentData,
        jawaban: answers,
        tanggalPengisian: new Date().toISOString(),
      };
      try {
        const responsesRef = ref(db, "responses");
        const newResponseRef = await push(responsesRef, finalData);
        const submissionId = newResponseRef.key;
        navigate("/selesai", { state: { submissionId: submissionId } });
      } catch (error) {
        console.error("Gagal mengirim data:", error);
        alert("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
      }
    }
  };

  const questionsForPage = ALL_QUESTIONS.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );
  const questionStartIndex = (currentPage - 1) * questionsPerPage;

  if (
    loadingSettings ||
    isExpired ||
    !respondentData?.nama ||
    !questionnaireData
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Memeriksa status...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-2">
          Kuesioner Manfaat Smartphone
        </h2>
        <p className="text-center text-slate-500 mb-6">
          Halaman {currentPage} dari {totalPages}
        </p>
        <ProgressBar currentStep={currentPage} totalSteps={totalPages} />
        <div className="space-y-6">
          {questionsForPage.map((q, index) => {
            const questionIndex = questionStartIndex + index;
            const hasError = errors.includes(questionIndex);
            return (
              <div
                key={questionIndex}
                className={`p-4 border rounded-lg transition-all ${
                  hasError ? "border-red-500 border-2" : "border-gray-200"
                }`}
              >
                <p className="font-medium mb-3">
                  {questionIndex + 1}. {q}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {Object.entries(labels)
                    .reverse()
                    .map(([value, label]) => (
                      <label
                        key={value}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question_${questionIndex}`}
                          value={value}
                          checked={answers[questionIndex] === value}
                          onChange={() =>
                            handleAnswerChange(questionIndex, value)
                          }
                          className="form-radio h-5 w-5 text-blue-600"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                </div>
                {hasError && (
                  <p className="text-red-600 text-sm mt-2">
                    Pertanyaan ini wajib diisi.
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-10">
          <Button onClick={handleBackClick} variant="secondary">
            Kembali
          </Button>
          {currentPage < totalPages ? (
            <Button onClick={handleNextClick}>Selanjutnya</Button>
          ) : (
            <Button onClick={handleSubmit}>Selesai & Kirim</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePage;
