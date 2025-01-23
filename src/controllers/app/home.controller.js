import homeService from "../../services/app/home.service.js";

const homeController = async (req, res, next) => {
	try {
		const result = await homeService.homePage();
		res.status(200).json({
			message: "ok",
			data: result,
		});
		console.log(result.categories);
	} catch (error) {
		next(error);
	}
};

export default { homeController };
