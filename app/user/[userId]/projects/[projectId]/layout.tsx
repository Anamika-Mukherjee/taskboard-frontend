//Layout for Projects Pages (Project Specific)
import Header from "@/components/Layout/Header";
import ProjectSidebar from "@/components/Layout/ProjectSidebar";
import React from "react";

const layout = ({children}: Readonly<{children: React.ReactNode}>) => {
  return (
    <div className="w-screen h-screen">
        <Header />
        <div className="w-screen h-[calc(100%-45px)] hidden md:flex justify-between items-center">
            <ProjectSidebar />
            {children}
        </div> 
        <div className="w-screen h-[calc(100%-45px)] md:hidden flex justify-between items-center">
            {children}
        </div>
    </div> 
  )
}

export default layout;
