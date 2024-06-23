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
      productItemTemplate.remove(); // Remove the template item

      products.forEach((product) => {
        const productItem = productItemTemplate.cloneNode(true);
        productItem.querySelector(".product-image").src = product.image;
        productItem.querySelector(".title").textContent = product.title;

        productItem.setAttribute("data-title", product.title);
        productItem.setAttribute("data-description", product.description);
        productItem.setAttribute("data-price", product.price);

        productItem
          .querySelector(".product-image")
          .addEventListener("click", () => {
            const productInfo = {
              title: product.title,
              description: product.description,
              price: product.price,
              imageSrc: product.image,
            };

            localStorage.setItem("productInfo", JSON.stringify(productInfo));
            window.location.href = "product-details.html";
          });

        productList.appendChild(productItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
});
