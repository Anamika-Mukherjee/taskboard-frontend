//API request to edit project
interface EditProjectPayload{
    projectName: string;
    projectDescription: string;
    startDate: Date;
    endDate: Date;
    teamMembers: {memberEmail: string}[];       
}

export const editProjectApi = async (payload: EditProjectPayload, projectId: string) =>{
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/project/edit/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify({
            ...payload
        }),
        credentials: "include",
        headers: {"Content-Type": "application/json"}
      });
      
      return response;
}