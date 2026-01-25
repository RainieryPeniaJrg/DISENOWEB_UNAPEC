import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LayoutShell } from "./components/LayoutShell";
import { HomePage } from "./pages/HomePage";
import { WipPage } from "./pages/WipPage";

export default function App() {
  return (
    <BrowserRouter>
      <LayoutShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sitios" element={<WipPage title="Sitios Turísticos" />} />
          <Route path="/hoteles" element={<WipPage title="Hoteles" />} />
          <Route path="/reservas" element={<WipPage title="Reservas" />} />
          <Route path="/pagos" element={<WipPage title="Pagos" />} />
          <Route path="/perfil" element={<WipPage title="Perfil" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LayoutShell>
    </BrowserRouter>
  );
}
