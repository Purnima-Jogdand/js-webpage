document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navLinksItems = document.querySelectorAll(".nav-links a");

  // Toggle navLinks active class on hamburger click
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Close navLinks when clicking outside
  document.addEventListener("click", (event) => {
    if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
      navLinks.classList.remove("active");
    }
  });

  // Close navLinks when a link is clicked
  navLinksItems.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });

  const productList = document.querySelector(".product-list");
  const productItemTemplate = document.querySelector(".product-item");

  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((products) => {
      // Remove the template product item
      productItemTemplate.remove();

      products.forEach((product) => {
        // Clone the template product item
        const productItem = productItemTemplate.cloneNode(true);

        // Update the placeholders with product data
        productItem.querySelector(".product-image").src = product.image;
        // productItem.querySelector(".title").alt = product.title;
        productItem.querySelector(".title").textContent = product.title;
        // productItem.querySelector(".price").textContent = `$${product.price}`;
        // productItem.querySelector(".description").textContent =
        //   product.description;
        // productItem.querySelector(".category").textContent = product.category;
        // productItem.querySelector(
        //   ".rate"
        // ).textContent = `⭐ ${product.rating.rate}`;
        // productItem.querySelector(
        //   ".count"
        // ).textContent = `(${product.rating.count} reviews)`;

        // // Append the updated product item to the product list
        productList.appendChild(productItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
});
