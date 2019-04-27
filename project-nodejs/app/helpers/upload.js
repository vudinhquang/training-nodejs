var multer       = require('multer');
var randomstring = require("randomstring");
const path       = require('path');

let uploadFile = (field, folderDes =  '/users', fileNameLength = 10, fileSizeMb = 1, fileExtension = 'jpeg|jpg|png|gif') => {
	let storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, __path_uploads + folderDes)
		},
		filename: (req, file, cb) => {
			cb(null, randomstring.generate(fileNameLength) + path.extname(file.originalname))
		}
	});

	let upload = multer({
		storage: storage
		, limits: {
			fileSize: fileSizeMb * 1024 * 1024
		}
		, fileFilter: (req, file, cb) => {
			let filetypes = new RegExp(fileExtension);
			let extname   = filetypes.test(path.extname(file.originalname).toLowerCase());
			let mimetype  = filetypes.test(file.mimetype);
	
			if(mimetype && extname){
				return cb(null, true);
			}else{
				cb(new Error('Phần mở rộng không phù hợp'))
			}
		}
	}).single(field);

	return upload;
}

module.exports = {
    uploadFile
}