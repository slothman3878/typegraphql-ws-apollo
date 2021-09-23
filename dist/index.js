"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const apollo_server_express_1 = require("apollo-server-express");
const ws_1 = __importDefault(require("ws"));
const ws_2 = require("graphql-ws/lib/use/ws");
const ioredis_1 = __importDefault(require("ioredis"));
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
const path_1 = __importDefault(require("path"));
const hello_resolver_1 = require("./resolvers/hello.resolver");
const message_resolver_1 = require("./resolvers/message.resolver");
const PORT = 5000;
(async () => {
    const app = (0, express_1.default)();
    const server = (0, http_1.createServer)(app);
    const wsServer = new ws_1.default.Server({
        server,
        path: '/graphql',
    });
    const corsOptions = {
        origin: '*',
    };
    app.use((0, cors_1.default)(corsOptions));
    app.get('/', (req, res) => {
        res.send('hello');
    });
    app.get('/graphql', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../graphiql-over-ws.html'));
    });
    const pubSub = new graphql_redis_subscriptions_1.RedisPubSub({
        publisher: new ioredis_1.default(),
        subscriber: new ioredis_1.default(),
    });
    const schema = await (0, type_graphql_1.buildSchema)({
        resolvers: [
            hello_resolver_1.HelloResolver,
            message_resolver_1.MessageResolver,
        ],
        pubSub,
    });
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema,
        plugins: [{
                async serverWillStart() {
                    return {
                        async drainServer() {
                            console.log('draining server');
                            wsServer.close(() => {
                                console.log('websocket server closing');
                            });
                        }
                    };
                }
            }],
        context: ({ req, res }) => ({
            req, res, pubSub,
        })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: corsOptions });
    server.listen(PORT, () => {
        (0, ws_2.useServer)({ schema }, wsServer);
    });
})();
//# sourceMappingURL=index.js.map