import MainLayout from "@/layouts/MainLayout";
import MyNavbar from "@/layouts/Navbar";
import Editor from "@/pages/Editor";

function App() {
  return (
    <MainLayout>
      <MyNavbar></MyNavbar>
      <Editor />
    </MainLayout>
  );
}

export default App;
