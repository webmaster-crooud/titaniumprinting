import { prisma } from "../../app/database.js";
import { ResponseError } from "../../errors/Response.error.js";
import { getSlugProduct } from "../../validations/app/product.validation.js";
import { validate } from "../../validations/validation.js";

const detail = async (slug) => {
	slug = validate(getSlugProduct, slug);
	const result = await prisma.product.findFirst({
		where: {
			OR: [
				{
					slug: slug,
					flag: "FAVOURITE",
				},
				{
					slug: slug,
					flag: "ACTIVED",
				},
			],
		},
		select: {
			barcode: true,
			cover: true,
			name: true,
			flag: true,
			description: true,
			totalPrice: true,
			totalCogs: true,
			product_category: {
				select: {
					categories: {
						select: {
							name: true,
							slug: true,
							description: true,
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
							category_service: {
								select: {
									categories: {
										select: {
											name: true,
										},
									},
								},
							},
						},
					},
				},
			},
			images: {
				select: {
					name: true,
					source: true,
				},
			},
			product_component: {
				select: {
					minQty: true,
					typePieces: true,
					component: {
						select: {
							id: true,
							name: true,
							canIncrise: true,
							price: true,
							cogs: true,
							description: true,
							typeComponent: true,
							qualities: {
								where: {
									OR: [
										{
											flag: "FAVOURITE",
										},
										{
											flag: "ACTIVED",
										},
									],
								},
								select: {
									name: true,
									description: true,
									orientation: true,
									id: true,
									sizes: {
										select: {
											id: true,
											cogs: true,
											height: true,
											length: true,
											price: true,
											weight: true,
											width: true,
										},
									},
								},
							},
						},
					},
				},
			},
		},
	});

	if (!result) {
		throw new ResponseError(404, "Products is not found!");
	} else {
		return result;
	}
};

export default { detail };
