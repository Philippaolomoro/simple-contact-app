import mongoose from "mongoose";

const ContactHistorySchema = new mongoose.Schema(
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
        contactId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contact"
        }
    }
)

const contactHistoryModel = mongoose.model("ContactHistory", ContactHistorySchema);

export default contactHistoryModel