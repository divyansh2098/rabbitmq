const amqplib = require("amqplib")

const queueName = "jobs"
const messageJSON = { number: process.argv[2] }

const produce = async () => {
    try {
        const connection = await amqplib.connect("amqp://localhost:5672")
        const channel = await connection.createChannel()
        await channel.assertQueue(queueName)
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(messageJSON)))
        console.log(`Job Sent Successfully ${messageJSON.number}`)
        await channel.close()
        await connection.close()
    } catch (e) {
        console.error("Something bad happened", e)
    }
}

produce()