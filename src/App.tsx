import MainLayout from "@/layouts/MainLayout";
import Navbar from "@/layouts/Navbar";
import Editor from "@/pages/Editor";
import Home from "@/pages/Home";
import { BrowserRouter, Route, Routes } from "react-router";

const configuredBase = import.meta.env.BASE_URL;
const normalizedBase =
  configuredBase.length > 1 && configuredBase.endsWith("/")
    ? configuredBase.slice(0, -1)
    : configuredBase;
const routerBasename =
  typeof window !== "undefined" &&
  normalizedBase !== "/" &&
  window.location.pathname.startsWith(normalizedBase)
    ? normalizedBase
    : "/";

function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <MainLayout>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
