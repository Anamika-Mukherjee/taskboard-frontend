//Create Ticket Form Component (used in Tickets Page)
"use client";
import { useAllTicketContext } from "@/contexts/allTicketContext";
import { createTicketApi } from "@/services/ticket/createTicket";
import { TeamMember } from "@/types/projectTypes";
import { TicketDetails } from "@/types/ticketTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { z } from "zod";

//Define arrays for ticket type and priority values
const ticketTypes = ["Task", "Bug", "Feature", "Improvement"];
const ticketPriority = ["Low", "Medium", "High", "Critical"];

// Define zod schema for Create Ticket Form Fields
const createTicketSchema = z.object({
    ticketTitle: z
                 .string()
                 .min(1, "Ticket Title is required")
                 .max(100, "Ticket Title must not be more than 100 characters"),
    ticketDescription: z
                        .string()
                        .min(1, "Ticket description is required")
                        .max(500, "Ticket description must not be more than 500 characters"),
    assignee: z
              .string()
              .email("Assignee is required"),                    
    ticketType: z
                .enum(["Task", "Bug", "Feature", "Improvement"]),
    ticketPriority: z
                    .enum(["Low", "Medium", "High", "Critical"]),
                
});

//Define type for form schema
type CreateTicketSchema = z.infer<typeof createTicketSchema>;

//Define interface for props
interface CreateTicketFormProps{
    open: boolean;
    onOpenChange: React.Dispatch<SetStateAction<boolean>>;
    projectId: string;
    teamMembers: TeamMember[];
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({open, onOpenChange, projectId, teamMembers}) => {

         const {
              register,
              handleSubmit,
              formState: { errors },
           } = useForm<CreateTicketSchema>({
              resolver: zodResolver(createTicketSchema),
         });
  
         const {setAllTickets} = useAllTicketContext();
         const [loading, setLoading] = useState<boolean>(false);
   
         //Create Ticket Form Submit Handler
         const onSubmit = async (data: CreateTicketSchema) => {
               try{
                    setLoading(true);
                    const response = await createTicketApi(projectId as string, data);
                    const responseData = await response.json();

                    if(!response.ok){
                        throw new Error(responseData.message)
                    }
                    if(responseData.allTickets){
                        setAllTickets(responseData.allTickets as TicketDetails[]);
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
                              ? err.message        
                              :"Could not create ticket";
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
                          <h3 className="text-lg font-semibold">Create new ticket</h3>
                        </div> 
                        {/* Create Ticket Form container (Scrollable) */}
                        <div className="w-full h-[calc(100%-45px)] flex justify-center items-center overflow-y-scroll hide-scrollbar">
                            {/* Create Ticket Form */}
                           <form 
                           className="w-[100%] h-full flex flex-col justify-start items-center mt-[30px] "
                           onSubmit = {handleSubmit(onSubmit)}
                           >
                                 {/* Form Fields Container */}
                                 <div className="w-full h-auto flex flex-col justify-start items-start py-[20px] ">
                                       {/* Ticket Title */}
                                       <div className="w-[100%] h-[100px] flex flex-col justify-between items-center px-[10px]">
                                          <label
                                            htmlFor="ticketTitle"
                                            className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer"
                                          >
                                            Ticket Title
                                          </label>
                                          <div className="w-full h-[30px] flex flex-col justify-center items-center">
                                             <input 
                                             type="text" 
                                             id="ticketTitle"
                                             placeholder="Ex. &apos;Create Sign in page&apos;"
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
                                       {/* Ticket Description */}
                                       <div className="w-[100%] h-[150px] flex flex-col justify-between items-center px-[10px]">
                                          <label
                                             htmlFor="ticketDescription"
                                             className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer"
                                          >
                                            Ticket Description
                                          </label>
                                          <div className="w-full h-[80px] flex flex-col justify-center items-center">
                                             <textarea 
                                                id="ticketDescription"
                                                placeholder="Ex. &apos;Sign in page with different sign in methods like email, google...&apos;"
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
                                       {/* Assignee */}
                                      <div className="w-[100%] h-[100px] flex flex-col justify-between items-center px-[10px]">
                                          <label
                                             htmlFor="assignee"
                                             className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer"
                                          >
                                             Assignee
                                          </label>
                                         <div className="w-full h-[30px] flex flex-col justify-center items-center">
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
                                       {/* Ticket Type */}
                                       <div className="w-[100%] h-[100px] flex flex-col justify-between items-center px-[10px]">
                                          <label
                                             htmlFor="ticketType"
                                             className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer"
                                          >
                                            Ticket Type
                                          </label>
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
                                       {/* Ticket Priority */}
                                       <div className="w-[100%] h-[100px] flex flex-col justify-between items-center px-[10px]">
                                          <label
                                             htmlFor="ticketPriority"
                                             className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer"
                                          >
                                            Ticket Priority
                                          </label>
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
                                 {/* Create Ticket Button */}
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

export default CreateTicketForm;
