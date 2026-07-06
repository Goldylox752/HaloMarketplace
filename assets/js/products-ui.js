const wishlist = new Set();

// =========================
// QUICK ADD
// =========================
function quickAdd(product) {
    addToCart(product);

    showToast("Added to cart 🛒");
}

// =========================
// WISHLIST TOGGLE
// =========================
function toggleWishlist(id) {

    const btn = event.target;

    if (wishlist.has(id)) {
        wishlist.delete(id);
        btn.classList.remove("active");
        btn.innerText = "♡";
    } else {
        wishlist.add(id);
        btn.classList.add("active");
        btn.innerText = "♥";
    }

    saveWishlist();
}

// Save wishlist locally
function saveWishlist() {
    localStorage.setItem("halo_wishlist", JSON.stringify([...wishlist]));
}

// Load wishlist
function loadWishlist() {
    const saved = JSON.parse(localStorage.getItem("halo_wishlist")) || [];
    saved.forEach(id => wishlist.add(id));
}

// =========================
// QUICK PREVIEW
// =========================
function openPreview(id) {
    alert("Open product modal for: " + id);
}

// =========================
// TOAST NOTIFICATION
// =========================
function showToast(message) {

    let toast = document.createElement("div");

    toast.className = "toast";
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
        toast.remove();
    }, 2000);
}