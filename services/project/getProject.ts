//API request to fetch all projects created by the user
export const getProjectApi = async () =>{  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/project/getallprojects`, {
        method: "GET",
        credentials: "include",
        headers: {"Content-Type": "application/json"}
      });

      return response; 
}