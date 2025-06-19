//Ticket Overview Page Component (used in Ticket Overview Page)
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TicketDetails } from "@/types/ticketTypes";
import { getTicketDetailsApi } from "@/services/ticket/getTicketDetails";
import EditTicket from "./EditTicket";
import DeleteTicket from "./DeleteTicket";
import { toast } from "sonner";
import { getProjectDetailsApi } from "@/services/project/getProjectDetails";
import { ProjectDetails } from "@/types/projectTypes";
import { FadeLoader } from "react-spinners";

const TicketOverview = () => {
        const params = useParams();
        const {ticketId, userId} = params;
        const [ticketDetails, setTicketDetails] = useState<TicketDetails>();
        const [projectDetails, setProjectDetails] = useState<ProjectDetails>();
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

        //Fetch given ticket's project details from backend
        useEffect(()=>{
            if(ticketDetails){
                const fetchProjectDetails = async () =>{
                    try{
                        setLoading(true);
                        const response = await getProjectDetailsApi(ticketDetails.projectId._id as string);
                        const responseData = await response.json();
                        
                        if(!response.ok){
                            throw new Error(responseData.message)
                        }
                        if(responseData.projectDetails){
                            setProjectDetails(responseData.projectDetails as ProjectDetails);
                        }  
                        else{
                            throw new Error("Invalid response structure");
                        }     
                    }
                    catch(err){
                        console.log(err);
                        const errorMessage = err instanceof Error
                                    ? err.message        
                                    :"Could not fetch project details";
                        toast.error(errorMessage);
                    }
                    finally{
                        setLoading(false);
                    }  
                }
                fetchProjectDetails();
            }  
        }, [ticketDetails]);

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
                    {ticketDetails && projectDetails ? (
                        <div className="w-[100%] h-[calc(100%-45px)] flex flex-col justify-center items-center space-y-2">
                            {/* Render Edit Ticket Form Component*/}
                            <div className="w-[100%] h-[calc(100%-55px)] flex flex-col justify-center items-center overflow-y-scroll hide-scrollbar rounded-[10px] bg-blue-100 p-[20px]">
                                <EditTicket ticketDetails = {ticketDetails} setTicketDetails={setTicketDetails} ticketId={ticketId as string} projectDetails = {projectDetails}/>
                            </div> 
                            {/* Render Delete Ticket Component*/}
                            <div className="w-[100%] h-[40px] flex flex-col justify-center items-center rounded-[10px]"> 
                                <DeleteTicket ticketTitle = {ticketDetails.ticketTitle} ticketId = {ticketId as string} userId = {userId as string} projectDetails = {ticketDetails.projectId}/>
                            </div>
                        </div>
                    ):( 
                        <div className="w-[100%] h-[calc(100%-45px)] flex flex-col justify-center items-center space-y-6"></div>
                    )}                    
                </div>
            </div>    
        )
}

export default TicketOverview;
