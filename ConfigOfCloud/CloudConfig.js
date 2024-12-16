const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: 'duvtqtg1j',   // Replace with your cloud name
    api_key: '631952148198189',         // Replace with your API key
    api_secret: 'T1JiLT47a6taERhgjMr-jM2rRrA',   // Replace with your API secret
  });

module.exports = cloudinary;

