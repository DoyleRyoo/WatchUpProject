import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import FirstMeetPage from "../pages/FirstMeetPage";

import LandingPage from "../pages/LandingPage";

import LoginPage from "../pages/LoginPage";

import SignupPage from "../pages/SignupPage";

import WelcomePage from "../pages/WelcomePage";

import DashboardPage from "../pages/DashboardPage";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<FirstMeetPage />}
        />

        <Route
          path="/landing"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<SignupPage />}
        />

        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <WelcomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}