//Create Project Form Component (used in Projects Page)
"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { createProjectApi } from "@/services/project/createProject";
import { ProjectDetails } from "@/types/projectTypes";
import { useAllProjectContext } from "@/contexts/allProjectContext";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { getAllUsersApi } from "@/services/profile/getAllUsers";
import { UserProfile } from "@/types/userTypes";

//Define zod schema for team member email
const memberEmailSchema = z.object({
   memberEmail: z.string().email("Please select a user")
})

// Define zod schema for Create Project Form Fields
const createProjectSchema = z.object({
    projectName: z
                 .string()
                 .min(1, "Project name is required")
                 .max(100, "Project name must not be more than 100 characters"),
    projectDescription: z
                        .string()
                        .min(1, "Project description is required")
                        .max(500, "Project description must not be more than 500 characters"),
    startDate: z.date(),
    endDate: z.date(),
    teamMembers: z.array(memberEmailSchema).min(1, "Select at least one team member"),
})
.refine((data)=>data.endDate>data.startDate, {
   message: "End date should be later than start date",
   path: ["endDate"],
})

//Define type for form schema
type CreateProjectSchema = z.infer<typeof createProjectSchema>;

//Define interface for props
interface CreateProjectFormProps{
   open: boolean;
   onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({open, onOpenChange}) => {

      const {
            control,
            register,
            watch,
            handleSubmit,
            formState: { errors },
         } = useForm<CreateProjectSchema>({
            resolver: zodResolver(createProjectSchema),
            defaultValues: {
               teamMembers: [{memberEmail: ""}],
            }
      });

      //Import methods for dynamic inputs for team members 
      const { fields, append, remove } = useFieldArray({
         control,
         name: "teamMembers",
      });

      const [memberCount, setMemberCount] = useState<number>(1);
      const [loading, setLoading] = useState<boolean>(false);
      const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
      const {setAllProjects} = useAllProjectContext();

      //Push team member email into array on input change event
      const addedMemberEmails = watch("teamMembers")?.map((member) => member.memberEmail) || [];

      //Fetch all users' details from backend to display list of all users for team member select dropdown
      useEffect(()=>{
         const fetchAllUsers = async ()=>{
           try{
              setLoading(true);
                  const response = await getAllUsersApi();
                  const responseData = await response.json();

                  if(!response.ok){
                     throw new Error(responseData.message)
                  }
                  if(responseData.allUserProfiles){
                     setAllUsers(responseData.allUserProfiles as UserProfile[]);
                  }  
                  else{
                     throw new Error("Invalid response structure");
                  }   
           }
           catch(err){
               console.log(err);
               const errorMessage = err instanceof Error
                                    ?err.message
                                    :"Could not fetch users";
               toast.error(errorMessage);
           }
           finally{
            setLoading(false);
           }
         }
         fetchAllUsers();
      }, []);

      
      useEffect(() => {
         const currentLength = fields.length;

         //Add select field when "Add Another" button is clicked (for team member selection)
         if (memberCount > currentLength) {
            for (let i = currentLength; i < memberCount; i++) {
               append({ memberEmail: "" });
            }
         } 
         //Remove select field when Remove button is clicked
         else if (memberCount < currentLength) {
            for (let i = currentLength; i > memberCount; i--) {
               remove(i - 1);
            }
         }
      }, [memberCount, append, remove, fields.length]);

      //Change count value when Remove button is clicked
      const handleRemoveClick = (index: number)=>{
         remove(index);
         setMemberCount(memberCount-1)
      }

      //Create Project Form Submit Handler
      const onSubmit = async (data: CreateProjectSchema) => {
            try{
                  setLoading(true);
                  const response = await createProjectApi(data);
                  const responseData = await response.json();

                  if(!response.ok){
                     throw new Error(responseData.message)
                  }
                  if(responseData.allProjects){
                     setAllProjects(responseData.allProjects as ProjectDetails[]);
                     onOpenChange(false);
                     toast.success(responseData.message);
                  }  
                  else{
                     throw new Error("Invalid response structure");
                  }     
            }
            catch(err){
               console.log(err);
               const errorMessage = err instanceof Error
                                    ?err.message
                                    :"Could not create project";
               toast.error(errorMessage);
            }
            finally{
               setLoading(false);
            }
      }

      return open && (
            <div className="w-[70%] md:w-[40%] h-[70%] md:h-[60%] flex justify-center items-center bg-white border border-gray-500 rounded-[10px]">
               <div className="w-[90%] h-full flex flex-col justify-start items-center px-[10px] py-[20px] space-y-6">
                     {/* Heading */}
                     <div className="w-[100%] h-[45px] flex justify-center items-center">
                        <h3 className="text-lg font-semibold">Create new project</h3>
                     </div> 
                     {/* Create Project Form container (Scrollable) */}
                     <div className="w-full h-[calc(100%-45px)] flex justify-center items-center overflow-y-scroll hide-scrollbar">
                        {/* Create Project Form */}
                        <form 
                        className="w-[100%] h-full flex flex-col justify-start items-center mt-[30px] "
                        onSubmit = {handleSubmit(onSubmit)}>
                              {/* Form Fields Container */}
                              <div className="w-full h-auto flex flex-col justify-start items-start py-[20px]">
                                    {/* Project Name */}
                                    <div className="w-[100%] h-[100px] flex flex-col justify-between items-center px-[10px]">
                                       <label
                                          htmlFor="projectName"
                                          className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer"
                                       >
                                          Project Name
                                       </label>
                                       <div className="w-full h-[30px] flex flex-col justify-center items-center">
                                          <input 
                                          type="text" 
                                          id="projectName"
                                          placeholder="Ex. Project Management Website"
                                          className="w-full h-[100%] flex justify-start items-center border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1"
                                          {...register("projectName")}
                                          />
                                       </div>
                                       <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                       {errors.projectName && (
                                             <p>{errors.projectName.message}</p>
                                       )} 
                                       </div>  
                                    </div>
                                    {/* Project Description */}
                                    <div className="w-[100%] h-[150px] flex flex-col justify-between items-center px-[10px]">
                                       <label
                                          htmlFor="projectDescription"
                                          className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer"
                                       >
                                          Project Description
                                       </label>
                                       <div className="w-full h-[80px] flex flex-col justify-center items-center">
                                          <textarea 
                                          id="projectDescription"
                                          placeholder="Ex. Website that allows users to create and manage projects..."
                                          className="w-full h-[100%] flex justify-start items-center border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1"
                                          {...register("projectDescription")}
                                          />
                                       </div>
                                       <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                       {errors.projectDescription && (
                                             <p>{errors.projectDescription.message}</p>
                                       )} 
                                       </div>  
                                    </div>
                                    {/* Project Start Date and Project End Date Container */}
                                    <div className="w-full h-[100px] flex justify-between items-center">
                                       {/* Project Start Date */}
                                       <div className="w-[100%] h-[100px] flex flex-col justify-between items-center px-[10px]">
                                          <label
                                             htmlFor="startDate"
                                             className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer"
                                          >
                                             Start Date
                                          </label>
                                          <div className="w-[100%] h-[30px] flex flex-col justify-center items-center">
                                             <Controller
                                                control={control}
                                                name="startDate"
                                                render={({ field }) => (
                                                   <div className="w-[100%] h-full flex justify-start items-center">
                                                      <DatePicker
                                                      id="startDate"
                                                      placeholderText="Ex. 01-01-2025"
                                                      selected={field.value}
                                                      autoComplete="off"
                                                      onChange={(date) => field.onChange(date)}
                                                      dateFormat="dd-MM-yyyy"
                                                      className="w-[100%] h-[30px] flex justify-start items-center border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1"
                                                      />
                                                   </div>  
                                                )}
                                             />
                                          </div>
                                          <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                             {errors.startDate && (
                                                   <p>{errors.startDate.message}</p>
                                             )} 
                                          </div>  
                                       </div>
                                       {/* Project End Date */}
                                       <div className="w-[100%] h-[100px] flex flex-col justify-between items-center px-[10px]">
                                          <label
                                             htmlFor="endDate"
                                             className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer"
                                          >
                                             End Date
                                          </label>
                                          <div className="w-[100%] h-[30px] flex flex-col justify-center items-center">
                                             <Controller
                                                control={control}
                                                name="endDate"
                                                render={({ field }) => (
                                                   <div className="w-[100%] h-full flex justify-start items-center">
                                                      <DatePicker
                                                      id="endDate"
                                                      placeholderText="Ex. 01-02-2025"
                                                      selected={field.value}
                                                      autoComplete="off"
                                                      onChange={(date) => field.onChange(date)}
                                                      dateFormat="dd-MM-yyyy"
                                                      className="w-[100%] h-[30px] flex justify-start items-center border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1"
                                                      />
                                                   </div>  
                                                )}
                                             />
                                          </div>
                                          <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                             {errors.endDate && (
                                                   <p>{errors.endDate.message}</p>
                                             )} 
                                          </div>  
                                       </div>
                                    </div>
                                    {/* Project Team Members */}
                                    <div className="w-[100%] min-h-[100px] h-auto flex flex-col justify-between items-center px-[10px] space-y-2">
                                       <label
                                          htmlFor="teamMembers"
                                          className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer"
                                       >
                                          Team Members
                                       </label>
                                       {/* Team Member Select Dropdown Container (multiple select fields to select multiple team members) */}
                                       <div className="w-full h-[calc(100%-30px)] flex flex-col justify-center items-start space-y-4 transform-gpu will-change-transform">
                                          {memberCount >= 1 ? 
                                             fields.map((field, index)=>{
                                                const options = allUsers.filter((user)=> !addedMemberEmails.includes(user.email) || user.email === watch(`teamMembers.${index}.memberEmail`))
                                                return (
                                                   <div
                                                   key={field.id}
                                                   className="w-[100%] h-[70px] flex flex-col justify-between items-start"
                                                   >
                                                      <div className="w-[100%] h-[30px] flex justify-start items-center space-x-4">
                                                         <Controller
                                                         control={control}
                                                         name={`teamMembers.${index}.memberEmail`}
                                                         render={({ field }) => (
                                                            <select
                                                               {...field}
                                                               className="w-full h-[100%] flex justify-start items-center py-[5px] border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1"
                                                            >
                                                               <option value="" disabled>
                                                               Select a user
                                                               </option>
                                                               {options.map((user) => (
                                                               <option key={user._id} value={user.email}>
                                                                  {user.name}
                                                               </option>
                                                               ))}
                                                            </select>
                                                         )}
                                                         /> 
                                                         {/* Remove Team Member Button  */}
                                                         <div className="w-[20px] h-[20px] flex justify-center items-center">
                                                            <button
                                                               type="button"
                                                               onClick={()=>handleRemoveClick(index)}
                                                               className="w-[20px] h-[20px] flex justify-center items-center"
                                                            >
                                                               <Icon
                                                               icon="zondicons:minus-outline"
                                                               className="w-full h-full text-gray-500 cursor-pointer"
                                                               />
                                                            </button>
                                                         </div>
                                                      </div> 
                                                      {/* Validation Errors for individual select fields */}
                                                      <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                                            {errors.teamMembers?.[index]?.memberEmail && (
                                                                           <p>{errors.teamMembers[index]?.memberEmail?.message}</p>
                                                            )}
                                                      </div> 
                                                   </div> 
                                                )
                                             }):null
                                          }
                                          {/* Validation Errors for all select fields */}
                                          {errors.teamMembers && (
                                             <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                                <p>{errors.teamMembers.message}</p>
                                             </div>
                                          )} 
                                          {/* Add Member Button (to add more select input fields) */}
                                          {addedMemberEmails && addedMemberEmails.length < allUsers.length && (
                                             <div className="w-[100%] h-[35px] flex justify-start items-center ">
                                                   <div className="w-[50%] md:w-[30%] h-[35px] flex justify-start items-center transform-gpu will-change-transform space-x-4">
                                                      <button 
                                                      type="button"
                                                      onClick={()=>setMemberCount(memberCount+1)}
                                                      className="w-[130px] h-full flex justify-center items-center space-x-2 bg-black text-white rounded-[10px] px-[10px] hover:cursor-pointer"
                                                      >
                                                         <Icon
                                                            icon="entypo:plus"
                                                            className="w-[15px] h-[15px] cursor-pointer"
                                                         />
                                                         <p className="text-sm">
                                                            Add another
                                                         </p>
                                                      </button>
                                                   </div>
                                             </div>
                                          )}
                                       </div>
                                    </div>
                              </div>
                              {/* Create Project Button */}
                              <div className="w-[100%] md:w-[50%] h-auto flex flex-col justify-center items-start space-y-2 transform-gpu will-change-transform">
                                 <button
                                 type="submit"
                                 className="w-full h-[40px] flex justify-center items-center scheme-gradient rounded-[5px] text-white hover:cursor-pointer"
                                 >
                                    <p className="z-[1000]">Create</p>
                                    {loading && (
                                       <div className="w-[25px] h-[25px] flex justify-center items-center z-[1100] relative left-[30px]">
                                          <ClipLoader color="#ffffff" size={25} className="opacity-70" speedMultiplier={0.5}/>
                                       </div>
                                    )}
                                 </button>
                              </div>
                        </form>
                     </div>        
               </div>
               {/* Close Modal Button */}
               <div className="w-[20px] h-[20px] flex justify-center items-center relative -top-[220px] md:-top-[200px] left-[5px] md:left-[10px]">
                  <button
                  type="button"
                  onClick={()=>onOpenChange(false)}
                  className="w-full h-full flex justify-center items-center rounded-sm active:bg-gray-300 focus:outline-1 focus:outline-gray-300  hover:cursor-pointer"
                  >
                     <p className="text-xl flex justify-center items-center">&times;</p>
                  </button>
               </div>
            </div> 
      )
}

export default CreateProjectForm;
