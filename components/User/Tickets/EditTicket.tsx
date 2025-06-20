//Edit Ticket Form Component (used in Ticket Overview Page)
"use client";
import { TicketDetails } from "@/types/ticketTypes";
import React, { SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import { editTicketApi } from "@/services/ticket/editTicket";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { ProjectDetails, TeamMember } from "@/types/projectTypes";

//Define arrays for ticket type, priority and status values
const ticketTypes = ["Task", "Bug", "Feature", "Improvement"];
const ticketPriority = ["Low", "Medium", "High", "Critical"];
const ticketStatus = ["To Do", "In Progress", "Done"];

// Define zod schema for Edit Ticket Form Fields
const editTicketSchema = z.object({
    ticketTitle: z
                .string()
                .min(1, "Ticket Title is required")
                .max(100, "Ticket Title must not be more than 100 characters"),
    ticketDescription: z
                       .string()
                       .min(1, "Ticket Description is required")
                       .max(500, "Ticket Description must not be more than 500 characters"),
    assignee: z
              .string()
              .email("Assignee is required"),                   
    ticketType: z
                .enum(["Task", "Bug", "Feature", "Improvement"]),
    ticketPriority: z
                    .enum(["Low", "Medium", "High", "Critical"]),
    ticketStatus: z   
                  .enum(["To Do", "In Progress", "Done"])
});

//Define type for form schema
type EditTicketSchema = z.infer<typeof editTicketSchema>;

//Define interface for props
interface EditTicketProps{
    ticketDetails: TicketDetails;
    setTicketDetails: React.Dispatch<SetStateAction<TicketDetails | undefined>>;
    ticketId: string;
    projectDetails: ProjectDetails;
}

const EditTicket: React.FC<EditTicketProps> = ({ticketDetails, setTicketDetails, ticketId, projectDetails}) => {

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<EditTicketSchema>({
        resolver: zodResolver(editTicketSchema)
    });

    const teamMembers: TeamMember[] = projectDetails.teamMembers;
    const [loading, setLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
  
    //Edit Ticket Form Submit Handler
    const onSubmit = async (data: EditTicketSchema) => {
        try{
            setLoading(true);
            const response = await editTicketApi(data, ticketId as string);
            const responseData = await response.json();
            
            if(!response.ok){
                throw new Error(responseData.message)
            }
            if(responseData.editedTicket){
                setTicketDetails(responseData.editedTicket as TicketDetails);
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
                    :"Could not edit ticket";
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
            ticketTitle: ticketDetails?.ticketTitle || "",
            ticketDescription: ticketDetails?.ticketDescription || "",
            assignee: ticketDetails?.assignee.email || "",
            ticketType: ticketDetails?.ticketType || "Task",
            ticketPriority: ticketDetails?.ticketPriority || "Low",
            ticketStatus: ticketDetails?.ticketStatus || "To Do",
        });
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
                        form="ticketEditForm"
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
            {/* Edit Ticket Form Container */} 
            <div className="w-[100%] md:w-[80%] h-[calc(100%-40px)] flex justify-center items-center">
                {/* Render Edit Form when Edit button is clicked */}
                {isEditing? (
                    <form 
                    id="ticketEditForm"
                    className="w-[100%] h-full flex flex-col justify-start items-center mt-[30px] transform-gpu will-change-transform"
                    onSubmit = {handleSubmit(onSubmit)}
                    >   
                        {/* Form Fields Container */}
                        <div className="w-full h-auto flex flex-col justify-start items-start py-[20px] space-y-6 md:space-y-0">
                            {/* Ticket Title */}
                            <div className="w-[100%] h-[100px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-start space-y-4 md:space-y-0 px-[10px]">
                                <label
                                    htmlFor="ticketTitle"
                                    className="w-[100%] md:w-[50%] h-[30px] flex flex-col justify-start items-start font-medium cursor-pointer"
                                >
                                    Ticket Title
                                </label>
                                <div className="w-[100%] md:w-[50%] h-[70px] flex flex-col justify-between items-start">
                                    <div className="w-full h-[30px] flex flex-col justify-center items-start">
                                        <input 
                                        type="text" 
                                        id="ticketTitle"
                                        placeholder="Ex. Create Sign In Page"
                                        className="w-full h-[100%] flex justify-start items-center border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1"
                                        {...register("ticketTitle")}
                                        />
                                    </div>
                                    <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                        {errors.ticketTitle && (
                                            <p>{errors.ticketTitle.message}</p>
                                        )} 
                                    </div>
                                </div>   
                            </div>
                            {/* Ticket Description */}
                            <div className="w-[100%] h-[150px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-start space-y-4 md:space-y-0 px-[10px]">
                                <label
                                    htmlFor="ticketDescription"
                                    className="w-[100%] md:w-[50%] h-[30px] flex flex-col justify-start items-start font-medium cursor-pointer"
                                >
                                    Ticket Description
                                </label>
                                <div className="w-[100%] md:w-[50%] h-[120px] flex flex-col justify-between items-start">
                                    <div className="w-full h-[80px] flex flex-col justify-center items-start">
                                        <textarea 
                                        id="ticketDescription"
                                        placeholder="Ex. &apos;Create sign in page with different sign in methods...&apos;"
                                        className="w-full h-[100%] flex justify-start items-center border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1"
                                        {...register("ticketDescription")}
                                        />
                                    </div>
                                    <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                        {errors.ticketDescription && (
                                            <p>{errors.ticketDescription.message}</p>
                                        )} 
                                    </div>  
                                </div>
                            </div>
                            {/* Assignee */}
                            <div className="w-[100%] h-[100px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-start space-y-4 md:space-y-0 px-[10px]">
                                <label
                                    htmlFor="assignee"
                                    className="w-[100%] md:w-[50%] h-[30px] flex flex-col justify-start items-start font-medium cursor-pointer"
                                >
                                    Assignee
                                </label>
                                <div className="w-[100%] md:w-[50%] h-[70px] flex flex-col justify-between items-start">
                                    <div className="w-full h-[30px] flex flex-col justify-center items-start">
                                            <select 
                                            id="assignee"
                                            className="w-full h-[100%] flex justify-start items-center border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1"
                                            {...register("assignee")}
                                            >
                                            {teamMembers.map((member)=>(
                                                <option key={member._id} value={member.email}>{member.name}</option>
                                            ))}
                                            </select>
                                    </div>
                                    <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                        {errors.assignee && (
                                            <p>{errors.assignee.message}</p>
                                        )} 
                                    </div>
                                </div>
                            </div>
                            {/* Ticket Type */}
                            <div className="w-[100%] h-[100px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-start space-y-4 md:space-y-0 px-[10px]">
                                <label
                                    htmlFor="ticketType"
                                    className="w-[100%] md:w-[50%] h-[30px] flex flex-col justify-start items-start font-medium cursor-pointer"
                                >
                                    Ticket Type
                                </label>
                                <div className="w-[100%] md:w-[50%] h-[70px] flex flex-col justify-between items-start">
                                    <div className="w-full h-[30px] flex flex-col justify-center items-center">
                                        <select 
                                            id="ticketType"
                                            defaultValue={"Task"}
                                            className="w-full h-[100%] flex justify-start items-center border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1"
                                            {...register("ticketType")}
                                        >
                                            {ticketTypes.map((type, index)=>(
                                                <option key={index} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                            {errors.ticketType && (
                                            <p>{errors.ticketType.message}</p>
                                            )} 
                                    </div> 
                                </div> 
                            </div>
                            {/* Ticket Priority */}
                            <div className="w-[100%] h-[100px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-start space-y-4 md:space-y-0 px-[10px]">
                                <label
                                    htmlFor="ticketPriority"
                                    className="w-[100%] md:w-[50%] h-[30px] flex flex-col justify-start items-start font-medium cursor-pointer"
                                >
                                    Ticket Priority
                                </label>
                                <div className="w-[100%] md:w-[50%] h-[70px] flex flex-col justify-between items-start">
                                    <div className="w-full h-[30px] flex flex-col justify-center items-center">
                                        <select 
                                            id="ticketPriority"
                                            defaultValue={"Low"}
                                            className="w-full h-[100%] flex justify-start items-center border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1"
                                            {...register("ticketPriority")}
                                        >
                                            {ticketPriority.map((type, index)=>(
                                                <option key={index} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                            {errors.ticketPriority && (
                                            <p>{errors.ticketPriority.message}</p>
                                            )} 
                                    </div> 
                                </div> 
                            </div>
                            {/* Ticket Status */}
                            <div className="w-[100%] h-[100px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-start space-y-4 md:space-y-0 px-[10px]">
                                <label
                                    htmlFor="ticketStatus"
                                    className="w-[100%] md:w-[50%] h-[30px] flex flex-col justify-start items-start font-medium cursor-pointer"
                                >
                                    Ticket Status
                                </label>
                                <div className="w-[100%] md:w-[50%] h-[70px] flex flex-col justify-between items-start">
                                    <div className="w-full h-[30px] flex flex-col justify-center items-center">
                                        <select 
                                            id="ticketStatus"
                                            defaultValue={"To Do"}
                                            className="w-full h-[100%] flex justify-start items-center border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1"
                                            {...register("ticketStatus")}
                                        >
                                            {ticketStatus.map((type, index)=>(
                                                <option key={index} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full h-[30px] text-sm font-semibold text-red-500">
                                            {errors.ticketStatus && (
                                            <p>{errors.ticketStatus.message}</p>
                                            )} 
                                    </div> 
                                </div> 
                            </div>
                        </div>
                    </form>
                ):(
                    // Render ticket details when Edit button is not clicked
                    <div className="w-[100%] h-full flex flex-col justify-start items-center mt-[30px] ">
                        {/* Ticket Details Container */}
                        <div className="w-full h-auto flex flex-col justify-start items-start py-[20px] space-y-4">
                            {/* Ticket Title */}
                            <div className="w-[100%] h-[70px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-center px-[10px]">
                                <p className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer">
                                    Ticket Title
                                </p>
                                <p className="w-full h-[30px] flex justify-start items-center border border-gray-300 rounded-md text-sm pl-[6px] bg-gray-200">
                                        {ticketDetails ? ticketDetails.ticketTitle : ""}
                                </p>    
                            </div>
                            {/* Ticket Description */}
                            <div className="w-[100%] min-h-[120px] h-auto flex flex-col justify-between items-start md:flex-row md:justify-start md:items-center px-[10px]">
                                <p className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer">
                                    Ticket Description
                                </p>
                                <p className="w-full h-[80px] flex justify-start items-center border border-gray-300 rounded-md text-sm px-[6px] bg-gray-200">
                                    {ticketDetails ? ticketDetails.ticketDescription :""}
                                </p>
                            </div>
                            {/* Assignee */}
                            <div className="w-[100%] h-[70px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-center px-[10px]">
                                <p className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer">
                                    Assignee
                                </p>
                                <p className="w-full h-[30px] flex justify-start items-center border border-gray-300 rounded-md text-sm pl-[6px] bg-gray-200">
                                    {ticketDetails ? ticketDetails.assignee.name :""}
                                </p> 
                            </div>
                            {/* Ticket Type */}
                            <div className="w-[100%] h-[70px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-center px-[10px]">
                                <p className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer">
                                    Ticket Type
                                </p>
                                <p className="w-full h-[30px] flex justify-start items-center border border-gray-300 rounded-md text-sm pl-[6px] bg-gray-200">
                                    {ticketDetails ? ticketDetails.ticketType : "Task"}
                                </p> 
                            </div>
                            {/* Ticket Priority */}
                            <div className="w-[100%] h-[70px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-center px-[10px]">
                                <p className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer">
                                    Ticket Priority
                                </p>
                                <p className="w-full h-[30px] flex justify-start items-center border border-gray-300 rounded-md text-sm pl-[6px] bg-gray-200">
                                    {ticketDetails ? ticketDetails.ticketPriority : "Low"}
                                </p> 
                            </div>
                            {/* Ticket Status */}
                            <div className="w-[100%] h-[70px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-center px-[10px]">
                                <p className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer">
                                    Ticket Status
                                </p>
                                <p className="w-full h-[30px] flex justify-start items-center border border-gray-300 rounded-md text-sm pl-[6px] bg-gray-200">
                                    {ticketDetails ? ticketDetails.ticketStatus : "To Do"}
                                </p> 
                            </div>
                        </div>                                    
                    </div>
                )}              
            </div> 
        </div>
    )
}

export default EditTicket;
