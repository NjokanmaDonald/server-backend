import express from "express";
import {
  acceptRequest,
  cancelRequest,
  createRequest,
  denyRequest,
  completeRequest,
  getRequest,
  checkExistingRequest,
  checkCompletedRequest,
  getRequests,
  updateRequestStatus
} from "../controllers/request.js";
import Request from "../models/Request.js";

const router = express.Router();

//CREATE
router.post("/", checkExistingRequest, createRequest);

//CHECK COMPLETED REQUESTS
router.post(
  "/check-completed-request",
  checkCompletedRequest,
  async (req, res) => {
    // If this middleware passes, return a success response
    res.status(200).json({ message: "No outstanding payment required." });
  }
);

// REQUEST CANCELED BY CLIENT
router.put("/cancel/:requestId", cancelRequest);

//REQUEST DENIAL
router.put("/deny/:requestid/:clientid", denyRequest);

//REQUEST COMPLETED
router.put("/complete/:requestId", completeRequest);

//REQUEST ACCEPTANCE
router.put("/:requestid/:clientid", acceptRequest);

// routes/requestRoutes.js
router.put('/update-status', updateRequestStatus);

//GET REQUEST
router.get("/:id", getRequest);

//GET requests
router.get("/", getRequests);


export default router;
