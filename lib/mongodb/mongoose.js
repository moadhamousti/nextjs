import mongoose from 'mongoose';

let isConnected = false // Check Connection status

export const connectToDB = async () =>{
    mongoose.set('strickQuery', true)

    if (isConnected) {
        console.log("MongoDB is already connected")
        return
    }

    try{
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "eWaCommunity",
            useNewUrlParser:true,
            useUnifiedTopology: true,
        })

        isConnected = true

        console.log("MongoDB is connected")
    } catch (error) {
        console.log(error)
    }
};

// ezoZYgpCJE3pWlW5

// mongodb+srv://eWaCommunity:ezoZYgpCJE3pWlW5@cluster0.upun9ff.mongodb.net/?retryWrites=true&w=majority