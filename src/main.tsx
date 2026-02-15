import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "./styles/global.css"
import "./styles/ui.css"
import BuilderPage from "./pages/BuilderPage"
import FormFillPage from "./pages/FormFillPage"
import TemplateFillPage from "./pages/TemplateFillPage"
import AdminDashboard from "./pages/AdminDashboard"


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/build" replace />} />
        <Route path="/build" element={<BuilderPage />} />
        <Route path="/f/:slug" element={<FormFillPage />} />
        <Route path="/template" element={<TemplateFillPage />} />
        <Route path="/f/:slug/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
