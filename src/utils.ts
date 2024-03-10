import { logs } from "./db/schema";

export function getDuration(log: typeof logs.$inferSelect) {
  if (!log.end || !log.start) {
    return "In Progress";
  }

  const sec_durations = (log.end.valueOf() - log.start.valueOf()) / 1000;

  if (sec_durations < 60) {
    return `${sec_durations.toFixed(2)} sec.`;
  } else if (sec_durations < 3600) {
    return `${(sec_durations / 60).toFixed(2)} min.`;
  } else {
    return `${(sec_durations / 3600).toFixed(2)} hr.`;
  }
}
