import { prisma } from "../src/app/database.js";

async function main() {
	console.log("Start seeding...");

	try {
		// Seed Categories
		const categories = [
			{
				name: "Kartu Nama",
				slug: "kartu-nama",
				description: "Cetak kartu nama profesional",
				flag: "FAVOURITE",
			},
			{
				name: "Brosur",
				slug: "brosur",
				description: "Cetak brosur untuk promosi",
				flag: "ACTIVED",
			},
			{
				name: "Poster",
				slug: "poster",
				description: "Cetak poster ukuran besar",
				flag: "ACTIVED",
			},
			{
				name: "Kalender",
				slug: "kalender",
				description: "Cetak kalender dinding atau meja",
				flag: "ACTIVED",
			},
			{
				name: "Stiker",
				slug: "stiker",
				description: "Cetak stiker untuk berbagai kebutuhan",
				flag: "ACTIVED",
			},
		];

		for (const category of categories) {
			await prisma.category.upsert({
				where: { slug: category.slug },
				update: {},
				create: category,
			});
		}

		// Seed Products
		const products = [
			{
				barcode: "1234567890123",
				name: "Kartu Nama Premium",
				slug: "kartu-nama-premium",
				description: "Kartu nama dengan bahan premium",
				flag: "ACTIVED",
				orientation: false,
			},
			{
				barcode: "1234567890124",
				name: "Brosur A4",
				slug: "brosur-a4",
				description: "Brosur ukuran A4 full color",
				flag: "ACTIVED",
				orientation: true,
			},
			{
				barcode: "1234567890125",
				name: "Poster A3",
				slug: "poster-a3",
				description: "Poster ukuran A3",
				flag: "ACTIVED",
				orientation: true,
			},
			{
				barcode: "1234567890126",
				name: "Kalender Dinding",
				slug: "kalender-dinding",
				description: "Kalender dinding full color",
				flag: "ACTIVED",
				orientation: false,
			},
			{
				barcode: "1234567890127",
				name: "Stiker Vinyl",
				slug: "stiker-vinyl",
				description: "Stiker vinyl tahan air",
				flag: "ACTIVED",
				orientation: false,
			},
		];

		for (const product of products) {
			await prisma.product.upsert({
				where: { barcode: product.barcode },
				update: {},
				create: product,
			});
		}

		// Seed CategoryProduct
		const categoryProducts = [
			{ barcode: "1234567890123", categoryId: 1 },
			{ barcode: "1234567890124", categoryId: 2 },
			{ barcode: "1234567890125", categoryId: 3 },
			{ barcode: "1234567890126", categoryId: 4 },
			{ barcode: "1234567890127", categoryId: 5 },
		];

		for (const cp of categoryProducts) {
			await prisma.categoryProduct.upsert({
				where: {
					barcode_categoryId: {
						barcode: cp.barcode,
						categoryId: cp.categoryId,
					},
				},
				update: {},
				create: cp,
			});
		}

		// Seed Services
		const services = [
			{
				barcode: "SVC001",
				name: "Desain Grafis",
				slug: "desain-grafis",
				flag: "ACTIVED",
			},
			{
				barcode: "SVC002",
				name: "Cetak Digital",
				slug: "cetak-digital",
				flag: "ACTIVED",
			},
			{
				barcode: "SVC003",
				name: "Finishing",
				slug: "finishing",
				flag: "ACTIVED",
			},
			{
				barcode: "SVC004",
				name: "Pengiriman",
				slug: "pengiriman",
				flag: "ACTIVED",
			},
			{
				barcode: "SVC005",
				name: "Konsultasi",
				slug: "konsultasi",
				flag: "ACTIVED",
			},
		];

		for (const service of services) {
			await prisma.service.upsert({
				where: { barcode: service.barcode },
				update: {},
				create: service,
			});
		}

		// Seed ServiceProduct
		const serviceProducts = [
			{ barcodeService: "SVC001", barcodeProduct: "1234567890123" },
			{ barcodeService: "SVC002", barcodeProduct: "1234567890124" },
			{ barcodeService: "SVC003", barcodeProduct: "1234567890125" },
			{ barcodeService: "SVC004", barcodeProduct: "1234567890126" },
			{ barcodeService: "SVC005", barcodeProduct: "1234567890127" },
		];

		for (const sp of serviceProducts) {
			await prisma.serviceProduct.upsert({
				where: {
					barcodeProduct_barcodeService: {
						barcodeProduct: sp.barcodeProduct,
						barcodeService: sp.barcodeService,
					},
				},
				update: {},
				create: sp,
			});
		}

		// Seed Components
		const components = [
			{
				name: "Kertas Art Paper",
				typeComponent: "MATERIAL",
				flag: "ACTIVED",
				price: 50000,
				cogs: 30000,
			},
			{
				name: "Tinta CMYK",
				typeComponent: "MATERIAL",
				flag: "ACTIVED",
				price: 200000,
				cogs: 150000,
			},
			{
				name: "Laminasi Glossy",
				typeComponent: "FINISHING",
				flag: "ACTIVED",
				price: 10000,
				cogs: 5000,
			},
			{
				name: "Lem Perekat",
				typeComponent: "MATERIAL",
				flag: "ACTIVED",
				price: 15000,
				cogs: 10000,
			},
			{
				name: "Plastik Kemasan",
				typeComponent: "MATERIAL",
				flag: "ACTIVED",
				price: 25000,
				cogs: 20000,
			},
		];

		for (const component of components) {
			await prisma.component.upsert({
				where: { id: component.id },
				update: {},
				create: component,
			});
		}

		// Seed ProductComponent
		const productComponents = [
			{ barcode: "1234567890123", componentId: 1, minQty: 1 },
			{ barcode: "1234567890124", componentId: 2, minQty: 1 },
			{ barcode: "1234567890125", componentId: 3, minQty: 1 },
			{ barcode: "1234567890126", componentId: 4, minQty: 1 },
			{ barcode: "1234567890127", componentId: 5, minQty: 1 },
		];

		for (const pc of productComponents) {
			await prisma.productComponent.upsert({
				where: {
					barcode_componentId: {
						barcode: pc.barcode,
						componentId: pc.componentId,
					},
				},
				update: {},
				create: pc,
			});
		}

		// Seed Qualities
		const qualities = [
			{
				name: "Standard",
				flag: "ACTIVED",
				price: 100000,
				cogs: 70000,
				componentId: 1,
			},
			{
				name: "Premium",
				flag: "ACTIVED",
				price: 150000,
				cogs: 100000,
				componentId: 2,
			},
			{
				name: "Glossy",
				flag: "ACTIVED",
				price: 120000,
				cogs: 80000,
				componentId: 3,
			},
			{
				name: "Matte",
				flag: "ACTIVED",
				price: 110000,
				cogs: 75000,
				componentId: 4,
			},
			{
				name: "UV Coating",
				flag: "ACTIVED",
				price: 130000,
				cogs: 90000,
				componentId: 5,
			},
		];

		for (const quality of qualities) {
			await prisma.quality.upsert({
				where: { id: quality.id },
				update: {},
				create: quality,
			});
		}

		// Seed Sizes
		const sizes = [
			{
				name: "A4",
				length: 21.0,
				width: 29.7,
				height: 0.1,
				weight: 100,
				wide: 210,
			},
			{
				name: "A3",
				length: 29.7,
				width: 42.0,
				height: 0.1,
				weight: 150,
				wide: 297,
			},
			{
				name: "A5",
				length: 14.8,
				width: 21.0,
				height: 0.1,
				weight: 80,
				wide: 148,
			},
			{
				name: "B5",
				length: 17.6,
				width: 25.0,
				height: 0.1,
				weight: 90,
				wide: 176,
			},
			{
				name: "Custom",
				length: 10.0,
				width: 15.0,
				height: 0.1,
				weight: 50,
				wide: 100,
			},
		];

		for (const size of sizes) {
			await prisma.size.upsert({
				where: { id: size.id },
				update: {},
				create: size,
			});
		}

		// Seed QualitySize
		const qualitySizes = [
			{ qualityId: 1, sizeId: 1, price: 100000, cogs: 70000 },
			{ qualityId: 2, sizeId: 2, price: 150000, cogs: 100000 },
			{ qualityId: 3, sizeId: 3, price: 120000, cogs: 80000 },
			{ qualityId: 4, sizeId: 4, price: 110000, cogs: 75000 },
			{ qualityId: 5, sizeId: 5, price: 130000, cogs: 90000 },
		];

		for (const qs of qualitySizes) {
			await prisma.qualitySize.upsert({
				where: { id: qs.id },
				update: {},
				create: qs,
			});
		}

		// Seed Users
		const users = [
			{
				id: "USR001",
				firstName: "John",
				lastName: "Doe",
				phone: "081234567890",
				email: "john.doe@example.com",
				role: "MEMBER",
			},
			{
				id: "USR002",
				firstName: "Jane",
				lastName: "Doe",
				phone: "081234567891",
				email: "jane.doe@example.com",
				role: "MEMBER",
			},
			{
				id: "USR003",
				firstName: "Alice",
				lastName: "Smith",
				phone: "081234567892",
				email: "alice.smith@example.com",
				role: "ADMIN",
			},
			{
				id: "USR004",
				firstName: "Bob",
				lastName: "Johnson",
				phone: "081234567893",
				email: "bob.johnson@example.com",
				role: "CUSTOMER",
			},
			{
				id: "USR005",
				firstName: "Charlie",
				lastName: "Brown",
				phone: "081234567894",
				email: "charlie.brown@example.com",
				role: "MEMBER",
			},
		];

		for (const user of users) {
			await prisma.user.upsert({
				where: { id: user.id },
				update: {},
				create: user,
			});
		}

		// Seed Accounts
		const accounts = [
			{
				email: "john.doe@example.com",
				username: "johndoe",
				password: "password123",
				ipAddress: "192.168.1.1",
				userAgent: "Mozilla/5.0",
				status: "ACTIVED",
			},
			{
				email: "jane.doe@example.com",
				username: "janedoe",
				password: "password123",
				ipAddress: "192.168.1.2",
				userAgent: "Mozilla/5.0",
				status: "ACTIVED",
			},
			{
				email: "alice.smith@example.com",
				username: "alicesmith",
				password: "password123",
				ipAddress: "192.168.1.3",
				userAgent: "Mozilla/5.0",
				status: "ACTIVED",
			},
			{
				email: "bob.johnson@example.com",
				username: "bobjohnson",
				password: "password123",
				ipAddress: "192.168.1.4",
				userAgent: "Mozilla/5.0",
				status: "ACTIVED",
			},
			{
				email: "charlie.brown@example.com",
				username: "charliebrown",
				password: "password123",
				ipAddress: "192.168.1.5",
				userAgent: "Mozilla/5.0",
				status: "ACTIVED",
			},
		];

		for (const account of accounts) {
			await prisma.account.upsert({
				where: { email: account.email },
				update: {},
				create: account,
			});
		}

		// Seed Addresses
		const addresses = [
			{
				userId: "USR001",
				name: "Rumah",
				street: "Jl. Merdeka No. 1",
				city: "Jakarta",
				province: "DKI Jakarta",
				country: "Indonesia",
				postalCode: 10110,
			},
			{
				userId: "USR002",
				name: "Kantor",
				street: "Jl. Sudirman No. 2",
				city: "Jakarta",
				province: "DKI Jakarta",
				country: "Indonesia",
				postalCode: 10220,
			},
			{
				userId: "USR003",
				name: "Apartemen",
				street: "Jl. Thamrin No. 3",
				city: "Jakarta",
				province: "DKI Jakarta",
				country: "Indonesia",
				postalCode: 10330,
			},
			{
				userId: "USR004",
				name: "Rumah",
				street: "Jl. Gatot Subroto No. 4",
				city: "Jakarta",
				province: "DKI Jakarta",
				country: "Indonesia",
				postalCode: 10440,
			},
			{
				userId: "USR005",
				name: "Kantor",
				street: "Jl. MH Thamrin No. 5",
				city: "Jakarta",
				province: "DKI Jakarta",
				country: "Indonesia",
				postalCode: 10550,
			},
		];

		for (const address of addresses) {
			await prisma.address.upsert({
				where: { id: address.id },
				update: {},
				create: address,
			});
		}

		// Seed Carts
		const carts = [
			{
				id: "CRT001",
				copies: 1,
				subTotalPrice: 100000,
				finalTotalPrice: 100000,
				finalTotalCogs: 70000,
				status: "PENDING",
				userEmail: "john.doe@example.com",
				productBarcode: "1234567890123",
				promotionCode: "PROMO001",
			},
			{
				id: "CRT002",
				copies: 2,
				subTotalPrice: 200000,
				finalTotalPrice: 200000,
				finalTotalCogs: 140000,
				status: "PENDING",
				userEmail: "jane.doe@example.com",
				productBarcode: "1234567890124",
				promotionCode: "PROMO002",
			},
			{
				id: "CRT003",
				copies: 3,
				subTotalPrice: 300000,
				finalTotalPrice: 300000,
				finalTotalCogs: 210000,
				status: "PENDING",
				userEmail: "alice.smith@example.com",
				productBarcode: "1234567890125",
				promotionCode: "PROMO003",
			},
			{
				id: "CRT004",
				copies: 4,
				subTotalPrice: 400000,
				finalTotalPrice: 400000,
				finalTotalCogs: 280000,
				status: "PENDING",
				userEmail: "bob.johnson@example.com",
				productBarcode: "1234567890126",
				promotionCode: "PROMO004",
			},
			{
				id: "CRT005",
				copies: 5,
				subTotalPrice: 500000,
				finalTotalPrice: 500000,
				finalTotalCogs: 350000,
				status: "PENDING",
				userEmail: "charlie.brown@example.com",
				productBarcode: "1234567890127",
				promotionCode: "PROMO005",
			},
		];

		for (const cart of carts) {
			await prisma.cart.upsert({
				where: { id: cart.id },
				update: {},
				create: cart,
			});
		}

		// Seed CartItems
		const cartItems = [
			{
				cartId: "CRT001",
				componentName: "Kertas Art Paper",
				qualityName: "Standard",
				sizeName: "A4",
				qty: 1,
				price: 100000,
				cogs: 70000,
				totalPrice: 100000,
				totalCogs: 70000,
			},
			{
				cartId: "CRT002",
				componentName: "Tinta CMYK",
				qualityName: "Premium",
				sizeName: "A3",
				qty: 2,
				price: 150000,
				cogs: 100000,
				totalPrice: 300000,
				totalCogs: 200000,
			},
			{
				cartId: "CRT003",
				componentName: "Laminasi Glossy",
				qualityName: "Glossy",
				sizeName: "A5",
				qty: 3,
				price: 120000,
				cogs: 80000,
				totalPrice: 360000,
				totalCogs: 240000,
			},
			{
				cartId: "CRT004",
				componentName: "Lem Perekat",
				qualityName: "Matte",
				sizeName: "B5",
				qty: 4,
				price: 110000,
				cogs: 75000,
				totalPrice: 440000,
				totalCogs: 300000,
			},
			{
				cartId: "CRT005",
				componentName: "Plastik Kemasan",
				qualityName: "UV Coating",
				sizeName: "Custom",
				qty: 5,
				price: 130000,
				cogs: 90000,
				totalPrice: 650000,
				totalCogs: 450000,
			},
		];

		for (const cartItem of cartItems) {
			await prisma.cartItem.upsert({
				where: { id: cartItem.id },
				update: {},
				create: cartItem,
			});
		}

		console.log("Seeding completed successfully.");
	} catch (error) {
		console.error("Error seeding database:", error);
	} finally {
		await prisma.$disconnect();
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
