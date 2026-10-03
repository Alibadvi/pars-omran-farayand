import { BrowserRouter, Route, Routes } from "react-router-dom";

import { MainLayout } from "./components/layout/MainLayout";
import { LanguageProvider } from "./i18n/LanguageContext";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { ProjectsPage } from "./pages/ProjectsPage";

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route
              path="admin"
              element={
                <PlaceholderPage eyebrow="Secure access" title="Project portal" />
              }
            />
            <Route
              path="*"
              element={<PlaceholderPage eyebrow="404" title="Page not found" />}
            />
          </Route>
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
