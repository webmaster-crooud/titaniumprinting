import { prisma } from "../../app/database.js";
import { ResponseError } from "../../errors/Response.error.js";
import { getSlugProduct } from "../../validations/app/product.validation.js";
import { validate } from "../../validations/validation.js";

const detail = async (slug) => {
	slug = validate(getSlugProduct, slug);
	const result = await prisma.$transaction(async (tx) => {
		const product = await tx.product.findUnique({
			where: { slug },
			include: {
				product_component: {
					include: {
						component: {
							include: {
								qualities: {
									where: {
										flag: "ACTIVED",
									},
									include: {
										qualitiesSize: {
											include: {
												sizes: true,
											},
										},
									},
								},
							},
						},
					},
				},
				product_category: {
					include: {
						categories: {
							select: {
								id: true,
								description: true,
								name: true,
								slug: true,
							},
						},
					},
				},
				service_product: {
					include: {
						services: {
							select: {
								name: true,
								slug: true,
							},
						},
					},
				},
			},
		});

		if (!product) {
			throw new Error("Product not found");
		}

		// Mengambil progressive pricing untuk semua komponen
		const componentIds = product.product_component.map((pc) => pc.componentId);
		const qualityIds = product.product_component.flatMap((pc) =>
			pc.component.qualities.map((q) => q.id)
		);
		const sizeIds = product.product_component
			.flatMap((pc) =>
				pc.component.qualities.flatMap((q) =>
					q.qualitiesSize.map((qs) => qs.sizeId)
				)
			)
			.filter((id) => id !== null);

		const progressivePricing = await prisma.progressivePricing.findMany({
			where: {
				OR: [
					{ entityType: "COMPONENT", entityId: { in: componentIds } },
					{ entityType: "QUALITY", entityId: { in: qualityIds } },
					{ entityType: "SIZE", entityId: { in: sizeIds } },
				],
			},
		});

		// Menggabungkan data progressive pricing dengan masing-masing entitas

		// Ambil kategori ID dari produk awal
		const categoryIds = product.product_category.map(
			(category) => category.categories.id
		);

		const listProduct = await tx.product.findMany({
			where: {
				product_category: {
					some: {
						categoryId: { in: categoryIds },
					},
				},
			},
			select: {
				name: true,
				cover: true,
				description: true,
				slug: true,
				product_category: {
					include: {
						categories: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
			},
			take: 4,
		});

		// return { product, listProduct };
		return {
			product: {
				...product,
				product_component: product.product_component.map((pc) => ({
					...pc,
					component: {
						...pc.component,
						progressivePricing: progressivePricing.filter(
							(pp) =>
								pp.entityType === "COMPONENT" && pp.entityId === pc.componentId
						),
						qualities: pc.component.qualities.map((q) => ({
							...q,
							progressivePricing: progressivePricing.filter(
								(pp) => pp.entityType === "QUALITY" && pp.entityId === q.id
							),
							qualitiesSize: q.qualitiesSize.map((qs) => ({
								...qs,
								progressivePricing: progressivePricing.filter(
									(pp) => pp.entityType === "SIZE" && pp.entityId === qs.sizeId
								),
							})),
						})),
					},
				})),
			},
			listProduct,
		};
	});

	if (!result) {
		throw new ResponseError(404, "Products is not found!");
	} else {
		return result;
	}
};

const listProduct = async (search) => {
	return await prisma.$transaction(async (tx) => {
		return await tx.product.findMany({
			where: {
				name: {
					contains: search,
				},
				OR: [
					{
						flag: "ACTIVED",
					},
					{
						flag: "FAVOURITE",
					},
				],
			},
			select: {
				name: true,
				slug: true,
				flag: true,
				cover: true,
				description: true,
				product_category: {
					select: {
						categories: {
							select: {
								name: true,
								slug: true,
							},
						},
					},
				},
				service_product: {
					select: {
						services: {
							select: {
								name: true,
								slug: true,
							},
						},
					},
				},
			},
			take: 12,
			orderBy: {
				createdAt: "desc",
			},
		});
	});
};

const favouriteProduct = async () => {
	return await prisma.product.findMany({
		where: {
			flag: "FAVOURITE",
		},
		select: {
			images: true,
			name: true,
			slug: true,
			flag: true,
			description: true,
			product_category: {
				select: {
					categories: {
						select: {
							name: true,
							slug: true,
						},
					},
				},
			},
			service_product: {
				select: {
					services: {
						select: {
							name: true,
							slug: true,
						},
					},
				},
			},
		},
		take: 12,
		orderBy: {
			createdAt: "desc",
		},
	});
};

export default { detail, listProduct, favouriteProduct };
