//Project Settings Page Component (used in Project Settings Page)
"use client";
import React, { useEffect, useState } from "react";
import EditProject from "./EditProject";
import DeleteProject from "./DeleteProject";
import { ProjectDetails } from "@/types/projectTypes";
import { getProjectDetailsApi } from "@/services/project/getProjectDetails";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { FadeLoader } from "react-spinners";

const ProjectSettings = () => {

    const params = useParams();
    const {projectId, userId} = params;
    const [projectDetails, setProjectDetails] = useState<ProjectDetails>();
    const [loading, setLoading] = useState<boolean>();
    
    //Fetch project details from backend for the given projectId
    useEffect(()=>{
        const fetchProjectDetails = async () =>{
            try{
                setLoading(true);
                const response = await getProjectDetailsApi(projectId as string);
                const responseData = await response.json();
                
                if(!response.ok){
                    throw new Error(responseData.message)
                }
                if(responseData.projectDetails){
                    setProjectDetails(responseData.projectDetails as ProjectDetails);
                }  
                else{
                    throw new Error("Invalid response structure");
                }     
            }
            catch(err){
                console.log(err);
                const errorMessage = err instanceof Error
                            ? err.message        
                            :"Could not fetch project details";
                toast.error(errorMessage);
            }
            finally{
                setLoading(false);
            }
        }
        fetchProjectDetails();
    }, [projectId, setProjectDetails]);

    if(loading){
        return (
        <div className="w-[100%] md:w-[90%] h-[calc(100%-45px)] flex justify-center items-start z-0">
            <div  className="w-[80%] h-[100%] bg-white rounded-[10px] flex flex-col justify-center items-center py-[20px] px-[30px] space-y-6 z-0 relative">
                <FadeLoader color="#8600D8" width={2} height={10} />
            </div>
        </div>
        )
    }
    

    return (
        <div className="w-[100%] md:w-[90%] h-[calc(100%-45px)] flex justify-center items-start z-0">
            {/* Project Settings Container */}
            <div className="w-[80%] h-[100%] bg-white rounded-[10px] flex flex-col justify-start items-center space-y-6 py-[20px] px-[30px] z-0 relative">
                {/* Heading */}
                <div className="w-[100%] h-[45px] flex justify-center items-center">
                    <h3 className="text-lg font-semibold">Project Settings</h3>
                </div>
                {projectDetails ? (
                    <div className="w-[100%] h-[calc(100%-45px)] flex flex-col justify-center items-center space-y-2">
                        {/* Render Edit Project Form Component*/}
                        <div className="w-[100%] h-[calc(100%-55px)] flex flex-col justify-center items-center overflow-y-scroll hide-scrollbar rounded-[10px] bg-blue-100 p-[20px]">
                            <EditProject projectDetails = {projectDetails} setProjectDetails={setProjectDetails}/>
                        </div> 
                        {/* Render Delete Project Component*/}
                        <div className="w-[100%] h-[40px] flex flex-col justify-center items-center rounded-[10px]"> 
                            <DeleteProject projectName = {projectDetails.projectName} projectId = {projectId as string} userId = {userId as string}/>
                        </div>
                    </div>
                ):( 
                    <div className="w-[100%] h-[calc(100%-45px)] flex flex-col justify-center items-center space-y-6"></div>
                )}                    
            </div>
        </div>    
    )
}

export default ProjectSettings;
