export type TicketType = "Task" | "Bug" | "Feature"| "Improvement";
export type TicketPriority = "Low" | "Medium" | "High" | "Critical";
export type TicketStatus = "To Do" | "In Progress" | "Done";

export interface OwnerRef{
   _id: string;
    email: string;
    name: string;
}

export interface ProjectRef{
    _id: string;
    projectName: string;
    projectKey: string;
    userId: OwnerRef;
}

interface AssigneeRef{
    _id: string;
    email: string;
    name: string;
}

export interface TicketDetails{
    _id: string;
    projectId: ProjectRef;
    assignee: AssigneeRef;
    ticketTitle: string;
    ticketDescription: string;
    ticketType: TicketType;
    ticketPriority: TicketPriority;
    ticketStatus: TicketStatus;
    createdAt: string;
}