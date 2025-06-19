//API request to fetch ticket details for a particular ticket
export const getTicketDetailsApi = async (ticketId: string) =>{    
   const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ticket/getticketdetails/${ticketId}`, {
      method: "GET",
      credentials: "include",
      headers: {"Content-Type": "application/json"}
   });

   return response;
}