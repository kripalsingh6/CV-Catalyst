import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1f] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16">

        {/* ✅ Main Grid (3 columns on md) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand Section */}
          <div>
            <Link
              to="/dashboard"
              onClick={() => window.scrollTo(0, 0)}
              className="flex items-center gap-2 mb-3 cursor-pointer group w-fit"
              title="Go to Dashboard"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-md">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors">
                CV-Catalyst
              </span>
            </Link>
            <p className="text-sm text-gray-400">
              Build ATS-optimized resumes in seconds.
            </p>
          </div>

          {/* Product + Company (grouped in one column) */}
          <div className="grid grid-cols-2 gap-8">

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link to="/dashboard" className="text-gray-400 text-sm hover:text-white cursor-pointer transition">Dashboard</Link></li>
                <li><Link to="/pricing" className="text-gray-400 text-sm hover:text-white cursor-pointer transition">Pricing</Link></li>
                <li><Link to="/templates" className="text-gray-400 text-sm hover:text-white cursor-pointer transition">Templates</Link></li>
                <li><Link to="/dashboard" className="text-gray-400 text-sm hover:text-white cursor-pointer transition">Security</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 text-sm hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 text-sm hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 text-sm hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 text-sm hover:text-white">Press</a></li>
              </ul>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Contact</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Community</a></li>
              <li><a href="#" className="text-gray-400 text-sm hover:text-white">Status</a></li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 my-8">
          <div className="h-px bg-white/10 flex-1" />
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-500 text-xs text-center md:text-left">
            © 2026 CV-Catalyst. All rights reserved.
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300">Privacy</a>
            <a href="#" className="hover:text-gray-300">Terms</a>
            <a href="#" className="hover:text-gray-300">Cookies</a>
            <a href="#" className="hover:text-gray-300">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
}