//API request to update ticket status in Kanban board by a collaborator
interface UpdateTicketStatusPayload{ 
    ticketStatus: string;     
}

export const updateTicketStatusApi = async (payload: UpdateTicketStatusPayload, ticketId: string) =>{
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/collaborations/updateticketstatus/${ticketId}`, {
        method: "PATCH",
        body: JSON.stringify({
            ...payload
        }),
        credentials: "include",
        headers: {"Content-Type": "application/json"}
      });

      return response;  
}