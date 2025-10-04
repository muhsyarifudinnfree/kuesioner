import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { ref, onValue } from "firebase/database";
import { useAppContext } from "../context/AppContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const QuestionnaireStats = () => {
  const { questionnaireData, loadingSettings } = useAppContext();
  // Ambil daftar pertanyaan dari context, beri array kosong sebagai default
  const questions = questionnaireData?.questions || [];

  const [respondentCount, setRespondentCount] = useState(0);
  const [scores, setScores] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    // Jangan lakukan apa-apa jika daftar pertanyaan belum dimuat
    if (loadingSettings || questions.length === 0) {
      setLoadingData(false);
      return;
    }

    // Inisialisasi state 'scores' dengan jumlah 0 sesuai total pertanyaan
    setScores(Array(questions.length).fill(0));

    const responsesRef = ref(db, "responses");

    const unsubscribe = onValue(responsesRef, (snapshot) => {
      if (snapshot.exists()) {
        const responses = snapshot.val();
        const count = Object.keys(responses).length;
        setRespondentCount(count);

        // Buat array baru untuk skor sesuai jumlah pertanyaan
        const newScores = Array(questions.length).fill(0);
        for (const responseId in responses) {
          const submission = responses[responseId];
          if (submission.jawaban) {
            // Lakukan perulangan sebanyak jumlah pertanyaan yang ada
            for (let i = 0; i < questions.length; i++) {
              const answerValue = Number(submission.jawaban[i]) || 0;
              newScores[i] += answerValue;
            }
          }
        }
        setScores(newScores);
      } else {
        setRespondentCount(0);
        setScores(Array(questions.length).fill(0));
      }
      setLoadingData(false);
    });

    return () => unsubscribe();
  }, [questions, loadingSettings]); // Jalankan ulang jika 'questions' berubah

  const chartData = {
    // Buat label (Q1, Q2, ...) sesuai jumlah pertanyaan
    labels: questions.map((_, index) => `Q${index + 1}`),
    datasets: [
      {
        label: "Total Skor per Pertanyaan",
        data: scores,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Visualisasi Skor Jawaban Kuesioner" },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            // Tampilkan pertanyaan dari array 'questions'
            return questions[index]
              ? `Q${index + 1}: ${questions[index]}`
              : `Q${index + 1}`;
          },
        },
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Total Skor" } },
      x: { title: { display: true, text: "Nomor Pertanyaan" } },
    },
  };

  if (loadingSettings || loadingData)
    return <p className="text-center text-slate-500">Memuat statistik...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Total Responden</h3>
        <p className="text-4xl font-bold text-blue-600">{respondentCount}</p>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Diagram Skor Pertanyaan</h3>
        {respondentCount > 0 && questions.length > 0 ? (
          <Bar options={chartOptions} data={chartData} />
        ) : (
          <p className="text-slate-500">Belum ada data untuk ditampilkan.</p>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireStats;
