//Completed Projects Card Component (used in User Dashboard Page)
"use client";
import { ProjectDetails } from "@/types/projectTypes";
import { dateConverter } from "@/utils/functions";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React, { useEffect, useState } from "react";

//Define interface for props
interface CompletedProjectCardProps{
    projects: ProjectDetails[];
}

const CompletedProjectsCard: React.FC<CompletedProjectCardProps> = ({projects}) => {
    const [completedProjects, setCompletedProjects] = useState<ProjectDetails[]>([]);
    const [lastUpdatedProject, setLastUpdatedProject] = useState<ProjectDetails>();

    //Filter completed projects from all projects
    useEffect(()=>{
       if(projects.length>0){
            const allCompletedProjects = projects.filter((project)=>project.status === "Completed");
            setCompletedProjects(allCompletedProjects);
        }   
    }, [projects]);

    //Get last updated project from completed projects
    useEffect(()=>{
       if(completedProjects.length>0){
            const lastUpdated = completedProjects.reduce((latest, project)=>{
                return (
                    new Date(project.updatedAt) > new Date(latest.createdAt)? project: latest
                );
            })
            setLastUpdatedProject(lastUpdated);
        }   
    }, [completedProjects]);
 
    return (
        //Completed Projects Card is a link to Projects Page
        <Link
            href={`projects`}
            className="w-[80%] md:w-[25%] h-[80%] md:h-[85%] flex flex-col justify-start items-start third-gradient-light rounded-[10px] px-[20px] py-[20px] cursor-pointer outline-2 -outline-offset-4 outline-white"
        >
            {/* Icon to signify completed status */}
            <div className="w-full h-[30%] flex justify-end items-start">
                <div className="w-[35px] h-[35px] flex justify-center items-center bg-gray-200 rounded-[20px] relative -top-[10px] left-[10px]">
                    <Icon
                        icon={"lets-icons:done-ring-round"}
                        className="w-[20px] h-[20px] text-[#edb805]"
                    />
                </div>
            </div>
        
            {/* Completed Project Details */}
            <div className="w-full h-[30%] flex flex-col justify-between items-start">
                {/* Total Completed Projects */}
                <div className="font-semibold text-[#8600D8]">
                    <p className="line-clamp-1">{completedProjects?completedProjects.length:"--"}</p>
                </div>
                {/* Heading */}
                <div className="text-lg font-semibold text-fuchsia-700">
                    Completed Projects
                </div>
                {/* Last Updated Date for Completed Projects */}
                <div className="text-xs text-gray-500">
                    <p>Last Updated: <span className="ml-[2px]">{lastUpdatedProject?dateConverter(lastUpdatedProject.updatedAt):"--"}</span></p>
                </div>
            </div>  
        </Link>
    )
}

export default CompletedProjectsCard;
