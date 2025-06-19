//Total Projects Card Component (used in User Dashboard Page)
"use client";
import { ProjectDetails } from "@/types/projectTypes";
import { dateConverter } from "@/utils/functions";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React from "react";

//Define interface for props
interface TotalProjectsCardProps{
    projects: ProjectDetails[];
}

// Function to obtain last updated project
const getLastUpdated = (projects: ProjectDetails[]) =>{
     if(projects.length>0){
        const lastUpdated = projects.reduce((latest, project)=>{
            return new Date(project.updatedAt) > new Date(latest.updatedAt)? project: latest;
        })
        return lastUpdated;
     }
     return;
}

const TotalProjectsCard: React.FC<TotalProjectsCardProps> = ({projects}) => {
    //Get last updated project and last update date 
    const lastUpdatedProject: ProjectDetails | undefined = getLastUpdated(projects);
    const lastUpdatedDate = lastUpdatedProject?dateConverter(lastUpdatedProject.updatedAt):"--";

    return (
        //Total Projects Card is a link to Projects Page
        <Link
            href={`projects`}
            className="w-[80%] md:w-[25%] h-[80%] md:h-[85%] flex flex-col justify-start items-start scheme-gradient-light rounded-[10px] px-[20px] py-[20px] cursor-pointer outline-2 -outline-offset-4 outline-white"
        >
            {/* Icon to signify project */}
            <div className="w-full h-[30%] flex justify-end items-start">
                <div className="w-[35px] h-[35px] flex justify-center items-center bg-gray-200 rounded-[20px] relative -top-[10px] left-[10px]">
                    <Icon 
                            icon={"eos-icons:project-outlined"}
                            className="w-[20px] h-[20px] scheme-color"
                        />
                    </div>
                </div>
        
            {/* Total Project Details */}
            <div className="w-full h-[30%] flex flex-col justify-between items-start">
                {/* Total Projects Count */}
                <div className="font-semibold text-[#8600D8]">
                    {projects?projects.length:"--"}
                </div>
                {/* Heading */}
                <div className="text-lg font-semibold text-fuchsia-700">
                    Total Projects
                </div>
                {/* Last Updated Date */}
                <div className="text-xs text-gray-500">
                    <p>Last Updated: <span className="ml-[2px]">{lastUpdatedDate}</span></p>
                </div>
            </div>  
        </Link>
    )
}

export default TotalProjectsCard;
