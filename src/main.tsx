import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes.tsx";
import "./index.css";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
      <Toaster richColors position="top-center" duration={3000}  closeButton swipeDirections={["top", "bottom", "left", "right"]} />
    </BrowserRouter>
  </React.StrictMode>
);
