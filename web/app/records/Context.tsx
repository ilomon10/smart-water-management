"use client";

import React from "react";
import moment from "moment";
import * as _ from "lodash";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { aggregateBy } from "./aggregateData";
import { Database } from "@/utils/supabase/database.types";

function map(
  x: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
): number {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

const calculateVolume = (currentHeight: number, diameter: number) =>
  Math.PI * diameter * map(currentHeight, 80, 0, 0, 80);

interface RecordsPageContextValue {
  selected: any | null;
  setSelected: (data: any) => void;
  filter: any | null;
  setFilter: (data: any) => void;
  by: "live" | "hour" | "day" | "month";
  setBy: (by: "live" | "hour" | "day" | "month") => void;

  records: {
    id: string;
    data: Database["public"]["Tables"]["records"]["Row"];
    date: string;
  }[];
}

const RecordsPageContext = React.createContext<RecordsPageContextValue>(
  null as any
);

export const RecordsPageProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [filter, setFilter] = React.useState({
    gt: moment().startOf("day").toISOString(),
    lt: moment().endOf("day").toISOString(),
  });
  const [selected, setSelected] = React.useState(null);
  const [by, setBy] = React.useState<RecordsPageContextValue["by"]>("hour");

  const [liveData, setLiveData] = React.useState<
    {
      id: string;
      data: any;
      date: string;
    }[]
  >([]);

  const supabase = createClient();

  let { data, isLoading } = useQuery({
    queryKey: ["records", filter.gt, filter.lt],
    queryFn: async () => {
      const result = await supabase
        .from("records")
        .select("*")
        .lt("created_at", filter.lt)
        .gt("created_at", filter.gt);
      return result.data;
    },
  });

  React.useEffect(() => {
    const channel = supabase
      .channel("realtime records")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "records",
        },
        (payload) => {
          console.log("RECEIVED", payload);
          setLiveData((ld) => {
            return [
              ...ld,
              {
                id: payload.new.id,
                data: payload.new,
                date: moment(payload.new.created_at).toISOString(),
              },
            ];
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const records = aggregateBy(by, data || [], (key, entries, date) => ({
    id: key,
    watt: _.chain(entries).meanBy("watt").round(2).value().toFixed(2),
    level: _.chain(entries).meanBy("level").round(2).value().toFixed(2),
    flow: _.chain(entries).meanBy("flow").round(2).value().toFixed(2),
    created_at: date,
  }));

  return (
    <RecordsPageContext.Provider
      value={{
        by,
        setBy,

        filter,
        setFilter,
        selected,
        setSelected: (data) => {
          setSelected((s: any) => {
            if (!data) return null;
            return data.id === s?.id ? null : data;
          });
        },

        records: by === "live" ? liveData : records,
      }}
    >
      {children}
    </RecordsPageContext.Provider>
  );
};

export const useRecordsPageContext = () => {
  return React.useContext(RecordsPageContext);
};
