import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Login/LoginPage";
import SignupPage from "./Login/SignupPage";
import ForgotPasswordPage from "./Login/ForgotPasswordPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    </Routes>
  );
}
