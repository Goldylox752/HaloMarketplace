// ========================================
// Halo Marketplace
// routes/categoryRoutes.js
// ========================================

const express = require("express");
const router = express.Router();

// Controllers
const categoryController = require("../controllers/categoryController");

// Middleware
const auth = require("../middleware/auth");

const {
    requireAuth,
    adminOnly
} = require("../middleware/permissions");

const {
    idValidation
} = require("../middleware/validators");

const {
    sanitizeBody,
    sanitizeQuery
} = require("../middleware/sanitizers");

// ========================================
// Public Routes
// ========================================

// Get all categories
router.get(
    "/",
    sanitizeQuery,
    categoryController.getCategories
);

// Category tree
router.get(
    "/tree",
    categoryController.getCategoryTree
);

// Featured categories
router.get(
    "/featured",
    categoryController.getFeaturedCategories
);

// Single category
router.get(
    "/:id",
    idValidation,
    categoryController.getCategory
);

// Products in category
router.get(
    "/:id/products",
    idValidation,
    categoryController.getCategoryProducts
);

// ========================================
// Admin Routes
// ========================================

// Create category
router.post(
    "/",
    auth,
    requireAuth,
    adminOnly,
    sanitizeBody,
    categoryController.createCategory
);

// Update category
router.put(
    "/:id",
    auth,
    requireAuth,
    adminOnly,
    idValidation,
    sanitizeBody,
    categoryController.updateCategory
);

// Delete category
router.delete(
    "/:id",
    auth,
    requireAuth,
    adminOnly,
    idValidation,
    categoryController.deleteCategory
);

// Reorder categories
router.patch(
    "/reorder",
    auth,
    requireAuth,
    adminOnly,
    sanitizeBody,
    categoryController.reorderCategories
);

// Feature / Unfeature category
router.patch(
    "/:id/feature",
    auth,
    requireAuth,
    adminOnly,
    idValidation,
    categoryController.toggleFeatured
);

// Enable / Disable category
router.patch(
    "/:id/status",
    auth,
    requireAuth,
    adminOnly,
    idValidation,
    categoryController.toggleStatus
);

module.exports = router;
