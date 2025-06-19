//API request to delete a ticket
export const deleteTicketApi = async (projectId: string, ticketId: string) =>{
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ticket/delete/${projectId}/${ticketId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {"Content-Type": "application/json"}
      });

      return response;
}