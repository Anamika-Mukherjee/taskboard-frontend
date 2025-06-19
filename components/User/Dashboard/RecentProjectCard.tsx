//Recent Projects Card Component (used in User Dashboard Page)
"use client";
import { ProjectDetails } from "@/types/projectTypes";
import { dateConverter } from "@/utils/functions";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React from "react";

//Define interface for props
interface RecentProjectCardProps{
    projects: ProjectDetails[];
}

//Function to obtain last created project from all projects
const getLastCreated = (projects: ProjectDetails[]) =>{
     if(projects.length>0){
        const lastCreated = projects.reduce((latest, project)=>{
            return new Date(project.createdAt) > new Date(latest.createdAt)? project: latest;
        })
        return lastCreated;
     }
     return;
}

const RecentProjectCard: React.FC<RecentProjectCardProps> = ({projects}) => {
    
    //Get last created project
    const recentProject: ProjectDetails | undefined = getLastCreated(projects);
 
    return recentProject ? (
            //Render Card as a link to recent project's overview page if recent project is available
            <Link
                href={`projects/${recentProject._id}/overview`}
                className="w-[80%] md:w-[25%] h-[80%] md:h-[85%] flex flex-col justify-start items-start secondary-gradient-light rounded-[10px] px-[20px] py-[20px] cursor-pointer outline-2 -outline-offset-4 outline-white"
            >
                {/* Icon to signify Recent status */}
                <div className="w-full h-[30%] flex justify-end items-start">
                    <div className="w-[35px] h-[35px] flex justify-center items-center bg-gray-200 rounded-[20px] relative -top-[10px] left-[10px]">
                        <Icon
                                icon={"mdi:latest"}
                                className="w-[20px] h-[20px] text-[#037ece]"
                        />
                    </div>
                </div>
                {/* Recent Project Details */}
                <div className="w-full h-[30%] flex flex-col justify-between items-start">
                    {/* Project Name */}
                    <div className="font-semibold text-[#8600D8]">
                        <p className="line-clamp-1">{recentProject.projectName}</p>
                    </div>
                    {/* Heading */}
                    <div className="text-lg font-semibold text-fuchsia-700">
                        Recently Created
                    </div>
                    {/* Creation Date */}
                    <div className="text-xs text-gray-500">
                        <p>Created on: <span className="ml-[2px]">{dateConverter(recentProject.createdAt)}</span></p>
                    </div>
                </div>  
            </Link>
    ):(
            // Render normal container element if recent project not available
            <div className="w-[80%] md:w-[25%] h-[80%] md:h-[75%] flex flex-col justify-start items-start secondary-gradient-light rounded-[10px] px-[20px] py-[20px] cursor-pointer outline-2 -outline-offset-4 outline-white">
                <div className="w-full h-[30%] flex justify-end items-start">
                    <div className="w-[35px] h-[35px] flex justify-center items-center bg-gray-200 rounded-[20px] relative -top-[10px] left-[10px]">
                        <Icon
                                icon={"eos-icons:project-outlined"}
                                className="w-[20px] h-[20px] text-[#037ece]"
                        />
                    </div>
                </div>
        
                <div className="w-full h-[30%] flex flex-col justify-between items-start">
                    <div className="font-semibold text-[#8600D8]">
                        --
                    </div>
                    <div className="text-lg font-semibold text-fuchsia-700">
                        Recently Created
                    </div>
                    <div className="text-xs text-gray-500">
                        <p>Created on: <span className="ml-[2px]">--</span></p>
                    </div>
                </div>  
            </div>
    )  
}

export default RecentProjectCard;
