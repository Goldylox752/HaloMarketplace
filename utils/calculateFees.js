// ==========================================
// Marketplace Fees
// ==========================================

function calculateFees(

    amount,

    commission = 10

) {

    amount = Number(amount);

    const marketplaceFee =

        amount * (commission / 100);

    const sellerReceives =

        amount - marketplaceFee;

    return {

        salePrice: amount,

        marketplaceFee:

            Number(marketplaceFee.toFixed(2)),

        sellerReceives:

            Number(sellerReceives.toFixed(2))

    };

}

module.exports = calculateFees;
