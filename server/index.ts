import express from 'express';
import {Server, createServer} from 'http';
import cors from 'cors';
import { GraphQLSchema } from 'graphql';
import "reflect-metadata";
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import ws from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import Redis from 'ioredis';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import path from 'path';

import { HelloResolver } from './resolvers/hello.resolver';
import { MessageResolver } from './resolvers/message.resolver';

const PORT = 5000;

(async ()=>{
  const app = express();
  const server = createServer(app);
  const wsServer = new ws.Server({
    server,
    path: '/graphql',
  })
  const corsOptions = {
    origin: '*', //for now at least, for testing purposes,
    // credentials: true,
  }
  app.use(cors(corsOptions));

  app.get('/', (req,res)=>{
    res.send('hello');
  })

  app.get('/graphql', (req,res)=>{
    res.sendFile(path.join(__dirname, '../graphiql-over-ws.html'));
  })

  const pubSub = new RedisPubSub({
    publisher: new Redis(),
    subscriber: new Redis(),
  })

  const schema = await buildSchema({
    resolvers: [
      HelloResolver,
      MessageResolver,
    ],
    pubSub,
  })

  const apolloServer = new ApolloServer({ 
    schema,
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            console.log('draining server');
            wsServer.close(()=>{
              console.log('websocket server closing')
            });
          }
        };
      }
    }],
    context: ({req, res})=>({
      req, res, pubSub,
    })
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: corsOptions });

  server.listen(PORT, () => {
    useServer({ schema }, wsServer);
  });
})()