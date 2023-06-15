import { EventsCollection } from "../db.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";

export const Query = {
  events: async () => {
    return (
      await EventsCollection.find({
        date: { $gte: new Date() },
      })
        .sort({ date: 1, startHour: 1 })
        .toArray()
    ).map((event: any) => {
      event.id = event._id.toString();
      delete event._id;
      console.log(event);
      return { ...event };
    });
  },
  eventsByPriority: async (_: any, args: { priority: number }) => {
    return (
      await EventsCollection.find({
        priority: args.priority,
        date: { $gte: new Date() },
      })
        .sort({ date: 1, startHour: 1 })
        .toArray()
    ).map((event: any) => {
      event.id = event._id.toString();
      delete event._id;
      return { ...event };
    });
  },
};
