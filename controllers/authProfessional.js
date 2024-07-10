import Professional from "../models/Professional.js"
import bcrypt from "bcryptjs"
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: "njokanmadon@gmail.com",
		pass: "ukyw ixfi csah smty",
	},
	secureConnection: 'false',
	tls: {
		ciphers: 'SSLv3',
		rejectUnauthorized: false
	}
})

export const register = async (req,res,next)=> {
	try{
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(req.body.password, salt)

		const newProfessional = new Professional({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			password: hash,
			profession: req.body.profession,
			country: req.body.country,
			city: req.body.city,
			profilePicture: req.body.profilePicture,
			phone: req.body.phone,
		})

		await newProfessional.save()
		res.status(200).send("Professional has been created")

		const mailOptions = {
			from: {
				name: "Server",
				address: 'njokanmadon@gmail.com'
			},
			to: "njokanmadonzy@gmail.com",
			subject: "New Professional Registered",
			text: "Hello There!",
			html: `
				<b>Firstname</b>: ${newProfessional.firstname}<br />
				<b>Lastname</b>: ${newProfessional.lastname} <br />
				<b>Email</b>: ${newProfessional.email} <br />
				<b>Profession</b>: ${newProfessional.profession} <br />
				<b>Country</b>: ${newProfessional.country} <br />
				<b>City</b>: ${newProfessional.city} <br />
				<img src=${newProfessional.profilePicture} alt="picture" style="border-radius: 50%; width: 200px;"/> <br />
				<b>Phone Number</b>: ${newProfessional.phone}<br />

				<a href="http://localhost:8800/api/authProfessional/approval/${newProfessional._id}">
					<button style="background-color: lightgreen; border-radius: 6px; width: 100px; border: 1px black; height: 30px; cursor: pointer;">
						Approve
					</button>
				</a>

				<button style="background-color: red; border-radius: 6px; width: 100px; border: 1px black; height: 30px; cursor: pointer;">
					Reject
				</button>
			`
		}

		const sendMail = async (transporter, mailOptions) => {
			try {
				await transporter.sendMail(mailOptions)
				console.log("Email has been sent!");
			} catch (error) {
				console.error(error);
			}
		}

		sendMail(transporter, mailOptions)
	} catch(err) {
		next(err)
	}
}


export const approval = async (req,res,next)=> {
	try{
		const updatedProfessional = await Professional.findByIdAndUpdate(req.params.id, {$set : {approved: true}}, {new: true})
		res.status(200).json(updatedProfessional)
	}catch(err){
		next(err);
	}
}

export const login = async (req,res,next)=> {
	try{
		const professional = await Professional.findOne({email:req.body.email})
		if(!professional) return next(createError(404, "Professional not found!"))

		const isPasswordCorrect = await bcrypt.compare(req.body.password, professional.password)
		if(!isPasswordCorrect) return next(createError(400, "Wrong password or email!"))

		const token = jwt.sign({ id:professional._id, isAdmin: professional.isAdmin }, process.env.JWT);

		const {password, isAdmin, ...otherDetails} = professional._doc
		res.cookie("access_token", token, {
			httpOnly: true,
		})
		.status(200)
		.json({ details:{...otherDetails}, isAdmin});
	} catch(err) {
		next(err)
	}
}