import "./App.css"
import Application from "./pages/Application"
import Report from "./pages/Report";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Home/>}></Route>
          <Route path="/application" element={<Application />} />
          <Route path="/report" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;