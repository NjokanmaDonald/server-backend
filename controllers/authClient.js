import Client from "../models/Client.js"
import bcrypt from "bcryptjs"
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req,res,next)=> {
	try{
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(req.body.password, salt)

		const newClient = new Client({
			...req.body,
			password: hash,
		})

		await newClient.save()
		res.status(200).send("Client has been created")
	} catch(err) {
		next(err)
	}
}

export const login = async (req,res,next)=> {
	try{
		const client = await Client.findOne({email:req.body.email})
		if(!client) return next(createError(404, "Client not found!"))

		const isPasswordCorrect = await bcrypt.compare(req.body.password, client.password)
		if(!isPasswordCorrect) return next(createError(400, "Wrong password or email!"))

		const token = jwt.sign({ id:client._id, isAdmin: client.isAdmin }, process.env.JWT);

		const {password, isAdmin, ...otherDetails} = client._doc
		res.cookie("access_token", token, {
			httpOnly: true,
		})
		.status(200)
		.json({ details:{...otherDetails}, isAdmin});
	} catch(err) {
		next(err)
	}
}