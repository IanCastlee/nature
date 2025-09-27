import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useThemeStore from "./store/themeStore";
import Header from "./components/molecules/Header";
import Footer from "./components/molecules/Footer";
import HomePage from "./components/pages/HomePage";
import AboutPage from "./components/pages/AboutPage";
import ViewRoomPage from "./components/pages/ViewRoomPage";
import RoomCategoriesPage from "./components/pages/RoomCategoriesPage";
import CottagesPage from "./components/pages/CottagesPage";
const UserLayout = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/room-category/:categoryId"
          element={<RoomCategoriesPage />}
        />
        <Route path="/room-deatails/:roomId" element={<ViewRoomPage />} />
        <Route path="/cottages" element={<CottagesPage />} />
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
