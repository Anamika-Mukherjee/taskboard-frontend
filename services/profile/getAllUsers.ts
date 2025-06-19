//API request to fetch all users' details
export const getAllUsersApi = async () =>{
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/getallusers`, {
        method: "GET",
        credentials: "include",
        headers: {"Content-Type": "application/json"}
      });
      
      return response;
}