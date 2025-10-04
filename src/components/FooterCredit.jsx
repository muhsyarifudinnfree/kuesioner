import React from "react";

const FooterCredit = () => {
  return (
    <div className="invitation-credit">
      <p style={{ marginBottom: "5px", fontSize: "0.9rem" }}>
        Halaman ini dibuat oleh:
      </p>
      <a
        href="https://bit.ly/cobabantuin"
        target="_blank"
        rel="noopener noreferrer"
        className="logo"
      >
        <img
          src="https://bantuin.byethost11.com/logo.png"
          alt="Bantu.in Logo"
        />
        <div className="logo-text-container">
          <span className="logo-brand">Bantu.in</span>
          <span className="logo-tagline">Solusi Jasa Digital</span>
        </div>
      </a>
    </div>
  );
};

export default FooterCredit;
