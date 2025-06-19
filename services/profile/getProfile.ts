//API request to fetch a particular user's profile details
export const getProfileApi = async () =>{
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/getprofile`, {
        method: "GET",
        credentials: "include",
        headers: {"Content-Type": "application/json"}
      });
      
      return response;
}