import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
    {
        firstName:{
            type: String,
        },
        lastName:{
            type: String,
        },
        email:{
            type: String,
        },
        phoneNumber:{
            type: String,
        }
    },
    {
        timestamps: true,
    }
)

const contactModel = mongoose.model("Contact", ContactSchema);

export default contactModel