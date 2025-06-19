//API request to fetch project details for a particular project
export const getProjectDetailsApi = async (projectId: string) =>{
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/project/getprojectdetails/${projectId}`, {
        method: "GET",
        credentials: "include",
        headers: {"Content-Type": "application/json"}
      });
      
      return response;
}