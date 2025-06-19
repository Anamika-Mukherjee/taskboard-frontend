//API request to fetch all tickets created in a particular project
export const getTicketApi = async (projectId: string) =>{
   const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ticket/getalltickets/${projectId}`, {
      method: "GET",
      credentials: "include",
      headers: {"Content-Type": "application/json"}
   });

  return response;
}