//Top Projects Chart Component (used in User Dashboard Page)
import { useIsMobile } from "@/hooks/useIsMobile";
import { TopProjectChart } from "@/types/chartTypes";
import { ProjectDetails } from "@/types/projectTypes";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

//Define interface for props
interface TopProjectsChartProps{
    projects: ProjectDetails[];
}

//Function to obtain top 5 projects based on completion percentage
const getTopProjects = (projects: ProjectDetails[])=>{
  
  //Declare array to store chart data
  const completionData: TopProjectChart[] = []; 

  if(projects.length>0){
      // Map through all projects
      projects.map((project)=>{

          let completedTasksCount = 0;

          // Get ticket count for completed tickets if tickets available
          if(project.tickets.length>0){
              project.tickets.map((ticket)=>
              ticket.ticketStatus === "Done" && completedTasksCount++
          );

          // Calculate completion percentage from completed tickets out of all tickets
          const percentage = (completedTasksCount/project.tickets.length*100).toFixed(2);
          const percentNumber = parseFloat(percentage);

          //Store project name and completion percentage in declared array
          completionData.push({
              projectName: project.projectName,
              completionPercentage: percentNumber,
          })    
        }
        else{
          // Enter completion percentage as 0 if ticket not available
          completionData.push({
              projectName: project.projectName,
              completionPercentage: 0,
          })
        }   
    });

    //Sort Completed Projects Data from maximum to minimum percentage and extract top 5 projects
    const topProjects = completionData
                        .sort((project1, project2)=>project2.completionPercentage -project1.completionPercentage)
                        .slice(0, 5);
    return topProjects;
  }
  // If projects not available, return empty array
  return completionData;
}

const TopProjectsChart: React.FC<TopProjectsChartProps> = ({projects}) => {
    const isMobile = useIsMobile();
    // Get top 5 project data
    const topProjects: TopProjectChart[] = getTopProjects(projects);

    return (
        <div className="w-full h-full flex flex-col justify-start items-start space-y-6 border border-gray-300 rounded-[10px] p-[20px]">
            {/* Heading */}
            <div className="w-full h-[45px] flex justify-start items-center">
              <p>Top 5 Projects</p>
            </div>
      
            {/* Top 5 Projects Chart */}
            <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topProjects}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 10,
                      bottom: 10,
                    }}
                    layout="horizontal"
                  >
                    <XAxis
                      dataKey="projectName"
                      tick={{ fontSize: "0.8rem" }}
                      interval={isMobile ? 0 : "preserveEnd"}
                      angle={isMobile ? -30 : 0}
                      height={isMobile ? 60 : 40}
                      tickMargin={isMobile ? 10 : 5}
                      tickFormatter={(value) =>
                        value.length > 10 ? `${value.substring(0, 10)}...` : value
                      }
                    />
                    <YAxis tick={{ fontSize: "0.8rem" }} width={40} />
                    <Tooltip
                      cursor={{ fill: "#88089c10" }}
                      contentStyle={{
                        fontSize: "0.9rem",
                        padding: "5px 8px",
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        fontSize: "0.7rem",
                        paddingTop: "5px",

                      }}
                    />
                    <Bar
                      dataKey={"completionPercentage"}
                      name={"Completion Percentage"}
                      fill={"#88089c9f"}
                      barSize={20}
                      radius={[3, 3, 0, 0]}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default TopProjectsChart;
