//Task Card Component (used in Kanban Board Page)
"use client";
import { TicketDetails } from "@/types/ticketTypes";
import { itemTypes } from "@/utils/constants";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useRef } from "react";
import {useDrag} from "react-dnd";

//Define interface for props
interface TaskCardProps{
    ticket: TicketDetails;
}

const TaskCard: React.FC<TaskCardProps> = ({ticket}) => {
    const ref = useRef(null);
    const [{isDragging}, dragRef] = useDrag(()=>({
        type: itemTypes.CARD,
        item: {...ticket},
        collect: (monitor)=>({
          isDragging: !!monitor.isDragging()
        })
    }));

    dragRef(ref);

    //Define colors for ticket types and priority
    const ticketTypeColor = ticket.ticketType === "Task"
                        ?"text-orange-500"
                        :ticket.ticketType === "Bug"
                        ?"text-orange-800"
                        :ticket.ticketType === "Feature"
                        ?"text-fuchsia-700"
                        :"text-teal-500";
    const ticketPriorityColor = ticket.ticketPriority === "Low"
                        ?"text-blue-700"
                        :ticket.ticketPriority === "Medium"
                        ?"text-yellow-500"
                        :ticket.ticketPriority === "High"
                        ?"text-orange-500"
                        :"text-red-500";


  return (
        // Ticket Card in Kanban Columns
        <div ref={ref} style={{opacity: isDragging?0.5:1}} 
          className={`w-[90%] min-h-[50px] h-auto flex flex-col justify-between items-center rounded-[10px] px-[10px] py-[20px] space-y-4 cursor-pointer
                    ${ticket.ticketStatus === "To Do"?"bg-[#e1eff7]":ticket.ticketStatus==="In Progress"?"bg-[#fefed2]":"bg-[#eefeec]"}`}
        >
            {/* Ticket Title */}
            <div className="w-full h-auto flex flex-col justify-between items-start space-y-2">
               <p className="text-sm font-semibold text-violet-800 line-clamp-1">{ticket.ticketTitle}</p>                      
            </div>
            <div className="w-full h-[75%] flex flex-col justify-center items-start space-y-1">
              {/* Assignee Name */}
              <div className="w-full h-auto flex justify-start items-center space-x-1">
                    <Icon
                     icon={"lsicon:user-outline"}
                     className="w-[15px] h-[15px] text-gray-400"
                    />
                    <p className="text-xs font-semibold text-gray-400">{ticket.assignee.name}</p>
              </div>
              {/* Ticket Type and Ticket Priority */}
              <div className="w-full h-auto flex justify-start items-center space-x-4">
                  {/* Ticket Type */}
                  <div className="w-full h-auto flex justify-start items-center space-x-2">
                    {ticket.ticketType === "Task" ? (
                      <Icon 
                          icon={"fluent:task-list-20-filled"}
                          className="text-orange-500 w-[15px] h-[15px]"
                      />
                    ):ticket.ticketType === "Bug" ? (
                      <Icon 
                          icon={"humbleicons:exclamation"}
                          className=" text-orange-800 w-[15px] h-[15px]"
                      />
                    ):ticket.ticketType === "Feature" ? (
                      <Icon 
                          icon={"material-symbols-light:star-rounded"}
                          className="text-fuchsia-700 w-[15px] h-[15px]"
                      />
                    ):(
                      <Icon 
                          icon={"mdi:arrow-upward"}
                          className="text-teal-500 w-[15px] h-[15px]"
                      />
                    )} 
                    <p className={`text-xs font-semibold ${ticketTypeColor}`}>{ticket.ticketType}</p>
                  </div>
                  {/* Ticket Priority */}
                  <div className="w-full h-auto flex justify-start items-center space-x-1">
                      <Icon 
                        icon={"material-symbols-light:priority"}
                        className="w-[15px] h-[15px] text-gray-400 font-semibold"
                      />
                      <p className={`text-xs font-semibold ${ticketPriorityColor}`}>{ticket.ticketPriority}</p>
                  </div>
              </div>
            </div> 
        </div>
  )
}

export default TaskCard;
