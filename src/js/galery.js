document.querySelectorAll(".card-img-top").forEach((img) => {
  img.style.cursor = "pointer";
  img.addEventListener("click", function () {
    document.getElementById("modalImg").src = this.src;
    const modal = new bootstrap.Modal(document.getElementById("imgModal"));
    modal.show();
  });
});
