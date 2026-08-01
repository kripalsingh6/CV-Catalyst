import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import toast, { Toaster } from "react-hot-toast";
import { Check, X, FileText, Users, Sparkles, Loader2, Crown, Zap, ShieldCheck } from "lucide-react";
import axios from "axios";
import Header from "./header";
import { Footer } from "./footer";

const API_BASE = "http://localhost:3000";

const FREE_FEATURES = [
  { label: "5 resume generations / month", on: true },
  { label: "Basic ATS score check", on: true },
  { label: "1 classic template", on: true },
  { label: "AI rewrite & keyword match", on: false },
  { label: "Modern & minimal templates", on: false },
  { label: "Priority support", on: false },
];

const PRO_FEATURES = [
  { label: "Unlimited resume generations", on: true },
  { label: "Advanced ATS score analysis", on: true },
  { label: "All templates (classic, modern, minimal)", on: true },
  { label: "Smart JD keyword matching", on: true },
  { label: "Full rewrite engine", on: true },
  { label: "Priority support", on: true },
];

const PRICING = {
  monthly: { amount: 1, label: "₹1", sub: "/mo" },
  yearly: { amount: 4199, label: "₹4,199", sub: "/yr", strike: "₹5,988", billedNote: "billed yearly · save ~30%" },
};

