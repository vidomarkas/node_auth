const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.register = async (req, res, next) => {
	const { username, password, email } = req.body;

	try {
		const user = await User.create({ username, email, password });
		sendToken(user, 201, res);
		// res.status(201).json({ success: true, token: "thetoken" });
	} catch (error) {
		next(error);
	}
};
exports.login = async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(
			new ErrorResponse("Please provide email and password", 400)
		);
	}

	try {
		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			return next(new ErrorResponse("Invalid credentials", 401));
		}

		const isMatch = await user.matchPasswords(password);
		if (!isMatch) {
			return next(new ErrorResponse("Invalid credentials", 401));
		}

		// res.status(200).json({
		// 	success: true,
		// 	token: "exampleToken1315446548",
		// });
		sendToken(user, 200, res);
	} catch (error) {
		next(error);
	}
};
exports.forgotPassword = (req, res, next) => {
	res.send("forgot password route");
};
exports.resetPassword = (req, res, next) => {
	res.send("reset password route");
};

const sendToken = (user, statusCode, res) => {
	const token = user.getSignedToken();
	res.status(statusCode).json({ success: true, token });
};
