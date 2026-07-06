function createProductCard(product) {
    return `
    <div class="product-card" data-id="${product.id}">

        <div class="product-image">

            <img src="${product.image}" />

            <span class="badge-verified">✔ Verified Seller</span>

            <button class="wishlist-btn" onclick="toggleWishlist('${product.id}')">♡</button>

            <div class="quick-preview">
                <button onclick="openPreview('${product.id}')">Quick View</button>
            </div>

        </div>

        <div class="product-content">

            <h3>${product.title}</h3>

            <p class="seller">
                ${product.seller} • ${product.location}
            </p>

            <p class="rating">★★★★★ ${product.rating}</p>

            <div class="price-row">

                <h4>$${product.price}</h4>

                <button class="quick-add" onclick='quickAdd(${JSON.stringify(product)})'>
                    Quick Add
                </button>

            </div>

        </div>

    </div>
    `;
}