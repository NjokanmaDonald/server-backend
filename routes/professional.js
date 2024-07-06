import express from "express";
import { deleteProfessional, getProfessional, getProfessionals, updateProfessional, updateLocation, getNearbyProfessionals, rateProfessional } from "../controllers/professional.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

//UPDATE
router.put("/:id", updateProfessional);

//UPDATE LOCATION
router.post('/update-location', updateLocation);

//RATE PROFESSIONAL
router.post("/:id/rate", rateProfessional)

//DELETE
router.delete("/:id", deleteProfessional);

//Get nearby professionals
router.get('/nearby', getNearbyProfessionals);

//GET
router.get("/:id", getProfessional);

//GET ALL
router.get("/", getProfessionals);

export default router