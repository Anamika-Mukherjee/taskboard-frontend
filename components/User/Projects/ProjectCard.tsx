//Project Card Component (used in Projects Page)
import React from "react";
import {Icon} from "@iconify/react/dist/iconify.js";
import { ProjectDetails } from "@/types/projectTypes";
import { dateConverter } from "@/utils/functions";
import Link from "next/link";

//Define interface for props
interface ProjectCardProps{
  project: ProjectDetails;
}

const ProjectCard: React.FC<ProjectCardProps> = ({project}) => {

  //Define text colors for different project status values
  const statusColor = project.status === "Not Started"
                      ?"text-blue-500"
                      :project.status === "In Progress"
                      ?"text-yellow-500"
                      :project.status === "Completed"
                      ?"text-green-500"
                      :project.status === "On Hold"
                      ?"text-[#88089c]"
                      :"text-red-500"
  return (
        // Link the Project Card to Project Overview Page
        <Link 
        href={`projects/${project._id}/overview`}
        className="w-[80%] md:w-[20%] h-[70%] md:h-[40%] flex flex-col justify-start items-start space-y-2 scheme-gradient-light rounded-[10px] px-[20px] py-[20px] cursor-pointer"
        >
            {/* Project Name and Project Key Container */}
            <div className="w-full h-[40%] flex flex-col justify-start items-start">
              <p className="text-sm font-semibold text-violet-800 line-clamp-1">{project.projectName}</p>
              <p className="text-xs font-semibold text-gray-400">{project.projectKey}</p>
            </div>
            {/* Other Details */}
            <div className="w-full h-[50%] flex flex-col justify-center items-start space-y-1">
                {/* Total Team Members */}
                <div className="w-full h-auto flex justify-start items-center space-x-2">
                  <Icon
                    icon={"ant-design:team-outlined"}
                    className="w-[15px] h-[15px] text-gray-500"
                  /> 
                  <p className="text-xs text-gray-500">{project.teamMembers.length}</p>
                </div>
                {/* Project Creation Date */}
                <div className="w-full h-auto flex justify-start items-center space-x-2">
                    <Icon
                    icon={"material-symbols-light:date-range-outline-sharp"}
                    className="w-[15px] h-[15px] text-gray-500"
                    /> 
                    <p className="text-xs text-gray-500">{dateConverter(project.createdAt)}</p>
                </div> 
                {/* Total Tickets */}     
                <div className="w-full h-auto flex justify-start items-center space-x-2">
                    <Icon
                    icon={"streamline:task-list"}
                    className="w-[15px] h-[15px] text-gray-500"
                    /> 
                    <p className="text-xs text-gray-500">{project.tickets?project.tickets.length:"--"}</p>
                </div>
                {/* Project Status */}
                <div className="w-full h-auto flex justify-start items-center space-x-2">
                  {project.status === "Not Started" ? (
                      <Icon
                        icon={"ic:baseline-pending"}
                        className={`w-[15px] h-[15px] ${statusColor}`}
                      /> 
                  ):project.status === "In Progress" ? (
                      <Icon
                          icon={"carbon:in-progress"}
                          className={`w-[15px] h-[15px] ${statusColor}`}
                      /> 
                  ):project.status === "Completed" ? (
                      <Icon
                          icon={"nrk:check-active"}
                          className={`w-[15px] h-[15px] ${statusColor}`}
                      /> 
                  )
                  :project.status === "On Hold"? (
                      <Icon
                          icon={"zondicons:pause-solid"}
                          className={`w-[15px] h-[15px] ${statusColor}`}
                      /> 
                  ):project.status === "Cancelled" ?(
                      <Icon
                          icon={"ic:baseline-cancel"}
                          className={`w-[15px] h-[15px] ${statusColor}`}
                      /> 
                  ): null
                  }
                  <p className={`text-xs ${statusColor}`}>{project.status}</p>
                </div>      
            </div>
        </Link>
  )
}

export default ProjectCard;
