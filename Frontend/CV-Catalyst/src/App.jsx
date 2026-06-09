
// import './App.css'
// import Check from './check'
// import Home from "./Home.jsx";

import { useEffect } from "react";
import { useState } from "react"
import axios from "axios";
import { LoginPage } from "./pages/loginPage";
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
    <Signup></Signup>

  )
  
}

export default App
