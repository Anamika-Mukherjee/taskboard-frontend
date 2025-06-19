//Projects Page Component (used in Projects Page)
"use client";
import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import CreateProjectForm from "./CreateProjectForm";
import { ProjectDetails } from "@/types/projectTypes";
import ProjectSearch from "./ProjectSearch";
import ProjectFilter from "./ProjectFilter";
import { useSearchParams } from "next/navigation";
import { getProjectApi } from "@/services/project/getProject";
import { FadeLoader } from "react-spinners";
import { toast } from "sonner";

const ProjectsPage = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [filteredProjects, setFilteredProjects] = useState<ProjectDetails[]>([]);
    const [projects, setProjects] = useState<ProjectDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    //Fetch all projects' details from backend for projects created by given user 
    useEffect(()=>{
        const fetchProjects = async ()=>{
          try{
            setLoading(true);
            const response = await getProjectApi();
            const responseData = await response.json();

            if(!response.ok){
                throw new Error(responseData.message)
            }
            if(responseData.allProjects){
                setProjects(responseData.allProjects as ProjectDetails[]);
            }  
            else{
                throw new Error("Invalid response structure");
            }     
          }
          catch(err){
            console.log(err);
              const errorMessage = err instanceof Error
                                  ? err.message        
                                  :"Could not fetch projects";
              toast.error(errorMessage);
              
          }
          finally{
            setLoading(false);
          }
        }
        fetchProjects();
    }, [setProjects]);

    useEffect(()=>{
          //If search query string available in route, then show only searched project
          if(query && projects){
            const searchedProject = projects.filter((project)=>project._id === query);
            setFilteredProjects(searchedProject);
          }
          //Show all projects if no query string is available
          else if(!query){
            setFilteredProjects(projects);
          }
    }, [query, projects]);

    if(loading){
          <div className="w-[100%] md:w-[90%] h-[calc(100%-45px)] flex justify-center items-start">
            <div className="w-[80%] h-[100%] bg-white rounded-[10px] flex justify-center items-center py-[20px] px-[30px]z-0 relative">
                <div className="w-[25px] h-[25px] flex justify-center items-center z-[1100] relative left-[30px]">
                  <FadeLoader color="#8600D8" width={2} height={10} />
                </div>
            </div>
          </div>
    }

    return (
        <>
          <div className="w-[100%] md:w-[90%] h-[calc(100%-45px)] flex justify-center items-start z-0">
            {/* Projects Page Container */}
            <div className="w-[80%] h-[100%] bg-white rounded-[10px] flex flex-col justify-between items-center py-[20px] px-[30px] space-y-6 z-0 relative">
                {/* Heading */}
                <div className="w-full h-[50px] flex justify-center items-center">
                    <h1 className="text-2xl font-semibold">Projects</h1>
                </div>
                {/* Project Searchbar */}
                <div className="w-full h-[50px] flex justify-start items-start md:items-center py-[20px]">
                    <ProjectSearch />
                </div>
                {/* Project Filter and New Project Button (to add new project) */}
                <div className="w-full h-[90px] flex justify-between items-start md:items-center py-[20px] z-[0]">
                    <ProjectFilter projects = {projects} setFilteredProjects = {setFilteredProjects}/>
                    <button
                      type="button"
                      onClick={()=>setOpenForm(true)}
                      className="w-[150px] h-[40px] flex justify-center items-center bg-[#000000] rounded-[5px] text-sm text-white hover:cursor-pointer hover:bg-gray-700"
                    >
                        New Project
                    </button>
                </div>
                {/* Display Filtered Projects in Card Format */}
                <div className="w-full h-[calc(100%-50px)] flex justify-start items-start py-[10px] md:py-[0px] overflow-y-scroll hide-scrollbar">
                  <div className="w-full h-[100%] flex flex-col md:flex-row justify-start items-center md:items-start md:flex-wrap space-y-4 md:space-x-6">
                    {/* Show Filtered Projects if available */}
                    {!loading && filteredProjects.length>0?
                      filteredProjects.map((project, index)=>(
                          <ProjectCard 
                            key={index}
                            project = {project}
                          />
                      ))
                      // Show message if no projects available under selected filter
                      : !filteredProjects.length && projects.length ?(
                        <p className="w-full h-full flex justify-center items-center italic text-gray-400">
                          No project matches your choice
                        </p>
                      )
                      // Show different message if no projects available
                      : !filteredProjects.length && !projects.length && (
                        <p className="w-full h-full flex justify-center items-center italic text-gray-400">
                          You haven&apos;t created any projects yet
                        </p>
                      )
                    }
                  </div> 
                </div>   
            </div>  
          </div>
          {/* Display Create Project Form Modal when New Project Button is clicked*/}
          {openForm && (
              <div className="w-full h-full flex justify-center items-center fixed top-0 left-0 z-[1000] bg-black/50">
                <CreateProjectForm open={openForm} onOpenChange={setOpenForm} />
              </div>
          )}    
      </>
    )
}

export default ProjectsPage;
