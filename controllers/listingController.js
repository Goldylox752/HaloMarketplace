const Listing = require("../models/Listing");

// GET ALL LISTINGS
exports.getListings = async (req, res) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        const keyword = req.query.search
            ? {
                  title: {
                      $regex: req.query.search,
                      $options: "i"
                  }
              }
            : {};

        const category = req.query.category
            ? { category: req.query.category }
            : {};

        const listings = await Listing.find({
            ...keyword,
            ...category
        })
            .populate("seller", "name email")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Listing.countDocuments({
            ...keyword,
            ...category
        });

        res.json({
            success: true,
            page,
            pages: Math.ceil(total / limit),
            total,
            listings
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// GET SINGLE LISTING

exports.getListing = async (req, res) => {

    try {

        const listing = await Listing.findById(req.params.id)
            .populate("seller", "name email");

        if (!listing) {

            return res.status(404).json({
                success: false,
                message: "Listing not found"
            });

        }

        res.json({
            success: true,
            listing
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// CREATE LISTING

exports.createListing = async (req, res) => {

    try {

        const listing = await Listing.create({

            seller: req.user._id,

            title: req.body.title,

            description: req.body.description,

            price: req.body.price,

            category: req.body.category,

            images: req.body.images,

            quantity: req.body.quantity,

            condition: req.body.condition,

            shipping: req.body.shipping,

            location: req.body.location

        });

        res.status(201).json({

            success: true,

            listing

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// UPDATE LISTING

exports.updateListing = async (req, res) => {

    try {

        const listing = await Listing.findById(req.params.id);

        if (!listing) {

            return res.status(404).json({

                success: false,

                message: "Listing not found"

            });

        }

        if (listing.seller.toString() !== req.user._id.toString()) {

            return res.status(401).json({

                success: false,

                message: "Unauthorized"

            });

        }

        Object.assign(listing, req.body);

        await listing.save();

        res.json({

            success: true,

            listing

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// DELETE LISTING

exports.deleteListing = async (req, res) => {

    try {

        const listing = await Listing.findById(req.params.id);

        if (!listing) {

            return res.status(404).json({

                success: false,

                message: "Listing not found"

            });

        }

        if (listing.seller.toString() !== req.user._id.toString()) {

            return res.status(401).json({

                success: false,

                message: "Unauthorized"

            });

        }

        await listing.deleteOne();

        res.json({

            success: true,

            message: "Listing deleted"

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
