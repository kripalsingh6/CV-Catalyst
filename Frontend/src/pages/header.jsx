import { FileText, LogOut, User as UserIcon, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { User, Logout } = useAuth();

  const handleLogout = async () => {
    try {
      await Logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50">
      
      {/* Logo */}
      <div 
        onClick={() => {
          window.scrollTo(0, 0);
          navigate(User ? "/dashboard" : "/");
        }}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white group-hover:text-gray-200 transition-colors">
          CV-Catalyst
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
        <button 
          onClick={() => navigate("/pricing")}
          className={`hover:text-white transition-colors cursor-pointer ${
            location.pathname === "/pricing" ? "text-white font-medium" : ""
          }`}
        >
          Pricing
        </button>

        {User && (
          <button 
            onClick={() => {
              window.scrollTo(0, 0);
              navigate("/dashboard");
            }}
            className={`hover:text-white transition-colors cursor-pointer ${
              location.pathname === "/dashboard" ? "text-white font-medium" : ""
            }`}
          >
            Dashboard
          </button>
        )}

        <button 
          onClick={() => navigate("/templates")}
          className={`hover:text-white transition-colors cursor-pointer ${
            location.pathname === "/templates" ? "text-white font-medium" : ""
          }`}
        >
          Templates
        </button>

        <button 
          onClick={() => navigate(User ? "/builder" : "/login")}
          className={`hover:text-white transition-colors cursor-pointer ${
            location.pathname.startsWith("/builder") ? "text-white font-medium" : ""
          }`}
        >
          Builder
        </button>
      </nav>

      {/* Auth Actions */}
      <div className="flex items-center gap-4">
        {User ? (
          <div className="flex items-center gap-3">
            {/* User Profile Badge */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                {User.name ? User.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-white leading-tight">
                  {User.name || "User"}
                </span>
                <span className="text-[10px] text-red-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {User.subscription === "pro" ? "CV-CATALYST PRO" : "FREE PLAN"}
                </span>
              </div>
            </div>

            {/* Upgrade Button if Free */}
            {User.subscription !== "pro" && (
              <button
                onClick={() => navigate("/pricing")}
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-semibold rounded-xl hover:opacity-90 transition cursor-pointer shadow-md shadow-red-500/20"
              >
                <Sparkles className="w-3 h-3" />
                Upgrade Pro
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer border border-white/5"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-xs font-medium text-gray-300 hover:text-white transition cursor-pointer px-3 py-2"
            >
              Log in
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition cursor-pointer shadow-lg shadow-red-500/20"
            >
              Sign up
            </button>
          </div>
        )}
      </div>

    </header>
  );
}