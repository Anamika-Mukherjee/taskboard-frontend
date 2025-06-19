//Collaboration Sidebar Component (used in Collaborations Pages)
"use client";
import { collabSidebarLinks } from "@/utils/constants";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

const CollabSidebar = () => {
   const params = useParams();
   const {userId, projectId} = params;
   const pathname = usePathname();  
  
  return (
    <div className="w-[15%] h-full flex flex-col justify-start items-center bg-[#000000] text-white px-[20px] py-[40px]">
      <ul className="w-full h-full flex flex-col justify-start items-start space-y-2 px-[10px]">
         {/* Show Collaborations Sidebar Links */}
         {collabSidebarLinks.map((item, index)=>(
            <li
             key={index}
             className={`w-full h-auto text-sm cursor-pointer px-[10px] py-[5px] flex justify-start items-center rounded-[2px] border-b-1 border-l-1
                         ${pathname.includes(`collaborations/${projectId}/${item.url}`) ?" border-gray-500": "border-transparent"}`
                      }
            >
               <Link
               href={`/user/${userId}/collaborations/${projectId}/${item.url}`}
               >
                  {item.label}
               </Link>
            </li>
         ))}
      </ul>
    </div>
  )
}

export default CollabSidebar;
