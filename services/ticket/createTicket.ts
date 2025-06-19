//API request to create new ticket
interface CreateTicketPayload{
    ticketTitle: string;
    ticketDescription: string;
    assignee: string;
    ticketType: string;
    ticketPriority: string;      
}

export const createTicketApi = async (projectId: string, payload: CreateTicketPayload) =>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ticket/create/${projectId}`, {
      method: "POST",
      body: JSON.stringify({
          ...payload
      }),
      credentials: "include",
      headers: {"Content-Type": "application/json"}
    });

    return response;   
}