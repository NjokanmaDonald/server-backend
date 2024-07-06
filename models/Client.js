import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
	firstname:{
		type: String,
		required: true,
	},
	lastname:{
		type: String,
		required: true,
	},
	email:{
		type: String,
		required: true,
		unique:true
	},
	password:{
		type: String,
		required:true
	},
	// address:{
	// 	type: String,
	// 	required: true
	// },
	country:{
		type: String,
		required: true,
	},
	city:{
		type:String,
		required: true,
	},
	profilePicture:{
		type:String,
	},
	phone: {
		type:String,
		required: true,
	},
	// requests: {
	// 	type:[String]
	// },
	requestInfo: {
		requests: {type: String},
		client_id: {type: String}
	},
	isAdmin:{
		type: Boolean,
		default:false
	}
},
	{timestamps: true}
)

export default mongoose.model("Client", ClientSchema)