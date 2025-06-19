//Tickets Page Component (used in Tickets Page)
"use client";
import React, { useEffect, useState } from "react";
import { TicketDetails } from "@/types/ticketTypes";
import TicketCard from "./TicketCard";
import CreateTicketForm from "./CreateTicketForm";
import { getProjectDetailsApi } from "@/services/project/getProjectDetails";
import { ProjectDetails } from "@/types/projectTypes";
import TicketFilter from "./TicketFilter";
import TicketSearch from "./TicketSearch";
import { useParams, useSearchParams } from "next/navigation";
import { getTicketApi } from "@/services/ticket/getTicket";
import { FadeLoader } from "react-spinners";
import { toast } from "sonner";


const TicketsPage= () => {
      const searchParams = useSearchParams();
      const query = searchParams.get("query");
      const [openForm, setOpenForm] = useState<boolean>(false);
      const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
      const [filteredTickets, setFilteredTickets] = useState<TicketDetails[]>([]);
      const {projectId} = useParams();
      const [tickets, setTickets] = useState<TicketDetails[]>([]);
      const [loading, setLoading] = useState<boolean>(false);

      //Fetch all tickets' details from backend for tickets created in a given project 
      useEffect(()=>{
          const fetchTickets = async ()=>{
            try{
              setLoading(true);
              const response = await getTicketApi(projectId as string);
              const responseData = await response.json();
              
              if(!response.ok){
                  throw new Error(responseData.message)
              }
              if(responseData.allTickets){
                  setTickets(responseData.allTickets as TicketDetails[]);
              }  
              else{
                  throw new Error("Invalid response structure");
              }               
            }
            catch(err){
              console.log(err);
              const errorMessage = err instanceof Error
                                  ? err.message        
                                  :"Could not fetch tickets";
              toast.error(errorMessage);
            }
            finally{
              setLoading(false);
            }
          }
          fetchTickets();
      }, [projectId, setTickets]);

      //Fetch project details from backend for all tickets
      useEffect(()=>{
        const fetchProjectDetails = async ()=>{
          try{
              setLoading(true);
              const response = await getProjectDetailsApi(projectId as string);
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
      }, [projectId, setProjectDetails]);

      useEffect(()=>{
          //If search query string available in route, then show only searched ticket
          if(query && tickets){
            const searchedTicket = tickets.filter((ticket)=>ticket._id === query);
            setFilteredTickets(searchedTicket);
          }
          //Show all tickets if no query string is available
          else if(!query){
            setFilteredTickets(tickets);
          }
      }, [query, tickets, setFilteredTickets]);

      if(loading){
          <div className="w-[100%] md:w-[90%] h-[calc(100%-45px)] flex justify-center items-start">
            <div className="w-[80%] h-[100%] bg-white rounded-[10px] flex justify-center items-center py-[20px] px-[30px]z-0 relative">
                <div className="w-[25px] h-[25px] flex justify-center items-center z-[1100] relative left-[30px]">
                  <FadeLoader color="#8600D8" width={2} height={10} />
                </div>
            </div>
          </div>
      }
    
      return (
            <>
                <div className="w-[100%] md:w-[90%] h-[calc(100%-45px)] flex justify-center items-start">
                    {/* Tickets Page Container */}
                    <div className="w-[80%] h-[100%] bg-white rounded-[10px] flex flex-col justify-between items-center py-[20px] px-[30px] space-y-6 z-0 relative">
                        {/* Heading */}
                        <div className="w-full h-[50px] flex justify-center items-center">
                            <h1 className="text-2xl font-semibold text-center">Tickets for {projectDetails?projectDetails.projectName:""}</h1>
                        </div>
                        {/* Ticket Searchbar */}
                        <div className="w-full h-[50px] flex justify-start items-start md:items-center py-[20px]">
                            <TicketSearch />
                        </div>
                        {/* Ticket Filter and New Ticket Button (to add new ticket) */}
                        <div className="w-full h-[300px] md:h-[50px] flex justify-between items-start md:items-center py-[20px] z-[0]">
                            <TicketFilter tickets = {tickets} setFilteredTickets = {setFilteredTickets}/>
                            <button
                            type="button"
                            onClick={()=>setOpenForm(true)}
                            className="w-[150px] h-[40px] flex justify-center items-center bg-[#000000] rounded-[5px] text-sm text-white hover:cursor-pointer hover:bg-gray-700"
                            >
                              New Ticket
                            </button>
                        </div>
                        {/* Display Filtered Tickets in Card Format */}
                        <div className="w-full h-[calc(100%-100px)] md:h-[calc(100%-100px)] flex justify-start items-start py-[10px] md:py-[0px] overflow-y-scroll hide-scrollbar">
                          <div className="w-full h-[100%] flex flex-col md:flex-row justify-start items-center md:items-start md:flex-wrap space-y-4 md:space-x-6">
                              {/* Show Filtered Tickets if available */}
                              {!loading && filteredTickets.length>0?
                                  filteredTickets.map((ticket, index)=>(
                                      <TicketCard
                                      key={index}
                                      ticket = {ticket}
                                      />
                                  ))
                                  // Show message if no tickets available under selected filter
                                  : !filteredTickets.length && tickets.length ? (
                                      <p className="w-full h-full flex justify-center items-center italic text-gray-400">
                                        No ticket matches your choice
                                      </p>
                                  )
                                  // Show different message if no tickets available
                                  : !filteredTickets.length && !tickets.length && (
                                      <p className="w-full h-full flex justify-center items-center italic text-gray-400">
                                        No tickets for this project
                                      </p>
                                  )
                              }
                          </div> 
                        </div>
                    </div>  
                </div>
                {/* Display Create Ticket Form Modal when New Ticket Button is clicked*/}
                {openForm && projectDetails &&(
                    <div className="w-full h-full flex justify-center items-center fixed top-0 left-0 z-[1000] bg-black/50">
                      <CreateTicketForm open={openForm} onOpenChange={setOpenForm} projectId = {projectId as string} teamMembers = {projectDetails.teamMembers}/>
                    </div>
                )}    
            </>
      )
}

export default TicketsPage;
