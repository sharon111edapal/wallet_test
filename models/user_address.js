const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserAddressSchema = new Schema({
	userId: {
		type: String,
		require: true,
	},
	address: {
		type: String,
		require: true,
	},
  	type: {
		type: String,
		require: true,
	},
	txCount: {
		type: Number,
		default: 0,
	},
	balance: {
		type: String,
		default: "0",
	},
	oamBalance: {
		type: String,
		default: "0",
	},
	usdtBalance: {
		type: String,
		default: "0",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = UserAddress = mongoose.model("user_address", UserAddressSchema);
