import Request from "../models/Request.js";
import Professional from "../models/Professional.js";
import Client from "../models/Client.js";
import { createError } from "../utils/error.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "njokanmadon@gmail.com",
    pass: "ukyw ixfi csah smty",
  },
  secureConnection: "false",
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});

// Middleware to check if there is an existing pending request from the same client to the same service provider
export const checkExistingRequest = async (req, res, next) => {
  const { clientId, professionalId } = req.body;

  try {
    const existingRequest = await Request.findOne({
      clientId: clientId,
      professionalId: professionalId,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({
          message:
            "You already have a pending request to this service provider.",
        });
    }

    next();
  } catch (error) {
    console.error("Error checking existing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const checkCompletedRequest = async (req, res, next) => {
  const { clientId } = req.body;

  try {
    const completedRequest = await Request.findOne({
      clientId: clientId,
      status: { $in: ["completed"] }
    });

    if (completedRequest) {
      return res
        .status(400)
        .json({ message: "You have an outstanding payment to be made", requestId: completedRequest._id });
    }

    next();
  } catch (error) {
    console.error("Error checking completed request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const createRequest = async (req, res) => {
  try {
    // Create a new request
    const newRequest = new Request({
      clientId: req.body.clientId,
      client: req.body.client,
      professionalId: req.body.professionalId,
      professional: req.body.professional,
      status: "pending",
    });

    const savedRequest = await newRequest.save();

    res.status(201).json(savedRequest);
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getRequests = async (req, res) => {
  const { clientId, professionalId, status } = req.query;
  let query = {};

  // Check if professionalId is provided
  if (professionalId) {
    query.professionalId = professionalId;
  } else if (clientId) {
    query.clientId = clientId;
  } else {
    // If professionalId is not provided, return an error
    return res
      .status(400)
      .json({ message: "professionalId parameter is required." });
  }

  // Check if status is provided
  if (status) {
    query.status = status;
  }

  try {
    const existingRequest = await Request.find(query);

    res.status(200).json(existingRequest);
  } catch (error) {
    console.error("Error retrieving existing requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptRequest = async (req, res, next) => {
  const requestId = req.params.requestid;
  const clientId = req.params.clientid;
  try {
    const acceptedRequest = await Request.findByIdAndUpdate(
      requestId,
      { $set: { status: "accepted" } },
      { new: true }
    );
    const client = await Client.findById(clientId);
    res.status(200).json(acceptedRequest);

    const mailOptions = {
      from: {
        name: "Server",
        address: "njokanmadon@gmail.com",
      },
      to: client.email,
      subject: "Request Accepted",
      text: "Hello There!",
      html: "Your request has been accepted. Log in to find more details...",
    };

    const sendMail = async (transporter, mailOptions) => {
      try {
        await transporter.sendMail(mailOptions);
        console.log("Email has been sent!");
      } catch (error) {
        console.error(error);
      }
    };

    sendMail(transporter, mailOptions);
  } catch (err) {
    next(err);
  }
};

export const denyRequest = async (req, res, next) => {
  const requestId = req.params.requestid;
  const clientId = req.params.clientid;
  try {
    const deniedRequest = await Request.findByIdAndUpdate(
      requestId,
      { $set: { status: "denied" } },
      { new: true }
    );
    const client = await Client.findById(clientId);
    res.status(200).json(deniedRequest);

    const mailOptions = {
      from: {
        name: "Server",
        address: "njokanmadon@gmail.com",
      },
      to: client.email,
      subject: "Request Denied",
      text: "Hello There!",
      html: "Your request has been denied. Log in to find more details...",
    };

    const sendMail = async (transporter, mailOptions) => {
      try {
        await transporter.sendMail(mailOptions);
        console.log("Email has been sent!");
      } catch (error) {
        console.error(error);
      }
    };

    sendMail(transporter, mailOptions);
  } catch (err) {
    next(err);
  }
};

// Backend API endpoint to cancel a request
// export const cancelRequest = async (req, res) => {
// 	const requestId = req.params.requestId;

// 	try {
// 	  // Find the request by requestId
// 	  const request = await Request.findById(requestId);

// 	  // Check if the request exists
// 	  if (!request) {
// 		return res.status(404).json({ message: "Request not found" });
// 	  }

// 	  // Check if the request is already canceled
// 	  if (request.status === "canceled") {
// 		return res.status(400).json({ message: "Request is already canceled" });
// 	  }

// 	  // Update the request status to canceled
// 	  request.status = "canceled";
// 	  await request.save();

// 	  res.status(200).json({ message: "Request canceled successfully", request });
// 	} catch (error) {
// 	  console.error("Error canceling request:", error);
// 	  res.status(500).json({ message: "Internal server error" });
// 	}
//   };

export const cancelRequest = async (req, res, next) => {
  const requestId = req.params.requestId;
  // const clientId = req.params.clientid
  try {
    const canceledRequest = await Request.findByIdAndUpdate(
      requestId,
      { $set: { status: "cancelled" } },
      { new: true }
    );
    // const client = await Client.findById(clientId)
    res.status(200).json(canceledRequest);

    // const mailOptions = {
    // 	from: {
    // 		name: "Server",
    // 		address: 'njokanmadon@gmail.com'
    // 	},
    // 	to: client.email,
    // 	subject: "Request Canceled",
    // 	text: "Hello There!",
    // 	html: "Your request has been canceled. Log in to find more details..."
    // }

    // const sendMail = async (transporter, mailOptions) => {
    // 	try {
    // 		await transporter.sendMail(mailOptions)
    // 		console.log("Email has been sent!");
    // 	} catch (error) {
    // 		console.error(error);
    // 	}
    // }

    // sendMail(transporter, mailOptions)
  } catch (err) {
    next(err);
  }
};

// export const completeRequest = async (req, res, next) => {
//   const requestId = req.params.requestId;
//   // const clientId = req.params.clientid
//   try {
//     const completedRequest = await Request.findByIdAndUpdate(
//       requestId,
//       { $set: { status: "completed" } },
//       { new: true }
//     );
//     // const client = await Client.findById(clientId)
//     res.status(200).json(completedRequest);

//     // const mailOptions = {
//     // 	from: {
//     // 		name: "Server",
//     // 		address: 'njokanmadon@gmail.com'
//     // 	},
//     // 	to: client.email,
//     // 	subject: "Request Canceled",
//     // 	text: "Hello There!",
//     // 	html: "Your request has been canceled. Log in to find more details..."
//     // }

//     // const sendMail = async (transporter, mailOptions) => {
//     // 	try {
//     // 		await transporter.sendMail(mailOptions)
//     // 		console.log("Email has been sent!");
//     // 	} catch (error) {
//     // 		console.error(error);
//     // 	}
//     // }

//     // sendMail(transporter, mailOptions)
//   } catch (err) {
//     next(err);
//   }
// };

export const completeRequest = async (req, res, next) => {
  const requestId = req.params.requestId;
  const { amount, description } = req.body;

  try {
    const updateData = {
      status: "completed"
    };

    // Include amount and description if they are provided in the request body
    if (amount !== undefined) {
      updateData.amount = amount;
    }
    if (description !== undefined) {
      updateData.description = description;
    }

    const completedRequest = await Request.findByIdAndUpdate(
      requestId,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json(completedRequest);

    // You can add email sending logic here if needed
  } catch (err) {
    next(err);
  }
};

// controllers/requestController.js
export const updateRequestStatus = async (req, res, next) => {
  const { requestId, status } = req.body;

  try {
    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { $set: { status } },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    next(error);
  }
};


export const getRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);
    res.status(200).json(request);
  } catch (err) {
    next(err);
  }
};

// export const getRequestToProfessional = async (req,res,next)=> {
// 	const qProfessional = req.query.receipient_id;
// 	const qClient = req.query.sender;
// 	try{
// 		let requests;
// 		if(qProfessional) {
// 			requests = await Request.find({
// 				receipient_id: {
// 					$in: [qProfessional]
// 				}
// 			})
// 		} else if(qClient) {
// 				requests = await Request.find({
// 					sender: {
// 						$in: [qClient]
// 					}
// 				})
// 		} else{
// 			requests = await Request.find();
// 		}
// 		res.status(200).json(requests)
// 	} catch(err){
// 		next(err)
// 	}
// }

// export const getRequests = async (req,res,next) => {
// 	try{
// 		const requests = await Request.find({});
//     res.send(users)
// 	}
// }
