//Header Component (used in all user pages)
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import UserButton from "./UserButton";
import { checkAuthApi } from "@/services/auth/checkAuth";
import { UserDetails } from "@/types/userTypes";
import { Icon } from "@iconify/react/dist/iconify.js";
import MobileSidebar from "./MobileSidebar";
import { usePathname } from "next/navigation";
import MobileProjectSidebar from "./MobileProjectSidebar";
import { sidebarLinks } from "@/utils/constants";
import { toast } from "sonner";
import MobileCollabSidebar from "./MobileCollabSidebar";

const Header = () => {
    const pathname = usePathname();
    const pathArray = pathname.split("/");
    const pathEnd = pathArray[pathArray.length-1];
    const [userData, setUserData] = useState<UserDetails | undefined>();
    const [openMenu, setOpenMenu] = useState<boolean>(false);

    const sidebarUrls = sidebarLinks.map((item)=>item.url);
    
    //Check if user is signed in 
    useEffect(()=>{
        const checkSignedIn = async ()=>{
           try{
                const response = await checkAuthApi();
                const responseData = await response.json();

                if(!response.ok){
                    throw new Error(responseData.message)
                }
                if(responseData.userDetails){
                    setUserData(responseData.userDetails as UserDetails);   
                }  
                else{
                    throw new Error("Invalid response structure");
                }     
           } 
           catch(err){
            console.log(err);
            const errorMessage = err instanceof Error
                           ? err.message        
                           :"Could not check authentication";
            toast.error(errorMessage);
           }
        };
        checkSignedIn();
    }, []);

    return (
        <>
            <div className="w-full h-[45px] flex justify-between items-center px-[10px] bg-[#000000] text-white">
                {/* Menu button for small devices */}
                <button
                type="button"
                onClick={()=>setOpenMenu(!openMenu)}
                className="w-[30px] h-[30px] md:hidden flex justify-center items-center cursor-pointer"
                >
                    <Icon
                    icon={"charm:menu-hamburger"}
                    className="w-full h-full md:hidden flex justify-center items-center"
                    /> 
                </button> 
                {/* Logo */}
                <Image 
                src={"/logo.png"}
                alt="logo"
                width={120}
                height={100}
                className="h-[60%]"
                /> 
                 {/* Render User Button Component if user is signed in  */}
                {userData && (
                    <UserButton userDetails = {userData}/>
                )}
            </div>
            {/* Sidebar Menu for small devices */}
            {openMenu && (
            <div className="w-[40%] h-[calc(100%-45px)] bg-white z-[1000] fixed top-[45px] left-0">
                {sidebarUrls.includes(pathEnd)?<MobileSidebar setOpenMenu = {setOpenMenu}/>:pathname.includes("projects")?<MobileProjectSidebar setOpenMenu={setOpenMenu}/>: <MobileCollabSidebar setOpenMenu={setOpenMenu}/>}
            </div>
            )} 
        </>
        
    )
}

export default Header;
  