import express from "express";
const router = express.Router(); 

import controller from "../controllers/contact.js";

router.post("/", controller.addContact);
router.get("/", controller.viewContacts);
router.get("/:_id", controller.viewOneContact);
router.put("/:_id", controller.updateContact);
router.delete("/:_id", controller.deleteContact);


export default router;