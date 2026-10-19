const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name:'pj5z5mwn',
  api_key: '878629567731554',
  api_secret: '1JThgtDofWYDQqVj7pdd0LKgORI',
});

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'semi-ecommerce' },
        (error, uploaded) => (error ? reject(error) : resolve(uploaded))
      );
      stream.end(req.file.buffer);
    });

    res.status(201).json({ url: result.secure_url });
  } catch (err) {
    next(err);
  }
};