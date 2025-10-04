import React from "react";

const LikertScaleQuestion = ({ question, name, value, onChange }) => {
  const labels = {
    1: "Sangat Tidak Setuju",
    2: "Tidak Setuju",
    3: "Netral",
    4: "Setuju",
    5: "Sangat Setuju",
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg mb-4 bg-white shadow-sm">
      <p className="font-medium text-gray-800 mb-3">{question}</p>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap gap-3">
        {[1, 2, 3, 4, 5].map((level) => (
          <label
            key={level}
            className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-blue-50"
          >
            <input
              type="radio"
              name={name}
              value={level}
              checked={Number(value) === level}
              onChange={onChange}
              className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">
              {labels[level]} ({level})
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default LikertScaleQuestion;
