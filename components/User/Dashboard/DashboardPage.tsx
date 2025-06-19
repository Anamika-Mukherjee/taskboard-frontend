//Dashboard Page Component (used in User Dashboard Page)
"use client";
import React, { useEffect, useState } from "react";
import TotalProjectsCard from "./TotalProjectsCard";
import RecentProjectCard from "./RecentProjectCard";
import { ProjectDetails } from "@/types/projectTypes";
import { getProjectApi } from "@/services/project/getProject";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import CompletedProjectsCard from "./CompletedProjectsCard";
import TopProjectsChart from "./TopProjectsChart";
import StatusDistributionChart from "./StatusDistributionChart";

const DashboardPage = () => {
    const [allProjects, setAllProjects] = useState<ProjectDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch all projects created by the given user
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
                    setAllProjects(responseData.allProjects as ProjectDetails[]);
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
    }, [setAllProjects]);

    if(loading){
      <div className="w-[100%] md:w-[90%] h-[calc(100%-45px)] flex justify-center items-start z-0"
      >
          <div className="w-[80%] h-[100%] bg-white rounded-[10px] flex justify-center items-center py-[20px] px-[30px] z-0 relative">
              <div className="w-[25px] h-[25px] flex justify-center items-center z-[1100] relative left-[30px]">
                      <ClipLoader color="#8600D8" size={25}/>
              </div>
          </div>
      </div>
    }


    return (
        
        <div className="w-[100%] md:w-[90%] h-[calc(100%-45px)] flex justify-center items-start">
            {/* Dashboard Page Container */}
            <div className="w-[80%] h-[100%] bg-white rounded-[10px] flex flex-col justify-center items-center py-[20px] md:py-[30px] px-[30px] ">
                {allProjects && (
                  <div className="w-[100%] h-[100%] flex flex-col justify-between items-center space-y-4 py-[20px] overflow-y-scroll hide-scrollbar">
                      {/* Cards Container - Total Projects Card, Recent Projects Card and Completed Projects Card Container */}
                      <div className="w-[100%] h-auto md:h-[35%] flex flex-col md:flex-row justify-start items-center space-y-4 md:space-y-0 md:space-x-6">
                          <TotalProjectsCard projects={allProjects}/>
                          <RecentProjectCard projects={allProjects}/>              
                          <CompletedProjectsCard projects={allProjects}/>                   
                      </div>
                      {/* Charts Container - Top 5 Projects Chart and Project Status Distribution Chart */}
                      <div className="w-[100%] h-[100%] md:h-[70%] flex flex-col md:flex-row justify-start space-y-4 md:space-y-0 md:justify-between items-start py-[20px] md:py-0 md:overflow-y-scroll hide-scrollbar">
                          <div className="w-[100%] md:w-[55%] md:h-[100%] h-[100%] flex justify-start items-center ">
                              <TopProjectsChart projects={allProjects} />
                          </div>
                          <div className="w-[100%] md:w-[40%] h-[100%] md:h-[100%] flex justify-start items-center ">
                              <StatusDistributionChart projects={allProjects} />
                          </div>  
                      </div>
                  </div>
                )}
            </div>
        </div>
    )
}

export default DashboardPage;
