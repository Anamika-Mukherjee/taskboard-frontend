//Sign In Page Component (used in Sign in Page)
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInApi } from "@/services/auth/signIn";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

// Define zod schema for Sign In Form Fields
const signinSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must have at least 8 characters")
});

//Define type for form schema
type SigninSchema = z.infer<typeof signinSchema>;

const SignIn = () => {
      const router = useRouter();
      const [loading, setLoading] = useState<boolean>(false);
      const [password = {
         passwordValue: "",
         showPassword: false,
      }, setPassword] = useState<{passwordValue: string, showPassword: boolean}>();

      const {
      register,
      handleSubmit,
      formState: { errors },
      } = useForm<SigninSchema>({
      resolver: zodResolver(signinSchema),
      });

      //Event handler to control password visibility
      const handleVisibilityClick = ()=>{
         setPassword({
            ...password,
            showPassword: !password.showPassword
         })
      }

      //Sign In Form Submit Handler
      const onSubmit= async (data: SigninSchema) => {
         try{
            setLoading(true);
            const response = await signInApi(data);
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
                                 :"Could not sign in";
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
                  <div className="w-[60%] h-[80%] hidden md:flex justify-start items-start self-start bg-[url('/auth_illustration.png')] mt-[70px] rounded-[10px]">
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
                  {/* Sign In Form Section */}
                  <div className="w-full md:w-[35%] h-[80%] bg-white flex flex-col justify-evenly items-center rounded-[10px] pt-[40px] space-y-6">
                        {/* Heading */}
                        <div className="w-[85%] h-[10%] flex flex-col justify-center items-start">
                           <h1 className="text-2xl font-bold">Sign In</h1>
                           <p>Welcome Back!</p>
                        </div>
                        {/* Sign In Form Container */}
                        <div className="w-[85%] h-[90%] flex flex-col justify-center items-start">
                           {/* Sign In Form */}
                           <form 
                              className="w-[100%] h-[100%] flex flex-col justify-between items-start"
                              onSubmit = {handleSubmit(onSubmit)}
                           >
                              {/* Form Fields Container */}
                              <div className="w-full h-[60%] flex flex-col justify-center items-start">
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
                                    <div className="w-full h-[100px] flex flex-col justify-between items-start">
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
                                                className="w-[90%] h-[100%] border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1"
                                                {...register("password")}
                                             />
                                             <button 
                                             type="button"
                                             className="hover:cursor-pointer"
                                             onClick={handleVisibilityClick}
                                             >
                                                {password.showPassword?
                                                <VisibilityIcon sx={{fontSize: "20px", color: "#9e9fa0"}}/>
                                                :<VisibilityOffIcon sx={{fontSize: "20px", color: "#9e9fa0"}}/>
                                                }
                                             </button>
                                          </div>
                                          <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                             {errors.password && (
                                                   <p>{errors.password.message}</p>
                                             )} 
                                          </div>  
                                    </div>
                              </div>
                              {/* Form Buttons Container */}
                              <div className="w-[90%] h-[40%] flex flex-col justify-center items-start space-y-6">
                                    {/* Sign In Button */}
                                    <button
                                    type="submit"
                                    className="w-full h-[40px] flex justify-center items-center scheme-gradient rounded-[5px] text-white hover:cursor-pointer"
                                    >
                                       <p className="z-0"> Sign In</p> 
                                       {loading && (
                                          <div className="w-[25px] h-[25px] flex justify-center items-center z-[1000] relative left-[30px]">
                                             <ClipLoader color="#ffffff" size={25} className="opacity-70" speedMultiplier={0.5}/>
                                          </div>
                                       )}
                                    </button>
                                    {/* Link to Sign Up Page */}
                                    <div className="w-full h-[40px] flex justify-center items-center">
                                       <p>Don&apos;t have an account?</p>
                                       <Link
                                       href={"/auth/signup"}
                                       className="ml-[2px] scheme-color"
                                       >
                                          Sign Up
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

export default SignIn;
