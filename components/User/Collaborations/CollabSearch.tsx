//Collaboration Searchbar Component (used in Collaborations Page)
"use client";
import { searchProjectApi } from "@/services/project/searchProject";
import { ProjectDetails } from "@/types/projectTypes";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const CollabSearch = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [results, setResults] = useState<ProjectDetails[]>([]);

    useEffect(() => {
        // Add debounce for fetching search results to ensure Search API is only called after 3 seconds of entering searchbar input 
        const delayDebounce = setTimeout(() => {
            const fetchSearchResults = async () =>{
                try{
                    //Call Search API only when user gives input in searchbar
                    if(searchTerm){
                        const response = await searchProjectApi(searchTerm);
                        const responseData = await response.json();
                        
                        if(!response.ok){
                            throw new Error(responseData.message)
                        }
                        if(responseData.projects){
                            setResults(responseData.projects as ProjectDetails[]);
                        }  
                        else{
                            throw new Error("Invalid response structure");
                        }      
                    }  
                }
                catch(err){
                    console.log(err);
                    const errorMessage = err instanceof Error
                                ? err.message        
                                :"Could not fetch search results";
                    toast.error(errorMessage);
                }
            }
            fetchSearchResults();
        }, 3000); 

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    //Searchbar Input Change Event Handler
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>{
        //Store searched input in state variable on every input change
        setSearchTerm(e.target.value);
        //Empty the search results array state when searchbar is empty, to make sure previous search results are not displayed when searchbar is empty
        if(!e.target.value){
            setResults([]);
        }
    }

    return (
        //Searchbar and Search Results Container
        <div className="w-[100%] md:w-[50%] h-auto flex flex-col justify-start items-center space-y-2">
            {/* Searchbar Container */}
            <div className="w-[100%] h-[30px] flex justify-start items-center z-0">
                {/* Search Icon and Input Field */}
                <div className="w-full h-[100%] flex justify-start items-center space-x-2 border border-gray-400 rounded-md text-sm pl-[6px] focus:outline-1 focus:outline-[#b409cf] focus:outline-offset-1">
                    <Icon 
                            icon={"mdi:search"}
                            className="w-[20px] h-[100%] flex justify-center items-center text-gray-700"
                    />
                    <input 
                            type="text" 
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e)=>handleSearch(e)}
                            className="w-[95%] h-[100%] flex justify-start items-center rounded-md text-sm pl-[6px] focus:outline-none"
                    />
                </div> 
            </div>
            {/* Show Search Results only when input present in searchbar and search results present in results state variable */}
            {results && searchTerm &&(
                <div className="w-[80%] md:w-[40%] h-max flex flex-col justify-start items-start space-y-4 p-[10px] bg-white z-[1000] rounded-[10px] border border-gray-300 absolute top-[150px] left-[25px] md:top-[120px] md:left-[30px]">
                    {results.length>0?
                        results.map((project, index)=>(
                            // Individual Search Result is a link to its Search Result Page 
                            <Link
                            key={index} 
                            href={`collabs?query=${project._id}`}
                            onClick={()=>{
                                setSearchTerm("");
                                setResults([]);
                            }}
                            className="w-full h-auto flex flex-col justify-start items-start rounded-[10px] hover:bg-gray-200 px-[20px] py-[10px]"
                            >
                                {/* Show Project Name in Search Result */}
                                <p className="text-sm text-violet-700 font-medium">{project.projectName}</p>
                                {/* Show Project Description if searched value is not present in Project Name but present in Project Description */}
                                {!project.projectName.includes(searchTerm) && project.projectDescription.includes(searchTerm) && (
                                    <p className="text-sm text-gray-500">{project.projectDescription}</p>
                                )} 
                                 {/* Show Project Key if searched value is not present in Project Name but present in Project Key */}  
                                {!project.projectName.includes(searchTerm) && project.projectKey.includes(searchTerm.toUpperCase()) && (
                                    <p className="text-sm text-gray-500">{project.projectKey}</p>
                                )}   
                            </Link>
                        )):(
                            // Show Message if searched value does not match with any project
                            <div className="w-full h-auto flex justify-center items-center">
                                <p>No results found</p>
                            </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default CollabSearch;
