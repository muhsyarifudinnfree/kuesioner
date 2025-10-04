import React from "react";

const Header = ({ title, subtitle }) => {
  return (
    <header className="text-center mb-10">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="mt-2 text-md text-gray-600">{subtitle}</p>}
    </header>
  );
};

export default Header;
