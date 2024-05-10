import { Database } from "@/utils/supabase/database.types";
import React from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { useRecordsPageContext } from "./Context";

export const Chart: React.FC = () => {
  const { records } = useRecordsPageContext();
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart
        data={records}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-green-500">
                        Energy Consump
                      </span>
                      <span className="font-bold">
                        {payload[0].value}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-blue-500">
                        Water Level
                      </span>
                      <span className="font-bold">{payload[1].value}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-lime-500">
                        Water Flow
                      </span>
                      <span className="font-bold">{payload[2].value}</span>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          }}
        />
        <Line
          type="monotone"
          strokeWidth={2}
          dataKey="data.watt"
          activeDot={{
            r: 6,
            style: { fill: "#22c55e" },
          }}
          style={
            {
              stroke: "#22c55e",
            } as React.CSSProperties
          }
        />
        <Line
          type="monotone"
          dataKey="data.level"
          strokeWidth={2}
          activeDot={{
            r: 8,
            style: { fill: "#0ea5e9" },
          }}
          style={
            {
              stroke: "#0ea5e9",
            } as React.CSSProperties
          }
        />
        <Line
          type="monotone"
          dataKey="data.flow"
          strokeWidth={2}
          activeDot={{
            r: 8,
            style: { fill: "#84cc16" },
          }}
          style={
            {
              stroke: "#84cc16",
            } as React.CSSProperties
          }
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
