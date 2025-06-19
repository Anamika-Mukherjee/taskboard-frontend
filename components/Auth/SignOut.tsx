//Sign Out Component (used in User Button in Header)
"use client";
import { signOutApi } from "@/services/auth/signOut";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

const SignOut = () => {

      const router = useRouter();
      const [loading, setLoading] = useState<boolean>(false);

      //Sign Out Button event handler
      const handleSignOut = async ()=>{
          try{
              setLoading(true);
              const response = await signOutApi();
              const responseData = await response.json();
              if(!response.ok){
                  throw new Error(responseData.message)
              }
              router.push("/");
              toast.success(responseData.message);
          }
          catch(err){
              console.log(err);
              const errorMessage = err instanceof Error
                                          ? err.message        
                                          :"Could not sign out";
              toast.error(errorMessage);
          }
          finally{
            setLoading(false);
          }
      }  

      return (
            // Sign Out Button
            <div className="w-full h-full flex justify-start items-center">
                  <button
                  type="button"
                  className="scheme-color cursor-pointer flex justify-start items-center"
                  onClick={handleSignOut}
                  >
                      <p className="z-0">Sign out</p>
                      {loading && (
                        <div className="w-[25px] h-[25px] flex justify-center items-center z-[1000] relative left-[10px]">
                          <ClipLoader color="#8600D8" size={15} className="opacity-70" speedMultiplier={0.5}/>
                        </div>
                      )}
                  </button>
            </div>
      )
}

export default SignOut;
