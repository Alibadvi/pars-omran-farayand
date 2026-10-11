import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { MainLayout } from "./components/layout/MainLayout";
import { LanguageProvider } from "./i18n/LanguageContext";
import { PlaceholderPage } from "./pages/PlaceholderPage";

const HomePage = lazy(() => import("./pages/HomePage").then(({ HomePage }) => ({ default: HomePage })));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage").then(({ ProjectsPage }) => ({ default: ProjectsPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then(({ ContactPage }) => ({ default: ContactPage })));

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<PlaceholderPage />} />
          </Route>
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
