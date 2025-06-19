//Sign Up Page Component (used in Sign up Page)
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import { signUpApi } from "@/services/auth/signUp";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

// Define zod schema for Sign Up Form Fields
const signupSchema = z.object({
  name: z.string().min(1, "Name is required").regex(/^[a-zA-Z\s]+$/, "Name should only contain letters"), 
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(8, "Password must have at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must have at least 8 characters"),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

//Define type for form schema
type SignupSchema = z.infer<typeof signupSchema>;

const SignUp = () => {
         const router = useRouter();
         const [loading, setLoading] = useState<boolean>(false);
         const [password = {
            passwordValue: "",
            showPassword: false,
         }, setPassword] = useState<{passwordValue: string, showPassword: boolean}>();
         
         const [confirmPassword = {
            confirmPasswordValue: "",
            showConfirmPassword: false,
         }, setConfirmPassword] = useState<{confirmPasswordValue: string, showConfirmPassword: boolean}>();
         
         const {
         register,
         handleSubmit,
         formState: { errors },
         } = useForm<SignupSchema>({
         resolver: zodResolver(signupSchema),
         });

         //Event handler to control password visibility
         const handlePasswordVisibilityClick = ()=>{
            setPassword({
               ...password,
               showPassword: !password.showPassword
            })
         }

         //Event handler to control confirm password visibility
         const handleConfirmPasswordVisibilityClick = ()=>{
            setConfirmPassword({
               ...confirmPassword,
               showConfirmPassword: !confirmPassword.showConfirmPassword
            })
         }

         //Sign Up Form Submit Handler
         const onSubmit= async (data: SignupSchema) => {
               try{
                  const {name, email, password} = data;
                  const signUpData = {name, email, password};

                  setLoading(true);
                  const response = await signUpApi(signUpData);
                  const responseData = await response.json();
                  
                  if(!response.ok){
                     throw new Error(responseData.message)
                  }
                  if(responseData.userDetails && responseData.userDetails.userId){
                     toast.success(responseData.message);
                     router.push(`/user/${responseData.userDetails.userId}/projects`);
                  }  
                  else{
                     throw new Error("Invalid response structure");
                  }     
               }
               catch(err){
                  console.log(err);
                  const errorMessage = err instanceof Error
                                       ? err.message        
                                       :"Could not sign up";
                  toast.error(errorMessage);
               }
               finally{
                  setLoading(false);
               }
         }
         return (
               <div className="w-full h-screen flex">
                     <div className="w-full h-full flex justify-between items-center px-[40px]">
                           {/* Illustration */}
                           <div className="w-[60%] h-[80%] hidden md:flex justify-start items-start self-start bg-[url('/auth_illustration.png')] mt-[80px] rounded-[10px]">
                              <div className="w-full h-[200px] bg-white flex justify-start items-start rounded-t-[10px]">
                                 <Image
                                    src={"/logo_slogan.png"}
                                    alt="logo"
                                    width={600}
                                    height={200}
                                    className="rounded-tl-[10px]"
                                 />
                              </div>
                           </div> 
                           {/* Sign Up Form Section */}
                           <div className="w-full md:w-[35%] h-[90%] bg-white flex flex-col justify-evenly items-center rounded-[10px] pt-[30px]">
                              {/* Heading */}
                              <div className="w-[85%] h-[10%] flex flex-col justify-center items-start">
                                 <h1 className="text-2xl font-bold">Sign Up</h1>
                                 <p>Sign up to manage your projects effectively</p>
                              </div>
                              {/* Sign Up Form Container */}
                              <div className="w-[85%] h-[90%] flex flex-col justify-center items-start">
                                 {/* Sign Up Form */}
                                 <form 
                                    className="w-[100%] h-[100%] flex flex-col justify-center items-start"
                                    onSubmit = {handleSubmit(onSubmit)}
                                 >
                                    {/* Form Fields Container */}
                                    <div className="w-full h-[70%] flex flex-col justify-center items-start">
                                       {/* Name */}
                                       <div className="w-[90%] h-[100px] flex flex-col justify-between items-start">
                                             <label
                                                htmlFor="name"
                                                className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer"
                                             >
                                                Name
                                             </label>
                                             <div className="w-full h-[30px] flex flex-col justify-center items-center">
                                                <input 
                                                type="text" 
                                                id="name"
                                                placeholder="Ex. John Doe"
                                                className="w-full h-[100%] flex justify-start items-center border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1"
                                                {...register("name")}
                                                />
                                             </div>
                                             <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                                {errors.name && (
                                                      <p>{errors.name.message}</p>
                                                )} 
                                             </div>  
                                       </div>
                                       {/* Email */}
                                       <div className="w-[90%] h-[100px] flex flex-col justify-between items-start">
                                          <label
                                             htmlFor="email"
                                             className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer"
                                          >
                                             Email
                                          </label>
                                          <div className="w-full h-[30px] flex flex-col justify-center items-center">
                                             <input 
                                             type="text" 
                                             id="email"
                                             placeholder="Ex. john.doe@example.com"
                                             className="w-full h-[100%] flex justify-start items-center border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1"
                                             {...register("email")}
                                             />
                                          </div>
                                             
                                             <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                             {errors.email && (
                                                   <p>{errors.email.message}</p>
                                             )} 
                                             </div>  
                                       </div>
                                       {/* Password */}
                                       <div className="w-full h-[120px] flex flex-col justify-between items-start">
                                             <label
                                             htmlFor="password"
                                             className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer"
                                             >
                                                Password
                                             </label>
                                             <div className="w-full h-[30px] flex justify-between items-center">
                                                <input 
                                                   type={password.showPassword?"text":"password"} 
                                                   id="password"
                                                   placeholder="Ex. Birthday"
                                                   className="w-[90%] h-[100%] border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b703cc] focus:outline-offset-1"
                                                   {...register("password")}
                                                />
                                                <button 
                                                type="button"
                                                className="hover:cursor-pointer"
                                                onClick={handlePasswordVisibilityClick}
                                                >
                                                   {password.showPassword?
                                                   <VisibilityIcon sx={{fontSize: "20px", color: "#9e9fa0"}}/>
                                                   :<VisibilityOffIcon sx={{fontSize: "20px", color: "#9e9fa0"}}/>
                                                   }
                                                </button>
                                                
                                             </div>
                                             <div className="w-full h-[60px] flex flex-col justify-between items-start">
                                                   <div className="w-full h-[30px] flex justify-start items-center">
                                                         <p className="text-sm">&#x28;Password must have at least 8 characters&#x29;</p>
                                                   </div>
                                                   <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                                   {errors.password && (
                                                         <p>{errors.password.message}</p>
                                                   )} 
                                                   </div> 
                                             </div>  
                                       </div>
                                       {/* Confirm Password */}
                                       <div className="w-full h-[100px] flex flex-col justify-between items-start">
                                             <label
                                             htmlFor="confirmPassword"
                                             className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer"
                                             >
                                                Confirm Password
                                             </label>
                                             <div className="w-full h-[30px] flex justify-between items-center">
                                                <input 
                                                   type={confirmPassword.showConfirmPassword?"text":"password"} 
                                                   id="confirmPassword"
                                                   placeholder="Ex. Birthday"
                                                   className="w-[90%] h-[100%] border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b703cc] focus:outline-offset-1"
                                                   {...register("confirmPassword")}
                                                />
                                                <button 
                                                type="button"
                                                className="hover:cursor-pointer"
                                                onClick={handleConfirmPasswordVisibilityClick}
                                                >
                                                   {confirmPassword.showConfirmPassword?
                                                   <VisibilityIcon sx={{fontSize: "20px", color: "#9e9fa0"}}/>
                                                   :<VisibilityOffIcon sx={{fontSize: "20px", color: "#9e9fa0"}}/>
                                                   }
                                                </button>
                                             </div>
                                             <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                             {errors.confirmPassword && (
                                                   <p>{errors.confirmPassword.message}</p>
                                             )} 
                                             </div>  
                                       </div>
                                    </div>
                                    {/* Form Buttons Container */}
                                    <div className="w-[90%] h-[20%] flex flex-col justify-center items-start space-y-2">
                                          {/* Sign Up Button */}
                                          <button
                                          type="submit"
                                          className="w-full h-[40px] flex justify-center items-center scheme-gradient rounded-[5px] text-white hover:cursor-pointer"
                                          >
                                             <p className="z-0">Sign Up</p>
                                             {loading && (
                                                <div className="w-[25px] h-[25px] flex justify-center items-center z-[1000] relative left-[30px]">
                                                   <ClipLoader color="#ffffff" size={25} className="opacity-70" speedMultiplier={0.5}/>
                                                </div>
                                             )} 
                                          </button>
                                          {/* Link to Sign In Page */}
                                          <div className="w-full h-[40px] flex justify-center items-center">
                                             <p>Already have an account?</p>
                                             <Link
                                             href={"/auth/signin"}
                                             className="ml-[2px] scheme-color"
                                             >
                                                Sign In
                                             </Link>
                                          </div>
                                    </div>
                                 </form>
                              </div>
                           </div>
                     </div>
               </div>
         )
}

export default SignUp;