export function PricingPage() {
  const { User, fetchMe } = useAuth();
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly");
  const [isProcessing, setIsProcessing] = useState(false);

  const proPlan = PRICING[billing];

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleUpgrade = async () => {
    if (!User) {
      toast.error("Please sign in to upgrade");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway");
        return;
      }

      const { data } = await axios.post(
        `${API_BASE}/api/payment/create-order`,
        { billingCycle: billing },
        { withCredentials: true }
      );

      // Local Dev Test Order Handling (if test keys are unverified on Razorpay server)
      if (data.orderId && data.orderId.startsWith("order_dev_")) {
        toast.loading("Verifying test payment...", { id: "pay-toast" });
        await axios.post(
          `${API_BASE}/api/payment/verify`,
          {
            razorpay_order_id: data.orderId,
            razorpay_payment_id: `pay_dev_${Date.now()}`,
            razorpay_signature: "dev_test_signature",
            billingCycle: billing,
          },
          { withCredentials: true }
        );
        await fetchMe();
        toast.success("Payment successful! Welcome to Pro", { id: "pay-toast" });
        return navigate("/dashboard");
      }

      // Real Razorpay Checkout Modal
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "CV-Catalyst Pro",
        description: `CV-Catalyst Pro — ${billing === "monthly" ? "Monthly" : "Yearly"}`,
        order_id: data.orderId,
        prefill: { name: User?.name || "", email: User?.email || "" },
        theme: { color: "#ef4444" },
        handler: async (response) => {
          try {
            await axios.post(
              `${API_BASE}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                billingCycle: billing,
              },
              { withCredentials: true }
            );
            await fetchMe();
            toast.success("Payment successful! Welcome to Pro");
            navigate("/dashboard");
          } catch {
            toast.error("Payment verification failed");
          }
        },
        modal: { ondismiss: () => setIsProcessing(false) },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again");
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error) {
      console.error("Razorpay order creation error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.response?.data?.error || "Could not create payment order");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden flex flex-col">
      <Toaster position="top-right" />

      {/* Ambient background glows */}
      <div className="absolute w-[700px] h-[700px] bg-red-600/10 blur-[160px] rounded-full top-[-100px] left-[-100px] pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-orange-600/10 blur-[160px] rounded-full bottom-[-100px] right-[-100px] pointer-events-none" />

      {/* Unified Site Header */}
      <Header />

      {/* Main Pricing Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full z-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Transparent Pricing Plans</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Accelerate Your Career with <span className="text-white">CV-Catalyst Pro</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Simple, predictable pricing with no hidden fees. Upgrade to unlock unlimited AI optimization and premium templates.
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1.5 flex items-center shadow-xl">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                billing === "monthly"
                  ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
                billing === "yearly"
                  ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span>Yearly Billing</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Save ~30%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
          
          {/* FREE TIER CARD */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-2xl">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white">Free Starter</h3>
                <Sparkles className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-gray-400 text-xs mb-6">Perfect for trying out basic ATS scoring.</p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">₹0</span>
                <span className="text-gray-400 text-xs ml-1">/forever</span>
              </div>

              <button
                onClick={() => (User ? navigate("/dashboard") : navigate("/signup"))}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition mb-6 cursor-pointer"
              >
                {User?.subscription === "pro" ? "Free Tier Active" : User ? "Go to Dashboard" : "Get Started Free"}
              </button>

              <div className="flex items-center gap-6 text-xs text-gray-400 mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-red-400" />
                  <span>5 Resumes / mo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-gray-400" />
                  <span>1 Seat</span>
                </div>
              </div>

              <ul className="space-y-3">
                {FREE_FEATURES.map((f) => (
                  <li key={f.label} className="flex items-center gap-2.5 text-xs">
                    {f.on ? (
                      <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    )}
                    <span className={f.on ? "text-gray-300 font-medium" : "text-gray-500 line-through"}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* PRO PLAN CARD (MOST POPULAR) */}
          <div className="relative bg-gradient-to-b from-red-600/20 via-orange-600/10 to-transparent border-2 border-red-500/60 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-red-500/10 transform hover:-translate-y-1 transition duration-300">
            
            {/* Most Popular Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-yellow-300" />
              <span>Most Popular</span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2 mt-2">
                <h3 className="text-xl font-bold text-white">CV-Catalyst Pro</h3>
                <Sparkles className="h-4 w-4 text-orange-400" />
              </div>
              <p className="text-gray-400 text-xs mb-6">Designed for active job seekers aiming for top callbacks.</p>

              <div className="flex items-baseline gap-2 mb-2">
                {billing === "yearly" && (
                  <span className="text-gray-500 line-through text-base">{PRICING.yearly.strike}</span>
                )}
                <span className="text-4xl font-extrabold text-white">{proPlan.label}</span>
                <span className="text-gray-400 text-xs">{proPlan.sub}</span>
              </div>
              <p className="text-xs text-orange-400 font-medium mb-6">
                {billing === "yearly" ? proPlan.billedNote : "Billed monthly • Cancel anytime"}
              </p>

              <button
                onClick={handleUpgrade}
                disabled={isProcessing || User?.subscription === "pro"}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 text-white text-xs font-bold transition disabled:opacity-50 flex items-center justify-center gap-2 mb-6 cursor-pointer shadow-lg shadow-red-500/20"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : User?.subscription === "pro" ? (
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    Active Pro Member
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Upgrade to CV-Catalyst Pro
                  </>
                )}
              </button>

              <div className="flex items-center gap-6 text-xs text-gray-300 mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-red-400" />
                  <span className="font-bold text-white">Unlimited</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-orange-400" />
                  <span>1 Seat</span>
                </div>
              </div>

              <ul className="space-y-3">
                {PRO_FEATURES.map((f) => (
                  <li key={f.label} className="flex items-center gap-2.5 text-xs font-medium text-gray-200">
                    <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ENTERPRISE / TEAM CARD */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-2xl">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white">Agency & Team</h3>
                <Users className="h-4 w-4 text-amber-400" />
              </div>
              <p className="text-gray-400 text-xs mb-6">For career coaches, recruiters & universities.</p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">Custom</span>
              </div>

              <button
                onClick={() => toast.success("Contact sales at: sales@cv-catalyst.com")}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition mb-6 cursor-pointer"
              >
                Contact Sales
              </button>

              <div className="flex items-center gap-6 text-xs text-gray-400 mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-red-400" />
                  <span>Unlimited</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-amber-400" />
                  <span>10+ Seats</span>
                </div>
              </div>

              <ul className="space-y-3">
                {PRO_FEATURES.map((f) => (
                  <li key={f.label} className="flex items-center gap-2.5 text-xs text-gray-300 font-medium">
                    <Check className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    <span>{f.label}</span>
                  </li>
                ))}
                <li className="flex items-center gap-2.5 text-xs text-gray-300 font-medium">
                  <Check className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <span>Team dashboard & analytics</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default PricingPage;