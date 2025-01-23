import { ResponseError } from "../../errors/Response.error.js";
import userService from "../../services/app/user.service.js";

const getCartController = async (req, res, next) => {
	const email = req.email;
	if (!email) throw new ResponseError(404, "Data is not found!");
	try {
		const data = await userService.getCart(email);
		res.status(200).json({
			message: "ok",
			data,
		});
	} catch (error) {
		next(error);
	}
};

const deleteCartController = async (req, res, next) => {
	const email = req.email;
	const { cartId } = req.params;
	try {
		await userService.deleteCart(email, cartId);
		res.status(201).json({
			message: `Successfully to deleted cart`,
		});
	} catch (error) {
		next(error);
	}
};

export default { getCartController, deleteCartController };
