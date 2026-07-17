import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Headers() {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/5">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
          <FileText
            onClick={() => navigate("/dashboard")} // fixed typo
            className="h-4 w-4 text-white cursor-pointer"
          />
        </div>
        <span
          onClick={() => navigate("/")}
          className="text-lg font-semibold cursor-pointer"
        >
          CV-Catalyst
        </span>
      </div>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
        <button className="hover:text-white transition-colors">
          Templates
        </button>
        <button className="hover:text-white transition-colors">
          Pricing
        </button>
        <button className="hover:text-white transition-colors">
          FAQ
        </button>
      </nav>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4"> {/* fixed typo: item-center */}
        <button
          onClick={() => navigate("/login")}
          className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          Log in
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition cursor-pointer"
        >
          Sign up
        </button>
      </div>

    </header>
  );
}