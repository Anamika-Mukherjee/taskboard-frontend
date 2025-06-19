//API request to search a ticket
export const searchTicketApi = async (projectId: string, searchQuery: string) =>{
   const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ticket/search/${projectId}?query=${searchQuery}`, {
      method: "GET",
      credentials: "include",
      headers: {"Content-Type": "application/json"}
   });

   return response;
}