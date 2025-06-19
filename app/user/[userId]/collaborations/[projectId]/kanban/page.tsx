//Kanban Board Page for Collaborations
"use client";
import KanbanBoard from "@/components/User/Kanban/KanbanBoard";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const page = () => {
  return (
     <DndProvider backend={HTML5Backend}>
          <KanbanBoard />
       </DndProvider>
  )
}

export default page;
