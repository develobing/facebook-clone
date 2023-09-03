const fs = require('fs');

exports.imageUpload = async function (req, res, next) {
  try {
    if (!req.files || Object.values(req.files).flat().length === 0)
      return res.status(400).json({ message: 'No files were uploaded.' });

    const files = Object.values(req.files).flat();
    const isValidImage = files.every((file) =>
      file.mimetype.startsWith('image')
    );

    if (!isValidImage) {
      files.forEach((file) => removeTmp(file.tempFilePath));
      return res.status(400).json({ message: 'Please upload an image file.' });
    }

    const maxSize = 1024 * 1024 * 5; // 5MB
    const isValidSize = files.every((file) => file.size < maxSize);
    if (!isValidSize) {
      files.forEach((file) => removeTmp(file.tempFilePath));
      return res.status(400).json({ message: 'Image must be less than 2MB.' });
    }

    next();
  } catch (error) {
    console.log('imageUpload() - error', error);

    return res.status(500).json({ message: error.message });
  }
};

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
