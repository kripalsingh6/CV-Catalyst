<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../context/authContext'
import toast, {Toaster} from 'react-hot-toast';
import {Check , X , FileText , Users , Sparkles , Loader2} from 'lucide-react';
=======
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import toast, { Toaster } from 'react-hot-toast';
import { Check, X, FileText, Users, Sparkles, Loader2 } from 'lucide-react';
>>>>>>> b0593b4 (some change)
import axios from 'axios';
import { Footer } from "./footer";

const api = "http://localhost:3000";

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
      { label: "AI-powered JD keyword matching", on: true },
      { label: "Full AI rewrite agent", on: true },
      { label: "Priority support", on: true },
]

const PRICING = {
    monthly : { amount :500, label:"₹499" , sub : "/mo"},
    yearly : {amount :5000, label:"₹4999" , sub : "/yr" , strike: "$1000", billedNote: "billed yearly . save 50%"},
};

export function PricingPage(){
<<<<<<< HEAD
    const {User} = useAuth();
=======
    const {User, fetchMe} = useAuth();
>>>>>>> b0593b4 (some change)
    const navigate = useNavigate();
    const [billing , setBilling]= useState("monthly");
    const [isProcessing , setISProcessing]= useState(false);

    const proPlan = PRICING[billing];

    const loadRazorpayScript = ()=>
        new Promise((resolve)=>{
            if(window.Razorpay) return resolve(true);
             const script = document.createElement("script");
             script.src= "https://checkout.razorpay.com/v1/checkout.js";
             script.onload = ()=> resolve(true);
             script.onerror = ()=> resolve(false);
             document.body.appendChild(script);
        });

<<<<<<< HEAD
        const handleFree = ()=>{
            if(!User) return navigate("/signup");
            toast.success("You're already on the Free plan");
        };

=======
>>>>>>> b0593b4 (some change)
        const handleUpgrade = async ()=>{
            if(!User){
                toast.error("Please sign in to upgrade");
                navigate("/login");
                return;
            }

            setISProcessing(true);
            try {
                const scriptLoaded = await loadRazorpayScript();
                if (!scriptLoaded) {
                        toast.error("Failed to load payment gateway");
                        return;
                      }

             const { data } = await axios.post(
                    `${api}/api/payment/create-order`,
                    { billingCycle: billing },
                    { withCredentials: true }
                  );

                  const options = {
                    key: data.key,
<<<<<<< HEAD
                    amount : data.currency || " INR",
=======
                    amount : data.amount,
                    currency: data.currency || "INR",
>>>>>>> b0593b4 (some change)
                    name : "CV-Catalyst",
                    description : `Pro plan — ${billing === "monthly" ? "Monthly" : "Yearly"} `,
                    order_id : data.orderId,
                    prefill : {name: User?.name || "", email: User?.email || ""},
                    theme: {color : "#ef4444"},
                    handler : async (response)=>{
                        try{
                            await axios.post(
                                `${api}/api/payment/verify`,
                                {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                   razorpay_signature: response.razorpay_signature,
                                   billingCycle: billing,
                                },
                                { withCredentials: true}
                                
                            );
<<<<<<< HEAD
                            toast.success("Payment successful! Welcome to Pro");
                            navigate("/dashboard");

                        }catch(error){
=======
                            await fetchMe();
                            toast.success("Payment successful! Welcome to Pro");
                            navigate("/dashboard");

                        }catch{
>>>>>>> b0593b4 (some change)
                            toast.error("Payment verification failed");
                        }
                    },
                    modal : { ondismiss: ()=> setISProcessing(false)},
                  };
                  const rzp = new window.Razorpay(options);
<<<<<<< HEAD
                  rzp.on("payment failed ",()=>{
=======
                  rzp.on("payment.failed",()=>{
>>>>>>> b0593b4 (some change)
                    toast.error("Payment failed. Please try again");
                    setISProcessing(false);
                  });
                  rzp.open();

            } catch (error) {
                toast.error(error.response?.data?.message || "could not start payment");
            }finally{
                setISProcessing(false);
            }
        };

        return (
            <div className="min-h-screen bg-[#0a0a0f] text-white">
                <Toaster position="top-right"></Toaster>
                  <div className="absolute w-[700px] h-[700px] bg-blue-600/20 blur-[140px] rounded-full bottom-[-100px] left-[-100px]" />

                {/* <div className="absolute w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full top-[-100px] right-[-100px]" /> */}

                {/* Header */}
                <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/5 ">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                        <FileText 
                        onClick={()=>navigate("/dashbord")}
                        className="h-4 w-4 text-white cursor-pointer"></FileText>
                    </div>
                    <span 
                    className="text-lg font-semibold cursor-pointer">CV-Catalyst</span>
                 </div>
                  <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
                     <a href="#" className="hover:text-white transition-colors">Templates</a>
                      <a href="#" className="hover:text-white transition-colors">Pricing</a>
                      <a href="#" className="hover:text-white transition-colors">FAQ</a>
                  </nav>

                  <div className="flex item-center gap-4">
                    <button 
                    onClick={()=>navigate("/login")}
                    className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
                        Log in
                    </button>
                    <button 
                    onClick={()=>navigate("/signup")}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition cursor-pointer">
                        Sign up
                    </button>
                  </div>
                </header>

                {/* Pricing section */}
                <main className="px-6 md:px-10 py-12 max-w-6xl mx-auto">
                    <div className="text-center mb-4">
                        <h1 className="text-3xl md:text-4xl font-bold">Simple, transparent pricing</h1>
                        <p className="text-gray-400 text-sm mt-2">Choose the plan that fits your job search</p>
                    </div>

                    {/*billing toggle */}
                    <div className="flex justify-center mb-10">
                        <div className="bg-white/5 border-white/10 rounded-full p-1 flex">
                        <button
                        onClick={()=> setBilling("monthly")}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-color ${
                            billing=== "monthly" ? "bg-white text-black" : "text-gray-400 hover:text-white"
                        }`}
                        >
                           {billing? "Monthly" : "Yearly"}
                            

                        </button>
                        <button
                         onClick={() => setBilling("yearly")}
                           className={`px-5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                              billing === "yearly" ? "bg-white text-black" : "text-gray-400 hover:text-white"
                           }`}
                        >
                            
                           {billing? "Yearly" : "monthly"}
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold">
                                      -30%
                                </span>

                        </button>
                       

                        </div>

                    </div>
                    {/* cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                        {/*free */}
                        <div className="bg-white border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold  text-black">
                                Free
                            </h3>
                            <Sparkles className="h-4 w-4 text-gray-500" />
                        </div>
                        <p className="text-black text-sm mb-5">Try it out</p>

                        <div className="mb-1">
                            <span className="text-4xl font-bold text-black">$0</span>
                                <span className="text-black text-sm">/mo</span>
                        </div>
                        <p className="text-black text-xs mb-5">Free forever</p>
                      <button
                         onClick={()=>navigate("/")}
                       className="w-full py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-black/70 transition mb-6"
                           >
                       {User ? "Current plan" : "Get started"}
                        </button>

                         <div className="flex items-center gap-6 text-xs text-black mb-5 pb-5 border-b border-black/10" >
                          <div className="flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5" />
                                            5 resumes/mo

                          </div>

                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                                            1 seat
                          </div>
                         </div>

                         <ul className="space-y-3">
                            {FREE_FEATURES.map((f)=> (
                           <li key={f.label} className="flex items-center gap-2.5 text-sm">
                                {f.on ? (
                               <Check className="h-4 w-4 text-gray-800 flex-shrink-0" />                                             ) : (
                                 <X className="h-4 w-4 text-gray-800 flex-shrink-0" />
                                  )}
                                 <span className={f.on ? "text-gray-800" : "text-gray-700"}>{f.label}</span>
                            </li>
                            ))}
                         </ul>
                     </div>
                     

                        {/*pro - most popular */}
                        <div className="relative bg-white from-red-950/40 to-[#15151c] border-2 border-red-500/60 rounded-2xl p-6">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                             Most popular
                          </div>

                          <div className="flex items-center gap-2 mb-1 mt-2">
                                        <h3 className="text-lg font-semibold text-red-400">Pro</h3>
                                        <Sparkles className="h-4 w-4 text-red-400" />
                          </div>
                           <p className="text-black text-sm mb-5">For active job seekers</p>

                           <div className="flex items-center gap-2 mb-1">
                               {billing === "yearly" && (
                              <span className="text-black line-through text-lg">{PRICING.yearly.strike}</span>
                                )}
                             <span className="text-4xl font-bold text-black">{proPlan.label}</span>
                               <span className="text-black text-sm">{proPlan.sub}</span>
                           </div>

                             <p className="text-black text-xs mb-5">
                                {billing === "yearly" ? proPlan.billedNote : "billed monthly"}
                            </p>

                                 <button
                                          onClick={handleUpgrade}
                                          disabled={isProcessing || User?.plan === "pro"}
                                          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 mb-6"
                                        >
                                          {isProcessing ? (
                                            <>
                                              <Loader2 className="h-4 w-4 animate-spin" />
                                              Processing...
                                            </>
                                          ) : User?.plan === "pro" ? (
                                            "Current plan"
                                          ) : (
                                            "Get Started"
                                          )}
                                 </button>

                                  <div className="flex items-center gap-6 text-xs text-black mb-5 pb-5 border-b border-black/10" >
                                       <div className="flex items-center gap-1.5">
                                             <FileText className="h-3.5 w-3.5" />
                                            Unlimted

                                             </div>

                                           <div className="flex items-center gap-1.5">
                                              <Users className="h-3.5 w-3.5" />
                                                  1 seat
                                                </div>
                                            </div>
                                 
                                             <ul className="space-y-3">
                                               {PRO_FEATURES.map((f) => (
                                                 <li key={f.label} className="flex items-center gap-2.5 text-sm">
                                                   <Check className="h-4 w-4 text-red-400 flex-shrink-0" />
                                                   <span className="text-gray-700">{f.label}</span>
                                                 </li>
                                               ))}
                                             </ul>
                        </div>
                           
                           {/*Team */}
                           <div className="bg-white border border-white/10 rounded-2xl p-6" >
                               <div className="flex items-center gap-2 mb-1">
                                   <h3 className="text-lg font-semibold text-gray-800">Team</h3>
                                    <Sparkles className="h-4 w-4 text-gray-800" />
                                  </div>
                                <p className="text-gray-800 text-sm mb-5">For career coaches & agencies</p>

                                <div className="mb-1">
                                    <span className="text-4xl font-bold text-gray-800">Custom</span>

                                </div>
                                <p className="text-gray-800 text-xs mb-5">Contact us for pricing</p>

                              <button
                                   onClick={() => toast("Reach out to sales@cv-catalyst.com")}
                                    className="w-full py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-black/70 transition mb-6"
                               >
                               Contact sales
                           </button>

                   <div className="flex items-center gap-6 text-xs text-black mb-5 pb-5 border-b border-black/10" >
                          <div className="flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5" />
                                            Unlimted

                          </div>

                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                                            10+ seat
                          </div>
                     </div>

                       <ul className="space-y-3">
                                   {PRO_FEATURES.map((f) => (
                                     <li key={f.label} className="flex items-center gap-2.5 text-sm">
                                       <Check className="h-4 w-4 text-gray-800 flex-shrink-0" />
                                       <span className="text-gray-800">{f.label}</span>
                                     </li>
                                   ))}
                                   <li className="flex items-center gap-2.5 text-sm">
                                     <Check className="h-4 w-4 text-gray-800 flex-shrink-0" />
                                     <span className="text-gray-800">Team dashboard & seats</span>
                                   </li>
                                   <li className="flex items-center gap-2.5 text-sm">
                                     <Check className="h-4 w-4 text-gray-800 flex-shrink-0" />
                                     <span className="text-gray-800">Dedicated account manager</span>
                                   </li>
                                 </ul>
                           </div>

                    </div>
                </main>
                <Footer></Footer>
            </div>
        )

}