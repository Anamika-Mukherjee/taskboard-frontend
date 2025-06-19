//Profile Page Component (used in User Profile Settings Page)
"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { UserProfile } from "@/types/userTypes";
import { getProfileApi } from "@/services/profile/getProfile";
import { editProfileApi } from "@/services/profile/editProfile";

// Define zod schema for Manage Profile Form Fields
const userProfileSchema = z.object({
    name: z
        .string()
        .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces")
        .min(1, "Name is required")
        .max(100, "Name must not be more than 100 characters"),
    contactNumber: z
                  .string()
                  .regex(/^[0-9]+$/, "Contact Number should only contain numbers")
                  .max(10, "Contact Number must not be more than 10 digits")
                  .or(z.literal("")),
    company: z
             .string()
             .max(100, "Company Name must not be more than 100 characters")
             .or(z.literal("")),
    
});

//Define type for form schema
type UserProfileSchema = z.infer<typeof userProfileSchema>;

const ProfilePage = () => {

            const {
                        register,
                        reset,
                        handleSubmit,
                        formState: { errors },
                    } = useForm<UserProfileSchema>({
                        resolver: zodResolver(userProfileSchema),
            });
    
            const [isEditing, setIsEditing] = useState<boolean>(false);
            const [loading, setLoading] = useState<boolean>(false);
            const [profileDetails, setProfileDetails] = useState<UserProfile>();
            
            //Fetch user's profile data from backend
            useEffect(()=>{
                const fetchProfileData = async ()=>{
                     try{
                        setLoading(true);
                        const response = await getProfileApi();
                        const responseData = await response.json();

                        if(!response.ok){
                            throw new Error(responseData.message);
                        }
                        if(responseData.userProfile){
                            setProfileDetails(responseData.userProfile as UserProfile);
                        }
                        else{
                            throw new Error("Invalid response structure");
                        }
                     }
                     catch(err){
                        console.log(err);
                        const errorMessage = err instanceof Error
                                    ? err.message        
                                    :"Could not fetch profile data";
                        toast.error(errorMessage);
                     }
                     finally{
                       setLoading(false);
                     }
                };
                fetchProfileData();
            }, []);
           
            //Manage Profile Form Submit Handler
            const onSubmit = async (data: UserProfileSchema) => {            
                try{
                        setLoading(true);
                        const response = await editProfileApi(data);
                        const responseData = await response.json();

                        if(!response.ok){
                            throw new Error(responseData.message);
                        }
                        if(responseData.editedProfile){
                            setProfileDetails(responseData.editedProfile as UserProfile);
                            toast.success(responseData.message);
                            setIsEditing(false);
                        }
                        else{
                            throw new Error("Invalid response structure");
                        }  
                    }
                    catch(err){
                        console.log(err);
                        const errorMessage = err instanceof Error
                                    ? err.message        
                                    :"Could not edit profile";
                        toast.error(errorMessage);
                    }
                    finally{
                        setLoading(false);
                    }
            }
    
            //Edit button click event handler
            const handleEditClick = ()=>{
                setIsEditing(true);
        
                //Reset form fields to data stored in database if available else set default values
                reset({
                    name: profileDetails?.name || "",
                    contactNumber: profileDetails?.contactNumber || "",
                    company: profileDetails?.company || ""
                })
            }
    
            return (
                    <div className="w-[100%] md:w-[90%] h-[calc(100%-45px)] flex justify-center items-start z-0">
                        {/* Manage Profile Page Container */}
                        <div className="w-[80%] h-[100%] bg-white rounded-[10px] flex flex-col justify-start items-center space-y-6 py-[20px] px-[30px] z-0 relative">
                            {/* Heading */}
                            <div className="w-[100%] h-[45px] flex justify-center items-center">
                                <h3 className="text-lg font-semibold">Manage Profile</h3>
                            </div>
                            {profileDetails ? (
                                <div className="w-[100%] h-[calc(100%-45px)] flex flex-col justify-center items-center space-y-2">
                                    <div className="w-[100%] h-[calc(100%-55px)] flex flex-col justify-center items-center overflow-y-scroll hide-scrollbar rounded-[10px] bg-blue-100 p-[20px]">
                                        <div className="w-[100%] h-[100%] flex flex-col justify-center items-center">
                                            {/* Form Buttons Container */}
                                            <div className="w-[100%] h-[30px] flex justify-end items-center">
                                                {!isEditing ? (
                                                    <button 
                                                        type="button"
                                                        onClick={handleEditClick}
                                                        className="w-[100px] h-[100%] flex justify-center items-center rounded-[5px] bg-[#8600D8] text-sm text-white cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                ):(
                                                <div className="w-[200px] h-[100%] flex justify-center items-center space-x-4">
                                                    <button 
                                                    type="submit"
                                                    form="profileEditForm"
                                                    className="w-[100px] h-[100%] flex justify-center items-center rounded-[5px] bg-[#8600D8] text-sm text-white cursor-pointer"
                                                    >
                                                        <p className="z-[0]">Save</p>
                                                        {loading && (
                                                                    <div className="w-[25px] h-[25px] flex justify-center items-center z-[1000] relative left-[10px]">
                                                                        <ClipLoader color="#ffffff" size={20} className="opacity-70" speedMultiplier={0.5}/>
                                                                    </div>
                                                        )}
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        onClick={()=>setIsEditing(false)}
                                                        className="w-[100px] h-[100%] flex justify-center items-center rounded-[5px] text-sm bg-gray-500 text-white cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>  
                                                )}
                                            </div> 
                                            {/* Manage Profile Form Container */}
                                            <div className="w-[100%] md:w-[80%] h-[calc(100%-40px)] flex justify-center items-center">
                                                {isEditing? (
                                                        // Manage Profile Form
                                                        <form 
                                                        id="profileEditForm"
                                                        className="w-[100%] h-full flex flex-col justify-start items-center mt-[30px] transform-gpu will-change-transform"
                                                        onSubmit = {handleSubmit(onSubmit)}
                                                        >
                                                            {/* Form Fields Container */}
                                                            <div className="w-full h-auto flex flex-col justify-start items-start py-[20px] space-y-6 md:space-y-0">
                                                                {/* Name */}
                                                                <div className="w-[100%] h-[100px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-start space-y-4 md:space-y-0 px-[10px]">
                                                                    <label
                                                                        htmlFor="name"
                                                                        className="w-[100%] md:w-[50%] h-[30px] flex flex-col justify-start items-start font-medium cursor-pointer"
                                                                    >
                                                                        Name
                                                                    </label>
                                                                    <div className="w-[100%] md:w-[50%] h-[70px] flex flex-col justify-between items-start">
                                                                        <div className="w-full h-[30px] flex flex-col justify-center items-start">
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
                                                                </div>
                                                                {/* Email */}
                                                                <div className="w-[100%] h-[100px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-start space-y-4 md:space-y-0 px-[10px]">
                                                                    <p className="w-[100%] md:w-[50%] h-[30px] flex flex-col justify-start items-start font-medium cursor-pointer">
                                                                        Email
                                                                    </p>
                                                                    <div className="w-[100%] md:w-[50%] h-[120px] flex flex-col justify-between items-start">
                                                                        <div className="w-full h-[30px] flex flex-col justify-center items-start">
                                                                            <p className="w-full h-[100%] flex justify-start items-center bg-gray-200 border border-gray-400 rounded-md text-sm pl-[6px] cursor-not-allowed focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1">
                                                                            {profileDetails.email}
                                                                            </p>
                                                                        </div>
                                                                        <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                                                        </div>  
                                                                    </div>
                                                                </div>
                                                                {/* Contact Number */}
                                                                <div className="w-[100%] h-[100px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-start space-y-4 md:space-y-0 px-[10px]">
                                                                    <label
                                                                        htmlFor="contactNumber"
                                                                        className="w-[100%] md:w-[50%] h-[30px] flex flex-col justify-start items-start font-medium cursor-pointer"
                                                                    >
                                                                        Contact Number
                                                                    </label>
                                                                    <div className="w-[100%] md:w-[50%] h-[70px] flex flex-col justify-between items-start">
                                                                        <div className="w-full h-[30px] flex flex-col justify-center items-start">
                                                                            <input 
                                                                            type="text" 
                                                                            id="contactNumber"
                                                                            placeholder="Ex. 1234567890"
                                                                            className="w-full h-[100%] flex justify-start items-center border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1"
                                                                            {...register("contactNumber")}
                                                                            />
                                                                        </div>
                                                                        <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                                                            {errors.contactNumber && (
                                                                                    <p>{errors.contactNumber.message}</p>
                                                                            )} 
                                                                        </div>
                                                                    </div> 
                                                                </div> 
                                                                {/* Company */}
                                                                <div className="w-[100%] h-[100px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-start space-y-4 md:space-y-0 px-[10px]">
                                                                    <label
                                                                        htmlFor="company"
                                                                        className="w-[100%] md:w-[50%] h-[30px] flex flex-col justify-start items-start font-medium cursor-pointer"
                                                                    >
                                                                        Company
                                                                    </label>
                                                                    <div className="w-[100%] md:w-[50%] h-[70px] flex flex-col justify-between items-start">
                                                                        <div className="w-full h-[30px] flex flex-col justify-center items-start">
                                                                            <input 
                                                                            type="text" 
                                                                            id="company"
                                                                            placeholder="Ex. Google Inc."
                                                                            className="w-full h-[100%] flex justify-start items-center border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1"
                                                                            {...register("company")}
                                                                            />
                                                                        </div>
                                                                        <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                                                            {errors.company && (
                                                                                    <p>{errors.company.message}</p>
                                                                            )} 
                                                                        </div>
                                                                    </div> 
                                                                </div>                                   
                                                            </div>
                                                        </form>
                                                ):(
                                                // Show Profile Details (when edit button not clicked)
                                                <div 
                                                    className="w-[100%] h-full flex flex-col justify-start items-center mt-[30px] "
                                                >
                                                    {/* Profile Details Container */}
                                                    <div className="w-full h-auto flex flex-col justify-start items-start py-[20px] space-y-4">
                                                        {/* Name */}
                                                        <div className="w-[100%] h-[70px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-center px-[10px]">
                                                            <p className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer">
                                                                Name
                                                            </p>
                                                            <p className="w-full h-[30px] flex justify-start items-center border border-gray-300 rounded-md text-sm pl-[6px] bg-gray-200">
                                                                {profileDetails ? profileDetails.name : ""}
                                                            </p>    
                                                        </div>
                                                        {/* Email */}
                                                        <div className="w-[100%] h-[70px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-center px-[10px]">
                                                            <p className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer">
                                                                Email
                                                            </p>
                                                            <p className="w-full h-[30px] flex justify-start items-center border border-gray-300 rounded-md text-sm px-[6px] bg-gray-200">
                                                                {profileDetails ? profileDetails.email :""}
                                                            </p>
                                                        </div>
                                                        {/* Contact Number */}
                                                        <div className="w-[100%] h-[70px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-center px-[10px]">
                                                            <p className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer">
                                                                Contact Number
                                                            </p>
                                                            <p className="w-full h-[30px] flex justify-start items-center border border-gray-300 rounded-md text-sm px-[6px] bg-gray-200">
                                                                {profileDetails ? profileDetails.contactNumber :""}
                                                            </p>
                                                        </div>
                                                        {/* Company */}
                                                        <div className="w-[100%] h-[70px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-center px-[10px]">
                                                            <p className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer">
                                                                Company
                                                            </p>
                                                            <p className="w-full h-[30px] flex justify-start items-center border border-gray-300 rounded-md text-sm px-[6px] bg-gray-200">
                                                                {profileDetails ? profileDetails.company :""}
                                                            </p>
                                                        </div>
                                                    </div> 
                                                </div>
                                                )}                                     
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ):(
                                <div className="w-[100%] h-[calc(100%-45px)] flex flex-col justify-center items-center space-y-6"></div>
                            )}                    
                        </div>
                    </div>                
            )
}

export default ProfilePage;
