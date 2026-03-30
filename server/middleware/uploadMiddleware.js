const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

/** Only run multer for multipart requests so JSON bodies still work. */
function optionalSingle(fieldName) {
  return (req, res, next) => {
    const ct = req.headers["content-type"] || "";
    if (ct.includes("multipart/form-data")) {
      return upload.single(fieldName)(req, res, next);
    }
    next();
  };
}

module.exports = { upload, optionalSingle };
