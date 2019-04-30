var multer       = require('multer');
var randomstring = require("randomstring");
const path       = require('path');
const fs         = require('fs');

const notify = require(__path_configs + '/notify');

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
				// cb(('Phần mở rộng không phù hợp'))
				cb({'extname': notify.ERROR_FILE_EXTENSION})
			}
		}
	}).single(field);

	return upload;
}

let removeFile = (folder, fileName, defaultImage = 'no-avatar.png') => {
	let path = folder + fileName;
	if(fileName){
		fs.exists(path, (exists) => {
			if (exists) {
				if(fileName !== defaultImage){
					fs.unlink(path, (err) => {
						if (err) throw err;
					});
				}
			}
		});
	}
}

module.exports = {
	uploadFile,
	removeFile
}