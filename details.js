document.addEventListener("DOMContentLoaded", function () {
  const productInfo = JSON.parse(localStorage.getItem("productInfo"));
  const backButton = document.getElementById("back-button");

  if (productInfo) {
    document.getElementById("product-title").textContent = productInfo.title;
    document.getElementById("product-description").textContent =
      productInfo.description;
    document.getElementById("product-price").textContent = productInfo.price;
    document
      .getElementById("product-image")
      .setAttribute("src", productInfo.imageSrc);
  }

  backButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
