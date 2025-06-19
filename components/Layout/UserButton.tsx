//User Button Component (used in Header in all User pages)
import { UserDetails } from "@/types/userTypes";
import React, { useState } from "react";
import SignOut from "../Auth/SignOut";

//Define interface for props
interface UserButtonProps{
  userDetails: UserDetails;
}

const UserButton: React.FC<UserButtonProps> = ({userDetails}) => {
  const [open, setOpen] = useState<boolean>(false);
  const userInitials = userDetails.userName.slice(0, 1).toUpperCase();

  return (
    <div className="w-auto h-auto flex flex-col justify-center items-center">
        {/* User Button (show user initials) */}
        <button
          type="button"
          className="w-[35px] h-[35px] rounded-[20px] flex justify-center items-center bg-violet-200 font-medium scheme-color cursor-pointer z-0 fixed top-[5px] right-[20px]"
          onClick={()=>setOpen(!open)}
          > 
            {userInitials}
        </button>
        {/* Show modal with signout component when user button is clicked */}
        {open && (
          <div className="w-[250px] h-[120px] flex flex-col justify-between items-center bg-white relative top-[100px] right-[30px] z-50 rounded-[10px] py-[10px] px-[20px]">
            <div className="w-full h-[40%] flex flex-col justify-start items-start border border-b-gray-400">
              <p className="text-black text-sm font-medium">{userDetails.userName}</p>
              <p className="text-gray-500 text-xs font-medium ">{userDetails.userEmail}</p>
            </div>
            <div className="w-full h-[60%] flex flex-col justify-center items-start">
                  <SignOut />
            </div>
          </div>
        )}
    </div>
  )
}

export default UserButton;
