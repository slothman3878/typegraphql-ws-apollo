import { 
  Resolver, 
  Subscription, 
  Mutation, 
  PubSub, 
  Arg, 
  Root,
  ObjectType,
  Field,
} from 'type-graphql';
import {PubSubEngine} from 'graphql-subscriptions';

@ObjectType()
class MessagePayload {
  @Field()
  message: string
}

@Resolver()
export class MessageResolver {
  @Mutation(() => String)
  async sendMessage(
    @Arg('message') message: string,
    @PubSub() pubSub: PubSubEngine
  ): Promise<string> {
    await pubSub.publish('MESSAGE_NOTIFICATION', { message })
    return message;
  }

  @Subscription(()=>MessagePayload, {
    topics: 'MESSAGE_NOTIFICATION',
  })
  async receiveMessage(
    @Root() root: MessagePayload
  ): Promise<MessagePayload> {
    return root;
  }
}