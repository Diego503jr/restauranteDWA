document.addEventListener("DOMContentLoaded", function() {
    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", function() {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(27, 58, 75, 0.95)';
        } else {
            navbar.style.backgroundColor = 'transparent';
        }
    });
});