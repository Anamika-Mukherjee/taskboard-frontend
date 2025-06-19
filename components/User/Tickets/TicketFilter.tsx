//Ticket Filter Component (used in Tickets Page)
"use client";
import { useAllTicketContext } from "@/contexts/allTicketContext";
import { TicketDetails, TicketPriority, TicketStatus } from "@/types/ticketTypes";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { SetStateAction, useEffect, useState } from "react";

//Define interface for props
interface TicketFilterProps{
    tickets: TicketDetails[];
    setFilteredTickets: React.Dispatch<SetStateAction<TicketDetails[]>>;
}

const TicketFilter: React.FC<TicketFilterProps> = ({tickets, setFilteredTickets}) => {
    //Declare state variable to store ticket filter criteria as ticket status, ticket priority and assignee
    const [filters, setFilters] = useState<{
        status: TicketStatus | "All";
        priority: TicketPriority | "All";
        assignee: string | "All";
    }>({
        status: "All",
        priority: "All",
        assignee: "All",
    });

    //Declare array state to store assignee details to show in filter dropdown
    const [assignees, setAssinees] = useState<{assigneeEmail: string; assigneeName: string;}[]>([]);

    //Import allTickets context variable to make sure newly updated list of tickets are also filtered
    const {allTickets} = useAllTicketContext();

    //Function to fetch and store assignee details
    useEffect(()=>{
        //If any ticket is added or deleted, get the updated list of tickets 
        if(allTickets && allTickets.length>0){
            //Map through all tickets and make a set of unique assignee ids
            const assigneeIdSet = new Set(allTickets.map(ticket=>ticket.assignee._id));

            //Convert assignee id set into array
            const assigneeIdArray = Array.from(assigneeIdSet);

            //Declare array to store assignee email and name for unique assignee ids
            const assigneeDetails: {assigneeEmail: string; assigneeName: string;}[] = [];

            //Map through unique assignee ids array and map through updated list of tickets to get assignee ids corresponding name and email values
            assigneeIdArray.map(id=>{
                allTickets.map(ticket=>
                    ticket.assignee._id === id && !assigneeDetails.find((assignee)=> assignee.assigneeEmail===ticket.assignee.email)
                    && assigneeDetails.push({assigneeEmail: ticket.assignee.email, assigneeName: ticket.assignee.name})
                )
            });

            //Store unique assignee name and email values in array state variable
            setAssinees(assigneeDetails);
        }
        //If no ticket is added or deleted, get the original list of tickets
        else{

            //Map through all tickets and make a set of unique assignee ids
            const assigneeIdSet = new Set(tickets.map(ticket=>ticket.assignee._id));

            //Convert assignee id set into array
            const assigneeIdArray = Array.from(assigneeIdSet);

            //Declare array to store assignee email and name for unique assignee ids
            const assigneeDetails: {assigneeEmail: string; assigneeName: string;}[] = [];

            //Map through unique assignee ids array and map through updated list of tickets to get assignee ids corresponding name and email values
            assigneeIdArray.map(id=>{
                tickets.map(ticket=>
                    ticket.assignee._id === id && !assigneeDetails.find((assignee)=> assignee.assigneeEmail===ticket.assignee.email)
                    && assigneeDetails.push({assigneeEmail: ticket.assignee.email, assigneeName: ticket.assignee.name})
                )
            });

            //Store unique assignee name and email values in array state variable
            setAssinees(assigneeDetails);
        }
    }, [allTickets, tickets]);

    useEffect(()=>{
        //If allTickets context has tickets, then filter tickets from allTickets 
        if(allTickets && allTickets.length>0){
            const filtered = allTickets.filter((ticket)=>{
                const matchStatus = filters.status === "All" || ticket.ticketStatus === filters.status;
                const matchPriority = filters.priority === "All" || ticket.ticketPriority === filters.priority;
                const matchAssignee = filters.assignee === "All" || ticket.assignee.email === filters.assignee;

                // Return tickets with selected status, priority and assignee value
                return matchStatus && matchPriority && matchAssignee;
            });
            //Store filtered tickets in prop send from tickets page to display it there
            setFilteredTickets(filtered);
        }
        else{
            //If allTickets context is empty, i.e no ticket is added or deleted, then filter tickets from tickets array which is the ticket list fetched from database
            const filtered= tickets.filter((ticket)=>{
                const matchStatus = filters.status === "All" || ticket.ticketStatus === filters.status;
                const matchPriority = filters.priority === "All" || ticket.ticketPriority === filters.priority;
                const matchAssignee = filters.assignee === "All" || ticket.assignee.email === filters.assignee;
                return matchStatus && matchPriority && matchAssignee;
            });
            //Store filtered tickets in prop sent from tickets page to display it there
            setFilteredTickets(filtered);
        }     
    }, [allTickets, tickets, filters, setFilteredTickets])

    return (
        <div className="w-[60%] h-full flex flex-col md:flex-row justify-start items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 z-[0]">
            {/* Status Filter */}
            <div className="w-auto h-[35%] md:h-full flex justify-center items-center relative">
               <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as TicketStatus | "All" })}
                className="block h-full md:h-[40px] appearance-none w-full bg-white border border-gray-300 text-gray-700 px-4 pr-10 rounded leading-tight focus:outline-none focus:border-black"
                >
                    <option value="All">All Statuses</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 px-2 flex justify-center items-center text-gray-700">
                    <Icon
                    icon={"mynaui:chevron-down-solid"}
                    className="w-[20px] h-[20px] text-gray-700 "
                    />
                </div>
            </div>
            {/* Priority Filter */}
            <div className="w-auto h-[35%] flex justify-center items-center relative">
                <select
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value as TicketPriority | "All" })}
                    className="block h-full md:h-[40px] appearance-none w-full bg-white border border-gray-300 text-gray-700 px-4 pr-10 rounded leading-tight focus:outline-none focus:border-black"
                >
                    <option value="All">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 px-2 flex justify-center items-center text-gray-700">
                    <Icon
                    icon={"mynaui:chevron-down-solid"}
                    className="w-[20px] h-[20px] text-gray-700"
                    />
                </div>
            </div>
            {/* Assignee Filter */}
            <div className="w-auto h-[35%] flex justify-center items-center relative">
                <select
                    value={filters.assignee}
                    onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
                    className="block h-full md:h-[40px] appearance-none w-full bg-white border border-gray-300 text-gray-700 px-4 pr-10 rounded leading-tight focus:outline-none focus:border-black"
                >
                    <option value="All">All Assignees</option>
                    {assignees && assignees.length && assignees.map((assignee) => (
                    <option key={assignee.assigneeEmail} value={assignee.assigneeEmail}>
                        {assignee.assigneeName}
                    </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 px-2 flex justify-center items-center text-gray-700">
                    <Icon
                    icon={"mynaui:chevron-down-solid"}
                    className="w-[20px] h-[20px] text-gray-700"
                    />
                </div>
            </div>
        </div>
    )
}

export default TicketFilter;
