//Assigned Ticket Card Component (used in Tickets Page in Collaborations)
import React from "react";
import {Icon} from "@iconify/react/dist/iconify.js";
import { dateConverter } from "@/utils/functions";
import Link from "next/link";
import { TicketDetails } from "@/types/ticketTypes";

//Define interface for props
interface AssignedTicketCardProps{
  assignedTicket: TicketDetails;
}

const AssignedTicketCard: React.FC<AssignedTicketCardProps> = ({assignedTicket}) => {

      //Define text colors for different ticket status, type and priority values
      const statusColor = assignedTicket.ticketStatus === "To Do"
                          ?"text-blue-500"
                          :assignedTicket.ticketStatus === "In Progress"
                          ?"text-yellow-500"
                          :"text-green-500";
      const ticketTypeColor = assignedTicket.ticketType === "Task"
                          ?"text-orange-500"
                          :assignedTicket.ticketType === "Bug"
                          ?"text-orange-800"
                          :assignedTicket.ticketType === "Feature"
                          ?"text-fuchsia-700"
                          :"text-teal-500";
      const ticketPriorityColor = assignedTicket.ticketPriority === "Low"
                          ?"text-blue-700"
                          :assignedTicket.ticketPriority === "Medium"
                          ?"text-yellow-500"
                          :assignedTicket.ticketPriority === "High"
                          ?"text-orange-500"
                          :"text-red-500";

    
      return (
        // Link the Assigned Ticket Card to Ticket Overview Page in Collaborations
          <Link 
          href={`tickets/${assignedTicket._id}/overview`}
          className="w-[80%] md:w-[25%] h-[70%] md:h-[40%] flex flex-col justify-between items-start fifth-gradient-light space-y-2 rounded-[10px] px-[20px] py-[20px] cursor-pointer"
          >
              {/* Ticket Title and Project Creator Name Container */}
              <div className="w-full h-auto flex flex-col justify-between items-start">
                  <p className="text-sm font-semibold text-violet-800 line-clamp-1">{assignedTicket.ticketTitle}</p>      
                  <div className="w-full h-auto flex justify-start items-center space-x-1">
                      <Icon 
                      icon={"hugeicons:manager"}
                      className="w-[15px] h-[15px] text-gray-400"
                      />
                      <p className="text-xs font-semibold text-gray-400">{assignedTicket.projectId.userId.name}</p>
                  </div>
              </div>
              {/* Other Details */}
              <div className="w-full h-[75%] flex flex-col justify-center items-start space-y-1">
                  {/* Assignee Name Container */}
                  <div className="w-full h-auto flex justify-start items-center space-x-1">
                      <Icon 
                      icon={"lets-icons:user"}
                      className="w-[15px] h-[15px] text-gray-400"
                      />
                      <p className="text-xs font-semibold text-gray-400">{assignedTicket.assignee.name}</p>
                  </div>
                  {/* Ticket Type and Ticket Priority Container */}
                  <div className="w-full h-auto flex justify-start items-center space-x-4">
                      <div className="w-full h-auto flex justify-start items-center space-x-2">
                          {assignedTicket.ticketType === "Task" ? (
                              <Icon 
                                  icon={"fluent:task-list-20-filled"}
                                  className="text-orange-500 w-[15px] h-[15px]"
                              />
                          ):assignedTicket.ticketType === "Bug" ? (
                            <Icon 
                                icon={"humbleicons:exclamation"}
                                className="text-orange-800 w-[15px] h-[15px]"
                            />
                          ):assignedTicket.ticketType === "Feature" ? (
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
                          <p className={`text-xs font-semibold ${ticketTypeColor}`}>{assignedTicket.ticketType}</p>
                      </div>
                      <div className="w-full h-auto flex justify-start items-center space-x-1">
                          <Icon 
                          icon={"material-symbols-light:priority"}
                          className="w-[15px] h-[15px] text-gray-400 font-semibold"
                          />
                          <p className={`text-xs font-semibold ${ticketPriorityColor}`}>{assignedTicket.ticketPriority}</p>
                      </div>
                  </div>
                  {/* Ticket Creation Date */}
                  <div className="w-full h-auto flex justify-start items-center space-x-2">
                        <Icon
                        icon={"material-symbols-light:date-range-outline-sharp"}
                        className="w-[15px] h-[15px] text-gray-500"
                        /> 
                        <p className="text-xs text-gray-500">{dateConverter(assignedTicket.createdAt)}</p>
                  </div>  
                  {/* Ticket Status */}     
                  <div className="w-full h-auto flex justify-start items-center space-x-2">
                        {assignedTicket.ticketStatus === "To Do" ? (
                            <Icon
                              icon={"ic:baseline-pending"}
                              className={`w-[15px] h-[15px] ${statusColor}`}
                            /> 
                        ):assignedTicket.ticketStatus === "In Progress" ? (
                          <Icon
                              icon={"carbon:in-progress"}
                              className={`w-[15px] h-[15px] ${statusColor}`}
                            /> 
                        ):(
                          <Icon
                              icon={"nrk:check-active"}
                              className={`w-[15px] h-[15px] ${statusColor}`}
                            /> 
                        )
                      }
                      <p className={`text-xs ${statusColor}`}>{assignedTicket.ticketStatus}</p>
                  </div>      
              </div>
          </Link>
      )
}

export default AssignedTicketCard;
