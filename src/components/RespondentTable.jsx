import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { ref, onValue, remove } from "firebase/database";
import { useAppContext } from "../context/AppContext";
import * as XLSX from "xlsx";
import Button from "./Button";

const RespondentTable = () => {
  const { questionnaireData } = useAppContext();
  const questions = questionnaireData?.questions || [];

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const responsesRef = ref(db, "responses");
    const unsubscribe = onValue(responsesRef, (snapshot) => {
      if (snapshot.exists()) {
        const responsesData = snapshot.val();
        const formattedData = Object.keys(responsesData).map((key) => ({
          id: key,
          ...responsesData[key],
        }));
        setSubmissions(formattedData.reverse());
      } else {
        setSubmissions([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = (submissionId, respondentName) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus data responden "${respondentName}"?`
      )
    ) {
      const responseRef = ref(db, `responses/${submissionId}`);
      remove(responseRef).catch((error) => {
        alert("Gagal menghapus data.");
        console.error(error);
      });
    }
  };

  const handleExport = () => {
    if (submissions.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    const dataToExport = submissions.map((sub) => {
      const row = {
        Nama: sub.biodata?.nama,
        "No HP": sub.biodata?.noHandphone,
        Domisili: sub.biodata?.domisili,
        Usia: sub.biodata?.usia,
        "Tanggal Pengisian": new Date(sub.tanggalPengisian).toLocaleString(
          "id-ID"
        ),
        "URL Screenshot": sub.screenshotUrl || "N/A",
      };

      for (let i = 0; i < questions.length; i++) {
        row[`Q${i + 1}`] = sub.jawaban?.[i] || "";
      }
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jawaban Responden");

    worksheet["!cols"] = [
      { wch: 25 }, // Nama
      { wch: 15 }, // No HP
      { wch: 25 }, // Domisili
      { wch: 5 }, // Usia
      { wch: 20 }, // Tanggal
      { wch: 50 }, // URL Screenshot
    ];

    XLSX.writeFile(workbook, "DataKuesionerResponden.xlsx");
  };

  if (loading) {
    return (
      <p className="text-center text-slate-500">Memuat data responden...</p>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleExport} disabled={submissions.length === 0}>
          📥 Export ke Excel
        </Button>
      </div>
      {submissions.length === 0 ? (
        <p className="text-center text-slate-500">
          Belum ada responden yang mengisi kuesioner.
        </p>
      ) : (
        <div className="overflow-x-auto relative shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Aksi
                </th>
                <th scope="col" className="py-3 px-6">
                  Screenshot
                </th>
                <th scope="col" className="py-3 px-6">
                  Nama
                </th>
                <th scope="col" className="py-3 px-6">
                  No. HP
                </th>
                <th scope="col" className="py-3 px-6">
                  Domisili
                </th>
                <th scope="col" className="py-3 px-6">
                  Usia
                </th>
                {Array.from({ length: questions.length }, (_, i) => (
                  <th
                    key={`head-q${i + 1}`}
                    scope="col"
                    className="py-3 px-6 text-center cursor-pointer"
                    title={questions[i]}
                  >{`Q${i + 1}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr
                  key={submission.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    {/* --- BAGIAN YANG DIUBAH: Mengganti teks 'Hapus' dengan ikon SVG --- */}
                    <button
                      onClick={() =>
                        handleDelete(submission.id, submission.biodata?.nama)
                      }
                      className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-md hover:bg-red-50"
                      title="Hapus Respon"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.84 48.84 0 013.898.586.75.75 0 01.612.863l-1.688 10.9a48.841 48.841 0 01-3.898.586h-.145c-1.321 0-2.614-.078-3.882-.236l-1.687-10.9a.75.75 0 01.612-.863 48.841 48.841 0 013.898.586v-.227a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75zm-9 0v.227a48.841 48.841 0 013.898.586.75.75 0 01.612.863l-1.688 10.9a48.841 48.841 0 01-3.898.586h-.145c-1.321 0-2.614-.078-3.882-.236L3 6.142a.75.75 0 01.612-.863 48.84 48.84 0 013.898-.586v-.227a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75z"
                          clipRule="evenodd"
                        />
                        <path d="M5.503 4.5v.65L7 6.096V4.5A.75.75 0 006.25 3.75h-1.5a.75.75 0 00-.747.75zM12 2.25a.75.75 0 01.75.75v6.126l-1.296-.405-1.296.405V3a.75.75 0 01.75-.75h1.5zm6.497 2.25v.65L17 6.096V4.5A.75.75 0 0017.75 3.75h1.5a.75.75 0 00.747-.75z" />
                      </svg>
                    </button>
                    {/* --- AKHIR BAGIAN YANG DIUBAH --- */}
                  </td>
                  <td className="py-4 px-6">
                    {submission.screenshotUrl ? (
                      <a
                        href={submission.screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={submission.screenshotUrl}
                          alt="screenshot"
                          className="w-24 h-auto rounded hover:scale-150 transition-transform origin-left"
                        />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">Belum Ada</span>
                    )}
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                    {submission.biodata?.nama || "-"}
                  </td>
                  <td className="py-4 px-6">
                    {submission.biodata?.noHandphone || "-"}
                  </td>
                  <td className="py-4 px-6">
                    {submission.biodata?.domisili || "-"}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {submission.biodata?.usia || "-"}
                  </td>
                  {Array.from({ length: questions.length }, (_, i) => (
                    <td
                      key={`sub-${submission.id}-q${i}`}
                      className="py-4 px-6 text-center"
                    >
                      {submission.jawaban?.[i] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RespondentTable;
