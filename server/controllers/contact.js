import Contact from "../models/contact.js";
import ContactHistory from "../models/contactHistory.js";

const controller = {
    addContact: async(req, res) => {
        try {
            const {firstName, lastName, email, phoneNumber} = req.body
            const contact = await Contact.findOne({email: req.body.email})
            if(!contact){
                const newContact = await new Contact({firstName, lastName, email, phoneNumber})

                const time = new Date(Date.now()).toLocaleTimeString('en', {
                    timeStyle: 'short',
                    hour12: false,
                    timeZone: 'UTC',
                });

                const date = new Date().toISOString().slice(0,10);

                const history = new ContactHistory({
                    contactId: newContact._id,
                    firstName: newContact.firstName,
                    lastName: newContact.lastName,
                    email: newContact.email,
                    phoneNumber: newContact.phoneNumber,
                    updated_at_date: date,
                    updated_at_time: time
                })

                history.save()
                newContact.history.push(history._id)

                await newContact.save(err => {
                    if(err){
                        return res.status(400).json({error: err.message, message: "Could not be created"})
                    } 
                    
                    return res.status(200).json({
                        data: newContact,
                        message: "Contact created successfully"
                    })
                })                     
            } else {
                res.status(403).json({error: "Email is already in use"})
            }
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: "Internal server error, please try again"
            })
        }
    },

    viewContacts: async(req, res) => {
        try {
            const contacts = await Contact.find({}).populate("history").lean()

            return res.status(200).json({
                message: "Contacts gotten successfully",
                contacts
            })
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: "Internal server error, please try again"
            })
        }
    },

    viewOneContact: async(req, res) => {
        try {
            const contact = await Contact.findById({_id: req.params._id});
            if(!contact){
                res.status(404).json({error: "Contact cannot be found"})
            } else {
                return res.status(200).json({
                    contact,
                    message: "Contact gotten successfully"
                })
            }
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: "Internal server error, please try again"
            })
        }
    },

    updateContact: async(req, res) => {
        try {

            const time = new Date(Date.now()).toLocaleTimeString('en', {
                timeStyle: 'short',
                hour12: false,
                timeZone: 'GMT',
            });

            const date = new Date().toISOString().slice(0,10);

            let recordToUpdate = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber
            }

            const updatedContact = await Contact.findByIdAndUpdate(
                req.params._id,
                {
                    $set: recordToUpdate,
                },
                {new: true}
            )

            if(updatedContact){
                const history = new ContactHistory({
                    contactId: updatedContact._id,
                    firstName: updatedContact.firstName,
                    lastName: updatedContact.lastName,
                    email: updatedContact.email,
                    phoneNumber: updatedContact.phoneNumber,
                    updated_at_date: date,
                    updated_at_time: time
                })
                history.save()
                updatedContact.history.push(history._id)
                updatedContact.save()
            }

            
            return res.status(200).json({ message: "Contact updated successfully"})
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: "Internal server error, please try again"
            })
        }
    },

    deleteContact: async(req, res) => {
        try {
            const contact = await Contact.deleteOne({_id: req.params._id});
            if (contact) {
                const history = await ContactHistory.deleteMany({contactId: req.params._id})
                return res.status(200).json({message: "Contact deleted successfully"});
            }
            
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: "Internal server error, please try again"
            })
        }
    },

    getContactHistory: async(req, res) => {
        try {
            const history = await ContactHistory.find({contactId: req.params.contactId}).lean()
            return res.status(200).json({message: "Client history gotten successfully", history})
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: "Internal server error, please try again"
            })
        }
    }
}

export default controller;