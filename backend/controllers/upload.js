const fs = require('fs');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.listImages = async (req, res) => {
  try {
    const { path, sort, max } = req.body;

    cloudinary.v2.search
      .expression(`folder=${path}`)
      .sort_by('created_at', `${sort}`)
      .max_results(max)
      .execute()
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        console.log('listImages() - error', error);
        return res.status(500).json({ message: error.message });
      });
  } catch (error) {
    console.log('listImages() - error', error);
    return res.status(500).json({ message: error.message });
  }
};

exports.uploadImages = async (req, res) => {
  try {
    const { path } = req.body;
    const files = Object.values(req.files).flat();
    const images = [];

    for (const file of files) {
      const url = await uploadToCloudinary(file, path);
      images.push(url);
    }

    res.json(images);
  } catch (error) {
    console.log('uploadImages() - error', error);
    return res.status(500).json({ message: error.message });
  }
};

const uploadToCloudinary = async (file, path = 'temp') => {
  return new Promise((resolve, reject) => {
    const filePath = file.tempFilePath;
    const appFolder = 'facebook-clone';
    const savePath = `/${appFolder}/${path}`;

    cloudinary.v2.uploader.upload(
      filePath,
      {
        folder: savePath,
      },
      (error, result) => {
        removeTmp(filePath);

        if (error) {
          console.log('uploadToCloudinary() - error', error);
          return reject(error);
        }

        resolve(result);
      }
    );
  });
};

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
