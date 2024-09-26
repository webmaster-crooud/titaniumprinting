import supertest from "supertest";
import { cleanCategoryTable, dummyCategoriesList, removeTestCategory } from "./lib/utils.js";
import { web } from "../src/app/web.js";

describe("CREATE DUMMY CATEGORIES", () => {
	beforeEach(async () => {
		await removeTestCategory();
		await dummyCategoriesList();
	});

	it("DUMMY CREATE CATEGORIES", async () => {
		const result = await supertest(web).get("/api/v1/categories");
		console.log(result.body);
	});
});

describe("POST /api/categories", () => {
	beforeAll(async () => {
		await removeTestCategory();
	});
	afterEach(async () => {
		await removeTestCategory();
	});

	afterAll(async () => {
		await cleanCategoryTable();
	});

	it("should can be created new category with automation slug name", async () => {
		const result = await supertest(web).post("/api/v1/categories").send({
			name: "Category Test Name",
		});

		expect(result.status).toBe(201);
		expect(result.body.message).toBeDefined();
		expect(result.body.data.name).toBe("Category Test Name");
		expect(result.body.data.slug).toBe("category-test-name");
		expect(result.body.data.flag).toBe("ACTIVED");
	});

	it("should can be created new category with manual input slug name", async () => {
		const result = await supertest(web).post("/api/categories").send({
			name: "Category Test Name",
			slug: "category-test-manual-name",
		});

		expect(result.status).toBe(201);
		expect(result.body.message).toBeDefined();
		expect(result.body.data.name).toBe("Category Test Name");
		expect(result.body.data.slug).toBe("category-test-manual-name");
		expect(result.body.data.flag).toBe("ACTIVED");
	});

	it("should reject if slug category is exist", async () => {
		let result = await supertest(web).post("/api/categories").send({
			name: "Category Test Name",
		});

		expect(result.status).toBe(201);
		expect(result.body.message).toBeDefined();
		expect(result.body.data.name).toBe("Category Test Name");
		expect(result.body.data.slug).toBe("category-test-name");
		expect(result.body.data.flag).toBe("ACTIVED");

		result = await supertest(web).post("/api/categories").send({
			name: "Category Test Name",
		});

		expect(result.status).toBe(400);
		expect(result.body.error).toBe(true);
		expect(result.body.message).toBeDefined();
	});
});
