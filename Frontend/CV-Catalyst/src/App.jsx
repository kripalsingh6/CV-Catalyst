import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/loginPage";
import { PricingPage } from "./pages/pricePage";
import { Signup } from "./pages/signupPage";
import { DashboardPage } from "./pages/Dashboard";
import { BuilderPage, BuilderRedirect } from "./pages/Builder";
import { TemplatesPage } from "./pages/templatePage";
import ProtectedRoute from "./components/layout/protectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/builder"
        element={
          <ProtectedRoute>
            <BuilderRedirect />
          </ProtectedRoute>
        }
      />
      <Route
        path="/builder/:id"
        element={
          <ProtectedRoute>
            <BuilderPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
