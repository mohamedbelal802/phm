import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import AboutPage from "../pages/about/AboutPage";
import NotFoundPage from "../pages/NotFoundPage";
import ErrorBoundary from "../components/ErrorBoundary";

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRoutes;
