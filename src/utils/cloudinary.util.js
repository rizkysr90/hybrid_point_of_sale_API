require('dotenv').config();
const cloudinary = require('cloudinary')

cloudinary.config({ 
    cloud_name: `${process.env.upload_name}`, 
    api_key: `${process.env.upload_key}`, 
    api_secret: `${process.env.upload_secret}` 
  });

 const uploadCloudinary = async (file,opts) => {
    const uploadResult = await cloudinary.v2.uploader.upload(file, {
        resource_type: opts.type,
        folder: opts.folder,
        eager_async: true,
        eager : {quality: 50}
    })

    return uploadResult;

}

const deleteCloudinary = async (file) => {
    const deleteResult = await cloudinary.v2.uploader.destroy(file, {
        resource_type: "image",
    })

    return deleteResult;
}

module.exports = {
    uploadCloudinary,
    deleteCloudinary
}
