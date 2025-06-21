//Collaboration Overview Page Component (used in Collaboration Overview Page)
"use client";
import { getCollabDetailsApi } from "@/services/collaboration/getCollabDetails";
import { ProjectDetails } from "@/types/projectTypes";
import { dateConverter } from "@/utils/functions";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";
import { toast } from "sonner";

const CollabOverview = () => {
    const params = useParams();
    const {projectId} = params;
    const [collabDetails ={
      _id: "",
     userId: {
        _id: "",
        name: "",
        email: ""
     },
     projectName: "",
     projectDescription: "",
     startDate: "",
     endDate: "",
     teamMembers: [],
     projectKey: "",
     status: "Not Started",
     tickets: [],
     createdAt: "",
     updatedAt: "",
    }, setCollabDetails] = useState<ProjectDetails>();
    const [loading, setLoading] = useState<boolean>(false); 
    const [showMembers, setShowMembers] = useState<boolean>(false);
    const [showTickets, setShowTickets] = useState<boolean>(false);

    //Define text colors for different project status values
    const statusColor = collabDetails.status === "Not Started"
                      ?"text-blue-500"
                      :collabDetails.status === "In Progress"
                      ?"text-yellow-500"
                      :collabDetails.status === "Completed"
                      ?"text-green-500"
                      :collabDetails.status === "On Hold"
                      ?"text-[#88089c]"
                      :"text-red-500"
 
    //Fetch given project's details from backend through projectId
    useEffect(()=>{
        const fetchProjectDetails = async () =>{
            try{
                setLoading(true);
                const response = await getCollabDetailsApi(projectId as string);
                const responseData = await response.json();

                if(!response.ok){
                    throw new Error(responseData.message)
                }
                if(responseData.collabDetails){
                    setCollabDetails(responseData.collabDetails as ProjectDetails);
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
        };
        fetchProjectDetails();
    }, [projectId, setCollabDetails]);
 
    if(loading){
        return (
        <div className="w-[100%] md:w-[90%] h-[calc(100%-45px)] flex justify-center items-start">
            <div className="w-[80%] h-[100%] bg-white rounded-[10px] flex justify-center items-center py-[20px] px-[30px]z-0 relative">
                <FadeLoader color="#8600D8" width={2} height={10} />
            </div>
        </div>
        )
    }

    return !loading && collabDetails && (
            <div className="w-[100%] md:w-[90%] h-[calc(100%-45px)] flex justify-center items-start z-0">
                {/* Collaborations Overview Container */}
                <div className="w-[80%] h-[100%] bg-white rounded-[10px] flex flex-col justify-start items-center py-[20px] px-[30px] space-y-6 z-0 relative">
                    {/* Heading and Project Status*/}
                    <div className="w-[100%] h-[80px] flex flex-col justify-between items-center">
                        {/* Heading - Project Name*/}
                        <div className="w-[100%] h-[40px] flex justify-center items-center">
                            <h1 className="w-[100%] h-[100%] flex justify-center items-center text-2xl font-semibold">
                                {collabDetails.projectName}
                            </h1>
                        </div>
                        {/* Project Status*/}
                        <div className="w-[100%] h-[20px] flex justify-end items-center">
                            <div className="w-auto h-[100%] flex jusify-center items-center space-x-2">
                                <div className="w-[20px] h-full flex justify-end items-center">
                                    {collabDetails.status === "Not Started"? (
                                    <Icon
                                        icon={"ic:baseline-pending"}
                                        className={`w-[15px] h-[15px] ${statusColor}`}
                                    /> 
                                    ): collabDetails.status === "In Progress"? (
                                        <Icon
                                            icon={"carbon:in-progress"}
                                            className={`w-[15px] h-[15px] ${statusColor}`}
                                        /> 
                                    ): collabDetails.status === "Completed"? (
                                        <Icon
                                            icon={"nrk:check-active"}
                                            className={`w-[15px] h-[15px] ${statusColor}`}
                                        /> 
                                    ):  collabDetails.status === "On Hold" ? (
                                        <Icon
                                            icon={"zondicons:pause-solid"}
                                            className={`w-[15px] h-[15px] ${statusColor}`}
                                        /> 
                                    ): collabDetails.status === "Cancelled"? (
                                        <Icon
                                            icon={"ic:baseline-cancel"}
                                            className={`w-[15px] h-[15px] ${statusColor}`}
                                        /> 
                                    ): null}
                                </div>
                                <div className="w-auto h-full flex justify-end items-center">
                                    <p className={`w-full h-full flex justify-end items-center text-sm font-semibold ${statusColor}`}>{collabDetails.status}</p>
                                </div>
                            </div>
                        </div>   
                    </div>
                    {/* Collaboration Details Container (Scrollable)*/}
                    <div className="w-full h-[calc(100%-50px)] flex flex-col justify-start items-start space-y-6 py-[20px] overflow-y-auto hide-scrollbar">
                        {/* Collaboration Details */}
                        <div className="w-full md:min-h-[350px] h-auto flex flex-col justify-start space-y-4 md:space-y-0 md:justify-between items-start py-[30px] px-[20px] md:px-[10px] bg-blue-100 rounded-[10px]">
                            {/* Project Creation Date, Start Date, End Date */}
                            <div className="w-full md:h-[50px] flex flex-col md:flex-row space-y-4 md:space-y-0 justify-between items-start md:items-center">
                                <div className="w-full md:w-[30%] h-[50px] md:h-full flex flex-col justify-between items-start md:items-center">
                                    <p className="font-semibold text-[#02659e] mr-[6px] flex">Project Created on </p>
                                    <p className="font-medium text-sm text-gray-500">{dateConverter(collabDetails.createdAt)}</p>
                                </div>
                                <div className="w-full md:w-[30%] h-[50px] md:h-full flex flex-col justify-between items-start md:items-center">
                                    <p className="font-semibold text-[#02659e] mr-[6px] flex">Project Start Date </p>
                                    <p className="font-medium text-sm text-gray-500">{dateConverter(collabDetails.startDate)}</p>
                                </div>
                                <div className="w-full md:w-[30%] h-[50px] md:h-full flex flex-col justify-between items-start md:items-center">
                                    <p className="font-semibold text-[#02659e] mr-[6px] flex">Project End Date </p>
                                    <p className="font-medium text-sm text-gray-500">{dateConverter(collabDetails.endDate)}</p>
                                </div>
                            </div>
                            {/* Project Created By, No of Team Members, No of Tickets */}
                            <div className="w-full md:h-[50px] flex flex-col md:flex-row space-y-4 md:space-y-0 justify-between items-start md:items-center">
                                <div className="w-full md:w-[30%] h-[50px] md:h-full flex flex-col justify-between items-start md:items-center">
                                    <p className="font-semibold text-[#02659e] mr-[6px] flex">Project Created by </p>
                                    <p className="font-medium text-sm text-gray-500">{collabDetails.userId.name}</p>
                                </div>
                                <div className="w-full md:w-[30%] h-[50px] md:h-full flex flex-col justify-between items-start md:items-center">
                                    <p className="font-semibold text-[#02659e] mr-[6px] flex">Team members </p>
                                    <p className="font-medium text-sm text-gray-500">{collabDetails.teamMembers.length}</p>
                                </div>
                                <div className="w-full md:w-[30%] h-[50px] md:h-full flex flex-col justify-between items-start md:items-center">
                                    <p className="font-semibold text-[#02659e] mr-[6px] flex">Tickets </p>
                                    <p className="font-medium text-sm text-gray-500">{collabDetails.tickets.length}</p>
                                </div>
                            </div>
                            {/* Project Description */}
                            <div className="w-full md:w-[85%] min-h-[calc(100%-150px)] h-auto flex justify-center items-center self-center">
                                <div className="w-full h-full flex flex-col justify-start items-start space-y-2">
                                    <p className="font-semibold text-[#02659e] flex">Description </p>
                                    <p className="w-full h-auto font-medium text-sm text-gray-500">{collabDetails.projectDescription}</p>
                                </div>
                            </div>
                        </div>
                        {/* Project Team Members and Tickets Expandable Tab Container */}
                        <div className="w-full h-auto flex flex-col justify-start items-center space-y-4 py-[20px]">
                            {/* Project Team Members Expandable Tab */}
                            <div className="w-full h-[50px] flex justify-center items-center px-[10px] rounded-[10px] py-[20px] bg-[#398ab8]">
                                <h2 className="w-[90%] h-auto py-[20px] flex justify-center items-center font-semibold text-lg text-white">
                                    Members
                                </h2> 
                                {/* Buttons to expand and collapse team members details */} 
                                <div className="w-[25px] h-[25px] flex justify-center items-center">
                                    {!showMembers ? (
                                        <button
                                        type="button"
                                        onClick={()=>setShowMembers(true)}
                                        className="hover:bg-gray-400 w-full h-full flex justify-center items-center rounded-[20px] cursor-pointer transition duration-200 ease-in-out"
                                        >
                                            <Icon
                                            icon={"entypo:plus"}
                                            className="text-white w-[20px] h-[20px]"
                                            />
                                        </button>
                                    ):(
                                        <button
                                        type="button"
                                        onClick={()=>setShowMembers(false)}
                                        className="hover:bg-gray-400 w-full h-full flex justify-center items-center rounded-[20px] cursor-pointer transition duration-200 ease-in-out"
                                        >
                                            <Icon 
                                            icon={"entypo:minus"}
                                            className="text-white w-[20px] h-[20px]"
                                            />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {/* Show Team Members' Details when Team Members tab is expanded */}
                            {showMembers ? (
                                <div className="w-full h-auto flex flex-col justify-start items-start space-y-2 px-[10px]">
                                    {collabDetails.teamMembers && collabDetails.teamMembers.length && 
                                        collabDetails.teamMembers.map((member, index)=>(
                                            <div 
                                                key={index}
                                                className="w-full h-auto grid grid-cols-3 gap-4"
                                            >
                                                <p className="grid col-span-1 font-medium text-sm text-gray-700">
                                                    {member.name}
                                                </p>
                                                <p className="grid col-span-1 font-medium text-sm text-gray-500">
                                                    {member.email}
                                                </p>
                                            </div>
                                        ))
                                    }
                                </div>
                            ):null
                            }
                            {/* Project Tickets Expandable Tab */}
                            <div className="w-full h-[50px] flex justify-center items-center px-[10px] rounded-[10px] py-[20px] bg-[#398ab8]">
                                <h2 className="w-[90%] h-auto py-[20px] flex justify-center items-center font-semibold text-lg text-white">
                                    Tickets
                                </h2>  
                                {/* Buttons to expand and collapse ticket details */} 
                                <div className="w-[25px] h-[25px] flex justify-center items-center">
                                    {!showTickets ? (
                                        <button
                                        type="button"
                                        onClick={()=>setShowTickets(true)}
                                        className="hover:bg-gray-400 w-full h-full flex justify-center items-center rounded-[20px] cursor-pointer transition duration-200 ease-in-out"
                                        >
                                            <Icon 
                                            icon={"entypo:plus"}
                                            className="text-white w-[20px] h-[20px]"
                                            />
                                        </button>
                                    ):(
                                        <button
                                        type="button"
                                        onClick={()=>setShowTickets(false)}
                                        className="hover:bg-gray-400 w-full h-full flex justify-center items-center rounded-[20px] cursor-pointer transition duration-200 ease-in-out"
                                        >
                                            <Icon 
                                            icon={"entypo:minus"}
                                            className="text-white w-[20px] h-[20px]"
                                            />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {/* Show Ticket Details when Tickets tab is expanded */}
                            {showTickets ? (
                                <div className="w-[80%] h-auto flex flex-col justify-start items-start space-y-2">
                                    {collabDetails.tickets && collabDetails.tickets.length?
                                        collabDetails.tickets.map((ticket, index)=>(
                                            <div 
                                            key={index}
                                            className="w-full h-auto grid grid-cols-3 gap-4"
                                            >
                                                <p className="grid col-span-1 font-medium text-sm text-gray-700"
                                                >
                                                {ticket.ticketTitle}
                                                </p>
                                                <p className={`grid col-span-1 font-medium text-sm ${ticket.ticketStatus==="To Do"?"text-blue-500":ticket.ticketStatus==="In Progress"?"text-yellow-500":"text-green-500"}`}
                                                >
                                                {ticket.ticketStatus}
                                                </p>
                                                <p className="grid col-span-1 font-medium text-sm text-gray-400"
                                                >
                                                {ticket.assignee.name}
                                                </p>
                                            </div>
                                        )):(
                                            <div className="w-[100%] h-auto flex justify-center items-center">
                                                <p className="font-medium italic text-gray-400">
                                                    No tickets created
                                                </p>
                                            </div>    
                                        )
                                    }
                                </div>
                            ):null}
                        </div>
                    </div>
                </div>  
            </div>
        )
}

export default CollabOverview;
