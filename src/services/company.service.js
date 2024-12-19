import {
	companyValidation,
	socialMediaValidation,
} from "../validations/company.validation.js";
import { validate } from "../validations/validation.js";
import { prisma } from "../app/database.js";
import { ResponseError } from "../errors/Response.error.js";

const get = async (code) => {
	return await prisma.company.findUnique({
		where: {
			code: code,
		},
		include: {
			socialMedia: {
				select: {
					id: true,
					name: true,
					url: true,
				},
			},
		},
	});
};

const update = async (code, request) => {
	request = validate(companyValidation, request);
	return await prisma.company.update({
		where: {
			code: code,
		},
		data: request,
		select: {
			name: true,
		},
	});
};

const addSocialMedia = async (code, request) => {
	request = validate(socialMediaValidation, request);

	const create = request.map((data) => ({
		code: code,
		name: data.name,
		url: data.url,
	}));
	return await prisma.socialMedia.createMany({
		data: create,
		skipDuplicates: true,
	});
};

const updateSocialMedia = async (id, request) => {
	request = validate(socialMediaValidation, request);

	const find = await prisma.socialMedia.findUnique({
		where: {
			id: id,
		},
		select: name,
	});

	if (!find) throw new ResponseError(404, "Social Media is not found!");
	if (find.name !== request.namme) {
		const count = await prisma.socialMedia.count({
			where: {
				name: request.name,
			},
		});

		if (count >= 1) throw new ResponseError(400, "Social Media is already");
	}

	return await prisma.socialMedia.update({
		where: {
			id: id,
		},
		data: request,
		select: {
			name: true,
		},
	});
};

const deletedSocialMedia = async (id) => {
	const find = prisma.socialMedia.findUnique({
		where: { id: id },
		select: { id: true },
	});

	if (!find) throw new ResponseError(404, "Social Media is not found!");

	return await prisma.socialMedia.delete({
		where: { id: id },
	});
};

export default {
	update,
	addSocialMedia,
	updateSocialMedia,
	deletedSocialMedia,
	get,
};
