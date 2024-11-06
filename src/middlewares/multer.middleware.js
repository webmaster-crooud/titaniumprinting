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

const upload = multer({ storage: storage });

function getDestinationFolder(fileName) {
	// Tentukan folder tujuan berdasarkan nama file
	if (fileName.includes("images-")) {
		return "images";
	} else if (fileName.includes("cover-")) {
		return "cover";
	} else if (fileName.includes("banner-")) {
		return "banner";
	} else {
		throw new Error("Invalid folder path");
	}
}
export default upload;
