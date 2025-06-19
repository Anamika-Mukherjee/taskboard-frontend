//Collab Card Component (used in Collaborations Page)
import React from "react";
import {Icon} from "@iconify/react/dist/iconify.js";
import { ProjectDetails } from "@/types/projectTypes";
import { dateConverter } from "@/utils/functions";
import Link from "next/link";

//Define interface for props
interface CollabCardProps{
  collab: ProjectDetails;
}

const CollabCard: React.FC<CollabCardProps> = ({collab}) => {

      //Define text colors for different project status values
      const statusColor = collab.status === "Not Started"
                      ?"text-blue-500"
                      :collab.status === "In Progress"
                      ?"text-yellow-500"
                      :collab.status === "Completed"
                      ?"text-green-500"
                      :collab.status === "On Hold"
                      ?"text-[#88089c]"
                      :"text-red-500"

      return (
            // Link the Collab Card to Collab Overview Page
            <Link 
            href={`collaborations/${collab._id}/overview`}
            className="w-[80%] md:w-[25%] h-[70%] md:h-[50%] flex flex-col justify-start items-start space-y-2 fourth-gradient-light rounded-[10px] px-[20px] py-[20px] cursor-pointer"
            >
              {/* Project Name and Project Key Container */}
              <div className="w-full h-[40%] flex flex-col justify-start items-start">
                <p className="text-sm font-semibold text-violet-800 line-clamp-1">{collab.projectName}</p>
                <p className="text-xs font-semibold text-gray-400">{collab.projectKey}</p>
              </div>
              {/* Other Details */}
              <div className="w-full h-[50%] flex flex-col justify-center items-start space-y-1">
                  {/* Project Creator Name */}
                  <div className="w-full h-auto flex justify-start items-center space-x-2">
                      <Icon
                        icon={"hugeicons:manager"}
                        className="w-[15px] h-[15px] text-gray-500"
                      /> 
                      <p className="text-xs text-gray-500">{collab.userId.name}</p>
                  </div>
                  {/* Total Team Members */}
                  <div className="w-full h-auto flex justify-start items-center space-x-2">
                      <Icon
                      icon={"ant-design:team-outlined"}
                      className="w-[15px] h-[15px] text-gray-500"
                      /> 
                      <p className="text-xs text-gray-500">{collab.teamMembers.length}</p>
                  </div>
                  {/* Project Creation Date */}
                  <div className="w-full h-auto flex justify-start items-center space-x-2">
                      <Icon
                      icon={"material-symbols-light:date-range-outline-sharp"}
                      className="w-[15px] h-[15px] text-gray-500"
                      /> 
                      <p className="text-xs text-gray-500">{dateConverter(collab.createdAt)}</p>
                  </div>
                  {/* Total Tickets */}      
                  <div className="w-full h-auto flex justify-start items-center space-x-2">
                      <Icon
                      icon={"streamline:task-list"}
                      className="w-[15px] h-[15px] text-gray-500"
                      /> 
                      <p className="text-xs text-gray-500">{collab.tickets?collab.tickets.length:"--"}</p>
                  </div> 
                  {/* Project Status */}     
                  <div className="w-full h-auto flex justify-start items-center space-x-2">
                      {collab.status === "Not Started" ? (
                          <Icon
                            icon={"ic:baseline-pending"}
                            className={`w-[15px] h-[15px] ${statusColor}`}
                          /> 
                      ):collab.status === "In Progress" ? (
                        <Icon
                            icon={"carbon:in-progress"}
                            className={`w-[15px] h-[15px] ${statusColor}`}
                          /> 
                      ):collab.status === "Completed" ? (
                        <Icon
                            icon={"nrk:check-active"}
                            className={`w-[15px] h-[15px] ${statusColor}`}
                          /> 
                      )
                      :collab.status === "On Hold"? (
                        <Icon
                            icon={"zondicons:pause-solid"}
                            className={`w-[15px] h-[15px] ${statusColor}`}
                          /> 
                      ):collab.status === "Cancelled" ?(
                        <Icon
                            icon={"ic:baseline-cancel"}
                            className={`w-[15px] h-[15px] ${statusColor}`}
                          /> 
                      ): null}
                      <p className={`text-xs ${statusColor}`}>{collab.status}</p>
                  </div>      
              </div>
            </Link>
      )
}

export default CollabCard;
