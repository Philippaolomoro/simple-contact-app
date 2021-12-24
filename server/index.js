import app from "./server.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const port = process.env.PORT || 8000
let database = process.env.MONGO_URI



export default function index(){

    if (process.env.NODE_ENV === "test") {
        database = process.env.MONGO_URI_TEST;
    }

    mongoose.connect(
        database, 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
    ).catch(err => {
        console.error(err.stack)
        process.exit(1)
    }).then(async client => {
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })
}

index()