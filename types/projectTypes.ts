import { TicketPriority, TicketStatus, TicketType } from "./ticketTypes";

export interface TeamMember{
    _id: string;
    email: string;
    name: string;
}

export interface ProjectCreator{
    _id: string;
    email: string;
    name: string;
}

export interface Assignee{
    _id: string;
    email: string;
    name: string;
}

export interface ProjectTicket{
    _id: string;
    ticketTitle: string;
    ticketType: TicketType;
    ticketPriority: TicketPriority;
    ticketStatus: TicketStatus;
    assignee: Assignee;
}
 
export type ProjectStatus =  "Not Started" | "In Progress" | "Completed" | "On Hold" | "Cancelled";

export interface ProjectDetails{
    _id: string;
    userId: ProjectCreator;
    projectName: string;
    projectDescription: string;
    startDate: string;
    endDate: string;
    teamMembers: TeamMember[];
    projectKey: string;
    status: ProjectStatus;
    tickets: ProjectTicket[];
    createdAt: string;
    updatedAt: string;
}