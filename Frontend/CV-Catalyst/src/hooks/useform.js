import { useState } from "react";

export function useForm(initialValues){
    const [values, setValues] = useState(initialValues);
    return [values, setValues];
}