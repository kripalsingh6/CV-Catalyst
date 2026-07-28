import { useState } from "react";
import { useAuth } from '../context/authContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { EyeOff } from "lucide-react";

export function LoginPage(){
  const {Login} = useAuth();

  const navigate = useNavigate();
  const [isSubmit, setIsSubmit]=useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const{register,handleSubmit, formState:{errors}} = useForm();

  const onSubmit = async(data)=>{
    try{
        setIsSubmit(true);
        setErrorMsg("");

        await Login(data);
        toast.success("Login successful");
        navigate("/dashboard");

    }catch(error){
        setErrorMsg(error.message);
        toast.error(error.message);

    }finally{
        setIsSubmit(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white relative overflow-hidden">
      
      <Toaster position="top-right" />

      {/* Ambient background glow */}
      <div className="absolute w-[700px] h-[700px] bg-red-600/10 blur-[160px] rounded-full top-[-100px] left-[-100px] pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-orange-600/10 blur-[160px] rounded-full bottom-[-100px] right-[-100px] pointer-events-none" />

      {/* Card */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
              <span className="text-white font-bold text-xl">CV</span>
            </div>
          </div>

        <h1 className="text-3xl font-semibold text-white">Sign in</h1>
        <p className="text-gray-400 text-sm mt-2">
          Sign in to your account and continue your journey.
        </p>
      </div>

      {/* Error */}
      {errorMsg && (
        <p className="text-red-400 text-sm mb-4 text-center">
          {errorMsg}
        </p>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Enter your Email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-4 py-3 bg-black/40 border border-gray-800 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className="w-full px-4 py-3 bg-black/40 border border-gray-800 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <EyeOff className="absolute right-4 top-3.5 h-5 w-5 text-blue-500 cursor-pointer" />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isSubmit}
          className="w-full rounded-full py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {isSubmit ? "Logging in..." : "Sign in"}
        </button>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  </div>
);
}
