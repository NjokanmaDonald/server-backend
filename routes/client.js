import express from "express";
import { deleteClient, getClient, getClients, updateClient } from "../controllers/client.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

//UPDATE
router.put("/:id", updateClient);

//DELETE
router.delete("/:id", deleteClient);

//GET
router.get("/:id", getClient);

//GET ALL
router.get("", getClients);

export default router