const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://mohdsithik0786:mohdsithik0786@cluster.f3fo9qq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster", {
        dbName: "Test",
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })  
    .catch(err => console.log(err.message))

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db')
})

mongoose.connection.on('error', (err) => {
    console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected.')
})

process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
})
