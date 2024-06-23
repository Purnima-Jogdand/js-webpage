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

  // // Close navLinks when a link is clicked
  // navLinksItems.forEach((link) => {
  //   link.addEventListener("click", () => {
  //     navLinks.classList.remove("active");
  //   });
  // });

  // Close navLinks when a link is clicked
  navLinks.querySelectorAll("a").forEach((link) => {
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
  const itemCount = document.getElementById("item-count");

  let products = [];
  let filteredProducts = [];
  let currentPage = 1;
  const itemsPerPage = 10;

  const updateItemCount = () => {
    itemCount.textContent = `${filteredProducts.length} Results`;
  };

  const loadProducts = (page) => {
    productList.innerHTML = "";

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);

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
      filteredProducts.length / itemsPerPage
    )}`;
  };

  const updatePaginationControls = () => {
    prevButton.disabled = currentPage === 1;
    nextButton.disabled =
      currentPage === Math.ceil(filteredProducts.length / itemsPerPage);
  };

  const sortProducts = (sortValue) => {
    switch (sortValue) {
      case "price-asc":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "title-asc":
        filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Default sort order (if any)
        break;
    }
    loadProducts(currentPage);
    updatePaginationControls();
  };

  const filterProducts = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategories = Array.from(categoryFilters)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    filteredProducts = products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm);
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      return matchesSearch && matchesCategory;
    });

    updateItemCount();
    currentPage = 1;
    loadProducts(currentPage);
    updatePaginationControls();
  };

  searchInput.addEventListener("input", filterProducts);

  sortSelect.addEventListener("change", (event) => {
    const sortValue = event.target.value;
    sortProducts(sortValue);
  });

  categoryFilters.forEach((checkbox) => {
    checkbox.addEventListener("change", filterProducts);
  });

  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadProducts(currentPage);
      updatePaginationControls();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentPage < Math.ceil(filteredProducts.length / itemsPerPage)) {
      currentPage++;
      loadProducts(currentPage);
      updatePaginationControls();
    }
  });

  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) => {
      products = data;
      filteredProducts = products;
      updateItemCount();
      loadProducts(currentPage);
      updatePaginationControls();
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
});
