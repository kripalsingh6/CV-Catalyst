<<<<<<< HEAD

// import './App.css'
// import Check from './check'
// import Home from "./components/home";

// import { useEffect } from "react";
// import { useState } from "react"
// import axios from "axios";
import { LoginPage } from "./pages/loginPage";
import { PricingPage } from "./pages/pricePage";
import { Signup } from "./pages/signupPage";


function App() {

  // const [message,setMessage]= useState("");
  //  useEffect(()=>{
  //   axios.get("http://localhost:3000/api/intro")
  //   .then((res)=>{
  //     setMessage(res.data.message);

  //   })
  //   .catch((error)=>{
  //     console.log(error);
  //   })
  //  },[])

  // return (
  //  <>
  //    <h1>Welcome to CV-Catalyst</h1>
  //    <h2>data{message}</h2>
  //  </>
  // )
  return(

    <>
     <PricingPage></PricingPage>
    </>
 
  )
  
=======
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
>>>>>>> b0593b4 (some change)
}

export default App;
