"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
const queueName = "jobs";
const consume = async () => {
    try {
        const connection = await amqplib_1.default.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        const result = await channel.assertQueue(queueName);
        channel.consume(queueName, (message) => {
            const content = message === null || message === void 0 ? void 0 : message.content.toString();
            const contentJson = content ? JSON.parse(content) : "{}";
            console.log(`Received message: ${contentJson.number}`);
            if (contentJson.number === "21" && message) {
                channel.ack(message);
            }
        });
        console.log("Waiting for jobs...");
    }
    catch (e) {
        console.log("Something bad happened", e);
    }
};
consume();
