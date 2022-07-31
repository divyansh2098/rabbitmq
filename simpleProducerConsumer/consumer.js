const amqp = require("amqplib")
const queueName = "jobs"

const consume = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost:5672")
        const channel = await connection.createChannel()
        const result = await channel.assertQueue(queueName)
        channel.consume(queueName, (message) => {
            const content = message.content.toString()
            const contentJson = JSON.parse(content)
            console.log(`Received message: ${contentJson.number}`)
            if(contentJson.number === "21") {
                channel.ack(message)
            }
        })
        console.log("Waiting for jobs...")
    } catch (e) {
        console.log("Something bad happened", e)
    }
}

consume()