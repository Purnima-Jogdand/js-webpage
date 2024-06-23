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

  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  const pageInfo = document.getElementById("page-info");
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");
  const categoryFilters = document.querySelectorAll(
    ".category-filters input[type='checkbox']"
  );

  let products = [];
  let currentPage = 1;
  const itemsPerPage = 6;

  const loadProducts = (page) => {
    productList.innerHTML = "";

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = products.slice(start, end);

    paginatedProducts.forEach((product) => {
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
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(
      products.length / itemsPerPage
    )}`;
  };
  const updatePaginationControls = () => {
    prevButton.disabled = currentPage === 1;
    nextButton.disabled =
      currentPage === Math.ceil(products.length / itemsPerPage);
  };
  const sortProducts = (sortValue) => {
    switch (sortValue) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "title-asc":
        products.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        products.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Default sort order (if any)
        break;
    }
    loadProducts(currentPage);
    updatePaginationControls();
  };

  const filterProducts = (searchTerm) => {
    products = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    currentPage = 1;
    loadProducts(currentPage);
    updatePaginationControls();
  };

  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value;
    if (searchTerm === "") {
      loadProducts(currentPage);
      updatePaginationControls();
    } else {
      filterProducts(searchTerm);
    }
  });

  sortSelect.addEventListener("change", (event) => {
    const sortValue = event.target.value;
    sortProducts(sortValue);
  });
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadProducts(currentPage);
      updatePaginationControls();
    }
  });
  nextButton.addEventListener("click", () => {
    if (currentPage < Math.ceil(products.length / itemsPerPage)) {
      currentPage++;
      loadProducts(currentPage);
      updatePaginationControls();
    }
  });
  categoryFilters.forEach((checkbox) => {
    checkbox.addEventListener("change", filterProducts);
  });
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) => {
      products = data;
      loadProducts(currentPage);
      updatePaginationControls();
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
});
