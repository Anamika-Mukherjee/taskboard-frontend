//Sidebar Component for small devices (used in user pages)
"use client";
import { sidebarLinks } from "@/utils/constants";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { SetStateAction } from "react";

//Define interface for props
interface MobileSidebarProps{
    setOpenMenu: React.Dispatch<SetStateAction<boolean>>;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({setOpenMenu}) => {
  const params = useParams();
  const {userId} = params;
  const pathname = usePathname();  
  
  return (
    <div className="w-[100%] h-full flex flex-col justify-start items-center bg-[#000000] text-white px-[20px] py-[40px]">
      <ul className="w-full h-full flex flex-col justify-start items-start space-y-2 px-[10px]">
          {/* Show Sidebar Links */}
          {sidebarLinks.map((item, index)=>(
            <li
             key={index}
             className={`w-full h-auto text-sm cursor-pointer px-[10px] py-[5px] flex justify-start items-center rounded-[2px] border-b-1 border-l-1
                         ${pathname.includes(`user/${userId}/${item.url}`) ?" border-gray-500": "border-transparent"}`
                      }
            >
                <Link
                href={`/user/${userId}/${item.url}`}
                onClick={()=>setOpenMenu(false)}
                >
                    {item.label}
                </Link>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default MobileSidebar;
