import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import 'dotenv/config';

const app = express();

const schema = gql`
    type Query {
        me: User
    }
    type User {
        username: String!
    }
`;

const resolvers = {
    Query: {
        me: () => {
            return {
                username: 'Robin Wieruch',
            };
        },
    },
};

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
    console.log('🚀Apollo Server running on http://localhost:8000/graphql');
});
