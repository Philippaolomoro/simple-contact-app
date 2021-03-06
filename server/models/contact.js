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
        },
        history: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "ContactHistory"
        }]
    },
    {
        timestamps: true,
    }
)

const contactModel = mongoose.model("Contact", ContactSchema);

export default contactModel