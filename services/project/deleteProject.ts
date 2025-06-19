//API request to delete a project
export const deleteProjectApi = async (projectId: string) =>{
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/project/delete/${projectId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {"Content-Type": "application/json"}
      });
      
      return response;  
}