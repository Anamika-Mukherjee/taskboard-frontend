//API request to create new project
interface CreateProjectPayload{
    projectName: string;
    projectDescription: string;
    startDate: Date;
    endDate: Date;
    teamMembers: {memberEmail: string}[];
        
}

export const createProjectApi = async (payload: CreateProjectPayload) =>{
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/project/create`, {
        method: "POST",
        body: JSON.stringify({
            ...payload
        }),
        credentials: "include",
        headers: {"Content-Type": "application/json"}
      });

      return response;  
}