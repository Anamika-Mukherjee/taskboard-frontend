//Project Filter Component (used in Projects Page and Collaborations Page)
"use client";
import { useAllProjectContext } from "@/contexts/allProjectContext";
import { ProjectDetails, ProjectStatus } from "@/types/projectTypes";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { SetStateAction, useEffect, useState } from "react";

//Define interface for props
interface ProjectFilterProps{
    projects: ProjectDetails[];
    setFilteredProjects: React.Dispatch<SetStateAction<ProjectDetails[]>>;
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({projects, setFilteredProjects}) => {

    const [filters, setFilters] = useState<{status: ProjectStatus | "All"}>({status: "All",});
    const {allProjects} = useAllProjectContext();

    
    useEffect(()=>{
        //If allProjects context has projects, then filter projects from allProjects 
            // (when a project is added or deleted, updated project list is initially stored in allProjects context to render updated list immediately)
        if(allProjects && allProjects.length>0){
            const filtered = allProjects.filter((project)=>{
                // Return projects with selected status value
                const matchStatus = filters.status === "All" || project.status === filters.status;
                return matchStatus;
            });
            //Store filtered projects in prop send from projects page or collaborations page to display it there
            setFilteredProjects(filtered);
        }
        else{
            //If allProjects context is empty, i.e no project is added or deleted, then filter projects from projects array which is the project list fetched from database
            const filtered= projects.filter((project)=>{
                //Return projects with selecte status value
                const matchStatus = filters.status === "All" || project.status === filters.status;
                return matchStatus;
            });
            //Store filtered projects in prop send from projects page or collaborations page to display it there
            setFilteredProjects(filtered);
        }     
    }, [allProjects, projects, filters, setFilteredProjects])
  
    return (
          <div className="w-[60%] h-full flex flex-col md:flex-row justify-start items-start md:items-center md:space-y-0 md:space-x-4 z-[0]">
              {/* Status Filter */}
              <div className="w-auto h-full flex justify-center items-center relative">
                 <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as ProjectStatus | "All" })}
                  className="block h-full md:h-[40px] appearance-none w-full bg-white border border-gray-300 text-gray-700 px-4 pr-10 rounded leading-tight focus:outline-none focus:border-black"
                  >
                      <option value="All">All Statuses</option>
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Cancelled">Cancelled</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 px-2 flex justify-center items-center text-gray-700">
                      <Icon
                      icon={"mynaui:chevron-down-solid"}
                      className="w-[20px] h-[20px] text-gray-700 "
                      />
                  </div>
              </div>
          </div>
  
    )
}

export default ProjectFilter;
