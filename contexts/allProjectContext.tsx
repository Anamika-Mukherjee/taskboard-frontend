//Context to store updated projects list when a project is created or deleted
"use client";
import { ProjectDetails } from "@/types/projectTypes";
import {createContext, useContext, useState} from "react";

interface AllProjectContext{
    allProjects: ProjectDetails[];
    setAllProjects: (allProjects: ProjectDetails[])=>void;
}

export const allProjectContext = createContext<AllProjectContext | null>(null);

export const useAllProjectContext = ()=>{
      const context = useContext(allProjectContext);

      if(!context){
        throw new Error("useAllProjectContext can only be used within AllProjectProvider");
      }

      return context;
}

export const AllProjectProvider = ({children}: {children: React.ReactNode})=>{
    const [allProjects, setAllProjects] = useState<ProjectDetails[]>([]);

    return(
        <allProjectContext.Provider value={{allProjects, setAllProjects}}>
            {children}
        </allProjectContext.Provider>
    )
}

