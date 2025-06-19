//Delete Project Button and Confirmation Modal Component (used in Project Settings Page)
"use client";
import { useAllProjectContext } from "@/contexts/allProjectContext";
import { deleteProjectApi } from "@/services/project/deleteProject";
import { ProjectDetails } from "@/types/projectTypes";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

//Define interface for props
interface DeleteProjectProps{
    projectName: string;
    projectId: string;
    userId: string;
}

const DeleteProject: React.FC<DeleteProjectProps> = ({projectName, projectId, userId}) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const {setAllProjects} = useAllProjectContext();
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    //Delete button click event handler
    const handleDeleteClick = async ()=>{
      try{
            setLoading(true);
            const response = await deleteProjectApi(projectId);
            const responseData = await response.json();
            if(!response.ok){
                throw new Error(responseData.message)
            }
            if(responseData.allProjects){
                setAllProjects(responseData.allProjects as ProjectDetails[]);
                setOpenModal(false);
                toast.success(responseData.message);
                //Redirect to Projects page after deletion
                router.push(`/user/${userId}/projects`);
            }  
            else{
                throw new Error("Invalid response structure");
            }            
        }
        catch(err){
            console.log(err);
            const errorMessage = err instanceof Error
                                ? err.message        
                                :"Could not delete project";
            toast.error(errorMessage);
        }
        finally{
            setLoading(false);
        }
    } 
    
    return (
        <>
            {/* Delete Project Button */}
            <div className="w-[100%] h-[100%] flex justify-end items-center z-0">
                <button 
                    type="button"
                    onClick={()=>setOpenModal(true)}
                    className="w-[150px] h-[100%] flex justify-center items-center bg-red-700 text-white rounded-[5px] cursor-pointer hover:bg-red-800"
                >
                    Delete Project
                </button>      
            </div>
            {/* Delete Project Confirmation Modal */}
            {openModal && (
                <div className="w-screen h-screen flex justify-center items-center fixed top-0 left-0 z-[1000] bg-black/50">
                    <div className="w-[50%] h-auto flex flex-col justify-center items-center bg-gray-100 rounded-[10px] p-[20px] space-y-6">
                        {/* Delete Confirmation Message */}
                        <p>Are you sure you want to delete project 
                            <span className="ml-[2px] font-semibold">
                                {projectName}
                            </span>
                            ?
                        </p>
                        {/* Button Container */}
                        <div className="w-[100%] h-auto flex justify-end items-center space-x-4">
                            {/* Delete Button */}
                            <button
                            type="button"
                            onClick={handleDeleteClick}
                            className="w-[100px] h-[35px] flex justify-center items-center bg-red-700 text-white rounded-[5px] text-sm cursor-pointer hover:bg-red-800"
                            >
                                <p className="z-[1000]">Delete</p>
                                {loading && (
                                    <div className="w-[25px] h-[25px] flex justify-center items-center z-[1100] relative left-[10px]">
                                        <ClipLoader color="#ffffff" size={25} className="opacity-70" speedMultiplier={0.5}/>
                                    </div>
                                )}
                            </button>
                            {/* Cancel Button */}
                            <button
                            type="button"
                            onClick={()=>setOpenModal(false)}
                            className="w-[100px] h-[35px] flex justify-center items-center bg-gray-500 text-white rounded-[5px] text-sm cursor-pointer hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
        
    )
}

export default DeleteProject;
