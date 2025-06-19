//Edit Project Form Component (used in Project Settings Page)
"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ProjectDetails } from "@/types/projectTypes";
import { editProjectApi } from "@/services/project/editProject";
import { useParams } from "next/navigation";
import { dateConverter } from "@/utils/functions";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { UserProfile } from "@/types/userTypes";
import { getAllUsersApi } from "@/services/profile/getAllUsers";


//Define arrays for project status values
const projectStatus = ["Not Started", "In Progress", "Completed", "On Hold", "Cancelled"];

//Define zod schema for team member email
const memberEmailSchema = z.object({
   memberEmail: z.string().email("Please select a user")
})

// Define zod schema for Edit Project Form Fields
const editProjectSchema = z.object({
    projectName: z
                 .string()
                 .min(1, "Project name is required")
                 .max(100, "Project name must not be more than 100 characters"),
    projectDescription: z
                        .string()
                        .min(1, "Project description is required")
                        .max(500, "Project description must not be more than 500 characters"),
    status: z.enum(["Not Started", "In Progress", "Completed", "On Hold", "Cancelled"]),
    startDate: z.date(),
    endDate: z.date(),
    teamMembers: z.array(memberEmailSchema).min(1, "Select at least one team member"),
})
.refine((data)=>data.endDate>data.startDate, {
   message: "End date should be later than start date",
   path: ["endDate"],
});

//Define type for form schema
type EditProjectSchema = z.infer<typeof editProjectSchema>;

//Define interface for props
interface EditProjectProps{
    projectDetails: ProjectDetails;
    setProjectDetails: React.Dispatch<SetStateAction<ProjectDetails | undefined>>;
}

