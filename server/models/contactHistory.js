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
        },
        updated_at_date: {
            type: String
        },
        updated_at_time: {
            type: String
        }
    },
)

const contactHistoryModel = mongoose.model("ContactHistory", ContactHistorySchema);

export default contactHistoryModel