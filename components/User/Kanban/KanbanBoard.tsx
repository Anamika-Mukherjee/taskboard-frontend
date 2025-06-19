// Kanban Board Component (used in Kanban Board Page)
"use client";
import { getTicketApi } from "@/services/ticket/getTicket";
import { TicketDetails, TicketStatus } from "@/types/ticketTypes";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import StatusColumn from "./StatusColumn";
import { editTicketApi } from "@/services/ticket/editTicket";
import { Icon } from "@iconify/react/dist/iconify.js";
import { FadeLoader } from "react-spinners";
import { toast } from "sonner";
import { updateTicketStatusApi } from "@/services/collaboration/updateTicketStatus";

//Define array for kanban board columns (stores ticket status)
const columnTitle : TicketStatus[] = ["To Do", "In Progress", "Done"]; 

const KanbanBoard = () => {

   const params = useParams();
   const {userId, projectId} = params;
   const [allTickets, setAllTickets] = useState<TicketDetails[]>([]);
   const [isClicked, setIsClicked] = useState<boolean>(false);
   const [clickedIndex, setClickedIndex] = useState<number>(-1);
   const [showColumn, setShowColumn] = useState<number[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   //Fetch all tickets for the given project from backend
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
              setAllTickets(responseData.allTickets as TicketDetails[]);
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
   }, [projectId, setAllTickets]);
   
   //Function that executes when ticket is dropped in a column
   const moveTicket = async (ticketId: string, newStatus: TicketStatus) =>{
      try{

        //Get moved ticket details from moved tickets' id 
        const movedTicket = allTickets.find((ticket)=>ticket._id === ticketId) as TicketDetails;

        //If the person moving ticket is not the creator of the project (i.e. a collaborator)
        if(movedTicket.projectId.userId._id !== userId){
            //Allow ticket to be dropped to new column and update status in database if collaborator is ticket's assignee
            if(movedTicket.assignee._id === userId){
                setLoading(true);
                const response = await updateTicketStatusApi({ticketStatus: newStatus}, ticketId);
                const responseData = await response.json();

                if(!response.ok){
                    throw new Error(responseData.message)
                }
                if(responseData.updatedTicket){
                  const updatedTicket: TicketDetails = responseData.updatedTicket;
                    setAllTickets((prev)=>
                      prev.map((ticket)=>
                          ticket._id === updatedTicket._id?updatedTicket:ticket
                      )
                    )
                }  
                else{
                    throw new Error("Invalid response structure");
                }   
            }
            //Show error message if collaborator is not the ticket's assignee
            else{
              toast.error("You are not allowed to change status for other assignees");
            }
        }
        //If the person moving the ticket is the creator of the project, allow to move all tickets and update status in database
        else{
          setLoading(true);
          const response = await editTicketApi({...movedTicket, assignee: movedTicket.assignee.email, ticketStatus: newStatus}, ticketId);
          const responseData = await response.json();
                                
          if(!response.ok){
              throw new Error(responseData.message)
          }
          if(responseData.editedTicket){
              const updatedTicket = responseData.editedTicket;
              setAllTickets((prev)=>
                prev.map((ticket)=>
                    ticket._id === updatedTicket._id?updatedTicket:ticket
                )
              )
          }  
          else{
              throw new Error("Invalid response structure");
          }     
        }
        
     }
     catch(err){
        console.log(err);
        const errorMessage = err instanceof Error
                            ? err.message        
                            :"Could not edit ticket status";
        toast.error(errorMessage);
     }
     finally{
      setLoading(false);
     }
   }

    //For small devices, show columns in expandable tab format
    useEffect(()=>{
      // If tab button is clicked and the clicked tab's index value stored in state variable clickedIndex
      if(clickedIndex>-1){
          // If tab expand button is clicked, add the index of that tab into showColumn array that shows columns for the tab index values present in the array
          if(isClicked){
            setShowColumn((prev)=>[...prev, clickedIndex]);
          }
          //If tab collapse button is clicked, remove the index of that tab from showColumn array to hide columns that are not present in showColumns array
          else{
              if(showColumn.length){
                  setShowColumn(prev => prev.filter(i => i !== clickedIndex));
              } 
          }
      }
   }, [isClicked, clickedIndex, showColumn.length])

   //Event handler for tab expand button click
   const handleExpandClick = (index: number) =>{
      setIsClicked(true);
      setClickedIndex(index);
   }
   //Event handler for tab collapse button click
   const handleCollapseClick = (index: number) =>{
      setIsClicked(false);
      setClickedIndex(index);
   }
   
    return (
          <div className="w-[100%] md:w-[90%] h-[calc(100%-45px)] flex justify-center items-center z-0">
              <div className="w-[80%] h-[100%] bg-white rounded-[10px] flex justify-center items-center z-0 relative">
                  {/* Kanban Board for medium and large devices */}
                  <div className="w-full h-full hidden md:flex justify-between items-center py-[20px] px-[30px]">
                        {/* Show tickets in columns if tickets available */}
                        {/* Wrapper Columns for Kanban Columns */}
                        {allTickets && allTickets.length ? 
                          columnTitle.map((title, index)=>(
                              <div 
                              key={index}
                              className={`w-[30%] h-[100%] flex flex-col justify-between items-center rounded-[20px] py-[20px]
                                      ${title === "To Do"?"bg-[#e1eff7]":title === "In Progress"?"bg-[#fefed2]":"bg-[#eefeec]"}`}
                              >
                                  {/* Column Heading */}
                                  <h2 className={`w-[90%] h-auto py-[20px] flex justify-center items-center font-semibold text-lg rounded-[10px] text-white
                                    ${title==="To Do"?" bg-[#398ab8]":title === "In Progress"?"bg-[#fcfc07]":"bg-green-500"}`}
                                  >
                                      {title}
                                  </h2> 
                                  {/* Kanban Column Component*/}
                                  {!loading ? (             
                                      <StatusColumn  
                                        tickets={allTickets.filter((ticket)=>ticket.ticketStatus === title)} 
                                        onDropTicket={(ticketId)=>moveTicket(ticketId, title)}
                                      />
                                  ):(
                                  <div className="w-[25px] h-[25px] flex justify-center items-center z-[1100] relative left-[30px]">
                                      <FadeLoader color="#8600D8" width={2} height={10}/>
                                  </div>
                                  )} 
                              </div>
                          ))
                          // Show wrapper columns with message if tickets not available
                          : columnTitle.map((title, index)=>(
                              <div 
                                key={index}
                                className={`w-[30%] h-[100%] flex flex-col justify-between items-center rounded-[20px] py-[20px]
                                          ${title === "To Do"?"bg-[#e1eff7]":title === "In Progress"?"bg-[#fefed2]":"bg-[#eefeec]"}`}
                              >
                                  <h2 className={`w-[90%] h-auto py-[20px] flex justify-center items-center font-semibold text-lg rounded-[10px] text-white
                                      ${title==="To Do"?" bg-[#398ab8]":title === "In Progress"?"bg-[#fcfc07]":"bg-green-500"}`}
                                  >
                                      {title}
                                  </h2>
                                  {/* Show message in columns if tickets not available */}
                                  <div className={`w-[90%] h-[85%] flex flex-col justify-center items-center rounded-[20px] py-[20px] bg-white`}>
                                      <p className="text-gray-400 text-sm italic">No tickets created yet</p>
                                  </div>
                              </div>                      
                          ))}
                  </div>
                  {/* Kanban board for small devices */}
                  <div className="w-full h-full md:hidden flex flex-col justify-start items-center py-[20px] px-[30px] space-y-6">
                      {/* Show tickets in columns if tickets available */}
                      {allTickets && allTickets.length ? 
                        columnTitle.map((title, index)=>(
                            <div 
                            key={index}
                            className={`w-[90%] min-h-[50px] h-auto flex flex-col justify-center items-center`}
                            >
                                {/* Show expandable tabs in small devices */}
                                <div className={`w-full h-[50px] flex justify-center items-center px-[10px]  rounded-[10px] py-[20px]
                                                  ${title==="To Do"?" bg-[#398ab8]":title === "In Progress"?"bg-[#fcfc07]":"bg-green-500"}`}
                                >
                                    {/* Heading */}
                                    <h2 className={`w-[90%] h-auto py-[20px] flex justify-center items-center font-semibold text-lg text-white`}>
                                      {title}
                                    </h2>
                                    {/* Expand and Collapse Buttons  */}
                                    <div className="w-[25px] h-[25px] flex justify-center items-center">
                                          {!showColumn.length || (showColumn.length && !showColumn.includes(index))? (
                                              <button
                                              type="button"
                                              onClick={()=>handleExpandClick(index)}
                                              className="hover:bg-gray-400 w-full h-full flex justify-center items-center rounded-[20px] cursor-pointer transition duration-200 ease-in-out"
                                              >
                                            
                                                  <Icon 
                                                    icon={"entypo:plus"}
                                                    className="text-white w-[20px] h-[20px]"
                                                  />
                                              </button>
                                          ):showColumn.length && showColumn.includes(index) && (
                                              <button
                                                type="button"
                                                onClick={()=>handleCollapseClick(index)}
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
                                {/* Show Kanban Columns when expand button is clicked */}
                                {showColumn.includes(index) ? (
                                        <StatusColumn  
                                          tickets={allTickets.filter((ticket)=>ticket.ticketStatus === title)} 
                                          onDropTicket={(ticketId)=>moveTicket(ticketId, title)}
                                        />
                                ):null}  
                            </div> 
                      ))
                      // Show message when tabs expanded if tickets not available
                      : columnTitle.map((title, index)=>(
                          <div 
                            key={index}
                            className={`w-[90%] min-h-[50px] h-auto flex flex-col justify-center items-center`}
                          >
                                <div className={`w-full h-[50px] flex justify-center items-center px-[10px]  rounded-[10px] py-[20px]
                                                ${title==="To Do"?" bg-[#398ab8]":title === "In Progress"?"bg-[#fcfc07]":"bg-green-500"}`}
                                >
                                    <h2 className={`w-[90%] h-auto py-[20px] flex justify-center items-center font-semibold text-lg text-white`}>
                                            {title}
                                    </h2>
                                    <div className="w-[25px] h-[25px] flex justify-center items-center">
                                        {!showColumn.length || (showColumn.length && !showColumn.includes(index))? (
                                          <button
                                          type="button"
                                          onClick={()=>handleExpandClick(index)}
                                          className="hover:bg-gray-400 w-full h-full flex justify-center items-center rounded-[20px] cursor-pointer transition duration-200 ease-in-out"
                                          >
                                            
                                              <Icon 
                                                icon={"entypo:plus"}
                                                className="text-white w-[20px] h-[20px]"
                                              />
                                          </button>
                                        ):showColumn.length && showColumn.includes(index) && (
                                          <button
                                            type="button"
                                            onClick={()=>handleCollapseClick(index)}
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
                                {/* Show message if tickets not available */}
                                {showColumn.includes(index) ? (
                                          <p className="w-full h-auto flex justify-center items-center p-[20px] text-gray-400 text-sm italic">No tickets created yet</p>       
                                ):null}
                          </div>                     
                      ))}
                  </div>
              </div>
          </div>
    )
}

export default KanbanBoard;
