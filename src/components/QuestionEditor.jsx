import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { ref, get, set } from "firebase/database";
import Button from "./Button";
import { ALL_QUESTIONS as defaultQuestions } from "../data/questions";

const defaultChoices = {
  5: "Sangat Setuju",
  4: "Setuju",
  3: "Agak Setuju",
  2: "Kurang Setuju",
  1: "Tidak Setuju",
};

const QuestionEditor = () => {
  const [questions, setQuestions] = useState([]);
  const [choices, setChoices] = useState(defaultChoices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const questionnaireRef = ref(db, "settings/questionnaire");
    get(questionnaireRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setQuestions(data.questions || []);
        setChoices(data.answerChoices || defaultChoices);
      } else {
        setQuestions(defaultQuestions);
      }
      setLoading(false);
    });
  }, []);

  // --- FUNGSI UNTUK MENGUBAH JUMLAH PERTANYAAN (SUDAH DIPERBAIKI) ---
  const handleTotalQuestionsChange = (e) => {
    const newTotal = parseInt(e.target.value, 10) || 0;
    const currentTotal = questions.length;

    if (newTotal < 0) return; // Mencegah angka negatif

    if (newTotal < currentTotal) {
      if (
        window.confirm(
          `Anda yakin ingin mengurangi jumlah pertanyaan dari ${currentTotal} menjadi ${newTotal}? Pertanyaan yang berlebih akan dihapus.`
        )
      ) {
        setQuestions((currentQuestions) => currentQuestions.slice(0, newTotal));
      }
      // Jika user menekan 'cancel', tidak ada yang terjadi, dan input akan kembali ke nilai `questions.length` pada render berikutnya.
    } else {
      const additionalQuestions = Array(newTotal - currentTotal).fill("");
      setQuestions((currentQuestions) => [
        ...currentQuestions,
        ...additionalQuestions,
      ]);
    }
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleChoiceChange = (key, value) => {
    setChoices({ ...choices, [key]: value });
  };

  const handleSave = async () => {
    const questionnaireRef = ref(db, "settings/questionnaire");
    try {
      await set(questionnaireRef, {
        questions: questions,
        answerChoices: choices,
      });
      alert("Pertanyaan dan jawaban berhasil disimpan!");
    } catch (error) {
      alert("Gagal menyimpan perubahan.");
      console.error(error);
    }
  };

  const handleInitialize = async () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin mengembalikan semua pertanyaan (50 soal) dan jawaban ke default? Perubahan yang belum disimpan akan hilang."
      )
    ) {
      setQuestions(defaultQuestions);
      setChoices(defaultChoices);
      const questionnaireRef = ref(db, "settings/questionnaire");
      await set(questionnaireRef, {
        questions: defaultQuestions,
        answerChoices: defaultChoices,
      });
      alert("Pertanyaan dan jawaban berhasil diinisialisasi ke default.");
    }
  };

  if (loading) return <p>Memuat editor pertanyaan...</p>;

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="totalQuestions"
          className="block text-sm font-medium text-slate-700"
        >
          Jumlah Total Pertanyaan
        </label>
        <input
          type="number"
          id="totalQuestions"
          value={questions.length} // <-- Diubah ke 'value'
          onChange={handleTotalQuestionsChange} // <-- Diubah ke 'onChange'
          className="mt-1 block w-full max-w-xs rounded-md border-slate-300 shadow-sm"
          min="1"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">
          Pengaturan Pilihan Jawaban
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.keys(choices)
            .sort((a, b) => b - a)
            .map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700">
                  Skor {key}
                </label>
                <input
                  type="text"
                  value={choices[key]}
                  onChange={(e) => handleChoiceChange(key, e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                />
              </div>
            ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">
          Pengaturan Pertanyaan ({questions.length} Soal)
        </h3>
        <div className="space-y-3">
          {questions.map((q, index) => (
            <div key={index} className="flex items-center gap-2">
              <label className="text-sm font-semibold w-8 flex-shrink-0">
                {index + 1}.
              </label>
              <textarea
                value={q}
                rows={1}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                className="block w-full rounded-md border-slate-300 shadow-sm text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 pt-4 border-t">
        <Button onClick={handleSave}>Simpan Semua Perubahan</Button>
        <Button onClick={handleInitialize} variant="secondary">
          Inisialisasi/Reset ke Default
        </Button>
      </div>
    </div>
  );
};

export default QuestionEditor;