const EditProject: React.FC<EditProjectProps> = ({projectDetails, setProjectDetails}) => {

        const {
                    control,
                    register,
                    reset,
                    watch,
                    handleSubmit,
                    formState: { errors },
                } = useForm<EditProjectSchema>({
                    resolver: zodResolver(editProjectSchema),
                    defaultValues: {
                    teamMembers: [{memberEmail: ""}],
                    }
            });
    
        //Import methods for dynamic inputs for team members 
        const { fields, append, remove } = useFieldArray({
            control,
            name: "teamMembers",
        });

        const params = useParams();
        const {projectId} = params;
        const [memberCount, setMemberCount] = useState<number>(projectDetails?projectDetails.teamMembers.length:1);
        const [isEditing, setIsEditing] = useState<boolean>(false);
        const [loading, setLoading] = useState<boolean>(false);
        const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

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

        //Edit Project Form Submit Handler
        const onSubmit = async (data: EditProjectSchema) => {            
            try{
                    setLoading(true);
                    const response = await editProjectApi(data, projectId as string);
                    const responseData = await response.json();
                    
                    if(!response.ok){
                        throw new Error(responseData.message)
                    }
                    if(responseData.editedProject){
                        setProjectDetails(responseData.editedProject as ProjectDetails);
                        setIsEditing(false);
                        toast.success(responseData.message);
                    }  
                    else{
                        throw new Error("Invalid response structure");
                    }        
                }
                catch(err){
                    console.log(err);
                    const errorMessage = err instanceof Error
                                ? err.message        
                                :"Could not edit project";
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
                projectName: projectDetails?.projectName || "",
                projectDescription: projectDetails?.projectDescription || "",
                status: projectDetails?.status || "Not Started",
                startDate: projectDetails && new Date((projectDetails?.startDate)),
                endDate: projectDetails && new Date((projectDetails?.endDate)),
                teamMembers: projectDetails?.teamMembers.map((member) => ({
                                    memberEmail: member.email,
                                })) || [],
            })
        }

        
        return (
            <div className="w-[100%] h-[100%] flex flex-col justify-center items-center">
                {/* Form Buttons Container */}
                <div className="w-[100%] h-[30px] flex justify-end items-center">
                    {/* Edit, Save and Cancel buttons  */}
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
                            form="projectEditForm"
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
                {/* Edit Project Form Container */}
                <div className="w-[100%] md:w-[80%] h-[calc(100%-40px)] flex justify-center items-center">
                        {/* Render Edit Form when Edit button is clicked */}
                        {isEditing? (
                        <form 
                        id="projectEditForm"
                        className="w-[100%] h-full flex flex-col justify-start items-center mt-[30px] transform-gpu will-change-transform"
                        onSubmit = {handleSubmit(onSubmit)}>
                            {/* Form Fields Container */}
                            <div className="w-full h-auto flex flex-col justify-start items-start py-[20px] space-y-6 md:space-y-0">
                                {/* Project Name */}
                                <div className="w-[100%] h-[100px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-start space-y-4 md:space-y-0 px-[10px]">
                                    <label
                                        htmlFor="projectName"
                                        className="w-[100%] md:w-[50%] h-[30px] flex flex-col justify-start items-start font-medium cursor-pointer"
                                    >
                                        Project Name
                                    </label>
                                    <div className="w-[100%] md:w-[50%] h-[70px] flex flex-col justify-between items-start">
                                        <div className="w-full h-[30px] flex flex-col justify-center items-start">
                                            <input 
                                            type="text" 
                                            id="projectName"
                                            placeholder="Ex. John Doe"
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
                                </div>
                                {/* Project Description */}
                                <div className="w-[100%] h-[150px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-start space-y-4 md:space-y-0 px-[10px]">
                                    <label
                                        htmlFor="projectDescription"
                                        className="w-[100%] md:w-[50%] h-[30px] flex flex-col justify-start items-start font-medium cursor-pointer"
                                    >
                                        Project Description
                                    </label>
                                    <div className="w-[100%] md:w-[50%] h-[120px] flex flex-col justify-between items-start">
                                        <div className="w-full h-[80px] flex flex-col justify-center items-start">
                                            <textarea 
                                            id="projectDescription"
                                            placeholder="Ex. John Doe"
                                            className="w-full h-[100%] flex justify-start items-center border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1"
                                            {...register("projectDescription")}
                                            />
                                        </div>
                                        <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                        {errors.projectName && (
                                                <p>{errors.projectName.message}</p>
                                        )} 
                                        </div>  
                                    </div>
                                </div>
                                {/* Project Status */}
                                <div className="w-[100%] h-[100px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-start space-y-4 md:space-y-0 px-[10px]">
                                    <label
                                        htmlFor="status"
                                        className="w-[100%] md:w-[50%] h-[30px] flex flex-col justify-start items-start font-medium cursor-pointer"
                                    >
                                        Project Status
                                    </label>
                                    <div className="w-[100%] md:w-[50%] h-[70px] flex flex-col justify-between items-start">
                                        <div className="w-full h-[30px] flex flex-col justify-center items-start">
                                            <select 
                                                id="status"
                                                defaultValue={"Not Started"}
                                                className="w-full h-[100%] flex justify-start items-center py-[5px] border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1"
                                                {...register("status")}
                                            >
                                                    {projectStatus.map((status, index)=>(
                                                        <option key={index} value={status}>{status}</option>
                                                    ))}
                                            </select>
                                            <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                                {errors.status && (
                                                        <p>{errors.status.message}</p>
                                                )} 
                                            </div>
                                        </div>    
                                    </div>
                                </div>
                                {/* Project Start Date */}
                                <div className="w-[100%] h-[100px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-start space-y-4 md:space-y-0 px-[10px]">
                                    <label
                                        htmlFor="startDate"
                                        className="w-[100%] md:w-[50%] h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer"
                                    >
                                        Start Date
                                    </label>
                                    <div className="w-[100%] md:w-[50%] h-[70px] flex flex-col justify-between items-start">
                                        <div className="w-[100%] h-[30px] flex flex-col justify-center items-center">
                                            <Controller
                                            control={control}
                                            name="startDate"
                                            render={({ field }) => (
                                                <div className="w-[100%] h-full flex justify-start items-center">
                                                    <DatePicker
                                                    id="startDate"
                                                    placeholderText="Select start date"
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
                                </div>
                                {/* Project End Date */}
                                <div className="w-[100%] h-[100px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-start space-y-4 md:space-y-0 px-[10px]">
                                    <label
                                        htmlFor="endDate"
                                        className="w-[100%] md:w-[50%] h-[30px] flex flex-col justify-start items-start font-medium cursor-pointer"
                                    >
                                        End Date
                                    </label>
                                    <div className="w-[100%] md:w-[50%] h-[70px] flex flex-col justify-between items-start">
                                        <div className="w-[100%] h-[30px] flex flex-col justify-center items-center">
                                            <Controller
                                            control={control}
                                            name="endDate"
                                            render={({ field }) => (
                                                <div className="w-[100%] h-full flex justify-start items-center">
                                                    <DatePicker
                                                    id="endDate"
                                                    placeholderText="Select end date"
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
                                <div className="w-[100%] min-h-[100px] h-auto flex flex-col justify-between items-start md:flex-row md:justify-start md:items-start space-y-4 md:space-y-0 px-[10px]">
                                    <label
                                        htmlFor="teamMembers"
                                        className="w-[100%] md:w-[50%] h-[30px] flex flex-col justify-start items-start font-medium cursor-pointer"
                                    >
                                        Team Members
                                    </label>
                                    {/* Team Member Select Dropdown Container (multiple select fields to select multiple team members) */}
                                    <div className="w-full md:w-[50%] h-[calc(100%-30px)] flex flex-col justify-start items-start space-y-4 transform-gpu will-change-transform">
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
                                                                <p >{errors.teamMembers[index]?.memberEmail?.message}</p>
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
                                        {addedMemberEmails.length < allUsers.length && (
                                            <div className="w-[100%] md:w-[40%] h-[35px] flex justify-start items-center transform-gpu will-change-transform">
                                                <div className="w-[50%] md:w-[100%] h-[35px] flex justify-start items-center transform-gpu will-change-transform space-x-4">
                                                    <button 
                                                    type="button"
                                                    onClick={()=>setMemberCount(memberCount+1)}
                                                    className="w-[100%] h-full flex justify-center items-center space-x-2 bg-black text-white rounded-[10px] px-[10px] hover:cursor-pointer"
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
                        </form>
                    ):(
                        // Render project details when Edit button is not clicked
                        <div className="w-[100%] h-full flex flex-col justify-start items-center mt-[30px]">
                            {/* Project Details Container */}
                            <div className="w-full h-auto flex flex-col justify-start items-start py-[20px] space-y-4">
                                {/* Project Name */}
                                <div className="w-[100%] h-[70px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-center px-[10px]">
                                    <p className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer">
                                        Project Name
                                    </p>
                                    <p className="w-full h-[30px] flex justify-start items-center border border-gray-300 rounded-md text-sm px-[20px] bg-gray-200">
                                        {projectDetails ? projectDetails.projectName : ""}
                                    </p>    
                                </div>
                                {/* Project Description */}
                                <div className="w-[100%] min-h-[120px] h-auto flex flex-col justify-between items-start md:flex-row md:justify-start md:items-center px-[10px]">
                                    <p className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer">
                                        Project Description
                                    </p>
                                    <p className="w-full min-h-[80px] h-auto flex justify-start items-center text-justify border border-gray-300 rounded-md text-sm py-[10px] px-[20px] bg-gray-200">
                                        {projectDetails ? projectDetails.projectDescription :""}
                                    </p>
                                </div>
                                {/* Project Status */}
                                <div className="w-[100%] h-[70px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-center px-[10px]">
                                    <p className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer">
                                        Project Status
                                    </p>
                                    <p className="w-full h-[30px] flex justify-start items-center border border-gray-300 rounded-md text-sm px-[20px] bg-gray-200">
                                        {projectDetails ? projectDetails.status :"Not Started"}
                                    </p>
                                </div>
                                {/* Project Start Date */}
                                <div className="w-[100%] h-[70px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-center px-[10px]">
                                    <p className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer">
                                        Start Date
                                    </p>
                                    <p className="w-full h-[30px] flex justify-start items-center border border-gray-300 rounded-md text-sm px-[20px] bg-gray-200">
                                        {projectDetails ? dateConverter(projectDetails.startDate) :""}
                                    </p> 
                                </div>
                                {/* Project End Date */}
                                <div className="w-[100%] h-[70px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-center px-[10px]">
                                    <p className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer">
                                        End Date
                                    </p>
                                    <p className="w-full h-[30px] flex justify-start items-center border border-gray-300 rounded-md text-sm px-[20px] bg-gray-200">
                                        {projectDetails ? dateConverter(projectDetails.endDate) : ""}
                                    </p> 
                                </div>
                                {/* Project Team Members */}
                                <div className="w-[100%] h-auto flex flex-col justify-between items-start md:flex-row md:justify-start md:items-start px-[10px] space-y-4 md:space-y-0">
                                    <p className="w-full h-[30px] flex flex-col justify-start items-start font-medium">
                                        Team Members
                                    </p>
                                    <div className="w-full h-auto flex flex-col justify-start items-start space-y-4">
                                        {(projectDetails && projectDetails.teamMembers && projectDetails.teamMembers.length) ? 
                                            projectDetails.teamMembers.map((member, index)=>(
                                                <p 
                                                key={index}
                                                className="w-full h-[30px] flex justify-start items-center border border-gray-300 rounded-md text-sm px-[20px] bg-gray-200"
                                                > 
                                                {member.name}
                                                </p>  
                                            )):(
                                                <p className="w-full h-[30px] flex justify-start items-center border border-gray-300 rounded-md text-sm px-[20px] bg-gray-200"> 
                                                </p>  
                                        )}
                                    </div>     
                                </div>
                            </div>                                    
                        </div>
                    )}      
                </div> 
            </div>
        )
}

export default EditProject;
