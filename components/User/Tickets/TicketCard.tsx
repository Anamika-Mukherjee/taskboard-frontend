//Ticket Card Component (used in Tickets Page)
import React from "react";
import {Icon} from "@iconify/react/dist/iconify.js";
import { dateConverter } from "@/utils/functions";
import Link from "next/link";
import { TicketDetails } from "@/types/ticketTypes";

//Define interface for props
interface TicketCardProps{
  ticket: TicketDetails;
}

const TicketCard: React.FC<TicketCardProps> = ({ticket}) => {

      //Define text colors for different ticket status, type and priority values
      const statusColor = ticket.ticketStatus === "To Do"
                          ?"text-blue-500"
                          :ticket.ticketStatus === "In Progress"
                          ?"text-yellow-500"
                          :"text-green-500";
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
        // Link the Ticket Card to Ticket Overview Page
          <Link 
          href={`tickets/${ticket._id}/overview`}
          className="w-[80%] md:w-[25%] h-[70%] md:h-[35%] flex flex-col justify-between items-start secondary-gradient-light space-y-2 rounded-[10px] px-[20px] py-[20px] cursor-pointer"
          >
            {/* Ticket Title and Assignee Name Container */}
            <div className="w-full h-auto flex flex-col justify-between items-start">
                <p className="text-sm font-semibold text-violet-800 line-clamp-1">{ticket.ticketTitle}</p>      
                <div className="w-full h-auto flex justify-start items-center space-x-1">
                    <Icon 
                    icon={"lsicon:user-outline"}
                    className="w-[15px] h-[15px] text-gray-400"
                    />
                    <p className="text-xs font-semibold text-gray-400">{ticket.assignee.name}</p>
                </div>
            </div>
            {/* Other Details */}
            <div className="w-full h-[75%] flex flex-col justify-center items-start space-y-1">
                {/* Ticket Type and Ticket Priority Container */}
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
                                className="text-orange-800 w-[15px] h-[15px]"
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
                {/* Ticket Creation Date */}
                <div className="w-full h-auto flex justify-start items-center space-x-2">
                    <Icon
                    icon={"material-symbols-light:date-range-outline-sharp"}
                    className="w-[15px] h-[15px] text-gray-500"
                    /> 
                    <p className="text-xs text-gray-500">{dateConverter(ticket.createdAt)}</p>
                </div> 
                {/* Ticket Status */}     
                <div className="w-full h-auto flex justify-start items-center space-x-2">
                    {ticket.ticketStatus === "To Do" ? (
                        <Icon
                          icon={"ic:baseline-pending"}
                          className={`w-[15px] h-[15px] ${statusColor}`}
                        /> 
                    ):ticket.ticketStatus === "In Progress" ? (
                      <Icon
                          icon={"carbon:in-progress"}
                          className={`w-[15px] h-[15px] ${statusColor}`}
                        /> 
                    ):(
                      <Icon
                          icon={"nrk:check-active"}
                          className={`w-[15px] h-[15px] ${statusColor}`}
                        /> 
                    )}
                    <p className={`text-xs ${statusColor}`}>{ticket.ticketStatus}</p>
                </div>      
            </div> 
          </Link>
      )
}

export default TicketCard;
