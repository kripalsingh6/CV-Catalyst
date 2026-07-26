import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/loginPage";
import { PricingPage } from "./pages/pricePage";
import { Signup } from "./pages/signupPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PricingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<PricingPage />} />
    </Routes>
  );
}

export default App;
