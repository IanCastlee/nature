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
import NotAvailableRoomPage from "./admin_components/admin_pages/NotAvailableRoomPage";
import RoomViewTest from "./components/pages/RoomViewTest";
import AvailableRoomPage from "./admin_components/admin_pages/AvailableRoomPage";
import AvailableFunctionHall from "./admin_components/admin_pages/AvailableFunctionHall";
import NotAvailableFunctionHall from "./admin_components/admin_pages/NotAvailableFunctionHall";
import AvailableCottage from "./admin_components/admin_pages/AvailableCottage";
import NotAvailableCottage from "./admin_components/admin_pages/NotAvailableCottage";
import ViewFunctionHallPage from "./components/pages/ViewFunctionHallPage";
import BookingPage from "./components/pages/BookingPage";
import MyBookingPage from "./components/pages/MyBookingPage";
import OtherFacilitiesBookingPage from "./components/pages/OtherFacilitiesBookingPage";
import AdminBookingPage from "./admin_components/admin_pages/AdminBookingPage";
import AdminBookingHistory from "./admin_components/admin_pages/AdminBookingHistory";
import AdminBookingDeclined from "./admin_components/admin_pages/AdminBookingDeclined";
import VerifiedUsers from "./admin_components/admin_pages/VerifiedUsers";
import NotVerifiedUsers from "./admin_components/admin_pages/NotVerifiedUsers";
const UserLayout = () => {
  const location = useLocation();

  const hideLayoutPaths = [
    "/signup",
    "/test",
    "/signin",
    "/room-deatails",
    "/booking",
    "/other-facilities-booking",
  ];
  const shouldHideLayout = hideLayoutPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const isHome = location.pathname === "/";

  return (
    <>
      {!shouldHideLayout && <Header isHome={isHome} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/room-category/:categoryId"
          element={<RoomCategoriesPage />}
        />
        <Route path="/room-deatails/:roomId" element={<ViewRoomPage />} />
        <Route path="/booking/:roomId" element={<BookingPage />} />
        <Route
          path="/other-facilities-booking/:facilityId"
          element={<OtherFacilitiesBookingPage />}
        />
        <Route path="/my-booking/:userId" element={<MyBookingPage />} />
        <Route
          path="/funtionhall-deatails/:fhId"
          element={<ViewFunctionHallPage />}
        />
        <Route path="/cottages" element={<CottagesPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/test" element={<Test />} />
        <Route path="/room-view/:photo" element={<RoomViewTest />} />

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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/available-room" element={<AvailableRoomPage />} />

          <Route
            path="/not-available-room"
            element={<NotAvailableRoomPage />}
          />
          <Route
            path="/room-categories"
            element={<RoomCategoriesPageAdmin />}
          />

          <Route
            path="/available-function-hall"
            element={<AvailableFunctionHall />}
          />

          <Route
            path="/not-available-function-hall"
            element={<NotAvailableFunctionHall />}
          />

          <Route path="/available-cottage" element={<AvailableCottage />} />

          <Route
            path="/not-available-cottage"
            element={<NotAvailableCottage />}
          />

          <Route path="/booking" element={<AdminBookingPage />} />
          <Route path="/booking-history" element={<AdminBookingHistory />} />
          <Route path="/declined-booking" element={<AdminBookingDeclined />} />

          <Route path="/verified-users" element={<VerifiedUsers />} />
          <Route path="/notverified-users" element={<NotVerifiedUsers />} />
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
