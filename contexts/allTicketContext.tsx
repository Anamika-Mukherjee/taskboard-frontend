//Context to store updated tickets list when a ticket is created or deleted
"use client";
import { TicketDetails } from "@/types/ticketTypes";
import {createContext, useContext, useState} from "react";

interface AllTicketContext{
    allTickets: TicketDetails[];
    setAllTickets: (allTickets: TicketDetails[])=>void;
}

export const allTicketContext = createContext<AllTicketContext | null>(null);

export const useAllTicketContext = ()=>{
      const context = useContext(allTicketContext);

      if(!context){
        throw new Error("useAllTicketContext can only be used within AllTicketProvider");
      }

      return context;
}

export const AllTicketProvider = ({children}: {children: React.ReactNode})=>{
    const [allTickets, setAllTickets] = useState<TicketDetails[]>([]);

    return(
        <allTicketContext.Provider value={{allTickets, setAllTickets}}>
            {children}
        </allTicketContext.Provider>
    )
}
