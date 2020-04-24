import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import 'dotenv/config';
import cors from 'cors';

const app = express();

app.use(cors());

const schema = gql`
    type Query {
        me: User
        users: [User!]
        user(id: ID!): User
    }
    type User {
        id: ID!
        username: String!
    }
`;

let users = {
    1: {
        id: '1',
        firstname: 'Mathias',
        lastname: 'Bergqvist',
    },
    2: {
        id: '2',
        username: 'Dave Davids',
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
    },
    User: {
        username: (user) => `${user.firstname} ${user.lastname}`,
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
