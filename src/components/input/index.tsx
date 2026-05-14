import { type RegisterOptions, type UseFormRegister } from "react-hook-form"

interface InputProps {
    name: string;
    type: string;
    placeholder: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
}

export function Input({name, type, placeholder, register, rules, error}: InputProps) {
    return(
        <div>
            <input
            className="w-full border-2 rounded-md h-11 px-2"
            id={name} 
            type={type}
            placeholder={placeholder}
            {...register(name, rules)} 
            />
            {error && <p className="my-1 text-red-500">{error}</p>}
        </div>
    )
}