//API request to fetch collaboration details for a particular collaboration project
export const getCollabDetailsApi = async (projectId: string) =>{
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/collaborations/getcollabdetails/${projectId}`, {
        method: "GET",
        credentials: "include",
        headers: {"Content-Type": "application/json"}
      });
      
      return response; 
}