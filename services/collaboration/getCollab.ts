//API request to fetch all collaboration projects
export const getCollabApi = async () =>{

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/collaborations/getallcollabs`, {
        method: "GET",
        credentials: "include",
        headers: {"Content-Type": "application/json"}
      });
      
      return response;
}
  
