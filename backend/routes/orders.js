const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.post("/", async (req, res) => {

    try {

        const { items } = req.body;

        const order = await prisma.order.create({
            data: {
                total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
                items: JSON.stringify(items)
            }
        });

        res.json({
            success: true,
            orderId: order.id
        });

    } catch (err) {
        res.status(500).json({ success: false });
    }
});

module.exports = router;