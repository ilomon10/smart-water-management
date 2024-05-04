import React from "react";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as _ from "lodash";

import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { useRecordsPageContext } from "./Context";
import { Database } from "@/utils/supabase/database.types";

export const Details: React.FC = () => {
  const { selected } = useRecordsPageContext();
  const record = (selected ||
    {}) as Database["public"]["Tables"]["records"]["Row"];

  let children = (
    <>
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            <div>
              Overview
              <Badge variant={"outline"} className="ml-2">
                {record.id?.substring(0, 5)}
              </Badge>
            </div>
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy Order ID</span>
            </Button>
          </CardTitle>
          <CardDescription>
            Date: {moment(record.created_at).format("LLL")}
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <span className="bg-green-500 w-2 h-2 rounded-full"></span>
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              Online
            </span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Details</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Energy Consume</span>
              <span>{record.watt}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Water Level</span>
              <span>{record.level}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Water Consump</span>
              <span>{record.flow}</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated{" "}
          <time dateTime="2023-11-23">
            {moment(record.created_at).format("LL")}
          </time>
        </div>
      </CardFooter>
    </>
  );

  if (!selected)
    children = (
      <CardContent
        className="p-6 text-sm flex items-center justify-center"
        style={{
          height: 306,
        }}
      >
        Please select a data record
      </CardContent>
    );

  return (
    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
      {children}
    </Card>
  );
};
