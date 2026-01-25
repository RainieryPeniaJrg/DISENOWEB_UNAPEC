import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LayoutShell } from "./components/LayoutShell";
import { HomePage } from "./pages/HomePage";
import { WipPage } from "./pages/WipPage";
import { SitiosPage } from "./pages/SitiosPage";
import { HotelesPage } from "./pages/HotelesPage";

export default function App() {
  return (
    <BrowserRouter>
      <LayoutShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sitios" element={<SitiosPage />} />
          <Route path="/hoteles" element={<HotelesPage />} />
          <Route path="/reservas" element={<WipPage title="Reservas" />} />
          <Route path="/pagos" element={<WipPage title="Pagos" />} />
          <Route path="/perfil" element={<WipPage title="Perfil" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LayoutShell>
    </BrowserRouter>
  );
}
