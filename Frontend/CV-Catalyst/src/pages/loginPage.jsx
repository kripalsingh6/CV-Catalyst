import { useState } from "react";
import {useAuth} from '../context/authContext.jsx';
import { Alert } from "../components/alert.jsx";
import {Link,useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import toast, {Toaster} from 'react-hot-toast';

export function LoginPage({onSwitch}){
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
        navigate("/dasboard");

    }catch(error){
        setErrorMsg(error.message);
        toast.error(error.message);

    }finally{
        setIsSubmit(false);
    }
  }

}