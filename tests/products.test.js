import supertest from "supertest";
import { cleanTestProducts } from "./lib/utils.js";
import { web } from "../src/app/web.js";

describe("POST /api/v1/products", () => {
	afterEach(async () => {
		await cleanTestProducts();
	});
	it("should can be created new product", async () => {
		const result = await supertest(web).post("/api/v1/products").send({
			name: "Testing Products From Test",
			category_id: 28,
		});

		expect(result.status).toBe(201);
	});
});
