"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageResolver = void 0;
const type_graphql_1 = require("type-graphql");
const graphql_subscriptions_1 = require("graphql-subscriptions");
let MessagePayload = class MessagePayload {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], MessagePayload.prototype, "message", void 0);
MessagePayload = __decorate([
    (0, type_graphql_1.ObjectType)()
], MessagePayload);
let MessageResolver = class MessageResolver {
    async sendMessage(message, pubSub) {
        await pubSub.publish('MESSAGE_NOTIFICATION', { message });
        return message;
    }
    async receiveMessage(root) {
        return root;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('message')),
    __param(1, (0, type_graphql_1.PubSub)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, graphql_subscriptions_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "sendMessage", null);
__decorate([
    (0, type_graphql_1.Subscription)(() => MessagePayload, {
        topics: 'MESSAGE_NOTIFICATION',
    }),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MessagePayload]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "receiveMessage", null);
MessageResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], MessageResolver);
exports.MessageResolver = MessageResolver;
//# sourceMappingURL=message.resolver.js.map