//Layout for Projects Page (General)
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import React from "react";

const layout = ({children}: Readonly<{children: React.ReactNode}>) => {
  return (
    <div className="w-screen h-screen">
        <Header />
        <div className="w-screen h-[calc(100%-45px)] hidden md:flex justify-between items-center">
            <Sidebar />
            {children}
        </div>
        <div className="w-screen h-[calc(100%-45px)] md:hidden flex justify-between items-center">
            {children}
        </div>
        
    </div> 
  )
}

export default layout;
