import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { EventsCollection } from "../db.ts";

export const Mutation = {
  createEvent: async (
    _: any,
    args: {
      title: string;
      description: string;
      date: Date;
      startHour: number;
      endHour: number;
      priority: number
    }
  ) => {
    const { title, description, date, startHour, endHour, priority } = args;
    // check if there is a Event already in that date and time

    const event = await EventsCollection.findOne({
      date: new Date(date),
      $or: [
        { startHour: { $gte: startHour, $lte: endHour } },
        { endHour: { $gte: startHour, $lte: endHour } },
      ],
    });

    if (event) {
      throw new Error("There is already an event in that date and time");
    }

    if(priority < 1 || priority > 3){
      throw new Error("Priority must be between 1 and 3");
    }

    const id = await EventsCollection.insertOne({
      title,
      description,
      date: new Date(date),
      startHour,
      endHour,
      priority
    });

    return {
      id: id.toString(),
      title,
      description,
      date: new Date(date),
      startHour,
      endHour,
      priority
    };
  },

  updateEvent: async (
    _: any,
    args: {
      id: string;
      title: string;
      description: string;
      date: Date;
      startHour: number;
      endHour: number
    }
  ) => {
    const { id, title, description, date, startHour, endHour } = args;
    // check if event exists
    const event = await EventsCollection.findOne({ _id: new ObjectId(id) });
    // if not exists 404
    if (!event) {
      throw new Error("Event not found");
    }

    // check if there is a Event already in that date and time
    const eventInSameDate = await EventsCollection.findOne({
      date: new Date(date),
      $or: [
        { startHour: { $gte: startHour, $lte: endHour } },
        { endHour: { $gte: startHour, $lte: endHour } },
      ],
    });

    if (eventInSameDate && eventInSameDate._id.toString() !== id) {
      throw new Error("There is already an event in that date and time");
    }

    // update event
    await EventsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          description,
          date: new Date(date),
          startHour,
          endHour,
        },
      }
    );

    return {
      id,
      title,
      description,
      date: new Date(date),
      startHour,
      endHour,
    };
  },

  deleteEvent: async (_: any, args: { id: string }) => {
    // check if event exists
    const event = await EventsCollection.findOne({
      _id: new ObjectId(args.id),
    });
    // if not exists 404
    if (!event) {
      throw new Error("Event not found");
    }
    // delete event
    await EventsCollection.deleteOne({ _id: new ObjectId(args.id) });

    return {
      id: args.id,
      title: event.title,
      description: event.description,
      date: event.date,
      startHour: event.startHour,
      endHour: event.endHour,
    };
  },

  toggleEvent: async (_: any, args: { id: string }) => {

    // check if event exists
    const event = await EventsCollection.findOne({
      _id: new ObjectId(args.id),
    });
    // if not exists 404
    if (!event) {
      throw new Error("Event not found");
    }
    // toggle event
    await EventsCollection.updateOne(
      { _id: new ObjectId(args.id) },
      {
        $set: {
          priority: event.priority === 1 ? 2 : 1,
        },
      }
    );

    return {
      id: args.id,
      title: event.title,
      description: event.description,
      date: event.date,
      startHour: event.startHour,
      endHour: event.endHour,
      priority: event.priority === 1 ? 2 : 1,
    };
  }

};
