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
  eventsBytitle: async (_: any, args: { title: string }) => {
    return (
      await EventsCollection.find({
        title: args.title,
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
  eventsByTitleAndPriority: async (
    _: any,
    args: { title: string; priority: number },
  ) => {
    return (
      await EventsCollection.find({
        title: args.title,
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
  }
  ,
  eventsByDate: async (_: any, args: { date: Date }) => {
    return (
      await EventsCollection.find({
        date: { $gte: new Date(args.date) },
      })
        .sort({ date: 1, startHour: 1 })
        .toArray()
    ).map((event: any) => {
      event.id = event._id.toString();
      delete event._id;
      return { ...event };
    });
  }
  ,
  event: async (_: any, args: { id: string }) => {
    const event = await EventsCollection.findOne({
      _id: new ObjectId(args.id),
    });
    event.id = event._id.toString();
    delete event._id;
    return { ...event };
  }
};
