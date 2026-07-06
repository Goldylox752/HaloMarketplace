// ========================================
// Halo Marketplace
// utils/image.js
// Image Processing Utilities
// ========================================

const sharp = require("sharp");
const fs = require("fs/promises");
const path = require("path");

// ========================================
// Ensure Directory Exists
// ========================================

const ensureDirectory = async (directory) => {
    await fs.mkdir(directory, { recursive: true });
};

// ========================================
// Optimize Image
// ========================================

const optimizeImage = async (
    inputPath,
    outputPath,
    options = {}
) => {

    const {
        width = 1600,
        height = 1600,
        quality = 85
    } = options;

    await ensureDirectory(path.dirname(outputPath));

    return sharp(inputPath)
        .resize(width, height, {
            fit: "inside",
            withoutEnlargement: true
        })
        .jpeg({
            quality,
            mozjpeg: true
        })
        .toFile(outputPath);

};

// ========================================
// Thumbnail
// ========================================

const createThumbnail = async (
    inputPath,
    outputPath,
    size = 400
) => {

    await ensureDirectory(path.dirname(outputPath));

    return sharp(inputPath)
        .resize(size, size, {
            fit: "cover"
        })
        .jpeg({
            quality: 80
        })
        .toFile(outputPath);

};

// ========================================
// WebP Version
// ========================================

const createWebP = async (
    inputPath,
    outputPath,
    quality = 82
) => {

    await ensureDirectory(path.dirname(outputPath));

    return sharp(inputPath)
        .webp({
            quality
        })
        .toFile(outputPath);

};

// ========================================
// PNG Version
// ========================================

const createPNG = async (
    inputPath,
    outputPath
) => {

    await ensureDirectory(path.dirname(outputPath));

    return sharp(inputPath)
        .png({
            compressionLevel: 9
        })
        .toFile(outputPath);

};

// ========================================
// Resize
// ========================================

const resizeImage = async (
    inputPath,
    outputPath,
    width,
    height
) => {

    await ensureDirectory(path.dirname(outputPath));

    return sharp(inputPath)
        .resize(width, height)
        .toFile(outputPath);

};

// ========================================
// Metadata
// ========================================

const getMetadata = async (imagePath) => {
    return sharp(imagePath).metadata();
};

// ========================================
// Delete Image
// ========================================

const deleteImage = async (imagePath) => {

    try {
        await fs.unlink(imagePath);
    } catch (err) {
        // Ignore missing files
    }

};

// ========================================
// Validate MIME Type
// ========================================

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif"
];

const isValidMimeType = (mimeType) => {
    return allowedMimeTypes.includes(mimeType);
};

// ========================================
// Validate Extension
// ========================================

const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".avif"
];

const isValidExtension = (filename) => {

    const extension = path.extname(filename).toLowerCase();

    return allowedExtensions.includes(extension);

};

// ========================================
// Generate Unique Filename
// ========================================

const generateFilename = (
    originalName,
    prefix = "image"
) => {

    const extension = path.extname(originalName).toLowerCase();

    const timestamp = Date.now();

    const random = Math.random()
        .toString(36)
        .substring(2, 10);

    return `${prefix}-${timestamp}-${random}${extension}`;

};

// ========================================
// Exports
// ========================================

module.exports = {

    optimizeImage,

    createThumbnail,

    createWebP,

    createPNG,

    resizeImage,

    getMetadata,

    deleteImage,

    generateFilename,

    isValidMimeType,

    isValidExtension,

    allowedMimeTypes,

    allowedExtensions

};
