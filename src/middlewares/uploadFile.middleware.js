const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fileLocation = 'uploads/products/images';
        if (!fs.existsSync(fileLocation)) fs.mkdirSync(fileLocation, { recursive: true });
        cb(null, fileLocation);
    },
    filename: (req, file, cb) => {
        const fileType = file.mimetype.split('/')[1];
        cb(null, + Date.now() + '-' + file.fieldname + `.${fileType}`);
    },
});


const upload = multer({ 
    storage
    // limits: {
    //     fileSize: 5000000
    // }
})

module.exports = {
    upload
};