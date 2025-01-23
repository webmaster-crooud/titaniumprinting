import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// Periksa folder tujuan berdasarkan nama file
		const folderPath = getDestinationFolder(file.originalname);
		cb(null, path.join("public", folderPath));
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
	fileFilter: (req, file, cb) => {
		const allowedTypes = /jpeg|jpg|png|pdf/;
		const extname = allowedTypes.test(
			path.extname(file.originalname).toLowerCase()
		);
		const mimetype = allowedTypes.test(file.mimetype);

		if (extname && mimetype) {
			return cb(null, true);
		}
		cb(new Error("Only .pfd, .png, .jpg and .jpeg format allowed!"));
	},
});

function getDestinationFolder(fileName) {
	// Tentukan folder tujuan berdasarkan nama file
	if (fileName.includes("images-")) {
		return "images";
	} else if (fileName.includes("cover-")) {
		return "cover";
	} else if (fileName.includes("banner-")) {
		return "banner";
	} else if (fileName.includes("cart-")) {
		return "cart"; // Folder untuk file cart
	} else {
		throw new Error("Invalid folder path");
	}
}
export default upload;
