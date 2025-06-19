//API request for Sign Out
export const signOutApi = async () =>{
 
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signout`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
      });
      
      return response;   
}