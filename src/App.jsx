import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../src/components/pages/Home";
import useThemeStore from "./store/themeStore";
import About from "./components/pages/About";
import Header from "./components/molecules/Header";
import Footer from "./components/molecules/Footer";
const UserLayout = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </>
  );
};

const AdminLayout = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Admin Dashboard Placeholder</div>} />
    </Routes>
  );
};

function App() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <Router>
      <Routes>
        <Route path="/*" element={<UserLayout />} />
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
