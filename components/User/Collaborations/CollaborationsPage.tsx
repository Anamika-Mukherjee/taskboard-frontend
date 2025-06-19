//Collaborations Page Component (used in Collaborations Page)
"use client";
import React, { useEffect, useState } from "react";
import { ProjectDetails } from "@/types/projectTypes";
import ProjectFilter from "../Projects/ProjectFilter";
import { useSearchParams } from "next/navigation";
import { FadeLoader } from "react-spinners";
import { toast } from "sonner";
import { getCollabApi } from "@/services/collaboration/getCollab";
import CollabCard from "./CollabCard";
import CollabSearch from "./CollabSearch";

const CollaborationsPage = () => {
      const searchParams = useSearchParams();
      const query = searchParams.get("query");
      const [filteredCollabs, setFilteredCollabs] = useState<ProjectDetails[]>([]);
      const [collabs, setCollabs] = useState<ProjectDetails[]>([]);
      const [loading, setLoading] = useState<boolean>(false);

       //Fetch all projects' details from backend for projects where the user is a team member 
      useEffect(()=>{
          const fetchProjects = async ()=>{
            try{
              setLoading(true);
              const response = await getCollabApi();
              const responseData = await response.json();

              if(!response.ok){
                  throw new Error(responseData.message)
              }
              if(responseData.allCollabs){
                  setCollabs(responseData.allCollabs as ProjectDetails[]);
              }  
              else{
                  throw new Error("Invalid response structure");
              }   
            }
            catch(err){
                console.log(err);
                const errorMessage = err instanceof Error
                                    ? err.message        
                                    :"Could not fetch collaborations";
                toast.error(errorMessage);
                
            }
            finally{
              setLoading(false);
            }
          }
          fetchProjects();
      }, [setCollabs]);


      useEffect(()=>{
            //If search query string available in route, then show only searched collaboration
            if(query && collabs){
              const searchedCollab = collabs.filter((collab)=>collab._id === query);
              setFilteredCollabs(searchedCollab);
            }
            //Show all collaborations if no query string is available
            else if(!query){
              setFilteredCollabs(collabs);
            }
      }, [query, collabs]);

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
                      {/* Collaborations Page Container */}
                      <div className="w-[80%] h-[100%] bg-white rounded-[10px] flex flex-col justify-between items-center py-[20px] px-[30px] space-y-6 z-0 relative">
                           {/* Heading */}
                          <div className="w-full h-[50px] flex justify-center items-center">
                              <h1 className="text-2xl font-semibold">Your Collaborations</h1>
                          </div>
                          {/* Collaboration Searchbar */}
                          <div className="w-full h-[50px] flex justify-start items-start md:items-center py-[20px]">
                              <CollabSearch />
                          </div>
                          {/* Project Filter */}
                          <div className="w-full h-[90px] flex justify-start items-start md:items-center py-[20px] z-[0]">
                              <ProjectFilter projects = {collabs} setFilteredProjects = {setFilteredCollabs}/>
                          </div>
                          {/* Display Filtered Projects in Card Format */}
                          <div className="w-full h-[calc(100%-50px)] flex justify-start items-start py-[10px] md:py-[0px] overflow-y-scroll hide-scrollbar">
                              <div className="w-full h-[100%] flex flex-col md:flex-row justify-start items-center md:items-start md:flex-wrap space-y-4 md:space-x-6">
                                  {/* Show Filtered Collaborations if available */}
                                  {!loading && filteredCollabs.length>0?
                                    filteredCollabs.map((collab, index)=>(
                                        <CollabCard 
                                        key={index}
                                        collab = {collab}/>
                                    ))
                                    // Show message if no collaborations available under selected filter
                                    : !filteredCollabs.length && collabs.length ?(
                                      <p className="w-full h-full flex justify-center items-center italic text-gray-400">
                                        No project matches your choice
                                      </p>
                                    )
                                    // Show different message if no collaborations available
                                    : !filteredCollabs.length && !collabs.length && (
                                      <p className="w-full h-full flex justify-center items-center italic text-gray-400">
                                        You don&apos;t have any collaborations
                                      </p>
                                    )
                                  }
                              </div> 
                          </div>
                      </div>  
                  </div>   
            </>
      )
}

export default CollaborationsPage;
