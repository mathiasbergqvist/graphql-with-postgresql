import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import 'dotenv/config';
import cors from 'cors';
import uuidv4 from 'uuid/v4';

const app = express();

app.use(cors());

const schema = gql`
    type Query {
        me: User
        users: [User!]
        user(id: ID!): User
        messages: [Message!]!
        message(id: ID!): Message!
    }
    type Mutation {
        createMessage(text: String!): Message!
        deleteMessage(id: ID!): Boolean!
    }
    type User {
        id: ID!
        username: String!
        messages: [Message!]
    }
    type Message {
        id: ID!
        text: String!
        user: User!
    }
`;

let users = {
    1: {
        id: '1',
        firstname: 'Mathias',
        lastname: 'Bergqvist',
        messageIds: [1],
    },
    2: {
        id: '2',
        firstname: 'Ziggy',
        lastname: 'Stardust',
        messageIds: [1],
    },
};

let messages = {
    1: {
        id: '1',
        text: 'Hello World',
        userId: '1',
    },
    2: {
        id: '2',
        text: 'By World',
        userId: '2',
    },
};

const resolvers = {
    Query: {
        me: (parent, args, { me }) => {
            return me;
        },
        users: () => {
            return Object.values(users);
        },
        user: (parent, { id }) => {
            return users[id];
        },
        messages: () => {
            return Object.values(messages);
        },
        message: (parent, { id }) => {
            return messages[id];
        },
    },
    Mutation: {
        createMessage: (parent, { text }, { me }) => {
            const id = uuidv4();

            const message = {
                id,
                text,
                userId: me.id,
            };

            messages[id] = message;
            users[me.id].messageIds.push(id);

            return message;
        },
        deleteMessage: (parent, { id }) => {
            const { [id]: message, ...otherMessages } = messages;
            if (!message) {
                return false;
            }
            messages = otherMessages;
            return true;
        },
    },
    User: {
        messages: (user) => {
            return Object.values(messages).filter((message) => message.userId === user.id);
        },
    },
    Message: {
        user: (message) => {
            return users[message.userId];
        },
    },
};

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
        me: users[1],
    },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
    console.log('🚀Apollo Server running on http://localhost:8000/graphql');
});
