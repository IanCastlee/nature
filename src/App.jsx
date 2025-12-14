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
import ViewCottagePage from "./components/pages/ViewCottagePage";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import NotFound from "./components/pages/NotFound";
import TermsAndConditions from "./components/pages/TermsAndConditions";
import AdminFhBooking from "./admin_components/admin_pages/AdminFhBooking";
import AdminBookingFhApproved from "./admin_components/admin_pages/AdminBookingFhApproved";
import AdminBookingFhDeclined from "./admin_components/admin_pages/AdminBookingFhDeclined";
import FunctionHallsPage from "./components/pages/FunctionHallsPage";
import Gallery from "./components/pages/Gallery";
import PendingPost from "./admin_components/admin_pages/PendingPost";
import PostedPost from "./admin_components/admin_pages/PostedPost";
import SearchRoomResult from "./components/pages/SearchRoomResult";
import Verified from "./components/pages/Verified";
import ResendVerification from "./components/pages/ResendVerification";
import ForgotPassword from "./components/pages/ForgotPassword";
import ResetPassword from "./components/pages/ResetPassword";
import AdminAnnouncementPage from "./admin_components/admin_pages/AdminAnnouncementPage";
import AdminAnnouncementHistory from "./admin_components/admin_pages/AdminAnnouncementHistory";
import Tester from "./components/pages/Tester";
import BookWithoutSigningIn from "./components/pages/BookWithoutSigningIn";
import AdminBookingHistoryLog from "./admin_components/admin_pages/AdminBookingHistoryLog";
import FunctionHallBooking from "./components/pages/FunctionHallBooking";
import AdminFhBookingArrived from "./admin_components/admin_pages/AdminFhBookingArrived";
import AdminSetting from "./admin_components/admin_pages/AdminSetting";
import AdminTermsAndConditions from "./admin_components/admin_pages/AdminTermsAndConditions";
import AdminWhyChooseUs from "./admin_components/admin_pages/AdminWhyChooseUs";
import Contacts from "./components/pages/Contacts";
import AdminBookingNotAttended from "./admin_components/admin_pages/AdminBookingNotAttended";
import AdminBookingFhNotAttended from "./admin_components/admin_pages/AdminBookingFhNotAttended";
import AdminBookingReschedLog from "./admin_components/admin_pages/AdminBookingReschedLog";
import AdminBookingReschedLogFh from "./admin_components/admin_pages/AdminBookingReschedLogFh";
import FAQ from "./components/pages/FAQ";
import AdminFAQs from "./admin_components/admin_pages/AdminFAQs";
import AdminTerms from "./admin_components/admin_pages/AdminTerms";
const UserLayout = () => {
  const location = useLocation();

  const hideLayoutPaths = [
    "/signup",
    "/test",
    "/signin",
    "/room-deatails",
    "/booking",
    "/gallery",
    "/other-facilities-booking",
    "/verified",
    "/resend-verification",
    "/forgot",
    "/reset",
    "/reserve",
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
        <Route path="/search-result" element={<SearchRoomResult />} />

        <Route path="/room-deatails/:roomId" element={<ViewRoomPage />} />
        <Route path="/booking/:roomId" element={<BookingPage />} />
        <Route
          path="/booking-fh/:facilityId"
          element={<FunctionHallBooking />}
        />
        <Route
          path="/other-facilities-booking/:facilityId"
          element={<OtherFacilitiesBookingPage />}
        />
        <Route path="/my-booking/:userId" element={<MyBookingPage />} />
        <Route
          path="/funtionhall-deatails/:fhId"
          element={<ViewFunctionHallPage />}
        />
        <Route
          path="/cottage-details/:cottageId"
          element={<ViewCottagePage />}
        />
        <Route path="/cottages" element={<CottagesPage />} />
        <Route path="/function-halls" element={<FunctionHallsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/test" element={<Test />} />
        <Route path="/room-view/:photo" element={<RoomViewTest />} />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/gallery" element={<Gallery />} />

        <Route path="*" element={<NotFound />} />
        <Route path="/verified" element={<Verified />} />
        <Route path="/resend-verification" element={<ResendVerification />} />

        <Route path="/tester" element={<Tester />} />
        <Route path="/reserve/:roomId" element={<BookWithoutSigningIn />} />
        <Route path="/faq" element={<FAQ />} />
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
          <Route path="/booking-approved" element={<AdminBookingHistory />} />
          <Route path="/declined-booking" element={<AdminBookingDeclined />} />
          <Route path="/not-attended" element={<AdminBookingNotAttended />} />
          <Route path="/booking-history" element={<AdminBookingHistoryLog />} />
          <Route path="/rescheduled-log" element={<AdminBookingReschedLog />} />

          <Route path="/fh-booking" element={<AdminFhBooking />} />
          <Route
            path="/fhbooking-history"
            element={<AdminFhBookingArrived />}
          />
          <Route
            path="/fhbooking-declined"
            element={<AdminBookingFhDeclined />}
          />
          <Route
            path="/fhbooking-approved"
            element={<AdminBookingFhApproved />}
          />
          <Route
            path="/fhbooking-not-attended"
            element={<AdminBookingFhNotAttended />}
          />

          <Route path="/verified-users" element={<VerifiedUsers />} />
          <Route path="/notverified-users" element={<NotVerifiedUsers />} />

          <Route path="/pending-post" element={<PendingPost />} />
          <Route path="/posted-post" element={<PostedPost />} />

          <Route path="/announcement" element={<AdminAnnouncementPage />} />
          <Route path="/setting" element={<AdminSetting />} />
          <Route
            path="/announcement-history"
            element={<AdminAnnouncementHistory />}
          />
          <Route
            path="/rescheduled-fh-log"
            element={<AdminBookingReschedLogFh />}
          />

          <Route path="/terms" element={<AdminTerms />} />
          {/* <Route path="/terms" element={<AdminTermsAndConditions />} /> */}
          <Route path="/why-choose-us" element={<AdminWhyChooseUs />} />
          <Route path="/faqs" element={<AdminFAQs />} />
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
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
