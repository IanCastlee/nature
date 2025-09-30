import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import useThemeStore from "./store/themeStore";
import Header from "./components/molecules/Header";
import Footer from "./components/molecules/Footer";
import HomePage from "./components/pages/HomePage";
import AboutPage from "./components/pages/AboutPage";
import ViewRoomPage from "./components/pages/ViewRoomPage";
import RoomCategoriesPage from "./components/pages/RoomCategoriesPage";
import RoomCategoriesPageAdmin from "../src/admin_components/admin_pages/RoomCategoriesPage";
import CottagesPage from "./components/pages/CottagesPage";
import Test from "./components/pages/Test";
import SignUp from "./components/pages/SignUp";
import SignIn from "./components/pages/SignIn";
import About from "./components/organisms/About";
import Dashboard from "./admin_components/admin_pages/Dashboard";
import AdminSideBar from "./admin_components/admin_molecules/AdminSideBar";
import RoomPage from "./admin_components/admin_pages/RoomPage";
import NotAvailableRoomPage from "./admin_components/admin_pages/NotAvailableRoomPage";
const UserLayout = () => {
  const location = useLocation();

  const hideLayout = ["/signup", "/test", "/signin"];
  const shouldHideLayout = hideLayout.includes(location.pathname);
  return (
    <>
      {!shouldHideLayout && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/room-category/:categoryId"
          element={<RoomCategoriesPage />}
        />
        <Route path="/room-deatails/:roomId" element={<ViewRoomPage />} />
        <Route path="/cottages" element={<CottagesPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/test" element={<Test />} />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
      {!shouldHideLayout && <Footer />}
    </>
  );
};

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div>
      <AdminSideBar
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <main
        className={`min-h-screen transition-all duration-300 p-6 bg-gray-100 dark:bg-gray-800 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/room" element={<RoomPage />} />
          <Route
            path="/not-available-room"
            element={<NotAvailableRoomPage />}
          />
          <Route
            path="/room-categories"
            element={<RoomCategoriesPageAdmin />}
          />
        </Routes>
      </main>
    </div>
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
