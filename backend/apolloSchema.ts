export const typeDefs = `
  scalar Date
  
  type Event {
    id: ID!
    title: String!
    description: String!
    date: Date!
    startHour: Int!
    endHour: Int!
    priority: Int!
  }

  type Query {
    events: [Event!]!
    eventsByPriority(priority : Int!): [Event!]!
    eventsBytitle(title : String!): [Event!]!
    eventsByTitleAndPriority(title : String!, priority : Int!): [Event!]!
    eventsByDate(date : Date!): [Event!]!
    event (id : ID!): Event!


  }

  type Mutation {
    createEvent(
      title: String!
      description: String!
      date: Date!
      startHour: Int!
      endHour: Int!
      priority: Int!
    ): Event!

    updateEvent(
      id: ID!
      title: String!
      description: String!
      date: Date!
      startHour: Int!
      endHour: Int!
    ): Event!

    deleteEvent(id: ID!): Event!
    
    toggleEvent(id: ID!): Event!





  }
`;
