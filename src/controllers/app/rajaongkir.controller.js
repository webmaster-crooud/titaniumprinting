// Config Defaults with Raja Ongkir Account Details
const API_KEY = "10b8e25d1d3d18545ab0eb3203ce11c8";
const BASE_URL = "https://api.rajaongkir.com/starter";
const getProvices = async (req, res, next) => {
	try {
		const response = await fetch(`${BASE_URL}/province`, {
			method: "GET",
			headers: {
				key: API_KEY,
			},
		});
		const { rajaongkir } = await response.json();
		res.status(200).json({
			data: rajaongkir.results,
		});
	} catch (err) {
		next(err);
	}
};

const getCities = async (req, res, next) => {
	try {
		const response = await fetch(`${BASE_URL}/city`, {
			method: "GET",
			headers: {
				key: API_KEY,
			},
		});
		const { rajaongkir } = await response.json();
		res.status(200).json({
			data: rajaongkir.results,
		});
	} catch (err) {
		next(err);
	}
};

const getOngkir = async (req, res, next) => {
	try {
		const { from, destination, weight, courier } = req.params;
		const response = await fetch(`${BASE_URL}/cost`, {
			method: "POST",
			headers: {
				key: API_KEY,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				origin: from,
				destination: destination,
				weight: weight,
				courier: courier,
			}),
		});
		const { rajaongkir } = await response.json();
		res.status(200).json({
			data: rajaongkir.results,
		});
	} catch (error) {
		next(error);
	}
};

export default { getProvices, getCities, getOngkir };
