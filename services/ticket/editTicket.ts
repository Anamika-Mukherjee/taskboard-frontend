//API request to edit ticket
interface EditTicketPayload{
    ticketTitle: string;
    ticketDescription: string;
    assignee: string;
    ticketType: string;
    ticketPriority: string;  
    ticketStatus: string;     
}

export const editTicketApi = async (payload: EditTicketPayload, ticketId: string) =>{
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ticket/edit/${ticketId}`, {
        method: "PATCH",
        body: JSON.stringify({
            ...payload
        }),
        credentials: "include",
        headers: {"Content-Type": "application/json"}
      });

      return response;
}