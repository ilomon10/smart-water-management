import * as _ from "lodash";
import moment from "moment";

type BaseRecord = {
  id: string;
  created_at: string;
};

// Function to aggregate data by hour
export function aggregateBy<TData extends BaseRecord>(
  by: "hour" | "day" | "month",
  data: TData[],
  mapValues: (key: string, entry: TData[], date: string) => any
) {
  return _.chain(data)
    .groupBy((entry) => moment(entry.created_at).startOf(by).toISOString())
    .map((entries) => ({
      id: `${by.substring(0,1)}_${entries[0].id}`,
      data: mapValues(
        `${by.substring(0,1)}_${entries[0].id}`,
        entries,
        moment(entries[0].created_at).startOf(by).toISOString()
      ),
      date: moment(entries[0].created_at).startOf(by).toISOString(),
    }))
    .value();
}
