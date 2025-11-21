import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import Editor from "@/pages/Editor";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="editor" element={<Editor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
