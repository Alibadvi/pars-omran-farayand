import { BrowserRouter, Route, Routes } from "react-router-dom";

import { MainLayout } from "./components/layout/MainLayout";
import { PlaceholderPage } from "./pages/PlaceholderPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            index
            element={
              <PlaceholderPage
                eyebrow="Energy infrastructure"
                title="Engineering the future"
              />
            }
          />

          <Route
            path="about"
            element={
              <PlaceholderPage eyebrow="Company" title="About us" />
            }
          />

          <Route
            path="capabilities"
            element={
              <PlaceholderPage
                eyebrow="What we do"
                title="Capabilities"
              />
            }
          />

          <Route
            path="projects"
            element={
              <PlaceholderPage eyebrow="Our work" title="Projects" />
            }
          />

          <Route
            path="hse"
            element={
              <PlaceholderPage eyebrow="Commitment" title="HSE" />
            }
          />

          <Route
            path="contact"
            element={
              <PlaceholderPage eyebrow="Work with us" title="Contact" />
            }
          />

          <Route
            path="admin"
            element={
              <PlaceholderPage
                eyebrow="Secure access"
                title="Project portal"
              />
            }
          />

          <Route
            path="*"
            element={
              <PlaceholderPage eyebrow="404" title="Page not found" />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;