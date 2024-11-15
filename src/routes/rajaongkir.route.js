import rajaongkirController from "../controllers/app/rajaongkir.controller.js";
import express from "express";
export const rajaRouter = express.Router();

// Router GET province
// rajaRouter.get("/address/province", rajaongkirController.getProvice);

// Router GET city by province_id
rajaRouter.get("/kota/:provId", (req, res) => {
	const id = req.params.provId;
	fetch(`${BASE_URL}/city?province=${id}`, {
		headers: {
			key: API_KEY,
		},
	})
		.then((response) => response.json())
		.then((data) => res.json(data))
		.catch((err) => res.send(err));
});

// Router GET costs
rajaRouter.get("/ongkos/:asal/:tujuan/:berat/:kurir", (req, res) => {
	const { asal, tujuan, berat, kurir } = req.params;
	fetch(`${BASE_URL}/cost`, {
		method: "POST",
		headers: {
			key: API_KEY,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			origin: asal,
			destination: tujuan,
			weight: berat,
			courier: kurir,
		}),
	});
});
