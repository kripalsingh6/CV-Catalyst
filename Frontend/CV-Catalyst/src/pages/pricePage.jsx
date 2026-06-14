import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../context/authContext'
import toast, {Toaster} from 'react-hot-toast';
import {Check , X , FileText , Users , Sparkles , Loader2} from 'lucide-react';
import axios from 'axios';

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
    monthly : { amount :500, label:"$5" , sub : "/mo"},
    yearly : {amount :5000, label:"$50" , sub : "/yr" , strike: "$1000", billedNote: "billed yearly . save 50%"},
};

export function PricingPage(){
    const {User} = useAuth();
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

        const handleFree = ()=>{
            if(!User) return navigate("/signup");
            toast.success("You're already on the Free plan");
        };

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

                  
            } catch (error) {
                toast.error(error.response?.data?.message || "could not start payment");
            }finally{
                setISProcessing(false);
            }
        }
}