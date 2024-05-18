import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { createClient } from "@/utils/supabase/client";
import moment from "moment";
import { cn } from "@/lib/utils";
import { useRecordsPageContext } from "./Context";
import { link } from "fs";

const DATE_FORMAT = {
  live: "lll",
  hour: "lll",
  day: "ll",
  month: "MMM YYYY",
};

export const RecordsTable: React.FC = () => {
  const { records, selected, setSelected, by } = useRecordsPageContext();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="py-2">
            <div>Timeline</div>
          </TableHead>
          <TableHead className="hidden sm:table-cell py-2">
            <div>Energy Consump</div>
          </TableHead>
          <TableHead className="hidden sm:table-cell py-2">
            <div>Water Level</div>
          </TableHead>
          <TableHead className="hidden md:table-cell py-2">
            <div>Water Consump</div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records &&
          records.map(({ id, data, date }) => (
            <TableRow
              key={date}
              className={cn(
                "cursor-pointer",
                selected && selected.id === id ? "bg-accent" : ""
              )}
              onClick={() => {
                setSelected(data);
              }}
            >
              <TableCell>
                <div>{moment(date).format((DATE_FORMAT as any)[by])}</div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {data.watt} W
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {data.level} cm
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {data.flow} ℓ
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
