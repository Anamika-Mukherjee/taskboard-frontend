//Status Column Component (used in Kanban Board Page)
"use client";
import { TicketDetails } from "@/types/ticketTypes";
import { itemTypes } from "@/utils/constants";
import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";

//Define interface for props
interface StatusColumnProps{
    tickets: TicketDetails[];
    onDropTicket: (id: string)=>void; 
}

const StatusColumn: React.FC<StatusColumnProps> = ({tickets, onDropTicket}) => {
    const ref = useRef(null);
    const [, dropRef] = useDrop(()=>({
        accept: itemTypes.CARD,
        drop: (item: TicketDetails)=> onDropTicket(item._id)
    }));

    dropRef(ref);
    return (
          <div ref={ref} className={`w-[90%] h-[85%] flex flex-col justify-start items-center rounded-[20px] py-[20px] bg-white overflow-y-scroll hide-scrollbar`}>
              <div className="w-full h-auto flex flex-col justify-start items-center space-y-6">
                {tickets.map((ticket)=>(
                      <TaskCard key={ticket._id} ticket={ticket}/>
                ))}
              </div>
          </div>
  )
}

export default StatusColumn;
