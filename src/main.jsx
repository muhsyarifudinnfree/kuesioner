import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async"; // <-- Impor

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      {" "}
      {/* <-- Bungkus di paling luar */}
      <AuthProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
