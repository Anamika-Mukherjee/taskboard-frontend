//Collaboration Ticket Overview Page Component (used in Ticket Overview Page in Collaborations)
"use client";
import { getTicketDetailsApi } from "@/services/ticket/getTicketDetails";
import { TicketDetails } from "@/types/ticketTypes";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";
import { toast } from "sonner";

const CollabTicketOverview = () => {
        const params = useParams();
        const {ticketId} = params;
        const [ticketDetails, setTicketDetails] = useState<TicketDetails>();
        const [loading, setLoading] = useState<boolean>(false);
        
        //Fetch given tickets's details from backend through ticketId
        useEffect(()=>{
            const fetchTicketDetails = async () =>{
                try{
                    setLoading(true);
                    const response = await getTicketDetailsApi(ticketId as string);
                    const responseData = await response.json();
                    
                    if(!response.ok){
                        throw new Error(responseData.message)
                    }
                    if(responseData.ticketDetails){
                        setTicketDetails(responseData.ticketDetails as TicketDetails);
                    }  
                    else{
                        throw new Error("Invalid response structure");
                    }  
                }
                catch(err){
                    console.log(err);
                    const errorMessage = err instanceof Error
                                ? err.message        
                                :"Could not fetch ticket details";
                    toast.error(errorMessage);
                }
                finally{
                    setLoading(false);
                }
            }
            fetchTicketDetails();
        }, [ticketId, setTicketDetails]);

        if(loading){
            return (
                <div className="w-[100%] md:w-[90%] h-[calc(100%-45px)] flex justify-center items-start z-0">
                    <div className="w-[80%] h-[100%] bg-white rounded-[10px] flex flex-col justify-center items-center py-[20px] px-[30px] space-y-6 z-0 relative">
                        <FadeLoader color="#8600D8" width={2} height={10} />
                    </div>
                </div>
            )
        }

        return (
            <div className="w-[100%] md:w-[90%] h-[calc(100%-45px)] flex justify-center items-start z-0">
                {/* Ticket Overview Container */}
                <div className="w-[80%] h-[100%] bg-white rounded-[10px] flex flex-col justify-start items-center space-y-6 py-[20px] px-[30px] z-0 relative">
                    {/* Heading */}
                    <div className="w-[100%] h-[45px] flex justify-center items-center">
                        <h3 className="text-lg font-semibold">Ticket Overview</h3>
                    </div>
                    {ticketDetails ? (
                            // Ticket Details
                            <div className="w-[100%] h-[calc(100%-45px)] flex flex-col justify-center items-center overflow-y-scroll hide-scrollbar rounded-[10px] bg-blue-100 p-[20px]">
                                <div className="w-[100%] h-full flex flex-col justify-start items-center mt-[30px]">
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
                                            <p className="w-full min-h-[80px] h-auto flex justify-start items-center border border-gray-300 rounded-md text-sm px-[6px] py-[10px] bg-gray-200">
                                                {ticketDetails ? ticketDetails.ticketDescription :""}
                                            </p>
                                        </div>
                                        {/* Project Owner */}
                                        <div className="w-[100%] h-[70px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-center px-[10px]">
                                            <p className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer">
                                                Project Owner
                                            </p>
                                            <p className="w-full h-[30px] flex justify-start items-center border border-gray-300 rounded-md text-sm pl-[6px] bg-gray-200">
                                                {ticketDetails ? ticketDetails.projectId.userId.name :""}
                                            </p> 
                                        </div>
                                        {/* Assignee */}
                                        <div className="w-[100%] h-[70px] flex flex-col justify-between items-start md:flex-row md:justify-start md:items-center px-[10px]">
                                            <p className="w-full h-[30px] flex flex-col justify-center items-start font-medium cursor-pointer">
                                                Assignee
                                            </p>
                                            <p className="w-full h-[30px] flex justify-start items-center border border-gray-300 rounded-md text-sm pl-[6px] bg-gray-200">
                                                {ticketDetails ? ticketDetails.assignee.email :""}
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
                            </div> 
                    ):(
                        <div className="w-[100%] h-[calc(100%-45px)] flex flex-col justify-center items-center space-y-6"></div>
                    )
                    }                    
                </div>
            </div>   
        )
}

export default CollabTicketOverview;
