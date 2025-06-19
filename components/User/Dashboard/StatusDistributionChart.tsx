//Status Distribution Chart Component (used in User Dashboard Page)
import React from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  PieLabelRenderProps,
  Legend,
} from "recharts";
import type { ComponentProps } from "react";
import { DefaultLegendContent } from "recharts/types/component/DefaultLegendContent";
import { ProjectDetails } from "@/types/projectTypes";
import { StatusDistribution } from "@/types/chartTypes";

//Define type for Pie Chart Legend
type CustomLegendProps = ComponentProps<typeof DefaultLegendContent>;

//Define interface for props
interface StatusDistributionChartProps{
  projects: ProjectDetails[];
}

//Define colors for Pie Chart
const COLORS = ["#2b7fff", "#efb100", "#00c951", "#88089c", "#fb2c36"];

const RADIAN = Math.PI / 180;

//Customized Labels for Pie Chart
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}: PieLabelRenderProps) => {

      const innerRadiusValue = Number(innerRadius);
      const outerRadiusValue = Number(outerRadius);
      const cxValue = Number(cx);
      const cyValue = Number(cy);
      const percentValue = Number(percent);

      const radius = innerRadiusValue + (outerRadiusValue - innerRadiusValue) * 0.5;
      const x = cxValue + radius * Math.cos(-midAngle * RADIAN);
      const y = cyValue + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cxValue ? "start" : "end"}
          dominantBaseline="central"
          fontSize="0.85rem"
        >
          {`${(percentValue * 100).toFixed(0)}%`}
        </text>
      );
};

//Customized legend for Pie Chart
const renderCustomLegend = (props: CustomLegendProps) => {
  const { payload } = props;

  return (
    <ul className="flex flex-wrap gap-4 mt-4 text-sm justify-center">
      {payload &&
        payload.map((entry, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}</span>
          </li>
        ))}
    </ul>
  );
};

//Categorize projects based on project status
const statusData = (projects: ProjectDetails[]): StatusDistribution[] => {
  const typeMap: Record<string, StatusDistribution> = {
    "Not Started": { name: "Not Started", totalProjects: 0 },
    "In Progress": { name: "In Progress", totalProjects: 0 },
    "Completed": { name: "Completed", totalProjects: 0 },
    "On Hold": { name: "On Hold", totalProjects: 0 },
    "Cancelled": { name: "Cancelled", totalProjects: 0 },
  };

  projects.forEach(project => {
    if (typeMap[project.status]) {
      typeMap[project.status].totalProjects++;
    }
  });

  return Object.values(typeMap);
};

const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({projects}) => {
  
  //Get project status data from statusData function
  const statusDistributionData = statusData(projects);

  return (
        <div className="w-full h-full flex flex-col justify-start items-start p-[20px] rounded-[10px] border border-gray-300">
            {/* Heading */}
            <div className="w-full h-[45px] flex justify-start items-center">
                <p>Project Status Distribution</p>
            </div>
            {/* Status Distribution Chart */}
            <div className="w-full h-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart width={400} height={200} margin={{top: 20, bottom: 20}}>
                  <Pie
                    data={statusDistributionData}
                    dataKey="totalProjects"
                    name="Total Projects"
                    outerRadius={90}
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {statusDistributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Legend content={renderCustomLegend} align="center"/>
                </PieChart>
              </ResponsiveContainer>
            </div>
        </div>
  );
};

export default StatusDistributionChart;

